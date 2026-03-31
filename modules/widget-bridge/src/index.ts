import { requireNativeModule } from 'expo-modules-core';

const WidgetBridge = requireNativeModule('WidgetBridge');

export interface WidgetData {
    affirmation: string;
    mood: string;
    moodEmoji: string;
    textColor: string;
    backgroundColor: string;
    wallpaperId: string;
    dailyQueue?: Array<{
        affirmation: string;
        mood: string;
        time: string;
    }>;
}

export const updateWidgetData = async (data: WidgetData): Promise<boolean> => {
    return await WidgetBridge.updateWidgetData(data);
};

export const setRotationSchedule = async (schedule: {
    enabled: boolean;
    interval: number; // hours
    startTime: string; // HH:mm
    endTime: string; // HH:mm
}): Promise<boolean> => {
    return await WidgetBridge.setRotationSchedule(schedule);
};

export const getCurrentWidgetData = (): Record<string, string> => {
    return WidgetBridge.getCurrentWidgetData();
};

export const APP_GROUP_ID = WidgetBridge.appGroupIdentifier;