import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Platform,
  ActionSheetIOS,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X, Settings2, Share2, Save } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useWallpaperStore } from '@/src/stores/wallpaperStore';
import { WallpaperCanvas } from '@/src/components/wallpaper/WallpaperCanvas';
import { CustomizerControls } from '@/src/components/wallpaper/CustomizerControls';
import { colors } from '@/src/constants/colors';
import { MOODS, MoodId } from '@/src/constants/moods';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import ViewShot from 'react-native-view-shot';
// eslint-disable-next-line import/no-unresolved
import { getAppGroupPath } from 'aura-bridge';
import { ExtensionStorage } from '@bacons/apple-targets';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSubscriptionStore } from '@/src/stores/subscriptionStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * CUSTOMIZE SCREEN - With Ghost Renderer for Widgets
 */
export default function CustomizeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { currentWallpaper, saveWallpaper, loadWallpaper } = useWallpaperStore();
  const { incrementSaveCount } = useSubscriptionStore();
  const insets = useSafeAreaInsets();

  // View References
  const viewShotRef = useRef<ViewShot>(null);
  const smallShotRef = useRef<ViewShot>(null);
  const mediumShotRef = useRef<ViewShot>(null);
  const largeShotRef = useRef<ViewShot>(null);

  const [saving, setSaving] = useState(false);
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
    scale.value = withSpring(visible ? 0.82 : 1, {
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
  }, [id, loadWallpaper]);

  const performWidgetSync = async () => {
    console.log('--- WIDGET SYNC START ---');
    try {
      const groupPath = getAppGroupPath();
      console.log('App Group Path:', groupPath);

      if (groupPath) {
        console.log('3. Refs Status:', {
          small: !!smallShotRef.current,
          medium: !!mediumShotRef.current,
          large: !!largeShotRef.current,
        });

        const snapshots = [
          { ref: smallShotRef, name: 'small_widget.png' },
          { ref: mediumShotRef, name: 'medium_widget.png' },
          { ref: largeShotRef, name: 'large_widget.png' },
        ];

        for (const shot of snapshots) {
          try {
            await new Promise((resolve) => setTimeout(resolve, 300));
            const uri = await shot.ref.current?.capture?.();
            if (uri) {
              console.log(`Captured ${shot.name}:`, uri);
              const dest = `file://${groupPath}/${shot.name}`;
              await FileSystem.copyAsync({ from: uri, to: dest });
              const info = await FileSystem.getInfoAsync(dest);
              console.log(`Verified ${shot.name} at ${dest}:`, info.exists);
            }
          } catch (err) {
            console.error(`Error capturing/copying ${shot.name}:`, err);
          }
        }

        // Sync Metadata
        const moodInfo = MOODS[currentWallpaper.moodId as MoodId];
        const storage = new ExtensionStorage('group.com.sureshbabudj.iamaura');
        storage.set('currentWallpaper', {
          id: currentWallpaper.id || '',
          moodId: currentWallpaper.moodId || '',
          moodName: moodInfo?.name || '',
          moodEmoji: moodInfo?.emoji || '',
        });
        ExtensionStorage.reloadWidget();
      }
    } catch (error) {
      console.error('Widget Sync Error:', error);
    }
  };

  const handleSaveToGallery = async () => {
    if (saving) return;
    if (!incrementSaveCount()) return;

    try {
      setSaving(true);
      const uri = await viewShotRef.current?.capture?.();
      if (uri) {
        await MediaLibrary.saveToLibraryAsync(uri);

        // Also sync widget for consistency
        saveWallpaper();
        await performWidgetSync();

        Alert.alert('Success', 'Wallpaper saved and widget updated!');
      }
    } catch (error) {
      console.error('Gallery save error:', error);
      Alert.alert('Error', 'Failed to save to gallery.');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      console.log('--- SAVE PROCESS START ---');
      saveWallpaper();
      await performWidgetSync();
      Alert.alert('Success', 'Design saved and widget updated!');
      router.replace('/(tabs)/library');
    } catch (error) {
      console.error('Save Error:', error);
      Alert.alert('Save Error', 'We saved your design, but the widget might not update.');
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      if (Platform.OS === 'ios') {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ['Cancel', 'Share', 'Save to Gallery'],
            cancelButtonIndex: 0,
          },
          async (buttonIndex) => {
            if (buttonIndex === 1) {
              const uri = await viewShotRef.current?.capture?.();
              if (uri) {
                await Sharing.shareAsync(uri);
              }
            } else if (buttonIndex === 2) {
              await handleSaveToGallery();
            }
          }
        );
      } else {
        const uri = await viewShotRef.current?.capture?.();
        if (uri) {
          await Sharing.shareAsync(uri, {
            dialogTitle: 'Share or save your quote',
          });
        }
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share wallpaper.');
    }
  };

  if (!currentWallpaper.quote) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color={colors.primary} />
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
          <X size={24} color={isControlsVisible ? colors.black : colors.white} />
        </Pressable>

        <View className="flex-col items-center">
          <Text
            className={`font-noto-serif-italic text-2xl tracking-tight ${isControlsVisible ? 'text-on-surface' : 'text-white'}`}>
            Aura
          </Text>
          <Text
            className={`font-manrope text-[10px] uppercase tracking-widest ${isControlsVisible ? 'text-on-surface-variant' : 'text-white/80'}`}>
            Personalize
          </Text>
        </View>

        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={handleSave}
            className={`rounded-full p-3 shadow-sm active:scale-95 ${isControlsVisible ? 'bg-primary' : 'bg-white'}`}>
            <Save size={20} color={isControlsVisible ? colors['on-primary'] : colors.primary} />
          </Pressable>
          <Pressable
            onPress={handleShare}
            className={`rounded-full p-3 shadow-sm active:scale-95 ${isControlsVisible ? 'bg-primary' : 'bg-white'}`}>
            <Share2 size={20} color={isControlsVisible ? colors['on-primary'] : colors.primary} />
          </Pressable>
        </View>
      </View>

      {/* Main Canvas with Animation */}
      <Animated.View style={[{ flex: 1 }, animatedCanvasStyle]}>
        <WallpaperCanvas ref={viewShotRef as any} />
      </Animated.View>

      {/* Customize Toggle */}
      {!isControlsVisible && (
        <View
          pointerEvents="box-none"
          className="absolute bottom-12 left-0 right-0 z-30 flex-row justify-center">
          <Pressable
            onPress={() => toggleControls(true)}
            className="flex-row items-center gap-3 rounded-full bg-white/90 px-6 py-4 shadow-2xl backdrop-blur-xl active:scale-95">
            <Settings2 size={20} color={colors.primary} strokeWidth={2.5} />
            <Text className="font-manrope text-sm font-bold uppercase tracking-widest text-primary">
              Customize
            </Text>
          </Pressable>
        </View>
      )}

      {/* Controls Container */}
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

      {/* --- GHOST RENDERERS (Hidden but mounted for capture) --- */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          opacity: 0.1,
          zIndex: -1,
          left: 0,
          top: 0,
          width: 1,
          height: 1,
          overflow: 'visible',
        }}>
        {/* Small Widget Capture - 1:1 Aspect */}
        <ViewShot ref={smallShotRef} options={{ format: 'png', quality: 1 }}>
          <View collapsable={false} style={{ width: 600, height: 600 }}>
            <WallpaperCanvas skipViewShot />
          </View>
        </ViewShot>

        {/* Medium Widget Capture - 2:1 Aspect */}
        <ViewShot ref={mediumShotRef} options={{ format: 'png', quality: 1 }}>
          <View collapsable={false} style={{ width: 1200, height: 600 }}>
            <WallpaperCanvas skipViewShot />
          </View>
        </ViewShot>

        {/* Large Widget Capture - 1:1 Large */}
        <ViewShot ref={largeShotRef} options={{ format: 'png', quality: 1 }}>
          <View collapsable={false} style={{ width: 1000, height: 1000 }}>
            <WallpaperCanvas skipViewShot />
          </View>
        </ViewShot>
      </View>
    </View>
  );
}
