import { LucideIconName } from './lucide';

export interface MoodConfig {
  id: string;
  name: string;
  emoji: string;
  icon: LucideIconName;
  color: string;
  gradient: [string, string];
  quotes: string[];
}

export interface MoodStats {
  timesUsed: number;
  lastUsed: string | null;
  favoriteQuotes: number[];
}
