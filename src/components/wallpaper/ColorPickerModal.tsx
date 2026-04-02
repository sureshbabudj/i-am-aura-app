import React from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import ColorPicker, { Panel1, HueSlider } from 'reanimated-color-picker';
import { colors } from '@/src/constants/colors';
import { runOnJS } from 'react-native-worklets';

interface ColorPickerModalProps {
  visible: boolean;
  tempHex: string;
  setTempHex: (hex: string) => void;
  onCancel: () => void;
  onConfirm: (hex: string) => void;
}

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  visible,
  tempHex,
  setTempHex,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 items-center justify-center bg-black/60 p-6">
        <View className="w-full max-w-md rounded-[2.5rem] bg-surface-container-lowest p-8 shadow-[0_20px_40px_rgba(83,67,62,0.15)]">
          <View className="mb-8 items-center text-center">
            <Text className="mb-2 font-manrope text-[10px] font-bold uppercase tracking-[0.2rem] text-secondary">
              Spectrum Selection
            </Text>
            <Text className="text-center font-noto-serif-italic text-4xl leading-tight text-on-surface">
              Choose Your{'\n'}
              <Text className="italic text-primary">Aura</Text>
            </Text>
          </View>

          <View className="mb-8 w-full items-center justify-center drop-shadow-lg">
            <ColorPicker
              style={{ width: '100%', gap: 16 }}
              value={tempHex.length === 4 || tempHex.length === 7 ? tempHex : colors.primary}
              onComplete={(color) => {
                'worklet';
                runOnJS(setTempHex)(color.hex);
              }}>
              <Panel1
                style={{
                  height: 180,
                  borderRadius: 24,
                  shadowColor: colors.black,
                  shadowOpacity: 0.1,
                  shadowRadius: 10,
                }}
              />
              <View className="rounded-full bg-surface-container-low p-2">
                <HueSlider style={{ height: 20, borderRadius: 10 }} sliderThickness={24} />
              </View>
            </ColorPicker>
          </View>

          <View className="mb-8 space-y-4">
            <View className="flex-row items-center justify-between px-2 pb-2">
              <Text className="font-manrope text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Hex Intensity
              </Text>
              <Text className="font-manrope text-xs font-bold text-primary">
                {tempHex.toUpperCase()}
              </Text>
            </View>
            <TextInput
              value={tempHex}
              onChangeText={setTempHex}
              placeholder={colors.black}
              className="shadow-inner w-full rounded-2xl bg-surface-container-high px-6 py-4 text-center font-manrope text-lg font-bold tracking-widest text-on-surface"
              autoCapitalize="none"
              maxLength={7}
            />
          </View>

          <View className="flex-row gap-4">
            <Pressable
              onPress={onCancel}
              className="flex-1 items-center justify-center rounded-xl bg-surface-container-low py-4 transition-colors hover:bg-surface-container-high">
              <Text className="font-manrope text-sm font-bold text-on-surface-variant">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => onConfirm(tempHex)}
              className="flex-1 items-center justify-center rounded-xl bg-primary py-4 shadow-xl transition-transform active:scale-95">
              <Text className="font-manrope text-sm font-bold text-white">Set Color</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
