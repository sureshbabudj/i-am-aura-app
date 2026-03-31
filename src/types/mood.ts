import { LucideIconName } from './lucide';

export interface MoodConfig {
    id: string;
    name: string;
    emoji: string;
    icon: LucideIconName;
    color: string;
    gradient: [string, string];
    affirmations: string[];
}

export interface MoodStats {
    timesUsed: number;
    lastUsed: string | null;
    favoriteAffirmations: number[];
}