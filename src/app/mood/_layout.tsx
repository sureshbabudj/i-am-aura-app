import { Slot } from 'expo-router';
import { View } from 'react-native';

export default function MoodLayout() {
  return (
    <View className="flex-1">
      <Slot />
    </View>
  );
}
