import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { Text } from '@/components/accessible';
import { BackRow, Button, Notice, PasswordField, Screen } from '@/components/ui';
import { useStore } from '@/data/store';
import { MIN_PASSWORD, passwordProblem } from '@/lib/password';

export default function ChangePasswordScreen() {
  const { mode } = useLocalSearchParams<{ mode?: 'code' }>();
  const { changePassword, prepareNewCode } = useStore();
  const [current, setCurrent] = useState('');
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [wrong, setWrong] = useState(false);
  const [busy, setBusy] = useState(false);
  const newCode = mode === 'code';
  const problem = newCode ? null : passwordProblem(password, repeat);

  const submit = async () => {
    setBusy(true);
    const correct = newCode ? await prepareNewCode(current) : await changePassword(current, password);
    setBusy(false);
    if (!correct) setWrong(true);
    else if (newCode) setTimeout(() => router.replace('/recovery-code'));
    else router.back();
  };

  return (
    <Screen footer={<Button label={newCode ? 'Vytvoriť nový kód' : 'Zmeniť heslo'} disabled={!current || !!problem} busy={busy} onPress={submit} />}>
      <BackRow />
      <Text variant="display" accessibilityRole="header">
        {newCode ? 'Nový záchranný kód' : 'Zmeniť heslo'}
      </Text>
      <PasswordField
        label="Aktuálne heslo"
        value={current}
        error={wrong}
        onChangeText={(value) => {
          setCurrent(value);
          setWrong(false);
        }}
      />
      {wrong ? <Notice tone="error">Heslo nesedí. Skús to znova.</Notice> : null}
      {newCode ? (
        <Notice tone="info">Starý kód prestane platiť.</Notice>
      ) : (
        <>
          <PasswordField label="Nové heslo" placeholder={`Aspoň ${MIN_PASSWORD} znakov`} value={password} onChangeText={setPassword} />
          <PasswordField label="Heslo ešte raz" placeholder="Zopakuj heslo" value={repeat} onChangeText={setRepeat} />
        </>
      )}
    </Screen>
  );
}
