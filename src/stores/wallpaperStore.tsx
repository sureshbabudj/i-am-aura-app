import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { colors, DEFAULT_GRADIENT } from '../constants/colors';
import { MOODS, MoodId } from '../constants/moods';
// eslint-disable-next-line import/no-unresolved
import * as AuraBridge from 'aura-bridge';

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

  // Widget Snapshots
  smallFilename?: string;
  mediumFilename?: string;
  largeFilename?: string;

  // External Links
  unsplashHref?: string;
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
  syncToWidget: (id?: string) => void;

  // Recent items
  recentColors: string[];
  recentGradients: string[][];
  addRecentColor: (color: string) => void;
  addRecentGradient: (gradient: string[]) => void;
}

interface WallPaperEntry {
  id: string;
  moodId: string;
  moodName: string;
  moodEmoji: string;
  smallFilename: string | null;
  mediumFilename: string | null;
  largeFilename: string | null;
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
      const syncToWidget = (priorityId?: string) => {
        const { savedWallpapers, dailyQueue } = get();

        // 1. Resolve which wallpaper to sync:
        // Priority: 1. Passed priorityId, 2. First daily in queue, 3. Any daily flagged, 4. First saved
        const targetId =
          priorityId ||
          dailyQueue?.[0] ||
          savedWallpapers.find((w) => w.isDaily)?.id ||
          savedWallpapers[0]?.id;

        const currentWp = savedWallpapers.find((w) => w.id === targetId);

        if (currentWp) {
          const mapToSwiftMetadata = (wp: Wallpaper) => {
            const moodInfo = MOODS[wp.moodId as MoodId];
            const data: WallPaperEntry = {
              id: wp.id,
              moodId: wp.moodId,
              moodName: moodInfo?.name || wp.moodId,
              moodEmoji: moodInfo?.emoji || '🌿',
              smallFilename: null,
              mediumFilename: null,
              largeFilename: null,
            };

            if (wp.smallFilename) data.smallFilename = wp.smallFilename;
            if (wp.mediumFilename) data.mediumFilename = wp.mediumFilename;
            if (wp.largeFilename) data.largeFilename = wp.largeFilename;

            return data;
          };

          // 2. Map only essential metadata for the resolved wallpaper
          const metadata: WallPaperEntry = mapToSwiftMetadata(currentWp);

          // 3. Update via Custom AuraBridge (Direct UserDefaults access)
          const groupId = 'group.com.sureshbabudj.iamaura';
          const sharedKey = 'currentWallpaper';
          AuraBridge.setSharedData(groupId, sharedKey, metadata);

          // 4. Force widget refresh
          setTimeout(() => {
            AuraBridge.reloadWidget();
          }, 500);
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
          // Removed syncToWidget(id) - sync is now an explicit user action from the UI
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

        syncToWidget: (id) => syncToWidget(id),

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
