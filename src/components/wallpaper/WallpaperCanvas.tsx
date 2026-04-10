import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { generatePatternSVG } from '@/src/services/wallpaper/patterns';
import { transformText } from '@/src/services/text/unicode-map';
import { Image } from 'expo-image';
import { useWallpaperStore } from '@/src/stores/wallpaperStore';
import ViewShot from 'react-native-view-shot';
import { colors } from '@/src/constants/colors';
import BrandIcon from '../common/Logo';
import {
  FULL_IMG_WIDTH,
  FULL_IMG_HEIGHT,
  SMALL_THUMB_IMG_WIDTH,
  SMALL_THUMB_IMG_HEIGHT,
} from '@/src/constants/data';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface WallpaperCanvasProps {
  skipViewShot?: boolean;
  size?: 'small' | 'medium' | 'large' | 'full';
}

export const WallpaperCanvas = React.forwardRef<ViewShot, WallpaperCanvasProps>((props, ref) => {
  const { currentWallpaper } = useWallpaperStore();

  const {
    backgroundType = 'gradient',
    backgroundValue = [colors['mood-energetic-primary'], colors['mood-energetic-secondary']],
    patternConfig,
    imageOpacity = 1,
    imageSaturation = 1,
    quote = '',
    textContent = '',
    textColor = colors.white,
    textSize = 32,
    textAlignment = { vertical: 'center', horizontal: 'center' },
    textOpacity = 1,
    textStyle,
    fontFamily = 'Inter-SemiBold',
    textShadow = true,
  } = currentWallpaper;

  const displayQuote = textStyle
    ? transformText(textContent || quote, textStyle as any)
    : textContent || quote;

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
              { backgroundColor: (backgroundValue as string) || colors.black },
            ]}
          />
        );

      case 'gradient':
        const gradientColors =
          Array.isArray(backgroundValue) && backgroundValue.length >= 2
            ? backgroundValue
            : [colors['mood-energetic-primary'], colors['mood-energetic-secondary']];
        return (
          <LinearGradient
            colors={gradientColors as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        );

      case 'image':
        let imageUrl = '';
        try {
          const parsed = JSON.parse(backgroundValue as string);
          imageUrl = parsed.full || parsed.medium || parsed.thumbnail;
        } catch(e) {
          imageUrl = (backgroundValue as string)
            .replace(`w_${SMALL_THUMB_IMG_WIDTH}`, `w_${FULL_IMG_WIDTH}`)
            .replace(`h_${SMALL_THUMB_IMG_HEIGHT}`, `h_${FULL_IMG_HEIGHT}`);
        }

        return (
          <View style={StyleSheet.absoluteFill}>
            <Image
              source={{ uri: imageUrl }}
              style={[StyleSheet.absoluteFill, { opacity: imageOpacity ?? 1 }]}
              contentFit="cover"
              transition={300}
              placeholderContentFit="cover"
            />
            {imageSaturation !== 1 && (
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor: colors.black,
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
            : colors.background;
        const activePatternType = patternConfig?.type || 'grid';
        const mergedPatternConfig = {
          ...patternConfig,
          type: activePatternType,
          color: patternConfig?.color || currentWallpaper.textColor || colors['inverse-surface'],
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

  const getScalingFactor = () => {
    switch (props.size) {
      case 'small':
        return 0.45; // ~158/390
      case 'medium':
        return 0.45;
      case 'large':
        return 0.8;
      default:
        return 1.0;
    }
  };

  const getCanvasStyle = () => {
    switch (props.size) {
      case 'small':
        return styles.smallCanvas;
      case 'medium':
        return styles.mediumCanvas;
      case 'large':
        return styles.largeCanvas;
      default:
        return styles.canvas;
    }
  };

  const scaleFactor = getScalingFactor();
  const adjustedTextSize = textSize * scaleFactor;
  const paddingSize = 40 * scaleFactor;

  const content = (
    <View style={getCanvasStyle()}>
      {renderBackground()}
      {renderPatternOverlay()}
      <Animated.View
        style={[
          styles.textContainer,
          {
            padding: paddingSize,
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
          numberOfLines={6}
          adjustsFontSizeToFit
          style={[
            styles.quoteText,
            {
              color: textColor,
              fontSize: adjustedTextSize,
              lineHeight: Math.round(adjustedTextSize * 1.3),
              opacity: textOpacity,
              fontFamily: fontFamily,
              textAlign: textAlignment.horizontal as any,
              ...(textShadow
                ? {
                    textShadowColor: 'rgba(0,0,0,0.4)',
                    textShadowOffset: { width: 0, height: 1.5 },
                    textShadowRadius: 6,
                  }
                : {
                    textShadowRadius: 0,
                  }),
            },
          ]}>
          {displayQuote}
        </Animated.Text>
      </Animated.View>
      <View style={styles.vignette} pointerEvents="none" />

      {/* Aura Branding Overlay */}
      <View
        style={[
          styles.brandingContainer,
          {
            bottom: 24 * scaleFactor,
            right: 24 * scaleFactor,
            opacity: textOpacity * 0.8, // Subtle overlay
            paddingHorizontal: 8 * scaleFactor,
            paddingVertical: 4 * scaleFactor,
            borderRadius: 12 * scaleFactor,
          },
        ]}
        className="bg-surface-dim/10">
        <View style={styles.brandRow}>
          <Text
            style={[
              styles.brandText,
              {
                color: textColor,
                fontSize: 12 * scaleFactor,
                marginRight: 6 * scaleFactor,
              },
            ]}>
            Aura
          </Text>
          <BrandIcon size={16 * scaleFactor} color={textColor} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.canvasContainer}>
      {props.skipViewShot ? (
        content
      ) : (
        <ViewShot ref={ref} style={getCanvasStyle()} options={{ format: 'png', quality: 1 }}>
          {content}
        </ViewShot>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  canvasContainer: {
    overflow: 'hidden',
  },
  canvas: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
  },
  textContainer: {
    ...StyleSheet.absoluteFill,
  },
  smallCanvas: {
    width: 158,
    height: 158,
    position: 'relative',
    overflow: 'hidden',
  },
  mediumCanvas: {
    width: 338,
    height: 158,
    position: 'relative',
    overflow: 'hidden',
  },
  largeCanvas: {
    width: 338,
    height: 354,
    position: 'relative',
    overflow: 'hidden',
  },
  quoteText: {
    fontWeight: '600',
    maxWidth: '100%',
  },
  vignette: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'transparent',
  },
  brandingContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  brandText: {
    fontFamily: 'NotoSerif-Italic',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
