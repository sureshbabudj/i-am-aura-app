import { requireNativeModule } from 'expo-modules-core';

const bridge = (() => {
  try {
    return requireNativeModule('WidgetBridge');
  } catch (e) {
    console.error('Failed to load WidgetBridge module:', e);
    return null;
  }
})();

export const getAppGroupPath = (): string | null => {
  return bridge?.getAppGroupPath?.() || null;
};

export const setSharedData = (groupId: string, key: string, data: any): void => {
  bridge?.setSharedData?.(groupId, key, data);
};

export const reloadWidget = (): void => {
  bridge?.reloadWidget?.();
};
