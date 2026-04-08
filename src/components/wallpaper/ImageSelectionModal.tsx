import React from 'react';
import { View, Text, ScrollView, Pressable, Modal, Dimensions } from 'react-native';
import { X } from 'lucide-react-native';
import { Image } from 'expo-image';
import { colors } from '@/src/constants/colors';
import { useWallpaperStore } from '@/src/stores/wallpaperStore';
import { MoodImageInfo } from '@/src/constants/images';
import {
  THUMB_IMG_WIDTH,
  THUMB_IMG_HEIGHT,
  SMALL_THUMB_IMG_WIDTH,
  SMALL_THUMB_IMG_HEIGHT,
} from '@/src/constants/data';

interface ImageSelectionModalProps {
  visible: boolean;
  images: MoodImageInfo[];
  onSelect: (img: MoodImageInfo) => void;
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
          className="flex-1"
          contentContainerStyle={{
            padding: 24,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
          {images.map((imgInfo, i) => {
            const url = imgInfo.url;
            // Swap small thumbs for regular thumbs in modal
            const modalUrl = url
              .replace(`w_${SMALL_THUMB_IMG_WIDTH}`, `w_${THUMB_IMG_WIDTH}`)
              .replace(`h_${SMALL_THUMB_IMG_HEIGHT}`, `h_${THUMB_IMG_HEIGHT}`);

            const isSelected = currentWallpaper.backgroundValue === url;

            return (
              <Pressable
                key={'allimg' + i}
                onPress={() => onSelect(imgInfo)}
                style={{
                  width: (Dimensions.get('window').width - 64) / 2, // 2 columns with padding
                  aspectRatio: 0.75,
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
                  style={{ width: '100%', height: '100%', backgroundColor: colors['surface-container-low'] }}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  transition={200}
                />
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
};
