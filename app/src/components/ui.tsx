import { router } from 'expo-router';
import { ReactNode } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Pressable, Text, TextInput, View } from '@/components/accessible';
import { Icon, IconName } from '@/components/icons';
import { Colors, Radius, Size, Space } from '@/constants/theme';

/** Full screen with safe areas. `footer` stays pinned to the bottom, above the keyboard. */
export function Screen({ children, footer, tabbed }: { children: ReactNode; footer?: ReactNode; tabbed?: boolean }) {
  return (
    <SafeAreaView edges={tabbed ? ['top'] : ['top', 'bottom']} style={styles.screen}>
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.fill} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function IconButton({ icon, label, onPress, color, filled }: { icon: IconName; label: string; onPress: () => void; color?: string; filled?: boolean }) {
  return (
    <Pressable accessibilityLabel={label} onPress={onPress} style={[styles.iconButton, filled && styles.iconButtonFilled]}>
      <Icon name={icon} color={filled ? Colors.onAccent : color} />
    </Pressable>
  );
}

export function BackRow({ right }: { right?: ReactNode }) {
  return (
    <View style={styles.backRow}>
      <View style={styles.backButton}>
        <IconButton icon="back" label="Späť" onPress={() => router.back()} />
      </View>
      {right}
    </View>
  );
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  kind?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  busy?: boolean;
};

export function Button({ label, onPress, kind = 'primary', disabled, busy }: ButtonProps) {
  const background = { primary: Colors.accent, secondary: Colors.surface, danger: Colors.danger }[kind];
  const foreground = { primary: Colors.onAccent, secondary: Colors.text, danger: Colors.onDanger }[kind];
  const off = disabled || busy;
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!off, busy: !!busy }}
      disabled={off}
      onPress={onPress}
      style={[styles.button, { backgroundColor: disabled ? Colors.surface : background }]}>
      {busy ? <ActivityIndicator color={foreground} /> : null}
      <Text variant="uiStrong" color={disabled ? Colors.textMuted : foreground}>
        {label}
      </Text>
    </Pressable>
  );
}

export function TextLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.textLink}>
      <Text color={Colors.textMuted} style={styles.underline}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Field({ label, error, ...input }: TextInputProps & { label: string; error?: boolean }) {
  return (
    <View style={styles.field}>
      <Text variant="caption" color={Colors.textMuted}>
        {label}
      </Text>
      <TextInput accessibilityLabel={label} {...input} style={[styles.input, error && styles.inputError]} />
    </View>
  );
}

export function PasswordField(props: TextInputProps & { label: string; error?: boolean }) {
  return <Field secureTextEntry autoCapitalize="none" autoCorrect={false} autoComplete="off" {...props} />;
}

export function Chip({ label, selected, dashed, onPress }: { label: string; selected?: boolean; dashed?: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected, dashed && styles.chipDashed]}>
      {selected ? <Icon name="check" size={16} color={Colors.onAccent} /> : null}
      <Text color={selected ? Colors.onAccent : Colors.text} style={styles.chipText}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Tag({ label }: { label: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <Text variant="eyebrow" color={Colors.accent} accessibilityRole="header">
      {children}
    </Text>
  );
}

export function Notice({ tone, children }: { tone: 'warning' | 'error' | 'info' | 'done'; children: ReactNode }) {
  const tones = {
    warning: { icon: 'warning', color: Colors.danger },
    error: { icon: 'error', color: Colors.danger },
    info: { icon: 'info', color: Colors.textMuted },
    done: { icon: 'check', color: Colors.accent },
  } as const;
  const { icon, color } = tones[tone];
  return (
    <View accessibilityLiveRegion="polite" style={[styles.notice, { borderColor: color }]}>
      <Icon name={icon} size={18} color={color} />
      <Text style={styles.fill}>{children}</Text>
    </View>
  );
}

/** Confirmation for an action that cannot be undone. */
export function ConfirmDialog({ title, message, confirm, cancel, onConfirm, onCancel }: { title: string; message: string; confirm: string; cancel: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <Modal transparent visible animationType="fade" onRequestClose={onCancel}>
      <View style={styles.scrim}>
        <View accessibilityViewIsModal style={styles.dialog}>
          <Text variant="statement" accessibilityRole="header">
            {title}
          </Text>
          <Text>{message}</Text>
          <View style={styles.dialogButtons}>
            <Button kind="danger" label={confirm} onPress={onConfirm} />
            <Button kind="secondary" label={cancel} onPress={onCancel} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export const styles = StyleSheet.create({
  fill: { flex: 1 },
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { flexGrow: 1, paddingHorizontal: Size.gutter, paddingTop: Space.m, paddingBottom: Space.xxl, gap: Space.m },
  footer: { paddingHorizontal: Size.gutter, paddingTop: Space.s, paddingBottom: Space.l, gap: Space.s },
  iconButton: { width: Size.touchMin, height: Size.touchMin, borderRadius: Radius.medium, alignItems: 'center', justifyContent: 'center' },
  iconButtonFilled: { backgroundColor: Colors.accent },
  backRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: Size.touchMin },
  backButton: { marginLeft: -Space.m },
  button: { minHeight: Size.button, paddingHorizontal: Space.l, borderRadius: Radius.medium, flexDirection: 'row', gap: Space.s, alignItems: 'center', justifyContent: 'center' },
  textLink: { minHeight: Size.touchMin, alignItems: 'center', justifyContent: 'center' },
  underline: { textDecorationLine: 'underline' },
  field: { gap: Space.s },
  input: { minHeight: Size.button, borderWidth: 1, borderColor: Colors.line, borderRadius: Radius.medium, backgroundColor: Colors.surface, paddingHorizontal: Space.l },
  inputError: { borderColor: Colors.danger },
  chip: { minHeight: 40, paddingHorizontal: 14, borderRadius: Radius.pill, backgroundColor: Colors.surfaceRaised, flexDirection: 'row', gap: Space.xs, alignItems: 'center', justifyContent: 'center' },
  chipSelected: { backgroundColor: Colors.accent },
  chipDashed: { backgroundColor: 'transparent', borderWidth: 1, borderStyle: 'dashed', borderColor: Colors.textMuted },
  chipText: { fontSize: 14 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.s },
  tag: { minHeight: 36, paddingHorizontal: Space.m, borderRadius: Radius.pill, backgroundColor: Colors.surfaceRaised, justifyContent: 'center' },
  notice: { flexDirection: 'row', gap: 10, borderWidth: 1, borderRadius: Radius.medium, paddingHorizontal: 14, paddingVertical: Space.m },
  scrim: { flex: 1, backgroundColor: Colors.scrim, justifyContent: 'center', padding: Size.gutter },
  dialog: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.large, padding: Size.gutter, gap: Space.m },
  dialogButtons: { gap: Space.s, marginTop: Space.s },
  divider: { borderTopWidth: 1, borderTopColor: Colors.line },
});
