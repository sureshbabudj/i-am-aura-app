import React from 'react';
import { View, Text, ScrollView, Pressable, Modal, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { Image } from 'expo-image';
import { colors } from '@/src/constants/colors';
import { useWallpaperStore } from '@/src/stores/wallpaperStore';
import {
  THUMB_IMG_WIDTH,
  THUMB_IMG_HEIGHT,
  SMALL_THUMB_IMG_WIDTH,
  SMALL_THUMB_IMG_HEIGHT,
} from '@/src/constants/data';

interface ImageSelectionModalProps {
  visible: boolean;
  images: string[];
  onSelect: (url: string) => void;
  onClose: () => void;
}

export const ImageSelectionModal: React.FC<ImageSelectionModalProps> = ({
  visible,
  images,
  onSelect,
  onClose,
}) => {
  const { currentWallpaper } = useWallpaperStore();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-surface-container-lowest pt-14">
        <View className="flex-row items-center justify-between px-6 pb-4">
          <Text className="font-manrope text-xl font-bold text-on-surface">All Images</Text>
          <Pressable onPress={onClose} className="p-2">
            <X size={24} color={colors['on-surface-variant']} />
          </Pressable>
        </View>
        <ScrollView
          className="h-full w-full"
          contentContainerStyle={{
            padding: 24,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
          {images.map((url, i) => {
            // Swap small thumbs for regular thumbs in modal
            const modalUrl = url
              .replace(`w_${SMALL_THUMB_IMG_WIDTH}`, `w_${THUMB_IMG_WIDTH}`)
              .replace(`h_${SMALL_THUMB_IMG_HEIGHT}`, `h_${THUMB_IMG_HEIGHT}`);

            const isSelected = currentWallpaper.backgroundValue === url;

            return (
              <Pressable
                key={'allimg' + i}
                onPress={() => onSelect(url)}
                style={{
                  width: '48%',
                  height: 200,
                  aspectRatio: 0.8,
                  borderRadius: 12,
                  overflow: 'hidden',
                  backgroundColor: colors['surface-container-low'],
                  position: 'relative',
                  borderWidth: isSelected ? 2 : 0,
                  borderColor: isSelected ? colors.primary : 'transparent',
                  marginBottom: 16,
                }}>
                <Image
                  source={{ uri: modalUrl }}
                  style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                />
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
};
