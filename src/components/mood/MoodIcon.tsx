import React from 'react';
import { View, Text } from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import { LucideIconName } from '@/src/types/lucide';

interface MoodIconProps {
    emoji: string;
    icon: LucideIconName;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showBadge?: boolean;
    badgeColor?: string;
}

export const MoodIcon: React.FC<MoodIconProps> = ({
    emoji,
    icon,
    size = 'md',
    showBadge = false,
    badgeColor = '#FF6B35'
}) => {
    const sizeMap = {
        sm: { container: 32, emoji: 16, icon: 14 },
        md: { container: 48, emoji: 24, icon: 20 },
        lg: { container: 64, emoji: 32, icon: 28 },
        xl: { container: 80, emoji: 40, icon: 36 },
    };

    const { container, emoji: emojiSize, icon: iconSize } = sizeMap[size];

    // Dynamic icon component from Lucide
    const IconComponent = LucideIcons[icon as keyof typeof LucideIcons] as React.ComponentType<{
        size: number;
        color: string;
        strokeWidth?: number;
    }>;

    return (
        <View
            className="items-center justify-center rounded-[0.5rem] bg-surface-container relative"
            style={{ width: container, height: container }}
        >
            <Text style={{ fontSize: emojiSize }}>{emoji}</Text>

            {IconComponent && (
                <View className="absolute -bottom-1 -right-1 bg-surface-container-highest rounded-full p-1 border-2 border-surface">
                    <IconComponent
                        size={iconSize}
                        color="#53433e"
                        strokeWidth={2}
                    />
                </View>
            )}

            {showBadge && (
                <View
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-surface"
                    style={{ backgroundColor: badgeColor }}
                />
            )}
        </View>
    );
};