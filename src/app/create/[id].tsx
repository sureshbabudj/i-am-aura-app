import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

import { useWallpaperStore } from '@/src/stores/wallpaperStore';
import { WallpaperCanvas } from '@/src/components/wallpaper/WallpaperCanvas';
import { CustomizerControls } from '@/src/components/wallpaper/CustomizerControls';

import * as MediaLibrary from 'expo-media-library';
import ViewShot from 'react-native-view-shot';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CustomizeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { currentWallpaper, saveWallpaper, loadWallpaper } = useWallpaperStore();
  const viewShotRef = useRef<ViewShot>(null);
  const [saving, setSaving] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (id && id !== 'new') {
      loadWallpaper(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSaveToGallery = async () => {
    try {
      setSaving(true);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission needed',
          'We need permission to save the wallpaper to your gallery.'
        );
        return;
      }

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
    router.push('/(tabs)/library');
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
      <StatusBar style="dark" />

      {/* Header Overlay */}
      <View
        style={{ paddingTop: insets.top + 10 }}
        className="pointer-events-auto absolute left-0 right-0 top-0 z-20 flex-row items-center justify-between px-8 py-4">
        <Pressable
          onPress={() => router.back()}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-lowest/20 backdrop-blur-md active:scale-90">
          <X size={24} color="#ffffff" />
        </Pressable>

        <View className="flex-col items-center">
          <Text
            className="font-noto-serif text-2xl italic tracking-tight text-white"
            style={{
              textShadowColor: 'rgba(0,0,0,0.1)',
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 10,
            }}>
            I Am
          </Text>
          <Text className="font-manrope text-[10px] uppercase tracking-widest text-white/80">
            Customize
          </Text>
        </View>

        <Pressable
          onPress={handleSave}
          className="rounded-full bg-white px-6 py-2 shadow-lg active:scale-95">
          <Text className="font-manrope text-sm font-bold text-primary">Save</Text>
        </Pressable>
      </View>

      {/* Main Canvas */}
      <View className="flex-1 pb-48">
        <WallpaperCanvas ref={viewShotRef as any} />
      </View>

      {/* Controls Overlay - Now with absolute positioning inside component */}
      <CustomizerControls 
        onApply={handleSaveToGallery}
        isApplying={saving}
        onSaveToLibrary={handleSave}
      />
    </View>
  );
}
