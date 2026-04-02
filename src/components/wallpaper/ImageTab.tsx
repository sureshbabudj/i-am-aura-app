import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ban, Grid } from 'lucide-react-native';
import { Image } from 'expo-image';
import Slider from '@react-native-community/slider';
import { useWallpaperStore } from '@/src/stores/wallpaperStore';
import { MOOD_IMAGES } from '@/src/constants/images';
import { colors } from '@/src/constants/colors';

interface ImageTabProps {
  onShowMore: () => void;
}

const MoodImage = React.memo(
  ({ url, isSelected, onPress }: { url: string; isSelected: boolean; onPress: () => void }) => (
    <Pressable
      onPress={onPress}
      style={{
        width: 80,
        aspectRatio: 0.8,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: colors['surface-container-low'],
        position: 'relative',
        borderWidth: isSelected ? 2 : 0,
        borderColor: isSelected ? colors.primary : 'transparent',
      }}>
      <Image
        source={{ uri: url }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        cachePolicy="memory-disk"
      />
    </Pressable>
  )
);

export const ImageTab: React.FC<ImageTabProps> = ({ onShowMore }) => {
  const { currentWallpaper, updateWallpaper } = useWallpaperStore();

  const allImages = React.useMemo(() => {
    const images = MOOD_IMAGES[currentWallpaper.moodId!] || [];
    // Seeded shuffle to keep it random but stable for the current mood
    return [...images].sort(() => 0.5 - Math.random());
  }, [currentWallpaper.moodId]);

  return (
    <View className="space-y-6 pb-32">
      <View>
        <Text className="mb-4 font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant/60">
          Select Image
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
          className="flex-row pb-2">
          <Pressable
            onPress={() =>
              updateWallpaper({ backgroundType: 'color', backgroundValue: colors.black })
            }
            style={{
              width: 80,
              aspectRatio: 0.8,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderStyle: 'dashed',
              borderColor: colors['outline-variant'],
              backgroundColor: colors['surface-container-lowest'],
            }}>
            <Ban size={24} color={colors['on-surface-variant']} />
            <Text className="mt-2 font-manrope text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              None
            </Text>
          </Pressable>

          {allImages.slice(0, 7).map((url) => (
            <MoodImage
              key={url}
              url={url}
              isSelected={currentWallpaper.backgroundValue === url}
              onPress={() => updateWallpaper({ backgroundType: 'image', backgroundValue: url })}
            />
          ))}

          <Pressable
            onPress={onShowMore}
            style={{
              width: 80,
              aspectRatio: 0.8,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors['surface-container'],
            }}>
            <Grid size={24} color={colors['on-surface-variant']} />
            <Text className="mt-2 font-manrope text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              More
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      <View>
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant/60">
            Opacity
          </Text>
          <Text className="font-manrope text-[10px] font-bold text-primary">
            {Math.round((currentWallpaper.imageOpacity ?? 1) * 100)}%
          </Text>
        </View>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={1}
          value={currentWallpaper.imageOpacity ?? 1}
          onValueChange={(val) => updateWallpaper({ imageOpacity: val })}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors['outline-variant']}
          thumbTintColor={colors.primary}
        />
      </View>

      <View>
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant/60">
            Saturation
          </Text>
          <Text className="font-manrope text-[10px] font-bold text-primary">
            {Math.round((currentWallpaper.imageSaturation ?? 1) * 100)}%
          </Text>
        </View>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={2}
          value={currentWallpaper.imageSaturation ?? 1}
          onValueChange={(val) => updateWallpaper({ imageSaturation: val })}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors['outline-variant']}
          thumbTintColor={colors.primary}
        />
      </View>
    </View>
  );
};
