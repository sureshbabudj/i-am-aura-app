import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as LucideIcons from 'lucide-react-native';
import { MoodConfig } from '@/src/constants/moods';

interface MoodCardProps {
  mood: MoodConfig;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
}

export const MoodCard: React.FC<MoodCardProps> = ({ mood, onPress, size = 'medium' }) => {
  // Dynamic icon component from Lucide
  const IconComponent = (LucideIcons as any)[mood.icon];

  const sizeStyles = {
    small: {
      container: 'w-[48%] aspect-square',
      emoji: 'text-2xl',
      icon: 20,
      title: 'text-sm',
      count: 'text-xs',
    },
    medium: {
      container: 'w-[48%] aspect-square rounded-2xl',
      emoji: 'text-4xl mb-2',
      icon: 24,
      title: 'text-lg',
      count: 'text-sm',
    },
    large: {
      container: 'w-full aspect-video rounded-3xl',
      emoji: 'text-5xl mb-3',
      icon: 32,
      title: 'text-2xl',
      count: 'text-base',
    },
  };

  const styles = sizeStyles[size];

  return (
    <Pressable
      onPress={onPress}
      className={`${styles.container} mb-4 overflow-hidden transition-transform active:scale-95`}
      style={{ borderRadius: size === 'small' ? 12 : size === 'medium' ? 16 : 24 }}>
      <LinearGradient
        colors={mood.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 justify-between p-4">
        {/* Top Row: Emoji + Icon */}
        <View className="flex-row items-start justify-between">
          <Text className={styles.emoji}>{mood.emoji}</Text>
          {IconComponent && (
            <View className="rounded-full bg-white/20 p-2">
              <IconComponent size={styles.icon} color="white" />
            </View>
          )}
        </View>

        {/* Bottom: Title + Quote Count */}
        <View>
          <Text className={`font-noto-serif font-bold text-white ${styles.title} mb-1`}>
            {mood.name}
          </Text>
          <Text className={`font-manrope text-white/80 ${styles.count}`}>
            {mood.quotes.length} quotes
          </Text>
        </View>

        {/* Decorative Pattern Overlay */}
        <View
          className="pointer-events-none absolute inset-0 opacity-10"
          style={
            {
              experimental_backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '20px 20px',
            } as any
          }
        />
      </LinearGradient>
    </Pressable>
  );
};
