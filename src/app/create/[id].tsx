import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X, Settings2 } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

import { useWallpaperStore } from '@/src/stores/wallpaperStore';
import { WallpaperCanvas } from '@/src/components/wallpaper/WallpaperCanvas';
import { CustomizerControls } from '@/src/components/wallpaper/CustomizerControls';

import * as MediaLibrary from 'expo-media-library';
import ViewShot from 'react-native-view-shot';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CustomizeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { currentWallpaper, saveWallpaper, loadWallpaper } = useWallpaperStore();
  const viewShotRef = useRef<ViewShot>(null);
  const [saving, setSaving] = useState(false);
  const insets = useSafeAreaInsets();

  const [isControlsVisible, setIsControlsVisible] = useState(false);

  // Animation values
  const controlsY = useSharedValue(SCREEN_HEIGHT);
  const scale = useSharedValue(1);

  const toggleControls = (visible: boolean) => {
    setIsControlsVisible(visible);
    controlsY.value = withSpring(visible ? 0 : SCREEN_HEIGHT, {
      damping: 25,
      stiffness: 100,
      mass: 0.8,
    });
    scale.value = withSpring(visible ? 0.6 : 1, {
      damping: 25,
      stiffness: 100,
      mass: 0.8,
    });
  };

  const animatedCanvasStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scale.value, [0.82, 1], [-SCREEN_HEIGHT * 0.05, 0]) },
      { scale: scale.value },
    ],
    borderRadius: interpolate(scale.value, [0.82, 1], [32, 0]),
    overflow: 'hidden',
  }));

  const animatedControlsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: controlsY.value }],
  }));

  useEffect(() => {
    if (id && id !== 'new') {
      loadWallpaper(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSaveToGallery = async () => {
    if (saving) return;
    try {
      setSaving(true);
      // Wait for React to process setSaving before showing permissions or capturing
      await new Promise((resolve) => setTimeout(resolve, 100));

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission needed',
          'We need permission to save the wallpaper to your gallery.'
        );
        return;
      }

      // Small delay to ensure any layout from permissions dialogue has settled
      // await new Promise((resolve) => setTimeout(resolve, 100));

      const uri = await viewShotRef.current?.capture?.();
      if (uri) {
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert(
          'Success',
          'Wallpaper saved to your gallery! You can now set it as your wallpaper in your phone settings.'
        );
      }
    } catch (error) {
      console.error('Failed to save wallpaper:', error);
      Alert.alert('Error', 'Failed to save wallpaper. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    saveWallpaper();
    if (router.canDismiss()) {
      router.dismissAll();
    }
    router.replace('/(tabs)/library');
  };

  if (!currentWallpaper.affirmation) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color="#874c37" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style={isControlsVisible ? 'dark' : 'light'} />

      {/* Header Overlay */}
      <View
        style={{ paddingTop: insets.top + 10 }}
        className="pointer-events-auto absolute left-0 right-0 top-0 z-20 flex-row items-center justify-between px-8 py-4">
        <Pressable
          onPress={() => router.back()}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-black/10 backdrop-blur-md active:scale-90">
          <X size={24} color={isControlsVisible ? '#000000' : '#ffffff'} />
        </Pressable>

        <View className="flex-col items-center">
          <Text
            className={`font-noto-serif-italic text-2xl tracking-tight ${isControlsVisible ? 'text-on-surface' : 'text-white'}`}
            style={{
              textShadowColor: 'rgba(0,0,0,0.1)',
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 10,
            }}>
            I Am
          </Text>
          <Text
            className={`font-manrope text-[10px] uppercase tracking-widest ${isControlsVisible ? 'text-on-surface-variant' : 'text-white/80'}`}>
            Personalize
          </Text>
        </View>

        <Pressable
          onPress={handleSave}
          className={`rounded-full px-6 py-2 shadow-lg active:scale-95 ${isControlsVisible ? 'bg-primary' : 'bg-white'}`}>
          <Text
            className={`font-manrope text-sm font-bold ${isControlsVisible ? 'text-white' : 'text-primary'}`}>
            Save
          </Text>
        </Pressable>
      </View>

      {/* Main Canvas with Animation */}
      <Animated.View style={[{ flex: 1 }, animatedCanvasStyle]}>
        <WallpaperCanvas ref={viewShotRef as any} />
      </Animated.View>

      {/* Floating Customize Toggle Button */}
      {!isControlsVisible && (
        <View
          pointerEvents="box-none"
          className="absolute bottom-12 left-0 right-0 z-30 flex-row justify-center">
          <Pressable
            onPress={() => toggleControls(true)}
            className="flex-row items-center gap-3 rounded-full bg-white/90 px-6 py-4 shadow-2xl backdrop-blur-xl active:scale-95"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.2,
              shadowRadius: 20,
              elevation: 10,
            }}>
            <Settings2 size={20} color="#874c37" strokeWidth={2.5} />
            <Text className="font-manrope text-sm font-bold uppercase tracking-widest text-primary">
              Customize
            </Text>
          </Pressable>
        </View>
      )}

      {/* Animated Controls Section */}
      <Animated.View
        pointerEvents="box-none"
        style={[StyleSheet.absoluteFill, animatedControlsStyle]}
        className="z-40 justify-end">
        <CustomizerControls
          onApply={handleSaveToGallery}
          isApplying={saving}
          onSaveToLibrary={handleSave}
          onClose={() => toggleControls(false)}
        />
      </Animated.View>
    </View>
  );
}

const StyleSheet = require('react-native').StyleSheet;
