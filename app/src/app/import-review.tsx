import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/accessible';
import { BackRow, Button, Notice, Screen, styles as ui } from '@/components/ui';
import { Colors, Space } from '@/constants/theme';
import { useStore } from '@/data/store';
import { formatMonthShort, monthOf } from '@/lib/dates';
import { countDreams, isSameDream } from '@/lib/dreams';

export default function ImportReviewScreen() {
  const { dreams, incoming, setIncoming, importDreams } = useStore();
  const [busy, setBusy] = useState(false);
  const [imported, setImported] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  if (imported !== null) {
    return (
      <Screen footer={<Button label="Zobraziť sny" onPress={() => router.dismissTo('/')} />}>
        <Text variant="display" accessibilityRole="header">
          Import je hotový
        </Text>
        <Notice tone="done">{`Pribudlo: ${countDreams(imported)}.`}</Notice>
      </Screen>
    );
  }

  if (!incoming) {
    return (
      <Screen>
        <BackRow />
        <Text variant="statement">Vyber súbor na import v obrazovke Presun.</Text>
      </Screen>
    );
  }

  const fresh = incoming.dreams.filter((item) => !dreams.some((existing) => isSameDream(existing, item)));
  const dates = incoming.dreams.map((item) => item.date).sort();

  const submit = async () => {
    setBusy(true);
    setFailed(false);
    try {
      setImported(await importDreams(fresh));
      setIncoming(null);
    } catch {
      setFailed(true);
    }
    setBusy(false);
  };

  return (
    <Screen
      footer={
        <Button
          label={busy ? 'Importujem' : fresh.length > 0 ? `Importovať: ${countDreams(fresh.length)}` : 'Nie je čo importovať'}
          disabled={fresh.length === 0}
          busy={busy}
          onPress={submit}
        />
      }>
      <BackRow />
      <Text variant="display" accessibilityRole="header">
        Kontrola importu
      </Text>
      <Text variant="caption" color={Colors.textMuted}>
        {incoming.name}
      </Text>
      {failed ? <Notice tone="error">Import sa nepodaril. Tvoje sny ostali nezmenené.</Notice> : null}
      <View style={ui.divider}>
        <Line label="Nové sny" value={fresh.length} />
      </View>
      <View style={ui.divider}>
        <Line label="Už sú v aplikácii" value={incoming.dreams.length - fresh.length} />
      </View>
      {dates.length > 0 ? (
        <View style={[ui.divider, styles.period]}>
          <Text style={styles.label}>Obdobie</Text>
          <Text color={Colors.textMuted}>{`${formatMonthShort(monthOf(dates[0]))} až ${formatMonthShort(monthOf(dates[dates.length - 1]))}`}</Text>
        </View>
      ) : null}
      <Text color={Colors.textMuted}>Rovnaké sny sa preskočia a sny v aplikácii sa neprepíšu.</Text>
    </Screen>
  );
}

function Line({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.line}>
      <Text style={styles.label}>{label}</Text>
      <Text variant="display">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  line: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Space.m },
  period: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Space.l, gap: Space.m, borderBottomWidth: 1, borderBottomColor: Colors.line },
  label: { fontSize: 16 },
});
