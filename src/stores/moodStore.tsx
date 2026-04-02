import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoodId } from '@/src/constants/moods';

interface MoodState {
  // Selection
  selectedMood: MoodId | null;
  recentlyUsed: MoodId[];

  // Stats
  moodUsageCount: Record<MoodId, number>;
  favoriteQuotes: Record<string, string[]>; // moodId -> quote indices

  // Actions
  setSelectedMood: (moodId: MoodId | null) => void;
  markMoodUsed: (moodId: MoodId) => void;
  toggleFavoriteQuote: (moodId: MoodId, quoteIndex: number) => void;
  isQuoteFavorite: (moodId: MoodId, quoteIndex: number) => boolean;
  getRecommendedMood: () => MoodId;
  getMoodStats: () => { mostUsed: MoodId | null; totalCreations: number };
}

const MAX_RECENT = 5;

export const useMoodStore = create<MoodState>()(
  persist(
    (set, get) => ({
      selectedMood: null,
      recentlyUsed: [],
      moodUsageCount: {} as Record<MoodId, number>,
      favoriteQuotes: {},

      setSelectedMood: (moodId) => {
        set({ selectedMood: moodId });
        if (moodId) {
          get().markMoodUsed(moodId);
        }
      },

      markMoodUsed: (moodId) => {
        set((state) => {
          // Update usage count
          const newCount = {
            ...state.moodUsageCount,
            [moodId]: (state.moodUsageCount[moodId] || 0) + 1,
          };

          // Update recently used (move to front, limit size)
          const filtered = state.recentlyUsed.filter((m) => m !== moodId);
          const newRecent = [moodId, ...filtered].slice(0, MAX_RECENT);

          return {
            moodUsageCount: newCount,
            recentlyUsed: newRecent,
          };
        });
      },

      toggleFavoriteQuote: (moodId, quoteIndex) => {
        set((state) => {
          const current = state.favoriteQuotes[moodId] || [];
          const exists = current.includes(String(quoteIndex));

          let updated: string[];
          if (exists) {
            updated = current.filter((i) => i !== String(quoteIndex));
          } else {
            updated = [...current, String(quoteIndex)];
          }

          return {
            favoriteQuotes: {
              ...state.favoriteQuotes,
              [moodId]: updated,
            },
          };
        });
      },

      isQuoteFavorite: (moodId, quoteIndex) => {
        const state = get();
        const favorites = state.favoriteQuotes[moodId] || [];
        return favorites.includes(String(quoteIndex));
      },

      getRecommendedMood: () => {
        const state = get();

        // Return most used mood, or default to motivational
        let maxCount = 0;
        let recommended: MoodId = 'motivational';

        Object.entries(state.moodUsageCount).forEach(([moodId, count]) => {
          if (count > maxCount) {
            maxCount = count;
            recommended = moodId as MoodId;
          }
        });

        return recommended;
      },

      getMoodStats: () => {
        const state = get();
        const total = Object.values(state.moodUsageCount).reduce((a, b) => a + b, 0);

        let mostUsed: MoodId | null = null;
        let maxCount = 0;

        Object.entries(state.moodUsageCount).forEach(([moodId, count]) => {
          if (count > maxCount) {
            maxCount = count;
            mostUsed = moodId as MoodId;
          }
        });

        return { mostUsed, totalCreations: total };
      },
    }),
    {
      name: 'mood-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Provider component for context (optional, mainly for initialization)
export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
