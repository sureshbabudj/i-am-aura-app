import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ban, Grid } from 'lucide-react-native';
import { Image } from 'expo-image';
import Slider from '@react-native-community/slider';
import { useWallpaperStore } from '@/src/stores/wallpaperStore';
import { MOOD_IMAGES } from '@/src/constants/images';
import { colors } from '@/src/constants/colors';

interface ImageTabProps {
  onShowMore: () => void;
}

export const ImageTab: React.FC<ImageTabProps> = ({ onShowMore }) => {
  const { currentWallpaper, updateWallpaper } = useWallpaperStore();

  const allImages = React.useMemo(() => {
    const images = MOOD_IMAGES[currentWallpaper.moodId!] || [];
    // Simple deterministic shuffle based on moodId to keep it stable during render
    // but random enough for variety
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
            className="flex w-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest"
            style={{ aspectRatio: 4 / 5 }}>
            <Ban size={24} color={colors['on-surface-variant']} />
            <Text className="mt-2 font-manrope text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              None
            </Text>
          </Pressable>

          {allImages.slice(0, 7).map((url) => {
            const isSelected = currentWallpaper.backgroundValue === url;
            return (
              <Pressable
                key={url}
                onPress={() => {
                  updateWallpaper({ backgroundType: 'image', backgroundValue: url });
                }}
                className={`relative w-20 shrink-0 overflow-hidden rounded-xl ${
                  isSelected ? 'border-2 border-primary' : 'bg-surface-container-low'
                }`}
                style={{ aspectRatio: 4 / 5 }}>
                <Image
                  source={{ uri: url }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="memory-disk"
                />
              </Pressable>
            );
          })}

          <Pressable
            onPress={onShowMore}
            className="flex w-20 shrink-0 items-center justify-center rounded-xl bg-surface-container transition-colors hover:bg-surface-container-high"
            style={{ aspectRatio: 4 / 5 }}>
            <Grid size={24} color={colors['on-surface-variant']} />
            <Text className="mt-2 font-manrope text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              More
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      <View>
        <Text className="mb-2 font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant/60">
          Opacity
        </Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={1}
          value={currentWallpaper.imageOpacity ?? 1}
          onValueChange={(val) => updateWallpaper({ imageOpacity: val })}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors['outline-variant']}
        />
      </View>

      <View>
        <Text className="mb-2 font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant/60">
          Saturation
        </Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={2}
          value={currentWallpaper.imageSaturation ?? 1}
          onValueChange={(val) => updateWallpaper({ imageSaturation: val })}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors['outline-variant']}
        />
      </View>
    </View>
  );
};
