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
import * as AuraBridge from 'aura-bridge';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSubscriptionStore } from '@/src/stores/subscriptionStore';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * CUSTOMIZE SCREEN - With Ghost Renderer for Widgets
 */
export default function CustomizeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { currentWallpaper, saveWallpaper, loadWallpaper, updateWallpaper } = useWallpaperStore();
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
    console.log('[WIDGET_SYNC] START');
    try {
      const groupPath = AuraBridge.getAppGroupPath();
      console.log('[WIDGET_SYNC] App Group Path:', groupPath);

      if (groupPath) {
        const timestamp = Date.now();
        const snapshots = [
          { ref: smallShotRef, name: `small_${timestamp}.png`, key: 'smallFilename' },
          { ref: mediumShotRef, name: `medium_${timestamp}.png`, key: 'mediumFilename' },
          { ref: largeShotRef, name: `large_${timestamp}.png`, key: 'largeFilename' },
        ];

        const filenames: any = {};

        for (const shot of snapshots) {
          try {
            await new Promise((resolve) => setTimeout(resolve, 300));
            const uri = await shot.ref.current?.capture?.();
            if (uri) {
              console.log(`[WIDGET SYNC] Captured ${shot.name}:`, uri);
              const dest = `file://${groupPath}/${shot.name}`;
              await FileSystem.copyAsync({ from: uri, to: dest });
              filenames[shot.key] = shot.name;
            }
          } catch (err) {
            console.error(`Error capturing/copying ${shot.name}:`, err);
          }
        }

        // Update store with these filenames so they persist and sync correctly
        updateWallpaper(filenames);

        // Sync Metadata with individual filenames
        const moodInfo = MOODS[currentWallpaper.moodId as MoodId];
        const sharedKey = 'currentWallpaper';
        const groupId = 'group.com.sureshbabudj.iamaura';

        const metadata = {
          id: currentWallpaper.id || '',
          moodId: currentWallpaper.moodId || '',
          moodName: moodInfo?.name || '',
          moodEmoji: moodInfo?.emoji || '',
          ...filenames,
        };

        console.log('[WIDGET_SYNC] Writing via AuraBridge...', metadata);
        AuraBridge.setSharedData(groupId, sharedKey, metadata);

        setTimeout(() => {
          console.log('[WIDGET_SYNC] Reloading widget via AuraBridge...');
          AuraBridge.reloadWidget();
        }, 1000);
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
        await performWidgetSync();
        saveWallpaper();

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
      console.log('[WIDGET_SYNC] --- SAVE PROCESS START ---');

      // 1. Capture and Sync Widget Images first
      await performWidgetSync();

      // 2. Now save to the store (it will now include filenames from our sync)
      saveWallpaper();

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
        <WallpaperCanvas ref={viewShotRef as any} size="full" />
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

      {/* Hidden capture containers */}
      <View style={{ position: 'absolute', left: -5000, top: 0, flexDirection: 'row' }} pointerEvents="none">
        {/* Small Widget Capture - 158x158 */}
        <View style={{ width: 158, height: 158, overflow: 'hidden' }}>
          <ViewShot ref={smallShotRef} options={{ format: 'png', quality: 1 }} style={{ width: 158, height: 158 }}>
            <View collapsable={false} style={{ width: 158, height: 158 }}>
              <WallpaperCanvas skipViewShot size="small" />
            </View>
          </ViewShot>
        </View>

        {/* Medium Widget Capture - 338x158 */}
        <View style={{ width: 338, height: 158, overflow: 'hidden' }}>
          <ViewShot ref={mediumShotRef} options={{ format: 'png', quality: 1 }} style={{ width: 338, height: 158 }}>
            <View collapsable={false} style={{ width: 338, height: 158 }}>
              <WallpaperCanvas skipViewShot size="medium" />
            </View>
          </ViewShot>
        </View>

        {/* Large Widget Capture - 338x354 */}
        <View style={{ width: 338, height: 354, overflow: 'hidden' }}>
          <ViewShot ref={largeShotRef} options={{ format: 'png', quality: 1 }} style={{ width: 338, height: 354 }}>
            <View collapsable={false} style={{ width: 338, height: 354 }}>
              <WallpaperCanvas skipViewShot size="large" />
            </View>
          </ViewShot>
        </View>
      </View>
    </View>
  );
}
