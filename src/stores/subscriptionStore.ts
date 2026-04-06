import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PurchaseService } from '../services/purchase';
import Purchases, { PurchasesOffering, CustomerInfo } from 'react-native-purchases';

interface UsageState {
  quoteViewCount: number;
  dailySaveCount: number;
  lastSaveDate: string | null;
  firstLaunchDate: string | null;
}

interface SubscriptionState extends UsageState {
  isSubscribed: boolean;
  isInitializing: boolean;
  currentOfferings: PurchasesOffering | null;
  customerInfo: CustomerInfo | null;
  isPaywallVisible: boolean;

  // Actions
  initialize: () => Promise<void>;
  checkStatus: () => Promise<void>;
  purchasePackage: (packageObject: any) => Promise<boolean>;
  restore: () => Promise<boolean>;
  showPaywall: () => void;
  hidePaywall: () => void;
  showCustomerCenter: () => Promise<void>;
  
  // Usage Actions
  incrementQuoteCount: () => void;
  incrementSaveCount: () => boolean; // Returns true if allowed, false if limited
  checkTrialStatus: () => boolean; // Returns true if blocked by trial end
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      // State
      isSubscribed: false,
      isInitializing: true,
      currentOfferings: null,
      customerInfo: null,
      isPaywallVisible: false,

      // Usage State
      quoteViewCount: 0,
      dailySaveCount: 0,
      lastSaveDate: null,
      firstLaunchDate: null,

      initialize: async () => {
        try {
          set({ isInitializing: true });
          await PurchaseService.initialize();

          // Initialize launch date if first time
          if (!get().firstLaunchDate) {
            set({ firstLaunchDate: new Date().toISOString() });
          }

          // Fetch initial offerings and status
          const [offerings, status] = await Promise.all([
            PurchaseService.fetchOfferings(),
            PurchaseService.checkEntitlement(),
          ]);

          const customerInfo = await Purchases.getCustomerInfo();

          set({
            currentOfferings: offerings,
            isSubscribed: status,
            customerInfo,
            isInitializing: false,
          });

          // Listen for customer info updates
          Purchases.addCustomerInfoUpdateListener((info) => {
            const hasEntitlement = info.entitlements.active['I am Aura Life'] !== undefined;
            set({ isSubscribed: hasEntitlement, customerInfo: info });
          });
        } catch (e) {
          console.error('SubscriptionStore initialization error:', e);
          set({ isInitializing: false });
        }
      },

      checkStatus: async () => {
        const status = await PurchaseService.checkEntitlement();
        const info = await Purchases.getCustomerInfo();
        set({ isSubscribed: status, customerInfo: info });
      },

      purchasePackage: async (packageObject: any) => {
        const success = await PurchaseService.purchase(packageObject);
        if (success) {
          set({ isSubscribed: true, isPaywallVisible: false });
        }
        return success;
      },

      restore: async () => {
        const success = await PurchaseService.restorePurchases();
        if (success) {
          set({ isSubscribed: true, isPaywallVisible: false });
        }
        return success;
      },

      showPaywall: () => set({ isPaywallVisible: true }),
      hidePaywall: () => set({ isPaywallVisible: false }),

      showCustomerCenter: async () => {
        await PurchaseService.showCustomerCenter();
      },

      // Usage Logic
      incrementQuoteCount: () => {
        const { isSubscribed, quoteViewCount } = get();
        if (isSubscribed) return;

        const newCount = quoteViewCount + 1;
        set({ quoteViewCount: newCount });

        if (newCount > 3) {
          set({ isPaywallVisible: true });
        }
      },

      incrementSaveCount: () => {
        const { isSubscribed, dailySaveCount, lastSaveDate } = get();
        if (isSubscribed) return true;

        const today = new Date().toDateString();

        if (lastSaveDate !== today) {
          // Reset count for a new day
          set({ dailySaveCount: 1, lastSaveDate: today });
          return true;
        }

        if (dailySaveCount >= 1) {
          set({ isPaywallVisible: true });
          return false;
        }

        set({ dailySaveCount: dailySaveCount + 1, lastSaveDate: today });
        return true;
      },

      checkTrialStatus: () => {
        const { isSubscribed, firstLaunchDate } = get();
        if (isSubscribed || !firstLaunchDate) return false;

        const launchTime = new Date(firstLaunchDate).getTime();
        const currentTime = new Date().getTime();
        const diffDays = (currentTime - launchTime) / (1000 * 60 * 60 * 24);

        if (diffDays > 3) {
          set({ isPaywallVisible: true });
          return true;
        }
        return false;
      }
    }),
    {
      name: 'aura-subscription-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        quoteViewCount: state.quoteViewCount,
        dailySaveCount: state.dailySaveCount,
        lastSaveDate: state.lastSaveDate,
        firstLaunchDate: state.firstLaunchDate,
      }),
    }
  )
);
