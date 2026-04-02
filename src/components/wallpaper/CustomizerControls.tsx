import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useWallpaperStore, DEFAULT_WALLPAPER } from '@/src/stores/wallpaperStore';

import { MOOD_IMAGES } from '@/src/constants/images';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { colors } from '@/src/constants/colors';

import { ColorTab } from './ColorTab';
import { ImageTab } from './ImageTab';
import { PatternTab } from './PatternTab';
import { GradientTab } from './GradientTab';
import { TextTab } from './TextTab';
import { StyleTab } from './StyleTab';

import { ColorPickerModal } from './ColorPickerModal';
import { ImageSelectionModal } from './ImageSelectionModal';
import { PatternSelectionModal } from './PatternSelectionModal';
import { StyleSelectionModal } from './StyleSelectionModal';
import { Tab } from '@/src/types';

interface CustomizerControlsProps {
  onApply?: () => void;
  isApplying?: boolean;
  onSaveToLibrary?: () => void;
  onClose: () => void;
}

const DEFAULT_GRADIENT = [colors['mood-energetic-primary'], colors['mood-energetic-secondary']];

export const CustomizerControls: React.FC<CustomizerControlsProps> = ({
  onApply,
  isApplying,
  onSaveToLibrary,
  onClose,
}) => {
  const { currentWallpaper, updateWallpaper, addRecentColor, addRecentGradient } =
    useWallpaperStore();
  const [activeTab, setActiveTab] = useState<Tab>('color');
  const insets = useSafeAreaInsets();

  // Modals state
  const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
  const [isPatternsModalOpen, setIsPatternsModalOpen] = useState(false);
  const [isStylesModalOpen, setIsStylesModalOpen] = useState(false);

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
      const currentPattern = currentWallpaper.patternConfig || DEFAULT_WALLPAPER.patternConfig!;
      updateWallpaper({ patternConfig: { ...currentPattern, color: hex } });
    } else if (colorPickerTarget === 'gradient0' || colorPickerTarget === 'gradient1') {
      let currentGrad =
        currentWallpaper.backgroundType === 'gradient' &&
        Array.isArray(currentWallpaper.backgroundValue)
          ? currentWallpaper.backgroundValue
          : DEFAULT_GRADIENT;

      const newGrad = [...currentGrad];
      if (colorPickerTarget === 'gradient0') newGrad[0] = hex;
      if (colorPickerTarget === 'gradient1') newGrad[1] = hex;

      updateWallpaper({ backgroundType: 'gradient', backgroundValue: newGrad });
      addRecentGradient(newGrad);
    }
    setColorPickerTarget(null);
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 z-40 max-h-[40%] flex-col rounded-t-[2.5rem] bg-surface-container-lowest shadow-[0_-20px_50px_rgba(83,67,62,0.15)]">
      {/* Sheet Handle & Close */}
      <View
        className="w-full flex-row items-center justify-between pb-2 pl-8 pr-6 pt-4"
        style={{ paddingBottom: 10 }}>
        <Text className="font-manrope text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">
          Personalize Design
        </Text>
        <Pressable
          onPress={onClose}
          className="h-8 w-8 items-center justify-center rounded-full bg-surface-container-high active:scale-90">
          <X size={16} color={colors['on-surface-variant']} strokeWidth={3} />
        </Pressable>
      </View>

      {/* Tabs Navigation */}
      <View className="border-b border-outline-variant/10">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingVertical: 12 }}
          className="flex-row">
          {(['color', 'image', 'pattern', 'gradient', 'text', 'style'] as Tab[]).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`rounded-xl px-5 py-2.5 ${
                activeTab === tab ? 'bg-primary' : 'bg-surface-container-low'
              }`}
              style={
                activeTab === tab
                  ? {
                      shadowColor: colors.primary,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }
                  : {}
              }>
              <Text
                className={`font-manrope text-[12px] font-bold uppercase tracking-wider ${
                  activeTab === tab ? 'text-white' : 'text-on-surface-variant'
                }`}>
                {tab}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Scrollable Controls Container */}
      <ScrollView className="flex-1 px-6 pb-32 pt-4" showsVerticalScrollIndicator={false}>
        {activeTab === 'color' && <ColorTab onPickColor={setColorPickerTarget} />}
        {activeTab === 'image' && <ImageTab onShowMore={() => setIsImagesModalOpen(true)} />}
        {activeTab === 'pattern' && (
          <PatternTab
            onPickColor={setColorPickerTarget}
            onShowMore={() => setIsPatternsModalOpen(true)}
          />
        )}
        {activeTab === 'gradient' && <GradientTab onPickColor={setColorPickerTarget} />}
        {activeTab === 'text' && <TextTab onPickColor={setColorPickerTarget} />}
        {activeTab === 'style' && <StyleTab onShowMore={() => setIsStylesModalOpen(true)} />}
      </ScrollView>

      {/* Sticky Primary Actions */}
      <View
        className="absolute bottom-0 left-0 right-0 flex-row gap-3 border-t border-outline-variant/70 bg-surface px-6 pb-8 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
        <Pressable className="flex-1 rounded-xl bg-secondary-container py-3 transition-colors hover:bg-secondary-container/80">
          <Text className="text-center font-manrope text-xs font-bold text-secondary">
            Set Daily Quote
          </Text>
        </Pressable>
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onApply?.();
          }}
          disabled={isApplying}
          className="flex-1 rounded-xl bg-primary py-3 shadow-xl transition-all active:scale-[0.98]"
          style={{
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
          }}>
          {isApplying ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text className="text-center font-manrope text-sm font-bold text-white">
              Apply as Wallpaper
            </Text>
          )}
        </Pressable>
      </View>

      {/* MODALS */}
      <ColorPickerModal
        visible={!!colorPickerTarget}
        tempHex={tempHex}
        setTempHex={setTempHex}
        onCancel={() => setColorPickerTarget(null)}
        onConfirm={handleApplyColor}
      />

      <ImageSelectionModal
        visible={isImagesModalOpen}
        images={allImages}
        onSelect={(url) => {
          updateWallpaper({ backgroundType: 'image', backgroundValue: url });
          setIsImagesModalOpen(false);
        }}
        onClose={() => setIsImagesModalOpen(false)}
      />

      <PatternSelectionModal
        visible={isPatternsModalOpen}
        currentColor={currentWallpaper.patternConfig?.color || colors['inverse-surface']}
        onSelect={(type) => {
          updateWallpaper({
            patternConfig: {
              ...(currentWallpaper.patternConfig || DEFAULT_WALLPAPER.patternConfig!),
              type,
            },
          });
          setIsPatternsModalOpen(false);
        }}
        onClose={() => setIsPatternsModalOpen(false)}
      />

      <StyleSelectionModal
        visible={isStylesModalOpen}
        currentStyle={currentWallpaper.textStyle}
        onSelect={(styleKey) => {
          updateWallpaper({ textStyle: styleKey });
          setIsStylesModalOpen(false);
        }}
        onClose={() => setIsStylesModalOpen(false)}
      />
    </View>
  );
};
