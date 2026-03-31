import * as LucideIcons from 'lucide-react-native';

export interface MoodConfig {
    id: string;
    name: string;
    emoji: string;
    icon: keyof typeof LucideIcons; // Lucide icon name
    color: string;
    gradient: readonly [string, string];
    affirmations: readonly string[];
}

export const MOODS = {
    motivational: {
        id: 'motivational',
        name: 'Motivational',
        emoji: '🔥',
        icon: 'Flame',
        color: '#FF6B35',
        gradient: ['#FF6B35', '#F7931E'],
        affirmations: [
            "I am capable of achieving anything I set my mind to",
            "I am stronger than any challenge I face",
            "I am creating my own success story",
            "I am worthy of all my dreams",
            "I am unstoppable today"
        ]
    },
    romantic: {
        id: 'romantic',
        name: 'Romantic',
        emoji: '💕',
        icon: 'Heart',
        color: '#FF6B9D',
        gradient: ['#FF6B9D', '#C44569'],
        affirmations: [
            "I am deserving of deep, meaningful love",
            "I am open to giving and receiving love",
            "I am whole, and I attract wholeness",
            "I am worthy of a love that feels like home"
        ]
    },
    peaceful: {
        id: 'peaceful',
        name: 'Peaceful',
        emoji: '🌿',
        icon: 'Leaf',
        color: '#96CEB4',
        gradient: ['#96CEB4', '#FFEAA7'],
        affirmations: [
            "I am calm in the midst of chaos",
            "I am at peace with my journey",
            "I am breathing in serenity, exhaling stress",
            "I am centered and grounded"
        ]
    },
    focused: {
        id: 'focused',
        name: 'Focused',
        emoji: '🎯',
        icon: 'Target',
        color: '#74B9FF',
        gradient: ['#74B9FF', '#0984E3'],
        affirmations: [
            "I am fully present in this moment",
            "I am laser-focused on my priorities",
            "I am eliminating distractions with ease",
            "I am in my zone of genius"
        ]
    },
    confident: {
        id: 'confident',
        name: 'Confident',
        emoji: '⭐',
        icon: 'Star',
        color: '#FDCB6E',
        gradient: ['#FDCB6E', '#E17055'],
        affirmations: [
            "I am confident in my unique abilities",
            "I am enough exactly as I am",
            "I am radiating self-assurance",
            "I am proud of who I'm becoming"
        ]
    },
    grateful: {
        id: 'grateful',
        name: 'Grateful',
        emoji: '🙏',
        icon: 'Sparkles',
        color: '#FD79A8',
        gradient: ['#FD79A8', '#E84393'],
        affirmations: [
            "I am thankful for this beautiful life",
            "I am surrounded by abundance",
            "I am grateful for the lessons today brings",
            "I am blessed beyond measure"
        ]
    }
} as const;

export type MoodId = keyof typeof MOODS;