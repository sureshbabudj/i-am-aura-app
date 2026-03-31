import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useWallpaperStore } from '@/src/stores/wallpaperStore';

import { MOOD_IMAGES } from '@/src/constants/images';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Palette, Ban, Grid } from 'lucide-react-native';
import { generatePatternSVG, PATTERN_DEFINITIONS } from '@/src/services/wallpaper/patterns';
import { SvgXml } from 'react-native-svg';
import Slider from '@react-native-community/slider';

type Tab = 'color' | 'image' | 'pattern' | 'gradient' | 'text';

interface CustomizerControlsProps {
  onApply?: () => void;
  isApplying?: boolean;
  onSaveToLibrary?: () => void;
}

const PREDEFINED_COLORS = [
  '#fbf9f4',
  '#d5e8d1',
  '#ffdbcf',
  '#874c37',
  '#30312e',
  '#655a4b',
  '#0ea5e9',
  '#ec4899',
  '#eab308',
  '#22c55e',
];
const PREDEFINED_GRADIENTS = [
  ['#FF6B35', '#F7931E'],
  ['#FF3366', '#FF9933'],
  ['#00C9FF', '#92FE9D'],
  ['#ef32d9', '#89fffd'],
  ['#ff758c', '#ff7eb3'],
  ['#20002c', '#cbb4d4'],
  ['#C33764', '#1D2671'],
  ['#34e89e', '#0f3443'],
  ['#e1eec3', '#f05053'],
  ['#000000', '#434343'],
];

export const CustomizerControls: React.FC<CustomizerControlsProps> = ({
  onApply,
  isApplying,
  onSaveToLibrary,
}) => {
  const {
    currentWallpaper,
    updateWallpaper,
    recentColors,
    recentGradients,
    addRecentColor,
    addRecentGradient,
  } = useWallpaperStore();
  const [activeTab, setActiveTab] = useState<Tab>('color');
  const insets = useSafeAreaInsets();

  // Modals state
  const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
  const [isPatternsModalOpen, setIsPatternsModalOpen] = useState(false);

  // Color Picker Modal state
  const [colorPickerTarget, setColorPickerTarget] = useState<
    'bg' | 'text' | 'pattern' | 'gradient0' | 'gradient1' | null
  >(null);
  const [tempHex, setTempHex] = useState('');

  const allImages = MOOD_IMAGES[currentWallpaper.moodId!] || [];

  const handleApplyColor = (hex: string) => {
    if (!hex.startsWith('#') || hex.length < 4) return;
    addRecentColor(hex);
    if (colorPickerTarget === 'bg') {
      updateWallpaper({ backgroundType: 'color', backgroundValue: hex });
    } else if (colorPickerTarget === 'text') {
      updateWallpaper({ textColor: hex });
    } else if (colorPickerTarget === 'pattern') {
      updateWallpaper({ patternConfig: { ...currentWallpaper.patternConfig!, color: hex } });
    } else if (colorPickerTarget === 'gradient0' || colorPickerTarget === 'gradient1') {
      let currentGrad =
        currentWallpaper.backgroundType === 'gradient' &&
        Array.isArray(currentWallpaper.backgroundValue)
          ? currentWallpaper.backgroundValue
          : ['#FF6B35', '#F7931E'];

      const newGrad = [...currentGrad];
      if (colorPickerTarget === 'gradient0') newGrad[0] = hex;
      if (colorPickerTarget === 'gradient1') newGrad[1] = hex;

      updateWallpaper({ backgroundType: 'gradient', backgroundValue: newGrad });
      addRecentGradient(newGrad);
    }
    setColorPickerTarget(null);
  };

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
      className={`h-10 w-10 shrink-0 rounded-full border transition-transform active:scale-90 ${
        isSelected ? 'border-2 border-primary' : 'border-1 border-outline-variant/50'
      }`}
    />
  );

  return (
    <View className="absolute bottom-0 left-0 right-0 z-40 max-h-[50%] flex-col rounded-t-[2.5rem] bg-surface-container-lowest shadow-[0_-20px_50px_rgba(83,67,62,0.15)]">
      {/* Sheet Handle */}
      <View className="w-full flex-row justify-center pb-2 pt-4">
        <View className="h-1.5 w-12 rounded-full bg-outline-variant/30" />
      </View>

      {/* Tabs Navigation */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 24 }}
        className="flex-row py-2">
        {(['color', 'image', 'pattern', 'gradient', 'text'] as Tab[]).map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            className="group flex-col items-center gap-1">
            <Text
              className={`font-manrope text-[11px] font-bold uppercase tracking-widest ${activeTab === tab ? 'text-primary' : 'text-on-surface-variant/40'}`}>
              {tab}
            </Text>
            <View
              className={`h-1 rounded-full transition-all ${activeTab === tab ? 'w-6 bg-primary' : 'w-0'}`}
            />
          </Pressable>
        ))}
      </ScrollView>

      {/* Scrollable Controls Container */}
      <ScrollView className="flex-1 px-6 pb-32 pt-4" showsVerticalScrollIndicator={false}>
        {/* COLOR TAB */}
        {activeTab === 'color' && (
          <View className="space-y-6 pb-32">
            <View>
              <Text className="mb-4 font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                Recently Used
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
                className="flex-row pb-2">
                <Pressable
                  onPress={() => {
                    setTempHex('#');
                    setColorPickerTarget('bg');
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dashed border-outline-variant transition-colors hover:bg-surface-container">
                  <Palette size={18} color="#d8c2bb" />
                </Pressable>
                {recentColors.map((c) => (
                  <ColorCircle
                    key={'recent' + c}
                    color={c}
                    isSelected={
                      currentWallpaper.backgroundType === 'color' &&
                      currentWallpaper.backgroundValue === c
                    }
                    onPress={() => updateWallpaper({ backgroundType: 'color', backgroundValue: c })}
                  />
                ))}
              </ScrollView>
            </View>

            <View>
              <Text className="mb-4 font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                Predefined Colors
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {PREDEFINED_COLORS.map((c) => (
                  <ColorCircle
                    key={'pre' + c}
                    color={c}
                    isSelected={
                      currentWallpaper.backgroundType === 'color' &&
                      currentWallpaper.backgroundValue === c
                    }
                    onPress={() => updateWallpaper({ backgroundType: 'color', backgroundValue: c })}
                  />
                ))}
              </View>
            </View>
          </View>
        )}

        {/* IMAGE TAB */}
        {activeTab === 'image' && (
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
                    updateWallpaper({ backgroundType: 'color', backgroundValue: '#000000' })
                  }
                  className="flex w-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest"
                  style={{ aspectRatio: 4 / 5 }}>
                  <Ban size={24} color="#53433e" />
                  <Text className="mt-2 font-manrope text-[8px] font-bold uppercase tracking-widest text-on-surface-variant">
                    None
                  </Text>
                </Pressable>

                {allImages.slice(0, 7).map((url) => (
                  <ImageThumb
                    key={url}
                    url={url}
                    currentWallpaper={currentWallpaper}
                    updateWallpaper={updateWallpaper}
                  />
                ))}

                <Pressable
                  onPress={() => setIsImagesModalOpen(true)}
                  className="flex w-20 shrink-0 items-center justify-center rounded-xl bg-surface-container transition-colors hover:bg-surface-container-high"
                  style={{ aspectRatio: 4 / 5 }}>
                  <Grid size={24} color="#53433e" />
                  <Text className="mt-2 font-manrope text-[8px] font-bold uppercase tracking-widest text-on-surface-variant">
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
                minimumTrackTintColor="#874c37"
                maximumTrackTintColor="#d8c2bb"
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
                minimumTrackTintColor="#874c37"
                maximumTrackTintColor="#d8c2bb"
              />
            </View>
          </View>
        )}

        {/* PATTERN TAB */}
        {activeTab === 'pattern' && (
          <View className="space-y-6 pb-32">
            <View>
              <Text className="mb-4 font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                Select Pattern
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
                className="flex-row pb-2">
                <Pressable
                  onPress={() =>
                    updateWallpaper({ backgroundType: 'color', backgroundValue: '#fbf9f4' })
                  }
                  className="flex w-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest"
                  style={{ aspectRatio: 4 / 5 }}>
                  <Ban size={24} color="#53433e" />
                  <Text className="mt-2 font-manrope text-[8px] font-bold uppercase tracking-widest text-on-surface-variant">
                    None
                  </Text>
                </Pressable>

                {Object.keys(PATTERN_DEFINITIONS)
                  .slice(0, 5)
                  .map((pattern, index) => (
                    <PatternThumb
                      key={index}
                      pattern={pattern}
                      currentWallpaper={currentWallpaper}
                      updateWallpaper={updateWallpaper}
                    />
                  ))}

                <Pressable
                  onPress={() => setIsPatternsModalOpen(true)}
                  className="flex w-20 shrink-0 items-center justify-center rounded-xl bg-surface-container transition-colors hover:bg-surface-container-high"
                  style={{ aspectRatio: 4 / 5 }}>
                  <Grid size={24} color="#53433e" />
                  <Text className="mt-2 font-manrope text-[8px] font-bold uppercase tracking-widest text-on-surface-variant">
                    More
                  </Text>
                </Pressable>
              </ScrollView>
            </View>

            <View>
              <Text className="mb-4 font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                Pattern Color
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
                className="flex-row pb-2">
                <Pressable
                  onPress={() => {
                    setTempHex('#');
                    setColorPickerTarget('pattern');
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dashed border-outline-variant transition-colors hover:bg-surface-container">
                  <Palette size={18} color="#d8c2bb" />
                </Pressable>
                {PREDEFINED_COLORS.map((c) => (
                  <ColorCircle
                    key={'pcol' + c}
                    color={c}
                    isSelected={currentWallpaper.patternConfig?.color === c}
                    onPress={() =>
                      updateWallpaper({
                        patternConfig: { ...currentWallpaper.patternConfig!, color: c },
                      })
                    }
                  />
                ))}
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
                value={currentWallpaper.patternConfig?.opacity ?? 0.2}
                onValueChange={(val) =>
                  updateWallpaper({
                    patternConfig: { ...currentWallpaper.patternConfig!, opacity: val },
                  })
                }
                minimumTrackTintColor="#874c37"
                maximumTrackTintColor="#d8c2bb"
              />
            </View>
          </View>
        )}

        {/* GRADIENT TAB */}
        {activeTab === 'gradient' && (
          <View className="space-y-6 pb-32">
            <View>
              <Text className="mb-4 font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                Gradient Colors
              </Text>
              <View className="flex-row items-center justify-center gap-6">
                <Pressable
                  onPress={() => {
                    setTempHex('#');
                    setColorPickerTarget('gradient0');
                  }}
                  className="h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-outline-variant bg-surface-container">
                  <View
                    style={{
                      backgroundColor: Array.isArray(currentWallpaper.backgroundValue)
                        ? currentWallpaper.backgroundValue[0]
                        : '#FF6B35',
                    }}
                    className="absolute inset-0"
                  />
                  <Text className="z-10 font-manrope text-[8px] font-bold text-white shadow-sm">
                    Left
                  </Text>
                </Pressable>

                <View className="h-4 w-20 flex-row overflow-hidden rounded-full border border-outline-variant">
                  <View
                    style={{
                      backgroundColor: Array.isArray(currentWallpaper.backgroundValue)
                        ? currentWallpaper.backgroundValue[0]
                        : '#FF6B35',
                      flex: 1,
                    }}
                  />
                  <View
                    style={{
                      backgroundColor: Array.isArray(currentWallpaper.backgroundValue)
                        ? currentWallpaper.backgroundValue[1]
                        : '#F7931E',
                      flex: 1,
                    }}
                  />
                </View>

                <Pressable
                  onPress={() => {
                    setTempHex('#');
                    setColorPickerTarget('gradient1');
                  }}
                  className="h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-outline-variant bg-surface-container">
                  <View
                    style={{
                      backgroundColor: Array.isArray(currentWallpaper.backgroundValue)
                        ? currentWallpaper.backgroundValue[1]
                        : '#F7931E',
                    }}
                    className="absolute inset-0"
                  />
                  <Text className="z-10 font-manrope text-[8px] font-bold text-white shadow-sm">
                    Right
                  </Text>
                </Pressable>
              </View>
            </View>

            <View>
              <Text className="mb-4 font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                Predefined Gradients
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
                className="flex-row pb-2">
                <Pressable
                  onPress={() =>
                    updateWallpaper({ backgroundType: 'color', backgroundValue: '#000000' })
                  }
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-dashed border-outline-variant bg-surface-container-lowest">
                  <Ban size={20} color="#53433e" />
                </Pressable>

                {[...recentGradients, ...PREDEFINED_GRADIENTS].slice(0, 15).map((g, i) => (
                  <Pressable
                    key={'grad' + i}
                    onPress={() => {
                      updateWallpaper({ backgroundType: 'gradient', backgroundValue: g });
                      addRecentGradient(g);
                    }}
                    className={`h-12 w-12 shrink-0 flex-row overflow-hidden rounded-full border transition-transform active:scale-90 ${
                      currentWallpaper.backgroundType === 'gradient' &&
                      Array.isArray(currentWallpaper.backgroundValue) &&
                      currentWallpaper.backgroundValue[0] === g[0] &&
                      currentWallpaper.backgroundValue[1] === g[1]
                        ? 'border-2 border-primary'
                        : 'border-1 border-outline-variant/50'
                    }`}>
                    <View style={{ backgroundColor: g[0], flex: 1 }} />
                    <View style={{ backgroundColor: g[1], flex: 1 }} />
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {/* TEXT TAB */}
        {activeTab === 'text' && (
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
                  onPress={() => {
                    setTempHex('#');
                    setColorPickerTarget('text');
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dashed border-outline-variant transition-colors hover:bg-surface-container">
                  <Palette size={18} color="#d8c2bb" />
                </Pressable>
                {['#ffffff', '#000000', ...PREDEFINED_COLORS].map((c) => (
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

            <View>
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
              <View className="mt-2 flex-row rounded-xl bg-surface-container-low p-1">
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
          </View>
        )}
      </ScrollView>

      {/* Sticky Primary Actions */}
      <View
        className="absolute bottom-0 left-0 right-0 flex-col gap-3 px-6 pb-8 pt-8"
        style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onApply?.();
          }}
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
            onPress={(e) => {
              e.stopPropagation();
              onSaveToLibrary?.();
            }}
            className="flex-1 rounded-xl bg-surface-container-low py-3 transition-colors hover:bg-surface-container">
            <Text className="text-center font-manrope text-xs font-bold text-on-surface-variant">
              Save to Library
            </Text>
          </Pressable>
        </View>
      </View>

      {/* MODALS */}
      {/* Color Picker Modal */}
      <Modal visible={!!colorPickerTarget} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 items-center justify-center bg-black/50 p-6">
          <View className="w-full max-w-sm rounded-3xl bg-surface-container-lowest p-6 shadow-2xl">
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="font-manrope text-lg font-bold text-on-surface">
                Enter Hex Color
              </Text>
              <Pressable
                onPress={() => setColorPickerTarget(null)}
                className="rounded-full bg-surface-container p-2">
                <X size={20} color="#53433e" />
              </Pressable>
            </View>
            <View className="mb-6 flex-row items-center gap-4">
              <View
                className="h-12 w-12 rounded-full border border-outline-variant"
                style={{
                  backgroundColor:
                    tempHex.length === 4 || tempHex.length === 7 ? tempHex : 'transparent',
                }}
              />
              <TextInput
                value={tempHex}
                onChangeText={setTempHex}
                placeholder="#000000"
                className="flex-1 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 font-manrope text-base text-on-surface"
                autoCapitalize="none"
              />
            </View>
            <Pressable
              onPress={() => handleApplyColor(tempHex)}
              className="w-full rounded-xl bg-primary py-4">
              <Text className="text-center font-manrope font-bold text-white">Apply Color</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* All Images Modal */}
      <Modal visible={isImagesModalOpen} transparent animationType="slide">
        <View className="flex-1 bg-surface-container-lowest pt-14">
          <View className="flex-row items-center justify-between px-6 pb-4">
            <Text className="font-manrope text-xl font-bold text-on-surface">All Images</Text>
            <Pressable onPress={() => setIsImagesModalOpen(false)} className="p-2">
              <X size={24} color="#53433e" />
            </Pressable>
          </View>
          <ScrollView
            contentContainerStyle={{
              padding: 24,
              gap: 16,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {allImages.map((url, i) => (
              <Pressable
                key={'allimg' + i}
                onPress={() => {
                  updateWallpaper({ backgroundType: 'image', backgroundValue: url });
                  setIsImagesModalOpen(false);
                }}
                className="w-[47%] overflow-hidden rounded-xl"
                style={{ aspectRatio: 4 / 5 }}>
                <Image
                  source={{ uri: url }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* All Patterns Modal */}
      <Modal visible={isPatternsModalOpen} transparent animationType="slide">
        <View className="flex-1 bg-surface-container-lowest pt-14">
          <View className="flex-row items-center justify-between px-6 pb-4">
            <Text className="font-manrope text-xl font-bold text-on-surface">All Patterns</Text>
            <Pressable onPress={() => setIsPatternsModalOpen(false)} className="p-2">
              <X size={24} color="#53433e" />
            </Pressable>
          </View>
          <ScrollView
            contentContainerStyle={{
              padding: 24,
              gap: 16,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {Object.keys(PATTERN_DEFINITIONS).map((key) => (
              <Pressable
                key={'allpat' + key}
                onPress={() => {
                  updateWallpaper({
                    backgroundType: 'pattern',
                    backgroundValue: ['pattern', 'color'].includes(currentWallpaper.backgroundType!)
                      ? currentWallpaper.backgroundValue
                      : '#fbf9f4',
                    patternConfig: {
                      ...currentWallpaper.patternConfig,
                      type: key,
                      opacity: currentWallpaper.patternConfig?.opacity || 0.2,
                      scale: 1,
                      color: currentWallpaper.patternConfig?.color || '#000000',
                    } as any,
                  });
                  setIsPatternsModalOpen(false);
                }}
                className="w-[47%] overflow-hidden rounded-xl bg-surface-container-low"
                style={{ aspectRatio: 4 / 5 }}>
                <SvgXml
                  xml={generatePatternSVG({
                    type: key as any,
                    opacity: 0.5,
                    scale: 1,
                    color: currentWallpaper.patternConfig?.color || '#30312e',
                  })}
                  width="100%"
                  height="100%"
                />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

function ImageThumb({ url, currentWallpaper, updateWallpaper }: any) {
  return (
    <Pressable
      key={url}
      onPress={() => {
        updateWallpaper({ backgroundType: 'image', backgroundValue: url });
      }}
      className={`relative w-20 shrink-0 overflow-hidden rounded-xl ${
        currentWallpaper.backgroundValue === url ? 'border-2 border-primary' : ''
      }`}
      style={{ aspectRatio: 4 / 5 }}>
      <Image source={{ uri: url }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
    </Pressable>
  );
}

function PatternThumb({ pattern, currentWallpaper, updateWallpaper, index }: any) {
  return (
    <Pressable
      onPress={() =>
        updateWallpaper({
          backgroundType: 'pattern',
          backgroundValue: ['pattern', 'color'].includes(currentWallpaper.backgroundType!)
            ? currentWallpaper.backgroundValue
            : '#fbf9f4',
          patternConfig: {
            ...currentWallpaper.patternConfig,
            type: pattern,
            opacity: currentWallpaper.patternConfig?.opacity || 0.2,
            scale: 1,
            color: currentWallpaper.patternConfig?.color || '#000000',
          } as any,
        })
      }
      className={`relative w-20 shrink-0 overflow-hidden rounded-xl bg-surface-container-low ${
        currentWallpaper.backgroundType === 'pattern' &&
        currentWallpaper.patternConfig?.type === pattern
          ? 'border-2 border-primary'
          : ''
      }`}
      style={{ aspectRatio: 4 / 5 }}>
      <SvgXml
        xml={generatePatternSVG({
          type: pattern as any,
          opacity: 0.5,
          scale: 1,
          color: currentWallpaper.patternConfig?.color || '#30312e',
        })}
        width="100%"
        height="100%"
      />
    </Pressable>
  );
}
