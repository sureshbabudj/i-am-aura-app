import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, withTiming, SharedValue } from 'react-native-reanimated';
import { colors } from '@/src/constants/colors';
import BrandIcon from './Logo';

interface HeaderProps {
  showSettings?: boolean;
  headerVisible?: SharedValue<boolean>;
}

export function Header({ showSettings = false, headerVisible }: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(() => {
    const isHidden = headerVisible ? !headerVisible.value : false;
    return {
      transform: [
        {
          translateY: withTiming(isHidden ? -150 : 0, { duration: 300 }),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          paddingTop: insets.top + 20,
        },
        animatedStyle,
      ]}
      className="w-full flex-row items-center justify-between bg-surface/90 px-6 py-4 backdrop-blur-md">
      <View className="flex-row items-center justify-center gap-2 active:scale-95">
        <BrandIcon size={30} color={colors.primary} />
        <Text className="font-noto-serif text-3xl text-primary">Aura</Text>
      </View>
      {showSettings && (
        <Pressable
          onPress={() => router.push('/settings')}
          className="text-primary active:scale-95">
          <Settings size={24} color={colors.primary} />
        </Pressable>
      )}
    </Animated.View>
  );
}
