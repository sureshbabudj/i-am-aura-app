import React, { useEffect } from 'react';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import { View, ActivityIndicator } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { colors } from '@/src/constants/colors';

interface PaywallProviderProps {
  children: React.ReactNode;
}

/**
 * A provider that handles global paywall navigation
 */
export const PaywallProvider: React.FC<PaywallProviderProps> = ({ children }) => {
  const { initialize, isPaywallVisible, isSubscribed, isInitializing } = useSubscriptionStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Handle global paywall navigation
  useEffect(() => {
    if (!isInitializing && isPaywallVisible && !isSubscribed && pathname !== '/paywall') {
      router.push('/paywall');
    }
  }, [isInitializing, isPaywallVisible, isSubscribed, pathname, router]);

  if (isInitializing) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.surface,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <View style={{ flex: 1 }}>{children}</View>;
};
