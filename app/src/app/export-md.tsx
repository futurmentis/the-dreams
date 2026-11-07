import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Pressable, Text, View } from '@/components/accessible';
import { BackRow, Button, IconButton, Notice, Screen } from '@/components/ui';
import { Colors, Radius, Size, Space } from '@/constants/theme';
import { saveTextFile } from '@/data/device';
import { useStore } from '@/data/store';
import { formatMonth, monthOf } from '@/lib/dates';
import { countDreams } from '@/lib/dreams';
import { buildMarkdown } from '@/lib/transfer';

export default function ExportScreen() {
  const { dreams } = useStore();
  const months = [...new Set(dreams.map((dream) => monthOf(dream.date)))];
  const [whole, setWhole] = useState(false);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);

  if (dreams.length === 0) {
    return (
      <Screen>
        <BackRow />
        <Text variant="display" accessibilityRole="header">
          Export do MD
        </Text>
        <Text variant="statement" style={styles.empty}>
          Zatiaľ nie je čo exportovať.
        </Text>
      </Screen>
    );
  }

  const month = months[index];
  const count = whole ? dreams.length : dreams.filter((dream) => monthOf(dream.date) === month).length;
  const fileName = whole ? 'the-dreams-vsetko.md' : `the-dreams-${month}.md`;
  const change = (update: () => void) => {
    update();
    setDone(false);
  };
  const create = async () => {
    setFailed(false);
    const chosen = whole ? dreams : dreams.filter((dream) => monthOf(dream.date) === month);
    try {
      setDone(await saveTextFile(fileName, 'text/markdown', buildMarkdown(chosen, whole ? null : month)));
    } catch {
      setFailed(true);
    }
  };

  return (
    <Screen
      footer={
        <>
          {failed ? <Notice tone="error">Súbor sa nepodarilo uložiť. Skús vybrať iný priečinok.</Notice> : null}
          {done ? <Notice tone="done">Súbor je uložený.</Notice> : <Notice tone="warning">Súbor nie je zamknutý heslom. Prečíta ho každý, kto ho otvorí.</Notice>}
          <Button label="Vytvoriť súbor" onPress={create} />
        </>
      }>
      <BackRow />
      <Text variant="display" accessibilityRole="header">
        Export do MD
      </Text>
      <Text variant="caption" color={Colors.textMuted}>
        Obdobie
      </Text>
      <Choice label="Jeden mesiac" selected={!whole} onPress={() => change(() => setWhole(false))} />
      <Choice label="Celé obdobie" selected={whole} onPress={() => change(() => setWhole(true))} />
      {whole ? null : (
        <View style={styles.month}>
          <IconButton icon="back" label="Staršie" onPress={() => change(() => setIndex(Math.min(index + 1, months.length - 1)))} />
          <Text variant="uiStrong">{formatMonth(month)}</Text>
          <IconButton icon="forward" label="Novšie" onPress={() => change(() => setIndex(Math.max(index - 1, 0)))} />
        </View>
      )}
      <Text>{`V súbore: ${countDreams(count)}`}</Text>
      <Text variant="caption" color={Colors.textMuted}>
        {fileName}
      </Text>
    </Screen>
  );
}

function Choice({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ selected }} onPress={onPress} style={[styles.choice, selected && styles.choiceSelected]}>
      <View style={[styles.radio, selected && styles.radioSelected]} />
      <Text style={styles.choiceText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  empty: { marginTop: Space.xxl },
  choice: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: Space.m, paddingHorizontal: Space.l, borderWidth: 1, borderColor: Colors.line, borderRadius: Radius.medium, backgroundColor: Colors.surface },
  choiceSelected: { borderColor: Colors.accent },
  choiceText: { fontSize: 16 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.textMuted },
  radioSelected: { borderColor: Colors.accent, borderWidth: 6 },
  month: { minHeight: Size.button, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: Radius.medium, backgroundColor: Colors.surface },
});
