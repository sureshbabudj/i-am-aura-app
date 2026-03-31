import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, Pattern, Path, Rect, Circle } from 'react-native-svg';
import { Image } from 'expo-image';
import { useWallpaperStore } from '@/src/stores/wallpaperStore';
import ViewShot from 'react-native-view-shot';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const WallpaperCanvas = React.forwardRef<ViewShot>((props, ref) => {
    const { currentWallpaper } = useWallpaperStore();

    const {
        backgroundType = 'gradient',
        backgroundValue = ['#FF6B35', '#F7931E'],
        patternConfig = { opacity: 0.1, scale: 1, type: 'dots', color: '#FFFFFF' },
        imageOpacity = 1,
        imageSaturation = 1,
        textContent = '',
        textColor = '#FFFFFF',
        textSize = 32,
        textAlignment = { vertical: 'center', horizontal: 'center' },
        textOpacity = 1,
        fontFamily = 'Inter-SemiBold',
    } = currentWallpaper;

    // Text position shared values for drag interaction
    const textX = useSharedValue(0);
    const textY = useSharedValue(0);
    const scale = useSharedValue(1);

    const animatedTextStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: textX.value },
            { translateY: textY.value },
            { scale: scale.value },
        ],
    }));

    const renderPattern = (config: any, id: string) => {
        if (!config || !config.type) return null;

        const scaleVal = config.scale ?? 1;
        const size = 40 * scaleVal;
        const color = config.color ?? '#FFFFFF';

        return (
            <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
                <Defs>
                    <Pattern
                        id={id}
                        patternUnits="userSpaceOnUse"
                        width={size}
                        height={size}
                    >
                        {config.type === 'grid' && (
                            <Path d={`M ${size} 0 L 0 0 0 ${size}`} fill="none" stroke={color} strokeWidth="1" />
                        )}
                        {config.type === 'dots' && (
                            <Circle cx={size / 4} cy={size / 4} r={size / 10} fill={color} />
                        )}
                        {config.type === 'lines' && (
                            <Path d={`M 0 0 L ${size} ${size}`} fill="none" stroke={color} strokeWidth="1" />
                        )}
                        {config.type === 'boxes' && (
                            <Rect x={size / 8} y={size / 8} width={size * 0.75} height={size * 0.75} fill="none" stroke={color} strokeWidth="1" rx={size / 10} />
                        )}
                    </Pattern>
                </Defs>
                <Rect width="100%" height="100%" fill={`url(#${id})`} opacity={config.opacity} />
            </Svg>
        );
    };

    const renderBackground = () => {
        switch (backgroundType) {
            case 'color':
                return (
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: (backgroundValue as string) || '#000000' }]} />
                );

            case 'gradient':
                const colors = Array.isArray(backgroundValue) && backgroundValue.length >= 2 
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
                                }
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
                                        opacity: 1 - Math.min(1, Math.max(0, imageSaturation))
                                    }
                                ]}
                            />
                        )}
                    </View>
                );

            case 'pattern':
                return renderPattern(patternConfig, 'bgPattern');
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
                            justifyContent: textAlignment.vertical === 'top' ? 'flex-start' :
                                textAlignment.vertical === 'bottom' ? 'flex-end' : 'center',
                            alignItems: textAlignment.horizontal === 'left' ? 'flex-start' :
                                textAlignment.horizontal === 'right' ? 'flex-end' : 'center',
                        },
                        animatedTextStyle,
                    ]}
                >
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
                        ]}
                    >
                        {textContent || currentWallpaper.affirmation}
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
        ...StyleSheet.absoluteFillObject,
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
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        // Radial gradient from transparent center to dark edges
    },
});