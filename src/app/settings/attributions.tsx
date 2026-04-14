import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { X, ExternalLink, Heart } from 'lucide-react-native';
import { colors } from '@/src/constants/colors';
import { settingsData } from '@/src/constants/settings';
import * as WebBrowser from 'expo-web-browser';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function AttributionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleOpenLink = async (url: string) => {
    await WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      toolbarColor: colors.surface,
      enableBarCollapsing: true,
    });
  };

  const renderAttribution = (label: string, url: string) => (
    <Pressable
      key={label}
      onPress={() => handleOpenLink(url)}
      className="mb-3 flex-row items-center justify-between rounded-2xl border border-outline-variant/30 bg-surface-container-low p-5 active:bg-surface-container">
      <View>
        <Text className="font-manrope text-sm font-bold capitalize text-on-surface">{label}</Text>
        <Text className="mt-1 font-manrope text-[10px] text-on-surface-variant/60">
          {url.replace('https://', '')}
        </Text>
      </View>
      <ExternalLink size={16} color={colors['on-surface-variant']} opacity={0.5} />
    </Pressable>
  );

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="dark" />
      <View style={{ paddingTop: 20 }} className="flex-1">
        <View className="flex-row items-center justify-between border-b border-outline-variant/10 px-6 pb-4">
          <Text className="font-noto-serif text-2xl text-on-surface">Attributions</Text>
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-surface-container-high active:bg-surface-container">
            <X size={20} color={colors['on-surface-variant']} />
          </Pressable>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 24, paddingBottom: insets.bottom + 40 }}>
          <View className="mb-6 rounded-3xl border border-primary/10 bg-primary/5 p-6">
            <View className="mb-4 h-12 w-12 items-center justify-center rounded-2xl bg-primary/20">
              <Heart size={24} color={colors.primary} fill={colors.primary} />
            </View>
            <Text className="font-noto-serif text-lg text-on-surface">Giving Credit</Text>
            <Text className="mt-2 font-manrope text-sm leading-relaxed text-on-surface-variant">
              Aura is built on top of amazing open-source projects, high-quality resources, and
              incredible photography. We are grateful to the authors of these projects.
            </Text>
          </View>

          <Text className="mb-4 ml-1 font-manrope text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">
            Data & Assets
          </Text>
          {Object.entries(settingsData.attributions).map(([key, value]) =>
            renderAttribution(key, value)
          )}
        </ScrollView>
      </View>
    </View>
  );
}
