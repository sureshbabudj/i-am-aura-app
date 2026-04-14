import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Trash2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';

import { Wallpaper } from '@/src/stores/wallpaperStore';
import { MOODS, MoodId } from '@/src/constants/moods';
import { colors } from '@/src/constants/colors';
import {
  THUMB_IMG_WIDTH,
  THUMB_IMG_HEIGHT,
  SMALL_THUMB_IMG_WIDTH,
  SMALL_THUMB_IMG_HEIGHT,
} from '@/src/constants/images';

import * as Linking from 'expo-linking';

export const RenderWallpaperCard = ({
  wallpaper,
  toggleFavorite,
  deleteWallpaper,
}: {
  wallpaper: Wallpaper;
  toggleFavorite: (id: string) => void;
  deleteWallpaper: (id: string) => void;
}) => {
  const moodConfig = MOODS[wallpaper.moodId as MoodId];
  const router = useRouter();

  const handleOpenUnsplash = () => {
    if (wallpaper.unsplashHref) {
      const fullUrl = `https://unsplash.com${wallpaper.unsplashHref}`;
      Linking.openURL(fullUrl);
    } else {
      Linking.openURL('https://unsplash.com');
    }
  };

  return (
    <View key={wallpaper.id} className="mb-8 w-full flex-col">
      <Pressable
        onPress={() => router.push(`/create/${wallpaper.id}`)}
        className="relative w-full overflow-hidden rounded-[2rem] bg-surface-container shadow-sm"
        style={{ aspectRatio: 0.8 }}>
        {wallpaper.backgroundType === 'color' && (
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: wallpaper.backgroundValue as string },
            ]}
          />
        )}
        {wallpaper.backgroundType === 'gradient' && (
          <LinearGradient
            colors={wallpaper.backgroundValue as [string, string]}
            style={StyleSheet.absoluteFill}
          />
        )}
        {wallpaper.backgroundType === 'image' && (
          <View style={StyleSheet.absoluteFill}>
            <Image
              source={{
                uri: (() => {
                  try {
                    const parsed = JSON.parse(wallpaper.backgroundValue as string);
                    return parsed.medium || parsed.full;
                  } catch (e) {
                    return (wallpaper.backgroundValue as string)
                      .replace(`w_${SMALL_THUMB_IMG_WIDTH}`, `w_${THUMB_IMG_WIDTH}`)
                      .replace(`h_${SMALL_THUMB_IMG_HEIGHT}`, `h_${THUMB_IMG_HEIGHT}`);
                  }
                })(),
              }}
              style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
              className="absolute inset-0 z-0 h-full w-full"
              contentFit="cover"
              transition={200}
            />
            <Pressable
              onPress={handleOpenUnsplash}
              className="absolute bottom-4 right-4 z-10 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-md active:bg-black/50">
              <Text className="font-manrope text-[10px] font-medium text-white/90">Unsplash</Text>
            </Pressable>
          </View>
        )}

        <LinearGradient
          colors={['transparent', `${colors.black}1A`, `${colors.black}99`]}
          style={StyleSheet.absoluteFill}
        />

        <View
          style={[
            StyleSheet.absoluteFill,
            {
              padding: 16,
              paddingBottom: 48, // space for mood tag
              justifyContent:
                wallpaper.textAlignment?.vertical === 'top'
                  ? 'flex-start'
                  : wallpaper.textAlignment?.vertical === 'bottom'
                    ? 'flex-end'
                    : 'center',
              alignItems:
                wallpaper.textAlignment?.horizontal === 'left'
                  ? 'flex-start'
                  : wallpaper.textAlignment?.horizontal === 'right'
                    ? 'flex-end'
                    : 'center',
            },
          ]}>
          <Text
            numberOfLines={4}
            style={{
              fontFamily: wallpaper.fontFamily || 'NotoSerif-Bold',
              fontSize: Math.max(14, (wallpaper.textSize || 32) * 0.5),
              color: wallpaper.textColor || colors.white,
              textAlign: (wallpaper.textAlignment?.horizontal as any) || 'center',
              opacity: wallpaper.textOpacity ?? 1,
            }}>
            {wallpaper.quote}
          </Text>
        </View>

        <View
          style={StyleSheet.absoluteFill}
          className="pointer-events-none flex-col justify-end p-4 sm:p-6">
          <View className="flex-row items-center gap-2">
            <Text style={{ color: `${colors.white}CC` }}>{moodConfig?.emoji || '✨'}</Text>
            <Text
              style={{ color: `${colors.white}CC` }}
              className="font-manrope text-[10px] font-bold uppercase tracking-widest">
              {moodConfig?.name || 'Saved'}
            </Text>
          </View>
        </View>
      </Pressable>

      <View className="mt-3 flex-row items-center justify-between px-2">
        <Text className="font-manrope text-[10px] uppercase tracking-tighter text-outline">
          {/* Replace with actual created date if exists, otherwise placeholder */}
          Saved
        </Text>
        <View className="flex-row gap-3">
          <Pressable onPress={() => toggleFavorite(wallpaper.id)} className="active:scale-90">
            <Heart
              size={18}
              color={wallpaper.isFavorite ? colors.primary : colors.outline}
              fill={wallpaper.isFavorite ? colors.primary : 'transparent'}
            />
          </Pressable>
          <Pressable onPress={() => deleteWallpaper(wallpaper.id)} className="active:scale-90">
            <Trash2 size={18} color={colors.outline} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};
