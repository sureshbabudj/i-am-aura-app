import { requireNativeModule } from 'expo-modules-core';

const bridge = (() => {
  try {
    return requireNativeModule('WidgetBridge');
  } catch {
    return null;
  }
})();

export const getAppGroupPath = (): string | null => {
  return bridge?.getAppGroupPath?.() || null;
};
