import { Tabs } from 'expo-router';
import { Sparkles, Palette, Award, Settings } from 'lucide-react-native';
import { View, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '@/src/constants/colors';

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View className="absolute bottom-4 left-0 right-0 items-center px-8">
      <BlurView
        intensity={90}
        tint="light"
        className="w-full max-w-md flex-row items-center justify-around overflow-hidden rounded-full bg-surface px-6 py-3 shadow-lg">
        <Pressable
          onPress={() => navigation.navigate('index')}
          className={`rounded-full p-3 ${state.index === 0 ? 'bg-primary' : ''}`}>
          <Sparkles
            size={24}
            color={state.index === 0 ? colors['on-primary'] : colors['primary']}
            opacity={state.index === 0 ? 1 : 0.9}
          />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('library')}
          className={`rounded-full p-3 ${state.index === 1 ? 'bg-primary' : ''}`}>
          <Palette
            size={24}
            color={state.index === 1 ? colors['on-primary'] : colors['primary']}
            opacity={state.index === 1 ? 1 : 0.9}
          />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('daily')}
          className={`rounded-full p-3 ${state.index === 2 ? 'bg-primary' : ''}`}>
          <Award
            size={24}
            color={state.index === 2 ? colors['on-primary'] : colors['primary']}
            opacity={state.index === 2 ? 1 : 0.9}
          />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('settings')}
          className={`rounded-full p-3 ${state.index === 3 ? 'bg-primary' : ''}`}>
          <Settings
            size={24}
            color={state.index === 3 ? colors['on-primary'] : colors['primary']}
            opacity={state.index === 3 ? 1 : 0.9}
          />
        </Pressable>
      </BlurView>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="library" />
      <Tabs.Screen name="daily" />
    </Tabs>
  );
}
