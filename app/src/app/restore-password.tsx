import { router } from 'expo-router';
import { useState } from 'react';

import { Text } from '@/components/accessible';
import { BackRow, Button, Field, Notice, PasswordField, Screen } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { useStore } from '@/data/store';
import { MIN_PASSWORD, passwordProblem } from '@/lib/password';

export default function RestorePasswordScreen() {
  const { prepareRestore } = useStore();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [wrong, setWrong] = useState(false);
  const [busy, setBusy] = useState(false);
  const problem = passwordProblem(password, repeat);

  const submit = async () => {
    setBusy(true);
    const correct = await prepareRestore(code, password);
    setBusy(false);
    if (correct) setTimeout(() => router.push('/recovery-code'));
    else setWrong(true);
  };

  return (
    <Screen footer={<Button label="Obnoviť prístup" disabled={!code.trim() || !!problem} busy={busy} onPress={submit} />}>
      <BackRow />
      <Text variant="display" accessibilityRole="header">
        Obnova hesla
      </Text>
      <Text color={Colors.textMuted}>Zadaj záchranný kód z papiera a nastav si nové heslo. Tvoje sny ostanú zachované a dostaneš nový kód.</Text>
      <Field
        label="Záchranný kód"
        placeholder="XXXX XXXX XXXX XXXX XXXX XXXX"
        autoCapitalize="characters"
        autoCorrect={false}
        value={code}
        error={wrong}
        onChangeText={(value) => {
          setCode(value);
          setWrong(false);
        }}
      />
      {wrong ? <Notice tone="error">Kód nesedí. Skontroluj ho a skús to znova.</Notice> : null}
      <PasswordField label="Nové heslo" placeholder={`Aspoň ${MIN_PASSWORD} znakov`} value={password} onChangeText={setPassword} />
      <PasswordField label="Heslo ešte raz" placeholder="Zopakuj heslo" value={repeat} onChangeText={setRepeat} />
    </Screen>
  );
}
