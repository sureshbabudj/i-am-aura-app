import React from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { X } from 'lucide-react-native';
import { Image } from 'expo-image';
import { colors } from '@/src/constants/colors';
import { useWallpaperStore } from '@/src/stores/wallpaperStore';
import {
  THUMB_IMG_WIDTH,
  THUMB_IMG_HEIGHT,
  SMALL_THUMB_IMG_WIDTH,
  SMALL_THUMB_IMG_HEIGHT,
} from '@/src/constants/images';

interface ImageSelectionModalProps {
  visible: boolean;
  images: any[];
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onSelect: (img: any) => void;
  onClose: () => void;
}

export const ImageSelectionModal: React.FC<ImageSelectionModalProps> = ({
  visible,
  images,
  isLoadingMore,
  hasMore,
  onLoadMore,
  onSelect,
  onClose,
}) => {
  const { currentWallpaper } = useWallpaperStore();

  const renderItem = ({ item: imgInfo, index: i }: { item: any; index: number }) => {
    const url = imgInfo.url;
    const modalUrl =
      imgInfo.medium ||
      (url &&
        url
          .replace(`w_${SMALL_THUMB_IMG_WIDTH}`, `w_${THUMB_IMG_WIDTH}`)
          .replace(`h_${SMALL_THUMB_IMG_HEIGHT}`, `h_${THUMB_IMG_HEIGHT}`));

    const imgStr = JSON.stringify(imgInfo);
    const isSelected =
      currentWallpaper.backgroundValue === imgStr || currentWallpaper.backgroundValue === url;

    return (
      <Pressable
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
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: colors['surface-container-low'],
          }}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={200}
        />
      </Pressable>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-surface-container-lowest pt-14">
        <View className="flex-row items-center justify-between px-6 pb-4">
          <Text className="font-manrope text-xl font-bold text-on-surface">All Images</Text>
          <Pressable onPress={onClose} className="p-2">
            <X size={24} color={colors['on-surface-variant']} />
          </Pressable>
        </View>
        <FlatList
          data={images}
          numColumns={2}
          keyExtractor={(item, index) => item.id || item.url || index.toString()}
          contentContainerStyle={{ padding: 24 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          onEndReached={() => {
            if (hasMore && !isLoadingMore && onLoadMore) {
              onLoadMore();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            isLoadingMore ? (
              <View className="items-center justify-center py-4">
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : null
          }
          renderItem={renderItem}
        />
      </View>
    </Modal>
  );
};
