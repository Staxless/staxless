import type { KafkaMessage } from 'kafkajs';
import type { WithId } from 'mongodb';
import { User, type UserType } from '../../models/user-model.js';

// Define SubscriptionData interface
interface SubscriptionData {
  type: string;
  startDate: Date;
  endDate?: Date | null;
  subscriptionId?: string;
  status?: 'active' | 'pending_cancellation' | 'canceled';
  cancelAtPeriodEnd?: boolean;
  cancellationType?: 'period_end';
  canceledAt?: Date;
}

// Define KafkaMessageData interface
interface KafkaMessageData {
  id: string;
  subscriptionId?: string;
  subscriptionType?: string;
  endDate?: string;
  cancellationType?: 'period_end';
  isRenewal?: boolean;
  cancelAtPeriodEnd?: boolean;
  paymentType?: string;
  paymentDate?: string;
  invoiceId?: string;
  attemptCount?: number;
  nextAttempt?: string;
  failureReason?: string;
}

// Handler for subscription updated event
async function handleSubscriptionUpdated(
  user: WithId<UserType>,
  data: KafkaMessageData
): Promise<void> {
  const subscriptionData: SubscriptionData = {
    ...user.subscription,
    type: data.subscriptionType ?? 'unknown',
    startDate: user.subscription.startDate || new Date(),
    endDate: data.endDate ? new Date(data.endDate) : undefined,
    subscriptionId: data.subscriptionId,
    status: data.cancelAtPeriodEnd ? 'pending_cancellation' : 'active',
    cancelAtPeriodEnd: !!data.cancelAtPeriodEnd,
  };
  await User.updateSubscription(data.id, subscriptionData);
  console.log(`✅ Updated subscription for user: ${data.id}`);
}

// Handler for payment completed event
async function handlePaymentCompleted(
  user: WithId<UserType>,
  data: KafkaMessageData
): Promise<void> {
  const subscriptionData: SubscriptionData = {
    ...user.subscription,
    type: data.paymentType ?? 'paid',
    startDate:
      user.subscription.startDate || new Date(data.paymentDate || Date.now()),
    endDate: null,
    status: 'active',
    cancelAtPeriodEnd: false,
  };
  await User.updateSubscription(data.id, subscriptionData);
  console.log(`✅ Payment completed for user: ${data.id}`);
}

// Handler for subscription canceled event
async function handleSubscriptionCanceled(
  user: WithId<UserType>,
  data: KafkaMessageData
): Promise<void> {
  const subscriptionData: SubscriptionData = {
    ...user.subscription,
    type: data.subscriptionType ? 'canceled' : 'unknown',
    startDate: user.subscription.startDate,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
    subscriptionId: data.subscriptionId,
    status: 'canceled',
    cancelAtPeriodEnd: false,
    cancellationType: 'period_end',
    canceledAt: new Date(),
  };
  await User.updateSubscription(data.id, subscriptionData);
  console.log(`✅ Subscription canceled for user: ${data.id}`);
}

// Handler for subscription cancel scheduled event
async function handleSubscriptionCancelScheduled(
  user: WithId<UserType>,
  data: KafkaMessageData
): Promise<void> {
  const subscriptionData: SubscriptionData = {
    ...user.subscription,
    type: data.subscriptionType ?? 'unknown',
    startDate: user.subscription.startDate,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
    subscriptionId: data.subscriptionId,
    status: 'pending_cancellation',
    cancelAtPeriodEnd: true,
  };
  await User.updateSubscription(data.id, subscriptionData);
  console.log(`✅ Subscription cancellation scheduled for user: ${data.id}`);
}

// Handler for payment failed event
async function handlePaymentFailed(data: KafkaMessageData): Promise<void> {
  const update: Partial<UserType> | { [key: string]: any } = {
    $set: {
      paymentStatus: {
        lastFailed: true,
        failureReason: data.failureReason || 'Unknown',
        lastAttempt: new Date(),
        nextAttempt: data.nextAttempt ? new Date(data.nextAttempt) : null,
        attemptCount: data.attemptCount || 0,
      },
    },
  };
  await User.updateOne({ _id: data.id }, update);
  console.log(`✅ Payment failure recorded for user: ${data.id}`);
}

// Main Kafka message handler
export default async function handleSubscriptionUpdate(message: KafkaMessage) {
  try {
    const messageValue = message.value?.toString();
    if (!messageValue) {
      console.log('⚠️  Empty message value, skipping');
      return;
    }

    const data: KafkaMessageData = JSON.parse(messageValue);
    const key = message.key?.toString();

    if (!key) {
      console.log('⚠️  No message key, skipping');
      return;
    }

    console.log(`📥 Processing event: ${key} for user: ${data.id}`);

    // Try to find user
    const user = await User.findOne({ _id: data.id });

    if (!user) {
      console.warn(`⚠️  User not found with ID: ${data.id}`);
      console.warn(
        `⚠️  This might be normal if the user hasn't been created yet`
      );

      // Debug logging to help diagnose the issue
      try {
        const anyUser: WithId<UserType> | null = await User.findOne({} as any);
        console.log(`🔍 Debug: Can find any user: ${anyUser ? 'YES' : 'NO'}`);

        if (anyUser) {
          console.log(`🔍 Debug: Sample user ID: ${anyUser._id}`);
          console.log(`🔍 Debug: Searching for: ${data.id}`);
          console.log(
            `🔍 Debug: ID types match: ${typeof anyUser._id === typeof data.id}`
          );
        }
      } catch (debugError) {
        console.error('❌ Debug query failed:', debugError);
      }

      return;
    }

    console.log(`✅ Found user: ${user._id}`);

    // Process the event based on key
    switch (key) {
      case 'user.subscription.updated':
        await handleSubscriptionUpdated(user, data);
        break;
      case 'user.payment.completed':
        await handlePaymentCompleted(user, data);
        break;
      case 'user.subscription.canceled':
        await handleSubscriptionCanceled(user, data);
        break;
      case 'user.subscription.cancel_scheduled':
        await handleSubscriptionCancelScheduled(user, data);
        break;
      case 'user.payment.failed':
        await handlePaymentFailed(data);
        break;
      default:
        console.log(`⚠️  Unknown event key: ${key}`);
        break;
    }

    console.log(`✅ Successfully processed ${key} for user ${data.id}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ [User Consumer] Error processing event: ${errorMessage}`);
    if (error instanceof Error && error.stack) {
      console.error(`Stack trace: ${error.stack}`);
    }
    throw new Error(`[User Consumer] Error processing event: ${errorMessage}`);
  }
}
