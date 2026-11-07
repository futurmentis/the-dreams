import { useState } from 'react';
import { Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Pressable, Text, View } from '@/components/accessible';
import { Button, IconButton } from '@/components/ui';
import { Colors, Size, Space } from '@/constants/theme';
import { useStore } from '@/data/store';
import { formatDayMonth, formatMonth, formatNumeric, monthCells, monthOf, shiftMonth, WEEKDAYS_SHORT } from '@/lib/dates';

/** Full screen month calendar. A dot marks a day that already has a dream. */
export function DatePicker({ value, onPick, onClose }: { value: string; onPick: (date: string) => void; onClose: () => void }) {
  const { dreams } = useStore();
  const [month, setMonth] = useState(monthOf(value));
  const [selected, setSelected] = useState(value);
  const dreamDays = new Set(dreams.map((dream) => dream.date));

  return (
    <Modal visible animationType="fade" onRequestClose={onClose}>
      <SafeAreaView style={styles.screen}>
        <MonthGrid month={month} onMonthChange={setMonth} selected={selected} dreamDays={dreamDays} onSelect={setSelected} />
        <View style={styles.legend}>
          <View style={styles.legendDot} />
          <Text variant="caption" color={Colors.textMuted}>
            V tento deň už je zapísaný sen
          </Text>
        </View>
        <View style={styles.footer}>
          <Button label={`Vybrať ${formatDayMonth(selected)}`} onPress={() => onPick(selected)} />
          <Button kind="secondary" label="Zrušiť" onPress={onClose} />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

/** One month with arrows to the neighbouring months. */
export function MonthGrid({ month, onMonthChange, selected, dreamDays, onSelect }: { month: string; onMonthChange: (month: string) => void; selected: string | null; dreamDays: Set<string>; onSelect: (day: string) => void }) {
  return (
    <>
      <View style={styles.header}>
        <IconButton icon="back" label="Predchádzajúci mesiac" onPress={() => onMonthChange(shiftMonth(month, -1))} />
        <Text variant="dreamTitle" accessibilityRole="header">
          {formatMonth(month)}
        </Text>
        <IconButton icon="forward" label="Nasledujúci mesiac" onPress={() => onMonthChange(shiftMonth(month, 1))} />
      </View>
      <View style={styles.grid}>
        {WEEKDAYS_SHORT.map((day) => (
          <View key={day} style={styles.head}>
            <Text variant="caption" color={Colors.textMuted}>
              {day}
            </Text>
          </View>
        ))}
        {monthCells(month).map((day, index) =>
          day ? (
            <Day key={day} day={day} selected={day === selected} hasDream={dreamDays.has(day)} onPress={() => onSelect(day)} />
          ) : (
            <View key={`empty-${index}`} style={styles.cell} />
          ),
        )}
      </View>
    </>
  );
}

function Day({ day, selected, hasDream, onPress }: { day: string; selected: boolean; hasDream: boolean; onPress: () => void }) {
  return (
    <View style={styles.cell}>
      <Pressable
        accessibilityLabel={`${formatNumeric(day)}${hasDream ? ', zapísaný sen' : ''}`}
        accessibilityState={{ selected }}
        onPress={onPress}
        style={[styles.day, selected && styles.daySelected]}>
        <Text color={selected ? Colors.onAccent : Colors.text}>{Number(day.slice(8))}</Text>
        {hasDream ? <View style={[styles.dot, selected && styles.dotSelected]} /> : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: Size.gutter, paddingBottom: Space.l },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Space.m },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  head: { width: `${100 / 7}%`, height: 28, alignItems: 'center' },
  cell: { width: `${100 / 7}%`, height: 50, alignItems: 'center', justifyContent: 'center' },
  day: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  daySelected: { backgroundColor: Colors.accent },
  dot: { position: 'absolute', bottom: 5, width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.accent },
  dotSelected: { backgroundColor: Colors.onAccent },
  legend: { flexDirection: 'row', alignItems: 'center', gap: Space.s, marginTop: Space.l },
  legendDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.accent },
  footer: { marginTop: 'auto', gap: Space.s },
});
