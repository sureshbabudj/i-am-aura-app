import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { colors, DEFAULT_GRADIENT } from '../constants/colors';
import { MOODS, MoodId } from '../constants/moods';
import { ExtensionStorage } from '@bacons/apple-targets';

export type BackgroundType = 'color' | 'gradient' | 'image' | 'pattern';

export interface TextAlignment {
  vertical: 'top' | 'center' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
}

export interface PatternConfig {
  type: string;
  opacity: number;
  scale: number;
  color: string;
  rotation?: number;
}

export interface Wallpaper {
  id: string;
  moodId: string;
  quote: string;

  // Background
  backgroundType: BackgroundType;
  backgroundValue: string | string[]; // hex, gradient array, imageUrl, patternType

  // Pattern overlay (when background is not pattern)
  patternConfig?: PatternConfig;

  // Image adjustments
  imageOpacity: number;
  imageSaturation: number;
  imageBlur?: number;

  // Text styling
  textColor: string;
  textSize: number;
  textAlignment: TextAlignment;
  textOpacity: number;
  textStyle?: string; // e.g., 'serifBold', 'script'
  fontFamily: string;
  textContent: string;

  dominantColor?: string;
  createdAt: string;
  isFavorite: boolean;
  isDaily: boolean;
  dailyOrder?: number;
}

interface WallpaperState {
  // Current editing wallpaper
  currentWallpaper: Partial<Wallpaper>;

  // Saved wallpapers
  savedWallpapers: Wallpaper[];

  // Daily queue
  dailyQueue: string[]; // wallpaper IDs

  // Actions
  createWallpaper: (moodId: string, quote: string) => void;
  updateWallpaper: (updates: Partial<Wallpaper>) => void;
  saveWallpaper: () => string; // returns ID
  deleteWallpaper: (id: string) => void;

  // Favorites & Daily
  toggleFavorite: (id: string) => void;
  addToDaily: (id: string) => void;
  removeFromDaily: (id: string) => void;
  reorderDailyQueue: (ids: string[]) => void;

  // Loading
  loadWallpaper: (id: string) => void;
  resetCurrent: () => void;

  // Recent items
  recentColors: string[];
  recentGradients: string[][];
  addRecentColor: (color: string) => void;
  addRecentGradient: (gradient: string[]) => void;
}

export const DEFAULT_WALLPAPER: Partial<Wallpaper> = {
  backgroundType: 'gradient',
  imageOpacity: 1,
  imageSaturation: 1,
  textColor: colors.white,
  textSize: 32,
  textAlignment: { vertical: 'center', horizontal: 'center' },
  textOpacity: 1,
  fontFamily: 'NotoSerif-Bold',
  patternConfig: {
    type: 'none',
    opacity: 0.2,
    scale: 1,
    color: colors.black,
  },
  textContent: '',
};

export const MOOD_DEFAULT_GRADIENTS: Record<string, string[]> = {
  confident: [colors['mood-confident-primary'], colors['mood-confident-secondary']],
  grateful: [colors['mood-grateful-primary'], colors['mood-grateful-secondary']],
  peaceful: [colors['mood-calm-primary'], colors['mood-calm-secondary']],
  focused: [colors['mood-focused-primary'], colors['mood-focused-secondary']],
  energetic: [colors['mood-energetic-primary'], colors['mood-energetic-secondary']],
  romantic: [colors['mood-peaceful-primary'], colors['mood-peaceful-secondary']],
};

export const useWallpaperStore = create<WallpaperState>()(
  persist(
    (set, get) => {
      const syncToWidget = () => {
        const { savedWallpapers, dailyQueue } = get();

        // 1. Find the primary wallpaper to show (usually the first in the daily queue)
        const dailyWallpaperId =
          dailyQueue?.[0] || savedWallpapers.find((w) => w.isDaily)?.id || savedWallpapers[0]?.id;
        const currentWp = savedWallpapers.find((w) => w.id === dailyWallpaperId);

        if (currentWp) {
          const mapToSwiftMetadata = (wp: Wallpaper) => {
            const moodInfo = MOODS[wp.moodId as MoodId];
            return {
              id: wp.id,
              moodId: wp.moodId,
              moodName: moodInfo?.name || wp.moodId,
              moodEmoji: moodInfo?.emoji || '🌿',
            };
          };

          // 2. Map only essential metadata for the current wallpaper
          const metadata = mapToSwiftMetadata(currentWp);

          // 3. Update via ExtensionStorage (Official module)
          const storage = new ExtensionStorage('group.com.sureshbabudj.iamaura');
          storage.set('currentWallpaper', metadata);
          console.log('currentWallpaper', metadata);

          // 4. Force widget refresh
          ExtensionStorage.reloadWidget();
        }
      };

      return {
        currentWallpaper: {
          ...DEFAULT_WALLPAPER,
          backgroundValue: DEFAULT_GRADIENT,
        },
        savedWallpapers: [],
        dailyQueue: [],
        recentColors: [],
        recentGradients: [],

        createWallpaper: (moodId, quote) => {
          const moodGradient = MOOD_DEFAULT_GRADIENTS[moodId] || DEFAULT_GRADIENT;
          set({
            currentWallpaper: {
              ...DEFAULT_WALLPAPER,
              id: Crypto.randomUUID(),
              moodId,
              quote,
              backgroundValue: moodGradient,
              createdAt: new Date().toISOString(),
            },
          });
        },

        updateWallpaper: (updates) => {
          set((state) => ({
            currentWallpaper: { ...state.currentWallpaper, ...updates },
          }));
        },

        saveWallpaper: () => {
          const { currentWallpaper, savedWallpapers } = get();
          const id = currentWallpaper.id || Crypto.randomUUID();
          const wallpaper = { ...currentWallpaper, id } as Wallpaper;

          const existingIndex = savedWallpapers.findIndex((w) => w.id === id);
          let newSaved;

          if (existingIndex >= 0) {
            newSaved = [...savedWallpapers];
            newSaved[existingIndex] = wallpaper;
          } else {
            newSaved = [wallpaper, ...savedWallpapers];
          }

          set({ savedWallpapers: newSaved });
          syncToWidget();
          return id;
        },

        deleteWallpaper: (id) => {
          set((state) => ({
            savedWallpapers: state.savedWallpapers.filter((w) => w.id !== id),
            dailyQueue: state.dailyQueue.filter((qid) => qid !== id),
          }));
          syncToWidget();
        },

        toggleFavorite: (id) => {
          set((state) => ({
            savedWallpapers: state.savedWallpapers.map((w) =>
              w.id === id ? { ...w, isFavorite: !w.isFavorite } : w
            ),
          }));
        },

        addToDaily: (id) => {
          set((state) => {
            const wallpaper = state.savedWallpapers.find((w) => w.id === id);
            if (!wallpaper) return state;

            const newQueue = [...state.dailyQueue, id];
            return {
              dailyQueue: newQueue,
              savedWallpapers: state.savedWallpapers.map((w) =>
                w.id === id ? { ...w, isDaily: true, dailyOrder: newQueue.length - 1 } : w
              ),
            };
          });
          syncToWidget();
        },

        removeFromDaily: (id) => {
          set((state) => ({
            dailyQueue: state.dailyQueue.filter((qid) => qid !== id),
            savedWallpapers: state.savedWallpapers.map((w) =>
              w.id === id ? { ...w, isDaily: false, dailyOrder: undefined } : w
            ),
          }));
          syncToWidget();
        },

        reorderDailyQueue: (ids) => {
          set((state) => ({
            dailyQueue: ids,
            savedWallpapers: state.savedWallpapers.map((w) => ({
              ...w,
              dailyOrder: ids.indexOf(w.id),
            })),
          }));
          syncToWidget();
        },

        loadWallpaper: (id) => {
          const { savedWallpapers } = get();
          const wallpaper = savedWallpapers.find((w) => w.id === id);
          if (wallpaper) {
            set({ currentWallpaper: wallpaper });
          }
        },

        resetCurrent: () => {
          set({ currentWallpaper: DEFAULT_WALLPAPER });
        },

        addRecentColor: (color) => {
          set((state) => {
            const newRecent = [color, ...state.recentColors.filter((c) => c !== color)].slice(
              0,
              10
            );
            return { recentColors: newRecent };
          });
        },

        addRecentGradient: (gradient) => {
          set((state) => {
            const gradStr = JSON.stringify(gradient);
            const newRecent = [
              gradient,
              ...state.recentGradients.filter((g) => JSON.stringify(g) !== gradStr),
            ].slice(0, 10);
            return { recentGradients: newRecent };
          });
        },
      };
    },
    {
      name: 'wallpaper-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
