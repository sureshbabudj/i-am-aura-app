import React from 'react';
import { View, Text, ScrollView, Pressable, Dimensions, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings, Sparkles, Layout } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useWallpaperStore } from '@/src/stores/wallpaperStore';
import { MOODS, MoodId } from '@/src/constants/moods';

export default function DailyScreen() {
    const { savedWallpapers, dailyQueue } = useWallpaperStore();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Get the first item from the daily queue or the first saved wallpaper
    const dailyWallpaperId = dailyQueue[0] || savedWallpapers.find(w => w.isDaily)?.id;
    const dailyWallpaper = savedWallpapers.find(w => w.id === dailyWallpaperId);

    const moodConfig = dailyWallpaper ? MOODS[dailyWallpaper.moodId as MoodId] : null;

    const renderWidgetPreview = (size: 'small' | 'medium' | 'large', label: string) => {
        const dimensions = {
            small: { width: 150, height: 150 },
            medium: { width: 320, height: 150 },
            large: { width: 320, height: 320 },
        }[size];

        return (
            <View className="mb-8 items-center">
                <Text className="text-on-surface-variant text-xs uppercase tracking-widest font-manrope font-bold mb-3">{label}</Text>
                <View 
                    style={[
                        { width: dimensions.width, height: dimensions.height, borderRadius: 24, overflow: 'hidden' },
                        styles.widgetShadow
                    ]}
                    className="bg-surface-container"
                >
                    {dailyWallpaper && (
                        <>
                            {dailyWallpaper.backgroundType === 'color' && (
                                <View style={[StyleSheet.absoluteFill, { backgroundColor: dailyWallpaper.backgroundValue as string }]} />
                            )}
                            {dailyWallpaper.backgroundType === 'gradient' && (
                                <LinearGradient colors={dailyWallpaper.backgroundValue as [string, string]} style={StyleSheet.absoluteFill} />
                            )}
                            {dailyWallpaper.backgroundType === 'image' && (
                                <Image source={{ uri: dailyWallpaper.backgroundValue as string }} className="w-full h-full" contentFit="cover" />
                            )}
                            
                            <View className="flex-1 items-center justify-center p-4">
                                <Text 
                                    numberOfLines={size === 'small' ? 3 : 5}
                                    className={`text-white text-center font-bold ${size === 'small' ? 'text-sm' : 'text-lg'}`}
                                    style={{ color: dailyWallpaper.textColor, opacity: 0.9 }}
                                >
                                    &quot;{dailyWallpaper.affirmation}&quot;
                                </Text>
                                {size !== 'small' && (
                                    <View className="mt-3 bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">
                                        <Text className="text-white text-[10px] font-medium tracking-widest uppercase">
                                            {moodConfig?.name}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-surface">
            <StatusBar style="dark" />
            
            <ScrollView className="flex-1">
                {/* Header */}
                <View 
                    style={{ paddingTop: insets.top + 20 }}
                    className="px-6 pb-6 flex-row justify-between items-center"
                >
                    <View>
                        <Text className="text-on-surface text-3xl font-noto-serif">Today</Text>
                        <Text className="text-on-surface-variant font-manrope mt-1">Widget Preview</Text>
                    </View>
                    <Pressable
                        onPress={() => router.push('/settings')}
                        className="w-10 h-10 bg-surface-container rounded-full items-center justify-center border-outline-variant"
                    >
                        <Settings size={20} color="#53433e" />
                    </Pressable>
                </View>

                {dailyWallpaper ? (
                    <View className="px-6 pt-4">
                        <View className="bg-primary-container border-primary rounded-2xl p-5 mb-8 flex-row items-center">
                            <Sparkles size={24} color="#fbf9f4" />
                            <View className="ml-4 flex-1">
                                <Text className="text-on-primary-container font-manrope font-bold">Rotation Active</Text>
                                <Text className="text-on-primary-container font-manrope text-xs">Your widgets will sync with this affirmation.</Text>
                            </View>
                            <Pressable 
                                className="bg-primary px-4 py-2 flex-row rounded-full"
                                onPress={() => router.push(`/create/${dailyWallpaper.id}`)}
                            >
                                <Text className="text-on-primary font-manrope font-bold">Edit</Text>
                            </Pressable>
                        </View>

                        <View className="items-center">
                            {renderWidgetPreview('small', 'Home Screen (Small)')}
                            {renderWidgetPreview('medium', 'Home Screen (Medium)')}
                        </View>
                    </View>
                ) : (
                    <View className="flex-1 items-center justify-center p-12 mt-20">
                        <View className="w-16 h-16 bg-surface-container rounded-full items-center justify-center mb-6">
                            <Layout size={32} color="#53433e" />
                        </View>
                        <Text className="text-on-surface text-xl font-noto-serif text-center mb-2">No active affirmation</Text>
                        <Text className="text-on-surface-variant font-manrope text-center mb-8">
                            Select one of your saved affirmations and mark it as &quot;Daily&quot; to see it here and in your widgets.
                        </Text>
                        <Pressable
                            onPress={() => router.push('/(tabs)/library')}
                            className="bg-primary px-8 py-3 rounded-full"
                        >
                            <Text className="text-on-primary font-manrope font-bold">Go to Library</Text>
                        </Pressable>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    widgetShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    }
});
