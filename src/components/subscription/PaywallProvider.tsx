import React, { useEffect } from 'react';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import { View } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

interface PaywallProviderProps {
  children: React.ReactNode;
}

/**
 * A provider that handles global paywall navigation
 */
export const PaywallProvider: React.FC<PaywallProviderProps> = ({ children }) => {
  const { initialize, isPaywallVisible, isSubscribed } = useSubscriptionStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Handle global paywall navigation
  useEffect(() => {
    if (isPaywallVisible && !isSubscribed && pathname !== '/paywall') {
      router.push('/paywall');
    }
  }, [isPaywallVisible, isSubscribed, pathname, router]);

  return <View style={{ flex: 1 }}>{children}</View>;
};
