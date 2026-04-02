import React from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
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
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/src/constants/colors';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
        <View className="flex-row items-center px-6 py-4">
          <Pressable
            onPress={() => router.back()}
            className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-surface-container">
            <ChevronLeft size={24} color={colors['on-surface-variant']} />
          </Pressable>
          <Text className="font-noto-serif text-2xl text-on-surface">Settings</Text>
        </View>

        <ScrollView
          className="flex-1 px-6 pt-4"
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) }}>
          <Text className="mb-4 ml-2 font-manrope text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Preferences
          </Text>

          {renderSettingItem(Bell, 'Daily Reminders', 'Off')}
          {renderSettingItem(Moon, 'App Theme', 'Dark')}

          <Text className="mb-4 ml-2 mt-8 font-manrope text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            About & Legal
          </Text>

          {renderSettingItem(Info, 'How it works', undefined, () => router.push('/onboarding'))}
          {renderSettingItem(Shield, 'Privacy Policy')}
          {renderSettingItem(ExternalLink, 'Attributions')}

          <Text className="mb-4 ml-2 mt-8 font-manrope text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Support
          </Text>
          {renderSettingItem(Heart, 'Rate the App')}

          <Text className="mb-4 ml-2 mt-8 font-manrope text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Danger Zone
          </Text>
          <Pressable
            onPress={() =>
              Alert.alert(
                'Reset Data',
                'Are you sure? This will delete all your saved wallpapers.',
                [{ text: 'Cancel' }, { text: 'Reset', style: 'destructive' }]
              )
            }
            className="flex-row items-center rounded-2xl border border-error/10 bg-error-container/30 p-4 active:bg-surface-container">
            <View className="mr-4 h-10 w-10 items-center justify-center rounded-xl bg-error/10">
              <Trash2 size={20} color={colors.error} />
            </View>
            <Text className="font-manrope font-medium text-error">Delete All Data</Text>
          </Pressable>

          <View className="items-center py-10">
            <Text className="font-manrope text-xs uppercase tracking-tighter text-on-surface-variant">
              Aura - Mood Quotes
            </Text>
            <Text className="mt-1 font-manrope text-[10px] text-surface-variant">
              Version 1.0.0
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
