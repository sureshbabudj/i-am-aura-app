import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings, Sparkles, Layout } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useWallpaperStore } from '@/src/stores/wallpaperStore';
import { MOODS, MoodId } from '@/src/constants/moods';
import { colors } from '@/src/constants/colors';

export default function DailyScreen() {
  const { savedWallpapers, dailyQueue } = useWallpaperStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Get the first item from the daily queue, or the first daily item, or fallback to the first saved wallpaper
  const dailyWallpaperId =
    dailyQueue?.[0] || savedWallpapers.find((w) => w.isDaily)?.id || savedWallpapers[0]?.id;
  const dailyWallpaper = savedWallpapers.find((w) => w.id === dailyWallpaperId);

  const moodConfig = dailyWallpaper ? MOODS[dailyWallpaper.moodId as MoodId] : null;

  const renderWidgetPreview = (size: 'small' | 'medium' | 'large', label: string) => {
    const dimensions = {
      small: { width: 150, height: 150 },
      medium: { width: 320, height: 150 },
      large: { width: 320, height: 320 },
    }[size];

    return (
      <View className="mb-8 items-center">
        <Text className="mb-3 font-manrope text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          {label}
        </Text>
        <View
          style={[
            {
              width: dimensions.width,
              height: dimensions.height,
              borderRadius: 24,
              overflow: 'hidden',
            },
            styles.widgetShadow,
          ]}
          className="bg-surface-container">
          {dailyWallpaper && (
            <>
              {dailyWallpaper.backgroundType === 'color' && (
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: dailyWallpaper.backgroundValue as string },
                  ]}
                />
              )}
              {dailyWallpaper.backgroundType === 'gradient' && (
                <LinearGradient
                  colors={dailyWallpaper.backgroundValue as [string, string]}
                  style={StyleSheet.absoluteFill}
                />
              )}
              {dailyWallpaper.backgroundType === 'image' && (
                <Image
                  source={{ uri: dailyWallpaper.backgroundValue as string }}
                  className="h-full w-full"
                  contentFit="cover"
                />
              )}

              <View className="flex-1 items-center justify-center p-4">
                <Text
                  numberOfLines={size === 'small' ? 3 : 5}
                  className={`text-center font-bold text-white ${size === 'small' ? 'text-sm' : 'text-lg'}`}
                  style={{ color: dailyWallpaper.textColor, opacity: 0.9 }}>
                  &quot;{dailyWallpaper.quote}&quot;
                </Text>
                {size !== 'small' && (
                  <View className="mt-3 rounded-full bg-black/30 px-3 py-1 backdrop-blur-md">
                    <Text className="text-[10px] font-medium uppercase tracking-widest text-white">
                      {moodConfig?.name}
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="dark" />

      <ScrollView className="flex-1">
        {/* Header */}
        <View
          style={{ paddingTop: insets.top + 20 }}
          className="flex-row items-center justify-between px-6 pb-6">
          <View>
            <Text className="font-noto-serif text-3xl text-on-surface">Today</Text>
            <Text className="mt-1 font-manrope text-on-surface-variant">Widget Preview</Text>
          </View>
          <Pressable
            onPress={() => router.push('/settings')}
            className="h-10 w-10 items-center justify-center rounded-full border-outline-variant bg-surface-container">
            <Settings size={20} color={colors['on-surface-variant']} />
          </Pressable>
        </View>

        {dailyWallpaper ? (
          <View className="px-6 pt-4">
            <View className="mb-10 flex-row items-center rounded-[2rem] border-primary bg-primary-container p-5">
              <Sparkles size={24} color={colors.background} />
              <View className="ml-4 flex-1">
                <Text className="font-manrope font-bold text-on-primary-container">
                  Rotation Active
                </Text>
                <Text className="font-manrope text-xs text-on-primary-container">
                  Your widgets will sync with this quote.
                </Text>
              </View>
              <Pressable
                className="flex-row rounded-full bg-primary px-4 py-2"
                onPress={() => router.push(`/create/${dailyWallpaper.id}`)}>
                <Text className="font-manrope font-bold text-on-primary">Edit</Text>
              </Pressable>
            </View>

            <View className="items-center">
              {renderWidgetPreview('small', 'Home Screen (Small)')}
              {renderWidgetPreview('medium', 'Home Screen (Medium)')}
            </View>
          </View>
        ) : (
          <View className="mt-20 flex-1 items-center justify-center p-12">
            <View className="mb-6 h-16 w-16 items-center justify-center rounded-full bg-surface-container">
              <Layout size={32} color={colors['on-surface-variant']} />
            </View>
            <Text className="mb-2 text-center font-noto-serif text-xl text-on-surface">
              No active quote
            </Text>
            <Text className="mb-8 text-center font-manrope text-on-surface-variant">
              Select one of your saved quotes and mark it as &quot;Daily&quot; to see it here and in
              your widgets.
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)/library')}
              className="rounded-full bg-primary px-8 py-3">
              <Text className="font-manrope font-bold text-on-primary">Go to Library</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  widgetShadow: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
});
