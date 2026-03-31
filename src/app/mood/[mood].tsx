import { View, Text, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Sparkles } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

import { MOODS, MoodId } from '@/src/constants/moods';
import { useWallpaperStore } from '@/src/stores/wallpaperStore';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AffirmationSelectionScreen() {
    const { mood } = useLocalSearchParams<{ mood: MoodId }>();
    const router = useRouter();
    const { createWallpaper } = useWallpaperStore();
    const insets = useSafeAreaInsets();

    const moodConfig = MOODS[mood as MoodId];

    if (!moodConfig) {
        return (
            <View className="flex-1 bg-surface items-center justify-center p-6">
                <Text className="text-on-surface text-xl font-noto-serif">Mood not found</Text>
                <Pressable
                    onPress={() => router.back()}
                    className="mt-4 bg-surface-container px-6 py-2 rounded-full"
                >
                    <Text className="text-on-surface font-manrope">Go Back</Text>
                </Pressable>
            </View>
        );
    }

    const handleSelectAffirmation = (text: string) => {
        createWallpaper(mood as string, text);
        // We'll navigate to create screen with a temporary ID if needed, 
        // but the store handles 'currentWallpaper'
        router.push('/create/new');
    };

    return (
        <View className="flex-1 bg-surface">
            <StatusBar style="dark" />

            <LinearGradient
                colors={moodConfig.gradient as unknown as [string, string]}
                style={{ paddingTop: insets.top + 20 }}
                className="pb-8 px-6"
            >
                <Pressable
                    onPress={() => router.back()}
                    className="w-10 h-10 bg-black/20 rounded-full items-center justify-center mb-4"
                >
                    <ChevronLeft size={24} color="#ffffff" />
                </Pressable>

                <View className="flex-row items-center mb-2">
                    <Text className="text-4xl mr-3">{moodConfig.emoji}</Text>
                    <View>
                        <Text className="text-white/70 text-sm uppercase tracking-widest font-bold font-manrope">
                            {moodConfig.name} Mood
                        </Text>
                        <Text className="text-white text-3xl font-bold font-noto-serif">
                            Choose Your Affirmation
                        </Text>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView
                className="flex-1 px-4 mt-6"
                contentContainerClassName="pb-10"
                showsVerticalScrollIndicator={false}
            >
                <View className="bg-surface-container-low rounded-2xl p-4 mb-6 flex-row items-center border-outline-variant">
                    <Sparkles size={20} color={moodConfig.color} />
                    <Text className="text-on-surface-variant font-manrope text-xs ml-3 flex-1">
                        Select an affirmation that resonates with you right now. You can style it in the next step.
                    </Text>
                </View>

                {moodConfig.affirmations.map((text, index) => (
                    <Pressable
                        key={index}
                        onPress={() => handleSelectAffirmation(text)}
                        className="bg-surface-container-low mb-4 p-6 rounded-2xl border border-outline-variant active:bg-surface-container transition-colors"
                    >
                        <Text className="text-on-surface text-lg font-medium font-noto-serif leading-7">
                            &quot;{text}&quot;
                        </Text>
                        <View className="flex-row justify-end mt-4">
                            <View className="bg-surface-container px-3 py-1 rounded-full flex-row items-center">
                                <Text className="text-on-surface-variant font-manrope text-xs mr-1">Select</Text>
                                <ChevronLeft size={14} color="#53433e" style={{ transform: [{ rotate: '180deg' }] }} />
                            </View>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}
