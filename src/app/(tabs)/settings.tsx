import React from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Info, Moon, Bell, Shield, Trash2, Heart, ExternalLink } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const renderSettingItem = (icon: any, label: string, value?: string, onPress?: () => void) => (
        <Pressable 
            onPress={onPress}
            className="flex-row items-center justify-between p-4 bg-surface-container-low mb-2 rounded-2xl border border-outline-variant active:bg-surface-container"
        >
            <View className="flex-row items-center">
                <View className="w-10 h-10 bg-surface-container rounded-xl items-center justify-center mr-4">
                    {React.createElement(icon, { size: 20, color: "#53433e" })}
                </View>
                <Text className="text-on-surface font-manrope font-medium">{label}</Text>
            </View>
            <View className="flex-row items-center">
                {value && <Text className="text-on-surface-variant font-manrope mr-2">{value}</Text>}
                <ChevronLeft size={18} color="#53433e" style={{ transform: [{ rotate: '180deg' }] }} />
            </View>
        </Pressable>
    );

    return (
        <View className="flex-1 bg-surface">
            <StatusBar style="dark" />
            <View 
                style={{ paddingTop: insets.top }}
                className="flex-1"
            >
                <View className="px-6 py-4 flex-row items-center">
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 bg-surface-container rounded-full items-center justify-center mr-4"
                    >
                        <ChevronLeft size={24} color="#53433e" />
                    </Pressable>
                    <Text className="text-on-surface text-2xl font-noto-serif">Settings</Text>
                </View>

                <ScrollView 
                    className="flex-1 px-6 pt-4"
                    contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) }}
                >
                    <Text className="text-on-surface-variant font-manrope text-xs uppercase tracking-widest font-bold mb-4 ml-2">Preferences</Text>
                    
                    {renderSettingItem(Bell, "Daily Reminders", "Off")}
                    {renderSettingItem(Moon, "App Theme", "Dark")}
                    
                    <Text className="text-on-surface-variant font-manrope text-xs uppercase tracking-widest font-bold mt-8 mb-4 ml-2">About & Legal</Text>
                    
                    {renderSettingItem(Info, "How it works", undefined, () => router.push('/onboarding'))}
                    {renderSettingItem(Shield, "Privacy Policy")}
                    {renderSettingItem(ExternalLink, "Attributions")}
                    
                    <Text className="text-on-surface-variant font-manrope text-xs uppercase tracking-widest font-bold mt-8 mb-4 ml-2">Support</Text>
                    {renderSettingItem(Heart, "Rate the App")}
                    
                    <Text className="text-on-surface-variant font-manrope text-xs uppercase tracking-widest font-bold mt-8 mb-4 ml-2">Danger Zone</Text>
                    <Pressable 
                        onPress={() => Alert.alert('Reset Data', 'Are you sure? This will delete all your saved wallpapers.', [{ text: 'Cancel' }, { text: 'Reset', style: 'destructive' }])}
                        className="flex-row items-center p-4 bg-surface-container-low rounded-2xl border border-error/20 active:bg-surface-container"
                    >
                        <View className="w-10 h-10 bg-error/10 rounded-xl items-center justify-center mr-4">
                            <Trash2 size={20} color="#ba1a1a" />
                        </View>
                        <Text className="text-error font-manrope font-medium">Delete All Data</Text>
                    </Pressable>

                    <View className="items-center py-10">
                        <Text className="text-on-surface-variant font-manrope text-xs uppercase tracking-tighter">I Am - Mood Affirmations</Text>
                        <Text className="text-surface-variant font-manrope text-[10px] mt-1">Version 1.0.0 (Build 1)</Text>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}
