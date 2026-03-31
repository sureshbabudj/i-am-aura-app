import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Menu,
  User,
  Heart,
  Share2,
  Zap,
  Sun,
  CloudRain,
  HeartHandshake,
  Focus,
} from 'lucide-react-native';

import { MoodId } from '@/src/constants/moods';
import { useMoodStore } from '@/src/stores/moodStore';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ORGANIC_1 = {
  borderTopLeftRadius: 60,
  borderTopRightRadius: 40,
  borderBottomRightRadius: 30,
  borderBottomLeftRadius: 70,
};

const ORGANIC_2 = {
  borderTopLeftRadius: 30,
  borderTopRightRadius: 70,
  borderBottomRightRadius: 70,
  borderBottomLeftRadius: 30,
};

const MOOD_UI = [
  {
    id: 'motivational',
    label: 'motivational',
    icon: Zap,
    bg: 'bg-[#a4644e]/10',
    color: '#a4644e',
    shape: ORGANIC_1,
  },
  {
    id: 'romantic',
    label: 'romantic',
    icon: Heart,
    bg: 'bg-[#d5e8d1]/20',
    color: '#526351',
    shape: ORGANIC_2,
  },
  {
    id: 'peaceful',
    label: 'happy',
    icon: Sun,
    bg: 'bg-[#f0e0cc]/30',
    color: '#655a4b',
    shape: { borderRadius: 48 },
  },
  {
    id: 'confident',
    label: 'sad',
    icon: CloudRain,
    bg: 'bg-[#f0eee9]',
    color: '#53433e',
    shape: ORGANIC_1,
  },
  {
    id: 'grateful',
    label: 'empathy',
    icon: HeartHandshake,
    bg: 'bg-[#ffdbcf]/20',
    color: '#874c37',
    shape: ORGANIC_2,
  },
  {
    id: 'focused',
    label: 'focused',
    icon: Focus,
    bg: 'bg-[#d5e8d1]/20',
    color: '#526351',
    shape: { borderRadius: 64 },
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { setSelectedMood } = useMoodStore();
  const insets = useSafeAreaInsets();

  const handleMoodSelect = (moodId: MoodId) => {
    setSelectedMood(moodId);
    router.push(`/mood/${moodId}`);
  };

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{ paddingTop: insets.top }}
        className="z-40 w-full flex-row items-center justify-between bg-surface px-6 py-4">
        <Pressable className="text-primary active:scale-95">
          <Menu size={24} color="#874c37" />
        </Pressable>
        <Text className="font-noto-serif text-2xl italic text-primary">I Am</Text>
        <Pressable
          onPress={() => router.push('/settings')}
          className="text-primary active:scale-95">
          <User size={24} color="#874c37" />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-4"
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}>
        {/* Today's Affirmation Promo */}
        <View className="mb-10 mt-4">
          <View className="mb-4">
            <Text className="font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant opacity-70">
              Today&apos;s Affirmation
            </Text>
          </View>
          <View className="min-h-[300px] items-center justify-center rounded-[2rem] bg-surface-container-lowest p-8 text-center shadow">
            <View className="relative z-10 items-center">
              <Text className="max-w-sm text-center font-noto-serif text-3xl italic leading-tight text-primary md:text-5xl">
                &quot;I inhale peace and exhale anything that no longer serves my soul.&quot;
              </Text>

              <View className="mt-8 flex-row items-center justify-center gap-6">
                <Pressable className="flex-row items-center gap-2 active:opacity-70">
                  <Heart size={18} color="#874c37" />
                  <Text className="font-manrope text-[10px] font-semibold uppercase tracking-widest text-primary">
                    Save
                  </Text>
                </Pressable>
                <Pressable className="flex-row items-center gap-2 active:opacity-70">
                  <Share2 size={18} color="#874c37" />
                  <Text className="font-manrope text-[10px] font-semibold uppercase tracking-widest text-primary">
                    Share
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

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

        {/* Journaling / Daily Widget Teaser */}
        <View className="mb-12 flex-col justify-between rounded-3xl border border-transparent bg-surface-container-low p-6">
          <View>
            <Text className="mb-2 font-noto-serif text-2xl text-on-surface">Daily Reflection</Text>
            <Text className="pr-4 font-manrope text-sm text-on-surface-variant">
              Set up daily rotations to get fresh affirmations on your widget throughout the day.
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/library/daily')}
            className="mt-6 w-[80%] items-center rounded-full bg-primary px-6 py-4">
            <Text className="font-manrope text-xs font-semibold uppercase tracking-widest text-on-primary">
              Set Up Rotation
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
