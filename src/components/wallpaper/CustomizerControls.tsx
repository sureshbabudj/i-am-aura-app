import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useWallpaperStore } from '@/src/stores/wallpaperStore';
import { MOODS, MoodId } from '@/src/constants/moods';
import { MOOD_IMAGES } from '@/src/constants/images';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Image as ImageIcon } from 'lucide-react-native';

interface CustomizerControlsProps {
  onApply?: () => void;
  isApplying?: boolean;
  onSaveToLibrary?: () => void;
}

export const CustomizerControls: React.FC<CustomizerControlsProps> = ({
  onApply,
  isApplying,
  onSaveToLibrary,
}) => {
  const { currentWallpaper, updateWallpaper } = useWallpaperStore();
  const [activeTab, setActiveTab] = useState<'background' | 'text'>('background');
  const insets = useSafeAreaInsets();

  const moodConfig = MOODS[currentWallpaper.moodId as MoodId];

  // Default palette combining UI requested colors + mood colors
  const colors = ['#fbf9f4', '#d5e8d1', '#ffdbcf', '#874c37', '#30312e', '#655a4b'];

  return (
    <View className="absolute bottom-0 left-0 right-0 z-40 max-h-[75%] flex-col rounded-t-[2.5rem] bg-surface-container-lowest shadow-[0_-20px_50px_rgba(83,67,62,0.15)]">
      {/* Sheet Handle */}
      <View className="w-full flex-row justify-center pb-2 pt-4">
        <View className="h-1.5 w-12 rounded-full bg-outline-variant/30" />
      </View>

      {/* Tabs Navigation */}
      <View className="flex-row justify-center gap-12 px-8 py-2">
        <Pressable
          onPress={() => setActiveTab('background')}
          className="group flex-col items-center gap-1">
          <Text
            className={`font-manrope text-[10px] font-bold uppercase tracking-widest ${activeTab === 'background' ? 'text-primary' : 'text-on-surface-variant/40'}`}>
            Background
          </Text>
          <View
            className={`h-1 rounded-full transition-all ${activeTab === 'background' ? 'w-6 bg-primary' : 'w-0'}`}
          />
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('text')}
          className="group flex-col items-center gap-1">
          <Text
            className={`font-manrope text-[10px] font-bold uppercase tracking-widest ${activeTab === 'text' ? 'text-primary' : 'text-on-surface-variant/40'}`}>
            Text Style
          </Text>
          <View
            className={`h-1 rounded-full transition-all ${activeTab === 'text' ? 'w-6 bg-primary' : 'w-0'}`}
          />
        </Pressable>
      </View>

      {/* Scrollable Controls Container */}
      <ScrollView className="flex-1 px-6 pb-32 pt-4" showsVerticalScrollIndicator={false}>
        {activeTab === 'background' ? (
          <View className="space-y-8 pb-32">
            {/* Color Palette */}
            <View>
              <Text className="mb-4 px-2 font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                Color Palette
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row gap-4 px-2 pb-2">
                {colors.map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => updateWallpaper({ backgroundType: 'color', backgroundValue: c })}
                    style={{ backgroundColor: c }}
                    className={`h-12 w-12 shrink-0 rounded-full transition-transform active:scale-90 ${
                      currentWallpaper.backgroundValue === c
                        ? 'ring-2 ring-primary ring-offset-2'
                        : 'ring-1 ring-outline-variant'
                    }`}
                  />
                ))}
                <Pressable
                  onPress={() => {
                    if (moodConfig?.gradient) {
                      updateWallpaper({
                        backgroundType: 'gradient',
                        backgroundValue: moodConfig.gradient as any,
                      });
                    }
                  }}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-dashed border-outline-variant transition-colors hover:bg-surface-container">
                  <Plus size={20} color="#d8c2bb" />
                </Pressable>
              </ScrollView>
            </View>

            {/* Pattern & Imagery */}
            <View>
              <View className="mb-4 flex-row items-center justify-between px-2">
                <Text className="font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                  Mood-Matched Library
                </Text>
                <Pressable>
                  <Text className="text-xs font-bold text-primary">View All</Text>
                </Pressable>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row gap-3 px-2 pb-2">
                {(MOOD_IMAGES[currentWallpaper.moodId!] || []).slice(0, 5).map((url, index) => (
                  <Pressable
                    key={index}
                    onPress={() =>
                      updateWallpaper({ backgroundType: 'image', backgroundValue: url })
                    }
                    className={`group relative w-24 shrink-0 overflow-hidden rounded-xl transition-all ${
                      currentWallpaper.backgroundValue === url
                        ? 'ring-2 ring-primary'
                        : 'hover:scale-105'
                    }`}
                    style={{ aspectRatio: 4 / 5 }}>
                    <Image
                      source={{ uri: url }}
                      style={{ width: '100%', height: '100%' }}
                      contentFit="cover"
                    />
                    <View className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
                  </Pressable>
                ))}
                <Pressable
                  className="flex w-24 shrink-0 items-center justify-center rounded-xl bg-surface-container transition-colors hover:bg-surface-container-high"
                  style={{ aspectRatio: 4 / 5 }}>
                  <View className="flex-col items-center gap-1 opacity-60">
                    <ImageIcon size={24} color="#53433e" />
                    <Text className="font-manrope text-[8px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Library
                    </Text>
                  </View>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        ) : (
          <View className="space-y-8 pb-32">
            {/* Text Size */}
            <View className="px-2">
              <Text className="mb-4 font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                Text Size
              </Text>
              <View className="flex-row items-center gap-4 rounded-xl bg-surface-container-low p-2">
                {[24, 32, 48, 60].map((sz) => (
                  <Pressable
                    key={sz}
                    onPress={() => updateWallpaper({ textSize: sz })}
                    className={`flex-1 items-center rounded-lg py-2 ${currentWallpaper.textSize === sz ? 'bg-white shadow-sm' : ''}`}>
                    <Text
                      className={`font-manrope font-bold ${currentWallpaper.textSize === sz ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {sz}px
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Horizontal Alignment */}
            <View className="px-2">
              <Text className="mb-4 font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                Horizontal Alignment
              </Text>
              <View className="flex-row rounded-xl bg-surface-container-low p-1">
                {(['left', 'center', 'right'] as const).map((align) => {
                  const isActive = currentWallpaper.textAlignment?.horizontal === align;
                  return (
                    <Pressable
                      key={align}
                      onPress={() =>
                        updateWallpaper({
                          textAlignment: { ...currentWallpaper.textAlignment!, horizontal: align },
                        })
                      }
                      className={`flex-1 items-center justify-center rounded-lg py-2.5 transition-colors ${isActive ? 'bg-white shadow-sm' : 'hover:bg-surface-container-high'}`}>
                      <Text className={`font-manrope text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>{align}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Vertical Alignment */}
            <View className="px-2">
              <Text className="mb-4 font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                Vertical Position
              </Text>
              <View className="flex-row rounded-xl bg-surface-container-low p-1">
                {(['top', 'center', 'bottom'] as const).map((align) => {
                  const isActive = currentWallpaper.textAlignment?.vertical === align;
                  return (
                    <Pressable
                      key={align}
                      onPress={() =>
                        updateWallpaper({
                          textAlignment: { ...currentWallpaper.textAlignment!, vertical: align },
                        })
                      }
                      className={`flex-1 items-center justify-center rounded-lg py-3 transition-colors ${isActive ? 'bg-white shadow-sm' : 'hover:bg-surface-container-high'}`}>
                      <Text
                        className={`font-manrope text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                        {align}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Text Color */}
            <View className="px-2 pb-4">
              <Text className="mb-4 font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                Text Color
              </Text>
              <View className="flex-row gap-4">
                {['#ffffff', '#000000', '#ffdbcf', '#30312e'].map((tc) => (
                  <Pressable
                    key={tc}
                    onPress={() => updateWallpaper({ textColor: tc })}
                    style={{ backgroundColor: tc }}
                    className={`h-10 w-10 rounded-full transition-transform active:scale-95 ${
                      currentWallpaper.textColor === tc
                        ? 'ring-2 ring-primary ring-offset-2'
                        : 'ring-1 ring-outline-variant'
                    }`}
                  />
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Primary Actions */}
      <View
        className="absolute bottom-0 left-0 right-0 flex-col gap-3 px-6 pb-8 pt-8"
        style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
        {/* Gradient fade overlay hack using normal view to ensure buttons are clickable */}
        <Pressable
          onPress={onApply}
          disabled={isApplying}
          className="w-full rounded-2xl bg-primary py-4 shadow-xl transition-all active:scale-[0.98]"
          style={{
            shadowColor: '#874c37',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
          }}>
          {isApplying ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-center font-manrope text-sm font-bold text-white">
              Apply as Wallpaper
            </Text>
          )}
        </Pressable>

        <View className="flex-row gap-3">
          <Pressable className="flex-1 rounded-xl bg-secondary-container py-3 transition-colors hover:bg-secondary-container/80">
            <Text className="text-center font-manrope text-xs font-bold text-secondary">
              Set Daily Affirmation
            </Text>
          </Pressable>
          <Pressable
            onPress={onSaveToLibrary}
            className="flex-1 rounded-xl bg-surface-container-low py-3 transition-colors hover:bg-surface-container">
            <Text className="text-center font-manrope text-xs font-bold text-on-surface-variant">
              Save to Library
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
