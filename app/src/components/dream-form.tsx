import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { Pressable, Text, TextInput, View } from '@/components/accessible';
import { DatePicker } from '@/components/calendar';
import { Icon } from '@/components/icons';
import { Button, Chip, styles as ui } from '@/components/ui';
import { Colors, Radius, Size, Space, Type } from '@/constants/theme';
import { DreamDraft, useStore } from '@/data/store';
import { formatLong } from '@/lib/dates';
import { themeCounts } from '@/lib/dreams';

/** Writing and editing share this form. The value lives with the caller, so a draft survives leaving the tab. */
export function DreamForm({ value, onChange, onSave }: { value: DreamDraft; onChange: (value: DreamDraft) => void; onSave: () => void | Promise<void> }) {
  const { dreams } = useStore();
  const [picking, setPicking] = useState(false);
  const [addingTheme, setAddingTheme] = useState(false);
  const [newTheme, setNewTheme] = useState('');

  const used = themeCounts(dreams).map((theme) => theme.name);
  const themes = [...used, ...value.themes.filter((theme) => !used.includes(theme))];
  const canSave = value.text.trim().length > 0 || value.title.trim().length > 0;

  const toggleTheme = (theme: string) =>
    onChange({
      ...value,
      themes: value.themes.includes(theme) ? value.themes.filter((item) => item !== theme) : [...value.themes, theme],
    });

  const confirmNewTheme = () => {
    const theme = newTheme.trim().toLowerCase();
    if (theme && !value.themes.includes(theme)) onChange({ ...value, themes: [...value.themes, theme] });
    setNewTheme('');
    setAddingTheme(false);
  };

  return (
    <KeyboardAvoidingView style={ui.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={ui.fill} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable accessibilityLabel={`Zmeniť dátum snu, teraz ${formatLong(value.date)}`} onPress={() => setPicking(true)} style={styles.date}>
          <Icon name="calendar" size={20} color={Colors.accent} />
          <Text>{formatLong(value.date)}</Text>
        </Pressable>
        <TextInput
          accessibilityLabel="Názov snu"
          placeholder="Názov snu"
          value={value.title}
          onChangeText={(title) => onChange({ ...value, title })}
          style={styles.title}
        />
        <TextInput
          accessibilityLabel="Text snu"
          placeholder="Čo sa ti snívalo?"
          multiline
          textAlignVertical="top"
          value={value.text}
          onChangeText={(text) => onChange({ ...value, text })}
          style={styles.body}
        />
        <Text variant="caption" color={Colors.textMuted}>
          Témy
        </Text>
        <View style={ui.chips}>
          {themes.map((theme) => (
            <Chip key={theme} label={theme} selected={value.themes.includes(theme)} onPress={() => toggleTheme(theme)} />
          ))}
          {addingTheme ? null : <Chip label="+ nová téma" dashed onPress={() => setAddingTheme(true)} />}
        </View>
        {addingTheme ? (
          <TextInput
            autoFocus
            accessibilityLabel="Nová téma"
            placeholder="Napíš tému"
            returnKeyType="done"
            value={newTheme}
            onChangeText={setNewTheme}
            onSubmitEditing={confirmNewTheme}
            onBlur={confirmNewTheme}
            style={styles.themeInput}
          />
        ) : null}
      </ScrollView>
      <View style={styles.footer}>
        <Button label="Uložiť sen" disabled={!canSave} onPress={onSave} />
      </View>
      {picking ? (
        <DatePicker
          value={value.date}
          onClose={() => setPicking(false)}
          onPick={(date) => {
            onChange({ ...value, date });
            setPicking(false);
          }}
        />
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: Size.gutter, paddingTop: Space.xs, gap: Space.s },
  date: { minHeight: Size.touchMin, flexDirection: 'row', alignItems: 'center', gap: Space.s },
  title: { ...Type.display, fontSize: 25, lineHeight: 32, paddingVertical: Space.s, borderBottomWidth: 1, borderBottomColor: Colors.line },
  body: { ...Type.dreamBody, flexGrow: 1, minHeight: 180, paddingVertical: Space.s },
  themeInput: { minHeight: Size.touchMin, borderRadius: Radius.medium, backgroundColor: Colors.surface, paddingHorizontal: Space.l },
  footer: { paddingHorizontal: Size.gutter, paddingVertical: Space.m },
});
