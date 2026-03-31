import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Palette, Share, Heart, ChevronRight } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const STEPS = [
    {
        title: "Pick your Mood",
        description: "Whether you're feeling happy, focused, or need a little motivation, we have affirmations for every moment.",
        icon: Heart,
        color: "#a4644e" // primary-container
    },
    {
        title: "Personalize your Style",
        description: "Choose from beautiful colors, patterns, and high-quality images to create a wallpaper that inspires you.",
        icon: Palette,
        color: "#874c37" // primary
    },
    {
        title: "Save & Share",
        description: "Keep your affirmations in your gallery and set them as your daily wallpaper or widget background.",
        icon: Share,
        color: "#526351" // secondary
    }
];

export default function OnboardingScreen() {
    const [currentStep, setCurrentStep] = useState(0);
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            router.replace('/(tabs)');
        }
    };

    const step = STEPS[currentStep];

    return (
        <View className="flex-1 bg-surface">
            <StatusBar style="dark" />
            <View 
                style={{ paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 20) }}
                className="flex-1"
            >
                <View className="flex-1 items-center justify-center px-8">
                    <Animated.View 
                        key={currentStep}
                        entering={FadeIn.duration(500)}
                        exiting={FadeOut.duration(500)}
                        className="items-center"
                    >
                        <View 
                            style={{ backgroundColor: `${step.color}20` }}
                            className="w-32 h-32 rounded-[2rem] items-center justify-center mb-10"
                        >
                            <step.icon size={48} color={step.color} />
                        </View>

                        <Text className="text-on-surface text-3xl font-noto-serif text-center mb-4">
                            {step.title}
                        </Text>
                        
                        <Text className="text-on-surface-variant font-manrope text-lg text-center leading-7">
                            {step.description}
                        </Text>
                    </Animated.View>
                </View>

                {/* Footer */}
                <View className="px-10 pb-8 flex-row justify-between items-center">
                    {/* Dots */}
                    <View className="flex-row space-x-2">
                        {STEPS.map((_, i) => (
                            <View 
                                key={i}
                                className={`h-1.5 rounded-full ${i === currentStep ? 'w-8 bg-primary' : 'w-1.5 bg-surface-container'}`}
                            />
                        ))}
                    </View>

                    {/* Button */}
                    <Pressable
                        onPress={handleNext}
                        className="bg-primary w-16 h-16 rounded-full items-center justify-center shadow-lg active:bg-primary-container"
                    >
                        <ChevronRight size={28} color="#ffffff" />
                    </Pressable>
                </View>

                {/* Skip */}
                {currentStep < STEPS.length - 1 && (
                    <Pressable 
                        onPress={() => router.replace('/(tabs)')}
                        style={{ top: insets.top + 20 }}
                        className="absolute right-10"
                    >
                        <Text className="text-on-surface-variant font-manrope font-semibold">Skip</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}
