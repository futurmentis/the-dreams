import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/accessible';
import { Button, PasswordField, Screen } from '@/components/ui';
import { Colors, Space } from '@/constants/theme';
import { useStore } from '@/data/store';
import { MIN_PASSWORD, passwordProblem } from '@/lib/password';

export default function SetupPasswordScreen() {
  const { prepareNew } = useStore();
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [busy, setBusy] = useState(false);
  const problem = passwordProblem(password, repeat);

  const submit = async () => {
    setBusy(true);
    await prepareNew(password);
    setBusy(false);
    // The recovery screen opens once the new state has reached the navigator.
    setTimeout(() => router.push('/recovery-code'));
  };

  return (
    <Screen footer={<Button label="Pokračovať" disabled={!password || !!problem} busy={busy} onPress={submit} />}>
      <View style={styles.top}>
        <Text variant="display" accessibilityRole="header">
          Nastav si heslo
        </Text>
        <Text color={Colors.textMuted}>Heslo zamkne tvoje sny v tomto mobile. Bez neho sa k nim nikto nedostane.</Text>
      </View>
      <PasswordField label="Nové heslo" placeholder={`Aspoň ${MIN_PASSWORD} znakov`} value={password} onChangeText={setPassword} />
      <PasswordField label="Heslo ešte raz" placeholder="Zopakuj heslo" value={repeat} onChangeText={setRepeat} />
      {password && problem ? (
        <Text variant="caption" color={Colors.textMuted}>
          {problem}
        </Text>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { paddingTop: Space.xxxl, gap: Space.m, marginBottom: Space.m },
});
