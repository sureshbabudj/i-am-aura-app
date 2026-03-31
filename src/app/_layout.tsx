import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { WallpaperProvider } from '@/src/stores/wallpaperStore';
import { MoodProvider } from '@/src/stores/moodStore';
import '@/global.css';

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded] = useFonts({

    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>

                <GestureHandlerRootView style={{ flex: 1 }}>
                    <MoodProvider>
                        <WallpaperProvider>
                            <Stack screenOptions={{ headerShown: false }}>
                                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                                <Stack.Screen
                                    name="mood/[mood]"
                                    options={{
                                        presentation: 'card',
                                        animation: 'slide_from_right'
                                    }}
                                />
                                <Stack.Screen
                                    name="create/[id]"
                                    options={{
                                        presentation: 'fullScreenModal',
                                        animation: 'fade'
                                    }}
                                />
                                <Stack.Screen name="settings/index" options={{ presentation: 'modal', title: 'Settings' }} />
                                <Stack.Screen name="onboarding" options={{ presentation: 'fullScreenModal' }} />
                            </Stack>
                            <StatusBar style="auto" />
                        </WallpaperProvider>
                    </MoodProvider>
                </GestureHandlerRootView>

            </SafeAreaProvider>
        </QueryClientProvider>
    );
}