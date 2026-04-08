import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  hasSeenOnboarding: boolean;
  completeOnboarding: () => void;
  reset: () => void;
  featureFlags: {
    darkTheme: boolean;
    dailyReminders: boolean;
    rateTheApp: boolean;
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      completeOnboarding: () => set({ hasSeenOnboarding: true }),
      featureFlags: {
        darkTheme: false,
        dailyReminders: false,
        rateTheApp: false,
      },
      reset: () =>
        set({
          hasSeenOnboarding: false,
          featureFlags: {
            darkTheme: false,
            dailyReminders: false,
            rateTheApp: false,
          },
        }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
