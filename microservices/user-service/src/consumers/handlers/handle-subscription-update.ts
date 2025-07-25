import type { KafkaMessage } from 'kafkajs';
import type { Document, WithId } from 'mongodb';
import { User } from '../../models/user-model'; // Adjust path if necessary

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

async function handleSubscriptionUpdated(
  user: WithId<Document>,
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
}

async function handlePaymentCompleted(
  user: WithId<Document>,
  data: KafkaMessageData
): Promise<void> {
  const subscriptionData: SubscriptionData = {
    ...user.subscription,
    type: data.paymentType ?? 'unknown',
    startDate:
      user.subscription.startDate || new Date(data.paymentDate || Date.now()),
    endDate: null,
    status: 'active',
    cancelAtPeriodEnd: false,
  };

  await User.updateSubscription(data.id, subscriptionData);
}

async function handleSubscriptionCanceled(
  user: WithId<Document>,
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
}

async function handleSubscriptionCancelScheduled(
  user: WithId<Document>,
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
}

async function handlePaymentFailed(data: KafkaMessageData): Promise<void> {
  await User.updateOne(
    { _id: data.id },
    {
      $set: {
        paymentStatus: {
          lastFailed: true,
          failureReason: data.failureReason || 'Unknown',
          lastAttempt: new Date(),
          nextAttempt: data.nextAttempt ? new Date(data.nextAttempt) : null,
          attemptCount: data.attemptCount || 0,
        },
      },
    }
  );
}

export default async function handleSubscriptionUpdate(message: KafkaMessage) {
  try {
    const messageValue = message.value?.toString();
    if (!messageValue) {
      return;
    }

    const data: KafkaMessageData = JSON.parse(messageValue);
    const key = message.key?.toString();

    if (!key) {
      return;
    }

    const user = await User.findOne({ _id: data.id });
    if (!user) {
      return;
    }

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
    }
  } catch (error) {
    throw new Error(
      `[User Consumer] Error processing message: ${error.message}`
    );
  }
}
