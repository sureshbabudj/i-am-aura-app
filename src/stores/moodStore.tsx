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
  favoriteAffirmations: Record<string, string[]>; // moodId -> affirmation indices

  // Actions
  setSelectedMood: (moodId: MoodId | null) => void;
  markMoodUsed: (moodId: MoodId) => void;
  toggleFavoriteAffirmation: (moodId: MoodId, affirmationIndex: number) => void;
  isAffirmationFavorite: (moodId: MoodId, affirmationIndex: number) => boolean;
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
      favoriteAffirmations: {},

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

      toggleFavoriteAffirmation: (moodId, affirmationIndex) => {
        set((state) => {
          const current = state.favoriteAffirmations[moodId] || [];
          const exists = current.includes(String(affirmationIndex));

          let updated: string[];
          if (exists) {
            updated = current.filter((i) => i !== String(affirmationIndex));
          } else {
            updated = [...current, String(affirmationIndex)];
          }

          return {
            favoriteAffirmations: {
              ...state.favoriteAffirmations,
              [moodId]: updated,
            },
          };
        });
      },

      isAffirmationFavorite: (moodId, affirmationIndex) => {
        const state = get();
        const favorites = state.favoriteAffirmations[moodId] || [];
        return favorites.includes(String(affirmationIndex));
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
