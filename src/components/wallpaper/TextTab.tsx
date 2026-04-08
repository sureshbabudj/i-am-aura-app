import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Palette } from 'lucide-react-native';
import { useWallpaperStore } from '@/src/stores/wallpaperStore';
import { colors } from '@/src/constants/colors';

const PREDEFINED_COLORS = [
  colors.background,
  colors['secondary-container'],
  colors['primary-fixed'],
  colors.primary,
  colors['inverse-surface'],
  colors.tertiary,
  colors['sky-500'],
  colors['pink-500'],
  colors['yellow-500'],
  colors['green-500'],
];

interface TextTabProps {
  onPickColor: (target: 'bg' | 'text' | 'pattern' | 'gradient0' | 'gradient1') => void;
}

export const TextTab: React.FC<TextTabProps> = ({ onPickColor }) => {
  const { currentWallpaper, updateWallpaper } = useWallpaperStore();

  const ColorCircle = ({
    color,
    isSelected,
    onPress,
  }: {
    color: string;
    isSelected: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      style={{ backgroundColor: color }}
      className={`h-10 w-10 shrink-0 rounded-full border ${
        isSelected ? 'border-2 border-primary' : 'border border-outline-variant'
      }`}
    />
  );

  return (
    <View className="space-y-6 pb-32">
      <View>
        <Text className="mb-4 font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant/60">
          Text Color
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
          className="flex-row pb-2">
          <Pressable
            onPress={() => onPickColor('text')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dashed border-outline-variant transition-colors hover:bg-surface-container">
            <Palette size={18} color={colors['outline-variant']} />
          </Pressable>
          {[colors.white, colors.black, ...PREDEFINED_COLORS].map((c) => (
            <ColorCircle
              key={'tcol' + c}
              color={c}
              isSelected={currentWallpaper.textColor === c}
              onPress={() => updateWallpaper({ textColor: c })}
            />
          ))}
        </ScrollView>
      </View>

      <View>
        <Text className="mb-2 font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant/60">
          Size
        </Text>
        <View className="flex-row items-center gap-4 rounded-xl bg-surface-container-low p-2">
          {[24, 32, 48, 60].map((sz) => (
            <Pressable
              key={'sz' + sz}
              onPress={() => updateWallpaper({ textSize: sz })}
              className={`flex-1 items-center rounded-lg py-2 ${currentWallpaper.textSize === sz ? 'bg-white' : ''}`}>
              <Text
                className={`font-manrope font-bold ${currentWallpaper.textSize === sz ? 'text-primary' : 'text-on-surface-variant'}`}>
                {sz}px
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="my-2">
        <Text className="mb-2 font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant/60">
          Alignment
        </Text>
        <View className="flex-row rounded-xl bg-surface-container-low p-1">
          {(['left', 'center', 'right'] as const).map((align) => (
            <Pressable
              key={'h' + align}
              onPress={() =>
                updateWallpaper({
                  textAlignment: { ...currentWallpaper.textAlignment!, horizontal: align },
                })
              }
              className={`flex-1 items-center justify-center rounded-lg py-2.5 transition-colors ${currentWallpaper.textAlignment?.horizontal === align ? 'bg-white' : 'hover:bg-surface-container-high'}`}>
              <Text
                className={`font-manrope text-[10px] font-bold uppercase tracking-widest ${currentWallpaper.textAlignment?.horizontal === align ? 'text-primary' : 'text-on-surface-variant'}`}>
                {align}
              </Text>
            </Pressable>
          ))}
        </View>
        <View className="my-2 flex-row rounded-xl bg-surface-container-low p-1">
          {(['top', 'center', 'bottom'] as const).map((align) => (
            <Pressable
              key={'v' + align}
              onPress={() =>
                updateWallpaper({
                  textAlignment: { ...currentWallpaper.textAlignment!, vertical: align },
                })
              }
              className={`flex-1 items-center justify-center rounded-lg py-2.5 transition-colors ${currentWallpaper.textAlignment?.vertical === align ? 'bg-white' : 'hover:bg-surface-container-high'}`}>
              <Text
                className={`font-manrope text-[10px] font-bold uppercase tracking-widest ${currentWallpaper.textAlignment?.vertical === align ? 'text-primary' : 'text-on-surface-variant'}`}>
                {align}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View>
        <Text className="mb-2 font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant/60">
          Shadow
        </Text>
        <View className="flex-row items-center gap-4 rounded-xl bg-surface-container-low p-1">
          {[true, false].map((val) => (
            <Pressable
              key={'sh' + val}
              onPress={() => updateWallpaper({ textShadow: val })}
              className={`flex-1 items-center rounded-lg py-2.5 ${
                currentWallpaper.textShadow === val ? 'bg-white' : ''
              }`}>
              <Text
                className={`font-manrope text-[10px] font-bold uppercase tracking-widest ${
                  currentWallpaper.textShadow === val ? 'text-primary' : 'text-on-surface-variant'
                }`}>
                {val ? 'On' : 'Off'}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};
