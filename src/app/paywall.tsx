import { useEffect } from 'react';
import { View, Alert } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useRouter } from 'expo-router';

export default function PaywallScreen() {
  const router = useRouter();
  const { hidePaywall, isSubscribed, paywallShownReason, checkStatus } = useSubscriptionStore();

  const handleDismiss = (forceDismiss = false) => {
    if (paywallShownReason === 'trial_end' && !isSubscribed && !forceDismiss) {
      Alert.alert(
        'Trial Ended',
        'Your trial has ended. Please subscribe to continue using the Aura app.'
      );
      return;
    }

    hidePaywall();
    if (router.canGoBack()) {
      router.back();
    }
  };

  // If already subscribed, redirect in an effect to avoid setState during render
  useEffect(() => {
    if (isSubscribed) {
      hidePaywall();
      if (router.canGoBack()) {
        router.back();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubscribed]);

  if (isSubscribed) {
    return null;
  }

  return (
    <View className="flex-1 bg-surface">
      <RevenueCatUI.Paywall
        onPurchaseCompleted={async () => {
          console.log('[PAYWALL] Purchase completed!');
          await checkStatus();
          handleDismiss(true);
        }}
        onRestoreCompleted={async () => {
          console.log('[PAYWALL] Restore completed!');
          await checkStatus();
          handleDismiss(true);
        }}
        onDismiss={() => handleDismiss(false)}
      />
    </View>
  );
}
