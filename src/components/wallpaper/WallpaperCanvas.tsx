import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { generatePatternSVG } from '@/src/services/wallpaper/patterns';
import { transformText } from '@/src/services/text/unicode-map';
import { Image } from 'expo-image';
import { useWallpaperStore } from '@/src/stores/wallpaperStore';
import ViewShot from 'react-native-view-shot';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const WallpaperCanvas = React.forwardRef<ViewShot>((props, ref) => {
  const { currentWallpaper } = useWallpaperStore();

  const {
    backgroundType = 'gradient',
    backgroundValue = ['#FF6B35', '#F7931E'],
    patternConfig,
    imageOpacity = 1,
    imageSaturation = 1,
    affirmation = '',
    textContent = '',
    textColor = '#FFFFFF',
    textSize = 32,
    textAlignment = { vertical: 'center', horizontal: 'center' },
    textOpacity = 1,
    textStyle,
    fontFamily = 'Inter-SemiBold',
  } = currentWallpaper;

  const displayAffirmation = textStyle
    ? transformText(textContent || affirmation, textStyle as any)
    : textContent || affirmation;

  // Text position shared values for drag interaction
  const textX = useSharedValue(0);
  const textY = useSharedValue(0);
  const scale = useSharedValue(1);

  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: textX.value }, { translateY: textY.value }, { scale: scale.value }],
  }));

  const renderPattern = (config: any, id: string) => {
    if (!config || !config.type || config.type === 'none') return null;
    const xml = generatePatternSVG(config);
    if (!xml) return null;

    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <SvgXml xml={xml} width="100%" height="100%" style={StyleSheet.absoluteFill} />
      </View>
    );
  };

  const renderBackground = () => {
    switch (backgroundType) {
      case 'color':
        return (
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: (backgroundValue as string) || '#000000' },
            ]}
          />
        );

      case 'gradient':
        const colors =
          Array.isArray(backgroundValue) && backgroundValue.length >= 2
            ? backgroundValue
            : ['#FF6B35', '#F7931E'];
        return (
          <LinearGradient
            colors={colors as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        );

      case 'image':
        return (
          <View style={StyleSheet.absoluteFill}>
            <Image
              source={{ uri: backgroundValue as string }}
              style={[
                StyleSheet.absoluteFill,
                {
                  opacity: imageOpacity ?? 1,
                },
              ]}
              contentFit="cover"
              transition={200}
            />
            {imageSaturation !== 1 && (
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor: '#000',
                    opacity: 1 - Math.min(1, Math.max(0, imageSaturation)),
                  },
                ]}
              />
            )}
          </View>
        );

      case 'pattern':
        const bgColor =
          typeof backgroundValue === 'string' && backgroundValue.startsWith('#')
            ? backgroundValue
            : '#FBF9F4';
        const activePatternType = patternConfig?.type || 'grid';
        const mergedPatternConfig = {
          ...patternConfig,
          type: activePatternType,
          color: patternConfig?.color || currentWallpaper.textColor || '#30312e',
          opacity: patternConfig?.opacity ?? 0.2,
          scale: patternConfig?.scale ?? 1,
        };
        return (
          <View style={StyleSheet.absoluteFill}>
            <View style={[StyleSheet.absoluteFill, { backgroundColor: bgColor }]} />
            {renderPattern(mergedPatternConfig, 'bgPattern')}
          </View>
        );
      default:
        return null;
    }
  };

  const renderPatternOverlay = () => {
    if (!patternConfig || backgroundType === 'pattern') return null;
    return renderPattern(patternConfig, 'overlayPattern');
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ViewShot ref={ref} style={styles.canvas} options={{ format: 'jpg', quality: 0.9 }}>
        <View style={StyleSheet.absoluteFill}>
          {/* Base Background */}
          {renderBackground()}

          {/* Pattern Overlay (if not using pattern as base) */}
          {renderPatternOverlay()}

          {/* Text Layer */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                justifyContent:
                  textAlignment.vertical === 'top'
                    ? 'flex-start'
                    : textAlignment.vertical === 'bottom'
                      ? 'flex-end'
                      : 'center',
                alignItems:
                  textAlignment.horizontal === 'left'
                    ? 'flex-start'
                    : textAlignment.horizontal === 'right'
                      ? 'flex-end'
                      : 'center',
              },
              animatedTextStyle,
            ]}>
            <Animated.Text
              style={[
                styles.affirmationText,
                {
                  color: textColor,
                  fontSize: textSize,
                  lineHeight: Math.round(textSize * 1.4),
                  opacity: textOpacity,
                  fontFamily: fontFamily,
                  textAlign: textAlignment.horizontal as any,
                },
              ]}>
              {displayAffirmation}
            </Animated.Text>
          </Animated.View>

          {/* Vignette Overlay for depth */}
          <View style={styles.vignette} pointerEvents="none" />
        </View>
      </ViewShot>
    </GestureHandlerRootView>
  );
});

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  canvas: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  textContainer: {
    ...StyleSheet.absoluteFill,
    padding: 40,
  },
  affirmationText: {
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    maxWidth: '100%',
  },
  vignette: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'transparent',
  },
});
