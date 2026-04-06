import { View, Text, Pressable, Dimensions, FlatList, ListRenderItemInfo, ViewToken } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Sparkles, ChevronDown } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useEffect, useCallback, useRef } from 'react';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

import { MOODS, MoodId } from '@/src/constants/moods';
import { useWallpaperStore } from '@/src/stores/wallpaperStore';
import { useSubscriptionStore } from '@/src/stores/subscriptionStore';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { groupedQuotes } from '@/src/constants/groupedQuotes';
import { QuoteItem } from '@/src/types/quote';
import { colors } from '@/src/constants/colors';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function QuoteSelectionScreen() {
  const { mood } = useLocalSearchParams<{ mood: MoodId }>();
  const router = useRouter();
  const { createWallpaper } = useWallpaperStore();
  const { incrementQuoteCount, checkTrialStatus } = useSubscriptionStore();
  const insets = useSafeAreaInsets();
  
  // Track viewed indices to avoid double counting
  const viewedIndices = useRef(new Set<number>());

  const moodConfig = MOODS[mood as MoodId];
  const bounceValue = useSharedValue(0);

  const handleSelectQuote = (text: string) => {
    // Block if trial expired
    if (checkTrialStatus()) return;
    
    createWallpaper(mood, text);
    router.push('/create/new');
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const topItem = viewableItems[0];
      if (topItem.index !== null && !viewedIndices.current.has(topItem.index)) {
        viewedIndices.current.add(topItem.index);
        // Only increment if it's not the first quote
        if (topItem.index > 0) {
          incrementQuoteCount();
        }
      }
    }
  }, [incrementQuoteCount]);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  useEffect(() => {
    bounceValue.value = withRepeat(
      withSequence(withTiming(-10, { duration: 600 }), withTiming(0, { duration: 600 })),
      -1,
      true
    );
  }, [bounceValue]);

  const animatedArrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceValue.value }],
  }));

  const randomizedQuotes = useMemo(() => {
    if (!moodConfig) return [];

    const categoryQuotes = (mood ? groupedQuotes[mood] : []) || [];
    const baseQuotes = moodConfig.quotes.map((text) => ({ quote: text }));

    // Combine and shuffle
    const combined = [...baseQuotes, ...categoryQuotes];
    return combined.sort(() => Math.random() - 0.5);
  }, [mood, moodConfig]);

  if (!moodConfig) {
    return (
      <View className="flex-1 items-center justify-center bg-surface p-6">
        <Text className="font-noto-serif text-xl text-on-surface">Mood not found</Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 rounded-full bg-surface-container px-6 py-2">
          <Text className="font-manrope text-on-surface">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const renderItem = ({ item, index }: ListRenderItemInfo<QuoteItem>) => (
    <View
      style={{ height: SCREEN_HEIGHT, width: SCREEN_WIDTH }}
      className="items-center justify-center px-10">
      <View className="w-full">
        <Text
          style={{ color: moodConfig.color }}
          className="mb-[-20px] font-noto-serif text-7xl leading-none opacity-20">
          &quot;
        </Text>
        <Text
          className="text-center font-noto-serif text-3xl leading-snug text-on-surface"
          numberOfLines={6}
          adjustsFontSizeToFit>
          {item.quote}
        </Text>
        {item.author && (
          <Text className="mt-6 text-center font-manrope text-sm uppercase tracking-widest text-on-surface-variant opacity-60">
            — {item.author}
          </Text>
        )}
      </View>

      {/* Select Button Overlay */}
      <View style={{ bottom: insets.bottom + 40 }} className="absolute w-full items-center">
        <Pressable
          onPress={() => handleSelectQuote(item.quote)}
          style={{ backgroundColor: moodConfig.color }}
          className="flex-row items-center gap-3 rounded-full px-10 py-5 shadow-xl shadow-black/20 transition-transform active:scale-95">
          <Text className="font-manrope text-lg font-bold tracking-wide text-white">Use Quote</Text>
          <Sparkles size={20} color="white" />
        </Pressable>
      </View>

      {/* Swipe Hint (First Item Only) */}
      {index === 0 && (
        <Animated.View
          style={[{ bottom: insets.bottom + 120 }, animatedArrowStyle]}
          className="absolute items-center opacity-40">
          <Text className="mb-2 font-manrope text-[10px] uppercase tracking-[0.3em] text-on-surface-variant">
            Swipe Up
          </Text>
          <ChevronDown size={24} color={moodConfig.color} />
        </Animated.View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="dark" />

      {/* Absolute Header Overlay */}
      <View
        style={{ paddingTop: insets.top }}
        className="absolute left-0 right-0 top-0 z-50 flex-row items-center justify-between px-6 py-4">
        <Pressable
          onPress={() => router.back()}
          className="h-12 w-12 items-center justify-center rounded-full bg-surface/80 shadow-sm backdrop-blur-md active:opacity-70">
          <ChevronLeft size={28} color={colors.primary} />
        </Pressable>
        <View className="flex-col items-center">
          <Text className="font-noto-serif text-xl tracking-tight text-primary">
            {moodConfig.name}
          </Text>
          <Text className="font-manrope text-[10px] uppercase tracking-widest text-primary opacity-60">
            Quotes
          </Text>
        </View>
        <View className="w-12" />
      </View>

      <FlatList
        data={randomizedQuotes}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        pagingEnabled
        horizontal={false}
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum={true}
        removeClippedSubviews={true}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
      />
    </View>
  );
}
