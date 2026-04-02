import { Pressable, Text, View } from 'react-native';
import { groupedQuotes } from '@/src/constants/groupedQuotes';
import { Palette } from 'lucide-react-native';
import { colors } from '@/src/constants/colors';
import { useWallpaperStore } from '@/src/stores/wallpaperStore';
import { useRouter } from 'expo-router';

export function RandomQuote() {
  const mood =
    Object.keys(groupedQuotes)[Math.floor(Math.random() * Object.keys(groupedQuotes).length)];
  const quotes = groupedQuotes[mood];
  const { quote } = quotes[Math.floor(Math.random() * quotes.length)];

  const router = useRouter();

  const { createWallpaper } = useWallpaperStore();

  const handleSelectQuote = () => {
    createWallpaper(mood, quote);
    router.push('/create/new');
  };

  return (
    <View className="mb-10 mt-4">
      <View className="mb-4">
        <Text className="font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant opacity-70">
          Insight of the Moment
        </Text>
      </View>
      <View className="min-h-[300px] items-center justify-center rounded-[2rem] bg-surface-container-lowest p-8 text-center shadow">
        <View className="relative z-10 items-center">
          <Text className="max-w-sm text-center font-noto-serif-italic text-3xl leading-tight text-primary md:text-5xl">
            &quot;{quote}&quot;
          </Text>

          <View className="mt-8 flex-row items-center justify-center gap-6">
            <Pressable
              onPress={handleSelectQuote}
              className="flex-row items-center gap-2 rounded-full border border-outline-variant px-4 py-2 active:opacity-70 ">
              <Palette size={18} color={colors.primary} />
              <Text className="font-manrope text-[10px] font-semibold uppercase tracking-widest text-primary">
                Customize
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
