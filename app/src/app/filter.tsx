import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Pressable, Text, View } from '@/components/accessible';
import { DatePicker } from '@/components/calendar';
import { Button, Chip, Eyebrow, IconButton, Screen, TextLink, styles as ui } from '@/components/ui';
import { Colors, Radius, Size, Space } from '@/constants/theme';
import { useStore } from '@/data/store';
import { formatNumeric, monthCells, monthOf, today } from '@/lib/dates';
import { countDreams, emptyFilter, filterDreams, themeCounts } from '@/lib/dreams';

export default function FilterScreen() {
  const { dreams, word, filter, setFilter } = useStore();
  const [picking, setPicking] = useState<'from' | 'to' | null>(null);

  const now = today();
  const thisMonth = monthOf(now);
  const ranges = [
    { label: 'Celé obdobie', from: null, to: null },
    { label: 'Tento mesiac', from: `${thisMonth}-01`, to: monthCells(thisMonth).at(-1) ?? now },
    { label: 'Tento rok', from: `${now.slice(0, 4)}-01-01`, to: `${now.slice(0, 4)}-12-31` },
  ];
  const count = filterDreams(dreams, word, filter).length;

  const toggleTheme = (theme: string) =>
    setFilter({
      ...filter,
      themes: filter.themes.includes(theme) ? filter.themes.filter((item) => item !== theme) : [...filter.themes, theme],
    });

  return (
    <Screen
      footer={
        <>
          <TextLink label="Zrušiť filter" onPress={() => setFilter(emptyFilter)} />
          <Button label={`Zobraziť ${countDreams(count)}`} onPress={() => router.back()} />
        </>
      }>
      <View style={styles.header}>
        <Text variant="display" accessibilityRole="header">
          Filter
        </Text>
        <View style={styles.close}>
          <IconButton icon="close" label="Zavrieť filter" onPress={() => router.back()} />
        </View>
      </View>

      <View style={styles.section}>
        <Eyebrow>Dátum</Eyebrow>
        <View style={ui.chips}>
          {ranges.map((range) => (
            <Chip
              key={range.label}
              label={range.label}
              selected={filter.from === range.from && filter.to === range.to}
              onPress={() => setFilter({ ...filter, from: range.from, to: range.to })}
            />
          ))}
        </View>
        <View style={styles.dates}>
          <DateButton label="Od" value={filter.from} onPress={() => setPicking('from')} />
          <DateButton label="Do" value={filter.to} onPress={() => setPicking('to')} />
        </View>
      </View>

      <View style={styles.section}>
        <Eyebrow>Témy</Eyebrow>
        <View style={ui.chips}>
          {themeCounts(dreams).map((theme) => (
            <Chip key={theme.name} label={theme.name} selected={filter.themes.includes(theme.name)} onPress={() => toggleTheme(theme.name)} />
          ))}
        </View>
      </View>

      {picking ? (
        <DatePicker
          value={(picking === 'from' ? filter.from : filter.to) ?? now}
          onClose={() => setPicking(null)}
          onPick={(date) => {
            setFilter({ ...filter, [picking]: date });
            setPicking(null);
          }}
        />
      ) : null}
    </Screen>
  );
}

function DateButton({ label, value, onPress }: { label: string; value: string | null; onPress: () => void }) {
  return (
    <Pressable accessibilityLabel={`${label}: ${value ? formatNumeric(value) : 'vybrať dátum'}`} onPress={onPress} style={styles.dateButton}>
      <Text variant="caption" color={Colors.textMuted}>
        {label}
      </Text>
      <Text>{value ? formatNumeric(value) : 'Vybrať dátum'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: Size.touchMin },
  close: { marginRight: -Space.m },
  section: { gap: Space.m, marginTop: Space.m },
  dates: { flexDirection: 'row', gap: Space.s },
  dateButton: { flex: 1, minHeight: 64, justifyContent: 'center', gap: 2, paddingHorizontal: 14, borderRadius: Radius.medium, backgroundColor: Colors.surface },
});
