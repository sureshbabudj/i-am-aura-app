import React from 'react';
import { View, Text, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Info,
  Moon,
  Bell,
  Shield,
  Trash2,
  Heart,
  ExternalLink,
  LifeBuoy,
  NotepadText,
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/src/constants/colors';
import { settingsData } from '@/src/constants/settings';
import * as WebBrowser from 'expo-web-browser';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/src/stores/appStore';
import { useWallpaperStore } from '@/src/stores/wallpaperStore';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const featureFlags = useAppStore((state) => state.featureFlags);
  const resetApp = useAppStore((state) => state.reset);
  const resetWallpapers = useWallpaperStore((state) => state.resetAllData);

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

  const handleResetData = () => {
    Alert.alert(
      'Reset Data',
      'Are you sure? This will delete all your saved wallpapers and reset all app settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: () => {
            resetWallpapers();
            resetApp();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  const renderSettingItem = (icon: any, label: string, value?: string, onPress?: () => void) => (
    <Pressable
      onPress={onPress}
      className="mb-2 flex-row items-center justify-between rounded-2xl border border-outline-variant/30 bg-surface-container-low p-4 active:bg-surface-container">
      <View className="flex-row items-center">
        <View className="mr-4 h-10 w-10 items-center justify-center rounded-xl bg-surface-container">
          {React.createElement(icon, { size: 20, color: colors['on-surface-variant'] })}
        </View>
        <Text className="font-manrope font-medium text-on-surface">{label}</Text>
      </View>
      <View className="flex-row items-center">
        {value && <Text className="mr-2 font-manrope text-on-surface-variant">{value}</Text>}
        <ChevronLeft
          size={18}
          color={colors['on-surface-variant']}
          style={{ transform: [{ rotate: '180deg' }] }}
        />
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="dark" />
      <View style={{ paddingTop: insets.top }} className="flex-1">
        <View className="flex-row items-center px-8 py-6">
          <Text className="font-noto-serif text-3xl font-black text-on-surface">Settings</Text>
        </View>

        <ScrollView
          className="flex-1 px-6 pt-4"
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) }}>
          {(featureFlags.dailyReminders || featureFlags.darkTheme) && (
            <View className="mb-8">
              <Text className="mb-4 ml-2 font-manrope text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/90">
                Preferences
              </Text>
              {featureFlags.dailyReminders && renderSettingItem(Bell, 'Daily Reminders', 'Off')}
              {featureFlags.darkTheme && renderSettingItem(Moon, 'App Theme', 'Dark')}
            </View>
          )}

          <Text className="mb-4 ml-2 font-manrope text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/90">
            About & Legal
          </Text>

          {renderSettingItem(Info, 'How it works', undefined, () => router.push('/onboarding'))}
          {renderSettingItem(Shield, 'Privacy Policy', undefined, () =>
            handleOpenLink(settingsData.privacyLink)
          )}
          {renderSettingItem(NotepadText, 'Terms of Conditions', undefined, () =>
            handleOpenLink(settingsData.termsLink)
          )}
          {renderSettingItem(ExternalLink, 'Attributions', undefined, () =>
            router.push('/settings/attributions')
          )}

          <Text className="mb-4 ml-2 mt-8 font-manrope text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/90">
            Support
          </Text>
          {featureFlags.rateTheApp &&
            renderSettingItem(Heart, 'Rate the App', undefined, () =>
              handleOpenLink(
                Platform.OS === 'ios'
                  ? settingsData.rateTheAppIosUrl
                  : settingsData.rateTheAppAndroidUrl
              )
            )}
          {renderSettingItem(LifeBuoy, 'Feedback', undefined, () =>
            handleOpenLink(settingsData.feedbackFormPostUrl.replace('/formResponse', '/viewform'))
          )}

          <Text className="mb-4 ml-2 mt-8 font-manrope text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/90">
            Danger Zone
          </Text>
          <Pressable
            onPress={handleResetData}
            className="flex-row items-center rounded-2xl border border-error/10 bg-error-container/10 p-4 active:bg-error-container/20">
            <View className="mr-4 h-10 w-10 items-center justify-center rounded-xl bg-error/10">
              <Trash2 size={20} color={colors.error} />
            </View>
            <Text className="font-manrope font-medium text-error">Delete All Data</Text>
          </Pressable>

          <View className="items-center py-10">
            <Text className="font-manrope text-[10px] font-bold uppercase tracking-[0.3em] text-on-primary-container">
              I am Aura
            </Text>
            <Text className="mt-1 font-manrope text-[10px] font-medium text-on-surface-variant/90">
              Version 1.0.0
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
