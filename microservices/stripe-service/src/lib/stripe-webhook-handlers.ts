import Stripe from 'stripe';
import { Producer } from 'kafkajs';

export async function sendPaymentEvent(
  producer: Producer,
  key: string,
  data: object,
  topic = 'payment-events'
): Promise<void> {
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ key, value: JSON.stringify(data) }],
  });
}

export async function getSubscriptionDetails(
  stripe: Stripe,
  subscription: Stripe.Subscription
) {
  const price = await stripe.prices.retrieve(subscription.items.data[0].price.id);
  return {
    subscriptionType: price.nickname || 'paid',
    endDate: new Date(subscription.current_period_end * 1000).toISOString(),
  };
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  stripe: Stripe,
  producer: Producer
) {
  const userId = session.metadata?.userId;
  if (!userId) {
    throw new Error('User ID missing in session metadata');
  }

  if (session.mode === 'subscription' && session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    const { subscriptionType, endDate } = await getSubscriptionDetails(stripe, subscription);
    await sendPaymentEvent(producer, 'user.subscription.updated', {
      id: userId,
      status: subscription.status,
      subscriptionId: subscription.id,
      subscriptionType,
      endDate,
    });
  } else if (session.mode === 'payment') {
    await sendPaymentEvent(producer, 'user.payment.completed', {
      id: userId,
      status: 'active',
      paymentId: session.payment_intent,
      paymentType: session.line_items?.data[0].description || 'one-time payment',
      paymentDate: new Date().toISOString(),
    });
  }
}

async function handleSubscriptionCreated(
  subscription: Stripe.Subscription,
  stripe: Stripe,
  producer: Producer
) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    throw new Error('User ID missing in subscription metadata');
  }

  const { subscriptionType, endDate } = await getSubscriptionDetails(stripe, subscription);
  await stripe.subscriptions.update(subscription.id, {
    metadata: { ...subscription.metadata, subscriptionId: subscription.id },
  });
  await sendPaymentEvent(producer, 'user.subscription.updated', {
    id: userId,
    status: subscription.status,
    subscriptionId: subscription.id,
    subscriptionType,
    endDate,
  });
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  stripe: Stripe,
  producer: Producer
) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    throw new Error('User ID missing in subscription metadata');
  }

  const { subscriptionType, endDate } = await getSubscriptionDetails(stripe, subscription);
  await sendPaymentEvent(producer, 'user.subscription.canceled', {
    id: userId,
    status: 'canceled',
    subscriptionId: subscription.id,
    subscriptionType,
    endDate,
    canceledAt: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000).toISOString()
      : null,
    cancellationType: 'period_end',
  });
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  event: Stripe.Event,
  stripe: Stripe,
  producer: Producer
) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    throw new Error('User ID missing in subscription metadata');
  }

  const previousAttributes = (event.data.previous_attributes || {}) as Partial<Stripe.Subscription>;
  const { subscriptionType, endDate } = await getSubscriptionDetails(stripe, subscription);
  const isRenewal = !!previousAttributes.current_period_end;
  const isCancellationScheduled =
    previousAttributes.cancel_at_period_end !== undefined &&
    subscription.cancel_at_period_end;

  await sendPaymentEvent(
    producer,
    isCancellationScheduled ? 'user.subscription.cancel_scheduled' : 'user.subscription.updated',
    {
      id: userId,
      status: subscription.status,
      subscriptionId: subscription.id,
      subscriptionType,
      endDate,
      isRenewal,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    }
  );
}

async function handleInvoicePaid(
  invoice: Stripe.Invoice,
  stripe: Stripe,
  producer: Producer
) {
  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata?.userId;
  if (!userId) {
    throw new Error('User ID missing in subscription metadata');
  }

  const { subscriptionType, endDate } = await getSubscriptionDetails(stripe, subscription);
  await sendPaymentEvent(producer, 'user.subscription.updated', {
    id: userId,
    status: subscription.status,
    subscriptionId,
    subscriptionType,
    endDate,
  });
}

async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  stripe: Stripe,
  producer: Producer
) {
  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata?.userId;
  if (!userId) {
    throw new Error('User ID missing in subscription metadata');
  }

  await sendPaymentEvent(producer, 'user.payment.failed', {
    id: userId,
    status: subscription.status,
    subscriptionId,
    invoiceId: invoice.id,
    attemptCount: invoice.attempt_count,
    nextAttempt: invoice.next_payment_attempt
      ? new Date(invoice.next_payment_attempt * 1000).toISOString()
      : null,
  });
}

export async function handleEvent(
  event: Stripe.Event,
  stripe: Stripe,
  producer: Producer
): Promise<void> {
  const handlers: { [key: string]: (data: any, stripe: Stripe, producer: Producer, event?: Stripe.Event) => Promise<void> } = {
    'checkout.session.completed': handleCheckoutSessionCompleted,
    'customer.subscription.created': handleSubscriptionCreated,
    'customer.subscription.deleted': handleSubscriptionDeleted,
    'customer.subscription.updated': (data, stripe, producer, event) =>
      handleSubscriptionUpdated(data, event!, stripe, producer),
    'invoice.paid': handleInvoicePaid,
    'invoice.payment_succeeded': handleInvoicePaid,
    'invoice.payment_failed': handleInvoicePaymentFailed,
  };

  const handler = handlers[event.type];
  if (handler) {
    await handler(event.data.object, stripe, producer, event);
  }
}