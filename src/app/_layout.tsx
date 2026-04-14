import { Stack } from 'expo-router';
import {
  NotoSerif_400Regular,
  NotoSerif_400Regular_Italic,
  NotoSerif_700Bold,
  NotoSerif_700Bold_Italic,
  NotoSerif_900Black,
  NotoSerif_900Black_Italic,
} from '@expo-google-fonts/noto-serif';
import { Manrope_200ExtraLight } from '@expo-google-fonts/manrope/200ExtraLight';
import { Manrope_300Light } from '@expo-google-fonts/manrope/300Light';
import { Manrope_400Regular } from '@expo-google-fonts/manrope/400Regular';
import { Manrope_500Medium } from '@expo-google-fonts/manrope/500Medium';
import { Manrope_600SemiBold } from '@expo-google-fonts/manrope/600SemiBold';
import { Manrope_700Bold } from '@expo-google-fonts/manrope/700Bold';
import { Manrope_800ExtraBold } from '@expo-google-fonts/manrope/800ExtraBold';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { MoodProvider } from '@/src/stores/moodStore';
import { useSubscriptionStore } from '@/src/stores/subscriptionStore';
import { PaywallProvider } from '@/src/components/subscription/PaywallProvider';
import '@/global.css';

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    NotoSerif_400Regular,
    NotoSerif_400Regular_Italic,
    NotoSerif_700Bold,
    NotoSerif_700Bold_Italic,
    NotoSerif_900Black,
    NotoSerif_900Black_Italic,
    Manrope_200ExtraLight,
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  const initializeStore = useSubscriptionStore((state) => state.initialize);

  useEffect(() => {
    if (fontsLoaded) {
      initializeStore();
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, initializeStore]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaywallProvider>
            <MoodProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="mood/[mood]"
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="create/[id]"
                  options={{
                    presentation: 'fullScreenModal',
                    animation: 'fade',
                  }}
                />
                <Stack.Screen
                  name="settings/attributions"
                  options={{
                    presentation: 'modal',
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="paywall"
                  options={{
                    presentation: 'fullScreenModal',
                    headerShown: false,
                  }}
                />
                <Stack.Screen name="onboarding" options={{ presentation: 'fullScreenModal' }} />
              </Stack>
              <StatusBar style="auto" />
            </MoodProvider>
          </PaywallProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
