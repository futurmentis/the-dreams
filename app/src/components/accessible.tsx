import {
  Pressable as RNPressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text as RNText,
  TextInput as RNTextInput,
  TextInputProps,
  TextProps as RNTextProps,
  View,
  ViewStyle,
} from 'react-native';

import { Colors, Type } from '@/constants/theme';

export { View };

const MAX_FONT_SCALE = 1.6;

type TextProps = RNTextProps & {
  variant?: keyof typeof Type;
  color?: string;
};

export function Text({ variant = 'ui', color = Colors.text, style, ...props }: TextProps) {
  return <RNText maxFontSizeMultiplier={MAX_FONT_SCALE} {...props} style={[Type[variant], { color }, style]} />;
}

export function TextInput({ style, ...props }: TextInputProps) {
  return (
    <RNTextInput
      maxFontSizeMultiplier={MAX_FONT_SCALE}
      placeholderTextColor={Colors.textMuted}
      cursorColor={Colors.accent}
      selectionColor={Colors.accent}
      {...props}
      style={[Type.ui, { color: Colors.text }, style]}
    />
  );
}

export function Pressable({ style, disabled, ...props }: Omit<PressableProps, 'style'> & { style?: StyleProp<ViewStyle> }) {
  return (
    <RNPressable
      accessibilityRole="button"
      disabled={disabled}
      {...props}
      style={({ pressed }) => StyleSheet.flatten([style, pressed && !disabled ? { opacity: 0.7 } : null])}
    />
  );
}
