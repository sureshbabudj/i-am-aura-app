import React from 'react';
import { View } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useRouter } from 'expo-router';

export default function PaywallScreen() {
  const router = useRouter();
  const { hidePaywall, isSubscribed } = useSubscriptionStore();

  const handleDismiss = () => {
    hidePaywall();
    if (router.canGoBack()) {
      router.back();
    }
  };

  // If already subscribed, just go back
  if (isSubscribed) {
    handleDismiss();
    return null;
  }

  return (
    <View className="flex-1 bg-surface">
      <RevenueCatUI.Paywall
        onPurchaseCompleted={() => {
          console.log('[PAYWALL] Purchase completed!');
          handleDismiss();
        }}
        onRestoreCompleted={() => {
          console.log('[PAYWALL] Restore completed!');
          handleDismiss();
        }}
        onDismiss={handleDismiss}
      />
    </View>
  );
}
