import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Switch } from 'react-native';

import { Text, View } from '@/components/accessible';
import { Button, Notice, Screen } from '@/components/ui';
import { Colors, Radius, Space } from '@/constants/theme';
import { useStore } from '@/data/store';

export default function RecoveryCodeScreen() {
  const { prepared, unlocked, commitPrepared } = useStore();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!prepared) return null;
  const parts = prepared.code.split(' ');

  const finish = async () => {
    setBusy(true);
    const wasUnlocked = unlocked;
    try {
      await commitPrepared();
    } catch {
      setBusy(false);
      Alert.alert('Nepodarilo sa to dokončiť', 'Skús to znova.');
      return;
    }
    if (wasUnlocked) router.back();
    else setTimeout(() => router.replace('/'));
  };

  return (
    <Screen
      footer={
        <>
          <View style={styles.confirm}>
            <Switch
              accessibilityLabel="Kód mám bezpečne odložený"
              value={saved}
              onValueChange={setSaved}
              trackColor={{ false: Colors.surfaceRaised, true: Colors.accent }}
              thumbColor={Colors.text}
            />
            <Text style={styles.confirmText}>Kód mám bezpečne odložený</Text>
          </View>
          <Button label="Hotovo" disabled={!saved} busy={busy} onPress={finish} />
        </>
      }>
      <View style={styles.top}>
        <Text variant="display" accessibilityRole="header">
          Záchranný kód
        </Text>
        <Text color={Colors.textMuted}>Ak zabudneš heslo, tento kód je jediná cesta k tvojim snom. Odpíš si ho na papier a schovaj ho mimo mobilu.</Text>
      </View>
      <View style={styles.code} accessible accessibilityLabel={`Záchranný kód: ${parts.join(' ')}`}>
        {parts.map((part, index) => (
          <Text key={index} variant="uiStrong" style={styles.part}>
            {part}
          </Text>
        ))}
      </View>
      <Notice tone="info">Kód sa zobrazí iba raz. Nový si vieš vytvoriť v Nastaveniach.</Notice>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { paddingTop: Space.xxxl, gap: Space.m, marginBottom: Space.xs },
  code: { flexDirection: 'row', flexWrap: 'wrap', rowGap: Space.s, padding: Space.l, borderRadius: Radius.medium, backgroundColor: Colors.surface },
  part: { width: '33.33%', textAlign: 'center', letterSpacing: 1, fontSize: 17 },
  confirm: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: Space.m },
  confirmText: { flex: 1 },
});
