import * as LucideIcons from 'lucide-react-native';
import { colors } from './colors';

export interface MoodConfig {
  id: string;
  name: string;
  emoji: string;
  icon: keyof typeof LucideIcons; // Lucide icon name
  color: string;
  gradient: readonly [string, string];
  quotes: readonly string[];
}

export const MOODS = {
  motivational: {
    id: 'motivational',
    name: 'Motivational',
    emoji: '🔥',
    icon: 'Flame',
    color: colors['mood-energetic-primary'],
    gradient: [colors['mood-energetic-primary'], colors['mood-energetic-secondary']],
    quotes: [
      'I am capable of achieving anything I set my mind to',
      'I am stronger than any challenge I face',
      'I am creating my own success story',
      'I am worthy of all my dreams',
      'I am unstoppable today',
    ],
  },
  romantic: {
    id: 'romantic',
    name: 'Love',
    emoji: '💕',
    icon: 'Heart',
    color: colors['mood-peaceful-primary'],
    gradient: [colors['mood-peaceful-primary'], colors['mood-peaceful-secondary']],
    quotes: [
      'I am deserving of deep, meaningful love',
      'I am open to giving and receiving love',
      'I am whole, and I attract wholeness',
      'I am worthy of a love that feels like home',
    ],
  },
  peaceful: {
    id: 'peaceful',
    name: 'Peaceful',
    emoji: '🌿',
    icon: 'Leaf',
    color: colors['mood-calm-primary'],
    gradient: [colors['mood-calm-primary'], colors['mood-calm-secondary']],
    quotes: [
      'I am calm in the midst of chaos',
      'I am at peace with my journey',
      'I am breathing in serenity, exhaling stress',
      'I am centered and grounded',
    ],
  },
  focused: {
    id: 'focused',
    name: 'Focused',
    emoji: '🎯',
    icon: 'Target',
    color: colors['mood-focused-primary'],
    gradient: [colors['mood-focused-primary'], colors['mood-focused-secondary']],
    quotes: [
      'I am fully present in this moment',
      'I am laser-focused on my priorities',
      'I am eliminating distractions with ease',
      'I am in my zone of genius',
    ],
  },
  confident: {
    id: 'confident',
    name: 'Confident',
    emoji: '⭐',
    icon: 'Star',
    color: colors['mood-confident-primary'],
    gradient: [colors['mood-confident-primary'], colors['mood-confident-secondary']],
    quotes: [
      'I am confident in my unique abilities',
      'I am enough exactly as I am',
      'I am radiating self-assurance',
      "I am proud of who I'm becoming",
    ],
  },
  grateful: {
    id: 'grateful',
    name: 'Grateful',
    emoji: '🙏',
    icon: 'Sparkles',
    color: colors['mood-grateful-primary'],
    gradient: [colors['mood-grateful-primary'], colors['mood-grateful-secondary']],
    quotes: [
      'I am thankful for this beautiful life',
      'I am surrounded by abundance',
      'I am grateful for the lessons today brings',
      'I am blessed beyond measure',
    ],
  },
} as const;

export type MoodId = keyof typeof MOODS;
