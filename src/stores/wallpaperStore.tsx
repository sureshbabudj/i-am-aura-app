import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

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
    affirmation: string;

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
    fontFamily: string;
    textContent: string;

    // Metadata
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
    createWallpaper: (moodId: string, affirmation: string) => void;
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
}

const DEFAULT_WALLPAPER: Partial<Wallpaper> = {
    backgroundType: 'gradient',
    backgroundValue: ['#FF6B35', '#F7931E'],
    imageOpacity: 1,
    imageSaturation: 1,
    textColor: '#FFFFFF',
    textSize: 32,
    textAlignment: { vertical: 'center', horizontal: 'center' },
    textOpacity: 1,
    fontFamily: 'Inter-SemiBold',
    patternConfig: {
        type: 'dots',
        opacity: 0.1,
        scale: 1,
        color: '#FFFFFF',
    },
    textContent: ''
};

export const useWallpaperStore = create<WallpaperState>()(
    persist(
        (set, get) => ({
            currentWallpaper: DEFAULT_WALLPAPER,
            savedWallpapers: [],
            dailyQueue: [],

            createWallpaper: (moodId, affirmation) => {
                set({
                    currentWallpaper: {
                        ...DEFAULT_WALLPAPER,
                        id: Crypto.randomUUID(),
                        moodId,
                        affirmation,
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
                return id;
            },

            deleteWallpaper: (id) => {
                set((state) => ({
                    savedWallpapers: state.savedWallpapers.filter((w) => w.id !== id),
                    dailyQueue: state.dailyQueue.filter((qid) => qid !== id),
                }));
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
            },

            removeFromDaily: (id) => {
                set((state) => ({
                    dailyQueue: state.dailyQueue.filter((qid) => qid !== id),
                    savedWallpapers: state.savedWallpapers.map((w) =>
                        w.id === id ? { ...w, isDaily: false, dailyOrder: undefined } : w
                    ),
                }));
            },

            reorderDailyQueue: (ids) => {
                set((state) => ({
                    dailyQueue: ids,
                    savedWallpapers: state.savedWallpapers.map((w, index) => ({
                        ...w,
                        dailyOrder: ids.indexOf(w.id),
                    })),
                }));
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
        }),
        {
            name: 'wallpaper-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);


// Provider component for context (optional, mainly for initialization)
export const WallpaperProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <>{children}</>;
};