import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Grid } from 'lucide-react-native';
import { useWallpaperStore } from '@/src/stores/wallpaperStore';
import { transformText, maps } from '@/src/services/text/unicode-map';
import { colors } from '@/src/constants/colors';

interface StyleTabProps {
  onShowMore: () => void;
}

export const StyleThumb = ({
  styleKey,
  label,
  isSelected,
  onPress,
  isFullWidth,
}: {
  styleKey?: string;
  label: string;
  isSelected: boolean;
  onPress: () => void;
  isFullWidth?: boolean;
}) => {
  const displayLabel = label
    .split(/(?=[A-Z])/)
    .join(' ')
    .replace(/^\w/, (c) => c.toUpperCase());

  return (
    <View
      pointerEvents="none"
      className={`flex flex-col items-center justify-center rounded-xl border p-4 ${
        isFullWidth ? 'mb-3 w-full' : 'w-28'
      } ${isSelected ? 'border-2 border-primary' : 'border border-outline-variant'}`}
      style={[
        !isFullWidth ? { aspectRatio: 1 } : {},
        isSelected ? { backgroundColor: `${colors.primary}0D` } : { backgroundColor: colors.white },
      ]}>
      <Text
        numberOfLines={2}
        className={`text-center font-manrope font-bold ${isFullWidth ? 'text-lg' : 'text-[14px]'} ${
          isSelected ? 'text-primary' : 'text-on-surface'
        }`}>
        {styleKey ? transformText('Quote', styleKey as any) : 'Quote'}
      </Text>
      <Text
        numberOfLines={1}
        className={`mt-1 text-center font-manrope text-[10px] uppercase tracking-widest ${
          isSelected ? 'text-primary/70' : 'text-on-surface-variant/50'
        }`}>
        {displayLabel}
      </Text>
    </View>
  );
};

export const StyleTab: React.FC<StyleTabProps> = ({ onShowMore }) => {
  const { currentWallpaper, updateWallpaper } = useWallpaperStore();

  return (
    <View className="space-y-6 pb-32">
      <View>
        <Text className="mb-4 font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant/60">
          Text Styles
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
          className="flex-row pb-2">
          <Pressable onPress={() => updateWallpaper({ textStyle: undefined })} className="w-28">
            <StyleThumb label="None" isSelected={!currentWallpaper.textStyle} onPress={() => {}} />
          </Pressable>

          {Object.keys(maps)
            .slice(0, 3)
            .map((styleKey) => (
              <Pressable
                key={styleKey}
                onPress={() => updateWallpaper({ textStyle: styleKey })}
                className="w-28">
                <StyleThumb
                  styleKey={styleKey}
                  label={styleKey}
                  isSelected={currentWallpaper.textStyle === styleKey}
                  onPress={() => {}}
                />
              </Pressable>
            ))}

          <Pressable
            onPress={onShowMore}
            className="flex w-28 shrink-0 flex-col items-center justify-center rounded-xl bg-surface-container transition-colors hover:bg-surface-container-high"
            style={{ aspectRatio: 1 }}>
            <Grid size={24} color={colors['on-surface-variant']} />
            <Text className="mt-2 font-manrope text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">
              More
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
};
