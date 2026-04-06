import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Heart, Clover, HandFist, HeartHandshake, Focus, BicepsFlexed } from 'lucide-react-native';
import Animated, { 
  useAnimatedScrollHandler, 
  useSharedValue 
} from 'react-native-reanimated';
import { MoodId } from '@/src/constants/moods';
import { useMoodStore } from '@/src/stores/moodStore';
import { colors } from '@/src/constants/colors';
import { RandomQuote } from '@/src/components/quote/RandomQuote';
import { Header } from '@/src/components/common/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { useSubscriptionStore } from '@/src/stores/subscriptionStore';

const MOOD_UI = [
  {
    id: 'motivational',
    label: 'Motivational',
    icon: BicepsFlexed,
    bg: 'bg-primary-container/40',
    color: colors['on-primary-container'],
    shape: {
      borderTopLeftRadius: 90,
      borderTopRightRadius: 80,
      borderBottomRightRadius: 90,
      borderBottomLeftRadius: 60,
    },
  },
  {
    id: 'romantic',
    label: 'Romantic',
    icon: Heart,
    bg: 'bg-on-error-container/5',
    color: colors['on-error-container'],
    shape: {
      borderTopLeftRadius: 86,
      borderTopRightRadius: 82,
      borderBottomRightRadius: 82,
      borderBottomLeftRadius: 100,
    },
  },
  {
    id: 'peaceful',
    label: 'Peaceful',
    icon: Clover,
    bg: 'bg-tertiary-container/50',
    color: colors['on-tertiary-container'],
    shape: {
      borderTopLeftRadius: 80,
      borderTopRightRadius: 90,
      borderBottomRightRadius: 70,
      borderBottomLeftRadius: 70,
    },
  },
  {
    id: 'confident',
    label: 'Confident',
    icon: HandFist,
    bg: 'bg-surface-container',
    color: colors['surface-tint'],
    shape: {
      borderTopLeftRadius: 90,
      borderTopRightRadius: 85,
      borderBottomRightRadius: 90,
      borderBottomLeftRadius: 60,
    },
  },
  {
    id: 'grateful',
    label: 'empathy',
    icon: HeartHandshake,
    bg: 'bg-surface-variant/50',
    color: colors['on-surface-variant'],
    shape: {
      borderTopLeftRadius: 80,
      borderTopRightRadius: 95,
      borderBottomRightRadius: 70,
      borderBottomLeftRadius: 85,
    },
  },
  {
    id: 'focused',
    label: 'focused',
    icon: Focus,
    bg: 'bg-secondary/10',
    color: colors['secondary'],
    shape: {
      borderTopLeftRadius: 70,
      borderTopRightRadius: 90,
      borderBottomRightRadius: 90,
      borderBottomLeftRadius: 90,
    },
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setSelectedMood } = useMoodStore();

  const headerVisible = useSharedValue(true);
  const prevScrollY = useSharedValue(0);
  const { checkTrialStatus } = useSubscriptionStore();

  useEffect(() => {
    // Check if trial has expired on mount
    checkTrialStatus();
  }, [checkTrialStatus]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;
      
      // If at top, always show
      if (currentScrollY <= 50) {
        headerVisible.value = true;
      } else {
        // Hide on scroll down, show on scroll up
        if (currentScrollY > prevScrollY.value + 5) { // 5px buffer for jitter
          headerVisible.value = false;
        } else if (currentScrollY < prevScrollY.value - 10) { // 10px buffer for deliberate scroll up
          headerVisible.value = true;
        }
      }
      
      prevScrollY.value = currentScrollY;
    },
  });

  const handleMoodSelect = (moodId: MoodId) => {
    // Block if trial expired
    if (checkTrialStatus()) return;

    setSelectedMood(moodId);
    router.push(`/mood/${moodId}`);
  };

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="dark" />

      {/* Header - Now Absolute and Animated */}
      <Header headerVisible={headerVisible} />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        className="flex-1 px-6"
        contentContainerStyle={{ 
          paddingTop: insets.top + 100, // Safe area + Header height
          paddingBottom: 120 
        }}
        showsVerticalScrollIndicator={false}>
        <RandomQuote />

        {/* Moods Section */}
        <View className="mb-6">
          <Text className="mb-2 font-noto-serif text-3xl text-on-surface">
            How are you feeling?
          </Text>
          <Text className="font-manrope text-sm text-on-surface-variant">
            Select a mood to curate your daily focus and intentions.
          </Text>
        </View>

        {/* Mood Grid */}
        <View className="mb-12 flex-row flex-wrap justify-between">
          {MOOD_UI.map((ui, idx) => {
            const Icon = ui.icon;
            return (
              <Pressable
                key={ui.id}
                onPress={() => handleMoodSelect(ui.id as MoodId)}
                className={`mb-6 w-[48%] ${idx % 2 !== 0 && idx !== 0 ? 'mt-8' : ''}`}>
                <View
                  className={`${ui.bg} aspect-square flex-col items-center justify-center p-6`}
                  style={ui.shape}>
                  <View className="mb-4">
                    <Icon size={36} color={ui.color} />
                  </View>
                  <Text
                    style={{ color: ui.color }}
                    className="font-manrope text-xs font-semibold uppercase tracking-widest">
                    {ui.label}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </Animated.ScrollView>
    </View>
  );
}
