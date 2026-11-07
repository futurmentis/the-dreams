import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/accessible';
import { Icon } from '@/components/icons';
import { Button, Notice, PasswordField, Screen, TextLink } from '@/components/ui';
import { Colors, Space } from '@/constants/theme';
import { useStore } from '@/data/store';

export default function LockScreen() {
  const { unlock } = useStore();
  const [password, setPassword] = useState('');
  const [wrong, setWrong] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const submit = async () => {
    if (!password || busy) return;
    setBusy(true);
    setFailed(false);
    let correct = false;
    try {
      correct = await unlock(password);
    } catch {
      setBusy(false);
      setFailed(true);
      return;
    }
    setBusy(false);
    if (correct) {
      router.replace('/');
    } else {
      setWrong(true);
      setPassword('');
    }
  };

  return (
    <Screen>
      <View style={styles.center}>
        <Icon name="moon" size={40} color={Colors.accent} />
        <Text variant="hero" accessibilityRole="header" style={styles.name}>
          the Dreams
        </Text>
        <PasswordField
          label="Heslo"
          placeholder="Zadaj heslo"
          value={password}
          error={wrong}
          onChangeText={(value) => {
            setPassword(value);
            setWrong(false);
          }}
          onSubmitEditing={submit}
          returnKeyType="go"
        />
        {wrong ? <Notice tone="error">Heslo nesedí. Skús to znova.</Notice> : null}
        {failed ? <Notice tone="error">Sny sa nepodarilo otvoriť. Zatvor aplikáciu a skús to znova.</Notice> : null}
        <Button label="Odomknúť" disabled={!password} busy={busy} onPress={submit} />
        <TextLink label="Zabudnuté heslo" onPress={() => router.push('/restore-password')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', gap: Space.m },
  name: { marginTop: Space.s, marginBottom: Space.l },
});
