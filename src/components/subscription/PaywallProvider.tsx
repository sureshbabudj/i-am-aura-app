import React, { useEffect } from 'react';
import RevenueCatUI from 'react-native-purchases-ui';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import { Modal, View } from 'react-native';

interface PaywallProviderProps {
  children: React.ReactNode;
}

/**
 * A provider that can display the RevenueCat Paywall as a modal
 */
export const PaywallProvider: React.FC<PaywallProviderProps> = ({ children }) => {
  const { initialize, isPaywallVisible, hidePaywall, isSubscribed } = useSubscriptionStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <View style={{ flex: 1 }}>
      {children}

      {/* 
        Global Paywall Modal 
        Triggered by:
        - Scrolling through 3+ quotes
        - Attempting second save of the day
        - Reaching 3 days of trial
      */}
      <AppPaywallModal visible={isPaywallVisible && !isSubscribed} onClose={hidePaywall} />
    </View>
  );
};

/**
 * A separate component to show the Paywall as a Full Screen Modal
 */
export const AppPaywallModal: React.FC<{ visible: boolean; onClose: () => void }> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={{ flex: 1 }}>
        <RevenueCatUI.Paywall
          onPurchaseCompleted={() => {
            console.log('Purchase completed!');
            onClose();
          }}
          onRestoreCompleted={() => {
            console.log('Restore completed!');
            onClose();
          }}
          onDismiss={() => onClose()}
        />
      </View>
    </Modal>
  );
};
