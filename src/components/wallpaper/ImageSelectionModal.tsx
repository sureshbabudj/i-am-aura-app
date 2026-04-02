import React from 'react';
import { View, Text, ScrollView, Pressable, Modal } from 'react-native';
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
          contentContainerStyle={{
            padding: 24,
            gap: 16,
            flexDirection: 'row',
            flexWrap: 'wrap',
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
                className={`w-[47%] overflow-hidden rounded-xl bg-surface-container-low ${
                  isSelected ? 'border-2 border-primary' : ''
                }`}
                style={{ aspectRatio: 4 / 5 }}>
                <Image
                  source={{ uri: modalUrl }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                  transition={200}
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
