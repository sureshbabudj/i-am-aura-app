import { requireNativeModule } from 'expo-modules-core';

// Lazy-load the native module to prevent top-level crashes during initialization
const getWidgetBridge = () => {
  try {
    return requireNativeModule('WidgetBridge');
  } catch (e) {
    console.error('WidgetBridge native module not found:', e);
    return null;
  }
};

interface DailyQueue {
  quote: string;
  mood: string;
  id: string;
}

export interface WidgetData {
  quote: string;
  mood: string;
  moodEmoji: string;
  textColor: string;
  backgroundColor: string;
  wallpaperId: string;
  dailyQueue?: DailyQueue[];
}

export const updateWidgetData = async (data: WidgetData): Promise<boolean> => {
  const bridge = getWidgetBridge();
  if (bridge?.updateWidgetData) {
    return await bridge.updateWidgetData(data);
  }
  return false;
};

export const setRotationSchedule = async (schedule: {
  enabled: boolean;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}): Promise<boolean> => {
  const bridge = getWidgetBridge();
  if (bridge?.setRotationSchedule) {
    return await bridge.setRotationSchedule(schedule);
  }
  return false;
};

export const getCurrentWidgetData = (): Record<string, string> => {
  const bridge = getWidgetBridge();
  if (bridge?.getCurrentWidgetData) {
    return bridge.getCurrentWidgetData();
  }
  return {};
};
