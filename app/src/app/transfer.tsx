import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/accessible';
import { BackRow, Button, Notice, Screen } from '@/components/ui';
import { Colors, Radius, Space } from '@/constants/theme';
import { pickTextFile, saveTextFile } from '@/data/device';
import { useStore } from '@/data/store';
import { today } from '@/lib/dates';
import { countDreams } from '@/lib/dreams';
import { parseTransfer, serializeTransfer } from '@/lib/transfer';

export default function TransferScreen() {
  const { dreams, setIncoming } = useStore();
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);

  const create = async () => {
    setFailed(null);
    try {
      setDone(await saveTextFile(`the-dreams-presun-${today()}.json`, 'application/json', serializeTransfer(dreams)));
    } catch {
      setFailed('Súbor sa nepodarilo uložiť. Skús vybrať iný priečinok.');
    }
  };

  const pick = async () => {
    setFailed(null);
    try {
      const file = await pickTextFile();
      if (!file) return;
      const incoming = parseTransfer(file.content);
      if (!incoming) {
        setFailed('Tento súbor sa nedá prečítať. Tvoje sny ostali nezmenené.');
        return;
      }
      setIncoming({ name: file.name, dreams: incoming });
      router.push('/import-review');
    } catch {
      setFailed('Tento súbor sa nedá prečítať. Tvoje sny ostali nezmenené.');
    }
  };

  return (
    <Screen footer={<Notice tone="warning">Súbor nie je zamknutý heslom. Po presune ho zmaž a neposielaj ho cudzím.</Notice>}>
      <BackRow />
      <Text variant="display" accessibilityRole="header">
        Presun do nového mobilu
      </Text>
      {failed ? <Notice tone="error">{failed}</Notice> : null}
      <View style={styles.card}>
        <Text variant="uiStrong">Starý mobil</Text>
        <Text color={Colors.textMuted}>{`Vytvor súbor so všetkými snami (${countDreams(dreams.length)}) a preber ho do nového mobilu.`}</Text>
        <Button label="Vytvoriť súbor" disabled={dreams.length === 0} onPress={create} />
        {done ? <Notice tone="done">Súbor je uložený.</Notice> : null}
      </View>
      <View style={styles.card}>
        <Text variant="uiStrong">Nový mobil</Text>
        <Text color={Colors.textMuted}>Vyber súbor a aplikácia ti pred importom ukáže, čo v ňom je.</Text>
        <Button kind="secondary" label="Vybrať súbor" onPress={pick} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { padding: Space.l, gap: 10, borderRadius: Radius.medium, backgroundColor: Colors.surfaceRaised },
});
