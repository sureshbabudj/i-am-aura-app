import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/src/constants/colors';
import BrandIcon from './Logo';

export function Header() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: insets.top + 20 }}
      className="z-40 w-full flex-row items-center justify-between bg-surface px-6 py-4">
      <View className="flex-row items-center justify-center gap-2 active:scale-95">
        <BrandIcon size={30} color={colors.primary} />
        <Text className="font-noto-serif text-3xl text-primary">Aura</Text>
      </View>
      <Pressable onPress={() => router.push('/settings')} className="text-primary active:scale-95">
        <Settings size={24} color={colors.primary} />
      </Pressable>
    </View>
  );
}
