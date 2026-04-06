import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { colors } from '@/src/constants/colors';
import { useAppStore } from '@/src/stores/appStore';

export default function AppTabs() {
  const { hasSeenOnboarding } = useAppStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const unsub = useAppStore.persist.onFinishHydration(() => setIsHydrated(true));
    setIsHydrated(useAppStore.persist.hasHydrated());
    return () => unsub();
  }, []);

  if (!isHydrated) return null;
  if (!hasSeenOnboarding) return <Redirect href="/onboarding" />;

  return (
    <NativeTabs
      backgroundColor={colors.surface}
      blurEffect="systemThickMaterialLight"
      iconColor={{ default: colors['on-surface-variant'], selected: colors['primary'] }}
      indicatorColor={colors.primary}
      labelStyle={{
        default: { color: colors['on-surface-variant'], fontWeight: '400', fontSize: 10 },
        selected: { color: colors.primary, fontWeight: '700', fontSize: 10 },
      }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('../../../assets/icons/aura.png')} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="library">
        <NativeTabs.Trigger.Label>Library</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('../../../assets/icons/wallpapers.png')} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('../../../assets/icons/settings.png')} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
