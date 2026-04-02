import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, Trash2, Menu, User, BookOpen, List, Search, Share2 } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';

import { useWallpaperStore, Wallpaper } from '@/src/stores/wallpaperStore';
import { MOODS, MoodId } from '@/src/constants/moods';
import { colors } from '@/src/constants/colors';
import {
  THUMB_IMG_WIDTH,
  THUMB_IMG_HEIGHT,
  SMALL_THUMB_IMG_WIDTH,
  SMALL_THUMB_IMG_HEIGHT,
} from '@/src/constants/data';

export default function LibraryScreen() {
  const { savedWallpapers, deleteWallpaper, toggleFavorite } = useWallpaperStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<'all' | MoodId>('all');

  const filteredWallpapers = useMemo(() => {
    return savedWallpapers.filter((wp) => {
      const matchesMood = selectedMoodFilter === 'all' || wp.moodId === selectedMoodFilter;
      const matchesSearch =
        wp.affirmation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        MOODS[wp.moodId as MoodId]?.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesMood && matchesSearch;
    });
  }, [savedWallpapers, searchQuery, selectedMoodFilter]);

  const renderWallpaperCard = (wallpaper: Wallpaper, index: number) => {
    const moodConfig = MOODS[wallpaper.moodId as MoodId];

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
                  uri: (wallpaper.backgroundValue as string)
                    .replace(`w_${SMALL_THUMB_IMG_WIDTH}`, `w_${THUMB_IMG_WIDTH}`)
                    .replace(`h_${SMALL_THUMB_IMG_HEIGHT}`, `h_${THUMB_IMG_HEIGHT}`),
                }}
                style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
                className="absolute inset-0 z-0 h-full w-full"
                contentFit="cover"
                transition={200}
              />
              <View className="absolute bottom-4 right-4 z-10 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-md">
                <Text className="font-manrope text-[10px] font-medium text-white/90">Unsplash</Text>
              </View>
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
              {wallpaper.affirmation}
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

  return (
    <View className="flex-1 bg-surface">
      <StatusBar />

      {/* Header */}
      <View
        style={{ paddingTop: insets.top }}
        className="z-40 w-full flex-row items-center justify-between bg-surface px-6 py-4">
        <Pressable className="text-primary active:scale-95">
          <Menu size={24} color={colors.primary} />
        </Pressable>
        <Text className="font-noto-serif-italic text-2xl tracking-tight text-primary">I Am</Text>
        <Pressable
          onPress={() => router.push('/settings')}
          className="text-primary active:scale-95">
          <User size={24} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        {/* Search & Filter Section */}
        <View className="pb-6 pt-4">
          <View className="relative mb-6 w-full px-6">
            <View className="pointer-events-none absolute inset-y-0 left-12 z-10 flex items-center justify-center">
              <Search size={20} color={colors.outline} />
            </View>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search affirmations..."
              placeholderTextColor={`${colors.outline}99`}
              className="w-full rounded-full bg-surface-container-low py-4 pl-14 pr-6 font-manrope text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20"
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-6 flex-row gap-3">
            <Pressable
              onPress={() => setSelectedMoodFilter('all')}
              className={`rounded-full px-6 py-2 transition-transform active:scale-95 ${
                selectedMoodFilter === 'all'
                  ? 'bg-primary'
                  : 'bg-surface-container-high hover:bg-surface-container-highest'
              }`}>
              <Text
                className={`font-manrope text-sm font-medium ${
                  selectedMoodFilter === 'all' ? 'text-on-primary' : 'text-on-surface-variant'
                }`}>
                All Moods
              </Text>
            </Pressable>
            {Object.entries(MOODS).map(([moodId, config]) => {
              const isSelected = selectedMoodFilter === moodId;
              return (
                <Pressable
                  key={moodId}
                  onPress={() => setSelectedMoodFilter(moodId as MoodId)}
                  className={`rounded-full px-6 py-2 transition-transform active:scale-95 ${
                    isSelected
                      ? 'bg-primary'
                      : 'bg-surface-container-high hover:bg-surface-container-highest'
                  }`}>
                  <Text
                    className={`font-manrope text-sm font-medium ${
                      isSelected ? 'text-on-primary' : 'text-on-surface-variant'
                    }`}>
                    {config.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Today's Focus Section */}
        {savedWallpapers.length > 0 && searchQuery === '' && selectedMoodFilter === 'all' && (
          <View className="group relative mb-12 mt-4 px-6">
            <View className="absolute -top-3 left-10 z-10">
              <Text className="rounded-full bg-surface px-3 py-1 font-manrope text-[10px] font-bold uppercase tracking-widest text-primary">
                Today&apos;s Focus
              </Text>
            </View>
            <Pressable
              onPress={() => router.push(`/create/${savedWallpapers[0].id}`)}
              className="relative h-[400px] w-full items-center justify-center overflow-hidden rounded-[2.5rem] p-8 text-center">
              {savedWallpapers[0].backgroundType === 'color' && (
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: savedWallpapers[0].backgroundValue as string },
                  ]}
                />
              )}
              {savedWallpapers[0].backgroundType === 'gradient' && (
                <LinearGradient
                  colors={savedWallpapers[0].backgroundValue as [string, string]}
                  style={StyleSheet.absoluteFill}
                />
              )}
              {savedWallpapers[0].backgroundType === 'image' && (
                <Image
                  source={{
                    uri: (savedWallpapers[0].backgroundValue as string)
                      .replace(`w_${SMALL_THUMB_IMG_WIDTH}`, `w_${THUMB_IMG_WIDTH}`)
                      .replace(`h_${SMALL_THUMB_IMG_HEIGHT}`, `h_${THUMB_IMG_HEIGHT}`),
                  }}
                  style={[StyleSheet.absoluteFill]}
                  className="absolute inset-0 z-0 h-full w-full"
                  contentFit="cover"
                  transition={200}
                />
              )}
              <LinearGradient
                colors={[`${colors.black}1A`, `${colors.black}66`, `${colors.black}99`]}
                style={StyleSheet.absoluteFill}
              />

              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    padding: 32,
                    justifyContent:
                      savedWallpapers[0].textAlignment?.vertical === 'top'
                        ? 'flex-start'
                        : savedWallpapers[0].textAlignment?.vertical === 'bottom'
                          ? 'flex-end'
                          : 'center',
                    alignItems:
                      savedWallpapers[0].textAlignment?.horizontal === 'left'
                        ? 'flex-start'
                        : savedWallpapers[0].textAlignment?.horizontal === 'right'
                          ? 'flex-end'
                          : 'center',
                  },
                ]}
                className="relative z-10 w-full"
                pointerEvents="none">
                <Text
                  style={{
                    fontFamily: savedWallpapers[0].fontFamily || 'NotoSerif-Bold',
                    fontSize: savedWallpapers[0].textSize || 32,
                    color: savedWallpapers[0].textColor || colors.white,
                    textAlign: (savedWallpapers[0].textAlignment?.horizontal as any) || 'center',
                    opacity: savedWallpapers[0].textOpacity ?? 1,
                  }}>
                  {savedWallpapers[0].affirmation}
                </Text>

                <View className="mt-6 flex-row items-center justify-center gap-4">
                  <View
                    style={{
                      backgroundColor: `${colors.white}1A`,
                      borderColor: `${colors.white}33`,
                    }}
                    className="rounded-full border px-4 py-1.5 backdrop-blur-md">
                    <Text
                      style={{ color: colors.white }}
                      className="font-manrope text-[10px] font-bold uppercase tracking-widest">
                      Saved
                    </Text>
                  </View>
                </View>
              </View>

              <View className="absolute bottom-6 right-6 flex-row gap-3">
                <Pressable
                  onPress={() => toggleFavorite(savedWallpapers[0].id)}
                  style={{ backgroundColor: `${colors.white}33` }}
                  className="h-12 w-12 items-center justify-center rounded-full backdrop-blur-xl active:scale-95">
                  <Heart
                    size={20}
                    color={savedWallpapers[0].isFavorite ? colors['inverse-primary'] : colors.white}
                    fill={savedWallpapers[0].isFavorite ? colors['inverse-primary'] : 'transparent'}
                  />
                </Pressable>
                <Pressable
                  style={{ backgroundColor: `${colors.white}33` }}
                  className="h-12 w-12 items-center justify-center rounded-full backdrop-blur-xl active:scale-95">
                  <Share2 size={20} color={colors.white} />
                </Pressable>
              </View>
            </Pressable>
          </View>
        )}

        <View className="mb-8 flex-row items-end justify-between px-8">
          <View>
            <Text className="font-noto-serif text-3xl text-on-surface">Saved Library</Text>
            <Text className="mt-1 font-manrope text-sm text-on-surface-variant">
              {filteredWallpapers.length} affirmations in your sanctuary
            </Text>
          </View>
          <Pressable className="flex-row items-center gap-1 active:opacity-80">
            <Text className="font-manrope text-xs font-semibold text-primary">View as List</Text>
            <List size={18} color={colors.primary} />
          </Pressable>
        </View>

        {filteredWallpapers.length === 0 ? (
          <View className="mx-auto max-w-lg items-center space-y-6 px-8 py-16 text-center">
            <BookOpen size={48} color={`${colors.primary}4D`} />
            <Text className="font-noto-serif text-2xl text-on-surface">
              Keep growing your sanctuary
            </Text>
            <Text className="text-center font-manrope text-base leading-relaxed text-on-surface-variant">
              {searchQuery || selectedMoodFilter !== 'all'
                ? 'No affirmations match your search filters.'
                : 'Your library is a reflection of your journey. Continue saving the words that resonate most deeply with your soul.'}
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)')}
              className="rounded-full bg-secondary-container px-8 py-3 active:opacity-90">
              <Text className="font-manrope text-sm font-semibold text-on-secondary-container">
                Explore New Moods
              </Text>
            </Pressable>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between px-6 pb-12">
            {filteredWallpapers.map((wp, index) => renderWallpaperCard(wp, index))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
