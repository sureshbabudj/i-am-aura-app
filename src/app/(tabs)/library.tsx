import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookOpen, Search } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useWallpaperStore } from '@/src/stores/wallpaperStore';
import { MOODS, MoodId } from '@/src/constants/moods';
import { colors } from '@/src/constants/colors';
import { RenderWallpaperCard } from '@/src/components/wallpaper/WallpaperCard';

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

  return (
    <View className="flex-1 bg-surface">
      <StatusBar />

      <View
        style={{ paddingTop: insets.top + 20 }}
        className="flex-row items-end justify-between px-8">
        <View>
          <Text className="font-noto-serif text-3xl text-on-surface">Saved Library</Text>
          <Text className="mt-1 font-manrope text-sm text-on-surface-variant">
            {filteredWallpapers.length} quotes in your sanctuary
          </Text>
        </View>
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
              placeholder="Search..."
              placeholderTextColor={`${colors.outline}99`}
              className="w-full rounded-full bg-surface-container-low py-4 pl-14 pr-6 font-manrope text-on-surface focus:border-2 focus:border-primary/20 focus:bg-surface-container-lowest"
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

        {filteredWallpapers.length === 0 ? (
          <View className="mx-auto max-w-lg items-center space-y-6 px-8 py-16 text-center">
            <BookOpen size={48} color={`${colors.primary}4D`} />
            <Text className="font-noto-serif text-2xl text-on-surface">
              Keep growing your sanctuary
            </Text>
            <Text className="text-center font-manrope text-base leading-relaxed text-on-surface-variant">
              {searchQuery || selectedMoodFilter !== 'all'
                ? 'No quotes match your search filters.'
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
            {filteredWallpapers.map((wp) => (
              <RenderWallpaperCard
                key={wp.id}
                wallpaper={wp}
                toggleFavorite={toggleFavorite}
                deleteWallpaper={deleteWallpaper}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
