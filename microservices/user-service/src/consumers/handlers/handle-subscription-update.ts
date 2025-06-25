// File: /microservices/user-service/src/consumers/handlers/handle-subscription-update.ts
// Action: CREATE new file

import { KafkaMessage } from 'kafkajs';
import { User } from '../../models/userModel'; // Adjust path if necessary

export default async function handleSubscriptionUpdate(message: KafkaMessage) {
  try {
    const { id, subscriptionType, endDate } = JSON.parse(message.value!.toString());
    const user = await User.findOne({ _id: id });
    
    if (user) {
      const subscriptionData = {
        // Ensure you don't overwrite other subscription fields if they exist
        ...user.subscription,
        type: subscriptionType,
        endDate: new Date(endDate)
      };
      // Assuming a static method on your User model to handle the update
      await User.updateSubscription(id, subscriptionData);
      console.log(`[User Consumer] Subscription updated for user ${id}`);
    } else {
      console.warn(`[User Consumer] User not found for subscription update: ${id}`);
    }
  } catch(error) {
    console.error('[User Consumer] Failed to process subscription update', error);
  }
}