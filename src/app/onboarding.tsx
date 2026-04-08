import React, { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Palette, Share, Heart, ChevronRight } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/src/stores/appStore';
import { colors } from '@/src/constants/colors';
import * as WebBrowser from 'expo-web-browser';
import { settingsData } from '../constants/settings';

const STEPS = [
  {
    title: 'Pick your Mood',
    description:
      "Whether you're feeling happy, focused, or need a little motivation, we have quotes for every moment.",
    icon: Heart,
    color: colors['primary-container'],
  },
  {
    title: 'Personalize your Style',
    description:
      'Choose from beautiful colors, patterns, and high-quality images to create a wallpaper that inspires you.',
    icon: Palette,
    color: colors.primary,
  },
  {
    title: 'Save & Share',
    description:
      'Keep your quotes in your gallery and set them as your daily wallpaper or widget background.',
    icon: Share,
    color: colors.secondary,
  },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useAppStore();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
      router.replace('/(tabs)');
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const step = STEPS[currentStep];

  const handleOpenLink = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        toolbarColor: colors.surface,
        enableBarCollapsing: true,
      });
    } catch {
      Alert.alert('Error', 'Could not open link.');
    }
  };

  return (
    <View className="relative flex-1 overflow-hidden bg-surface">
      <StatusBar style="dark" />

      {/* Top Skip Navigation */}
      <View
        style={{ paddingTop: insets.top + 16 }}
        className="absolute top-0 z-20 w-full flex-row justify-end px-8">
        <Pressable onPress={handleSkip} className="px-4 py-2 active:opacity-70">
          <Text className="font-manrope text-xs uppercase tracking-[0.2em] text-on-surface/60">
            Skip
          </Text>
        </Pressable>
      </View>

      <View className="z-10 flex-1 flex-col items-center justify-center px-8 pt-20">
        <Animated.View
          key={currentStep}
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(500)}
          className="w-full max-w-xl flex-col items-center space-y-8 self-center">
          <View
            style={{
              backgroundColor: `${step.color}10`,
              borderColor: `${step.color}20`,
              borderWidth: 1,
            }}
            className="mb-10 h-24 w-24 items-center justify-center rounded-full shadow-sm">
            <step.icon size={36} color={step.color} />
          </View>

          <View className="mb-8 h-[1px] w-12 bg-primary/30" />

          <Text className="mb-6 text-center font-noto-serif-italic text-4xl leading-tight text-on-surface">
            {step.title}
          </Text>

          <Text className="text-center font-manrope text-sm font-medium leading-relaxed tracking-wide text-on-surface-variant">
            {step.description}
          </Text>
        </Animated.View>
      </View>

      {/* Bottom Call to Action Section */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom + 10, 32) }}
        className="z-20 w-full max-w-sm flex-col items-center self-center px-8">
        {/* Dots */}
        <View className="mb-10 flex-row gap-2">
          {STEPS.map((_, i) => (
            <View
              key={i}
              className={`h-1.5 rounded-full ${i === currentStep ? 'w-8 bg-primary' : 'w-1.5 bg-primary/20'}`}
            />
          ))}
        </View>

        {/* Pill Button */}
        <Pressable
          onPress={handleNext}
          className="w-full flex-row items-center justify-center space-x-3 rounded-full bg-surface-container-highest px-10 py-5 text-primary shadow-sm transition-transform active:scale-[0.98]">
          <Text className="font-manrope text-sm font-extrabold uppercase tracking-widest text-primary">
            {currentStep === STEPS.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
          <ChevronRight size={18} color={colors.primary} />
        </Pressable>

        {/* Terms Disclaimer */}
        <Text className="mt-8 text-center font-manrope text-[10px] font-bold uppercase leading-relaxed tracking-widest text-on-surface/50">
          By starting, you agree to our{'\n'}
          <Pressable onPress={() => handleOpenLink(settingsData.privacyLink)}>
            <Text className="text-on-surface/70 underline">Terms of Conditions</Text>
          </Pressable>{' '}
          <Text className="text-on-surface/70">&</Text>{' '}
          <Pressable onPress={() => handleOpenLink(settingsData.privacyLink)}>
            <Text className="text-on-surface/70 underline">Privacy Policy</Text>
          </Pressable>
        </Text>
      </View>
    </View>
  );
}
