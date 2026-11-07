import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/accessible';
import { BackRow, Button, Field, Notice, Screen, styles as ui } from '@/components/ui';
import { Colors, Space } from '@/constants/theme';
import { useStore } from '@/data/store';
import { formatNumeric } from '@/lib/dates';
import { countDreams, dreamContains, toDreams } from '@/lib/dreams';

const SHOWN = 3;

export default function BulkThemesScreen() {
  const { dreams, addThemeTo } = useStore();
  const [word, setWord] = useState('');
  const [theme, setTheme] = useState('');
  const [added, setAdded] = useState<string | null>(null);

  const cleanTheme = theme.trim().toLowerCase();
  const matches = word.trim() ? dreams.filter((dream) => dreamContains(dream, word)) : [];
  const missing = matches.filter((dream) => !dream.themes.includes(cleanTheme));

  return (
    <Screen
      footer={
        <Button
          label={missing.length > 0 ? `Pridať tému ${toDreams(missing.length)}` : 'Pridať tému'}
          disabled={!cleanTheme || missing.length === 0}
          onPress={async () => {
            await addThemeTo(missing.map((dream) => dream.id), cleanTheme);
            setAdded(`Téma „${cleanTheme}“ pribudla ${toDreams(missing.length)}.`);
            setWord('');
            setTheme('');
          }}
        />
      }>
      <BackRow />
      <Text variant="display" accessibilityRole="header">
        Hromadné témy
      </Text>
      <Text color={Colors.textMuted}>Nájdi sny podľa slova a pridaj im tému. Slovo stačí napísať bez koncovky, napríklad „vod“ nájde vodu aj vode.</Text>
      <Field
        label="Slovo v sne"
        placeholder="napríklad vod"
        autoCapitalize="none"
        value={word}
        onChangeText={(value) => {
          setWord(value);
          setAdded(null);
        }}
      />
      <Field label="Téma" placeholder="napríklad voda" autoCapitalize="none" value={theme} onChangeText={setTheme} />
      {added ? <Notice tone="done">{added}</Notice> : null}
      {word.trim() ? (
        matches.length > 0 ? (
          <View style={styles.results}>
            <Text variant="caption" color={Colors.textMuted}>
              {`Nájdené: ${countDreams(matches.length)}`}
            </Text>
            {matches.slice(0, SHOWN).map((dream) => (
              <View key={dream.id} style={[ui.divider, styles.row]}>
                <Text variant="caption" color={Colors.textMuted}>
                  {formatNumeric(dream.date)}
                </Text>
                <Text variant="dreamTitle" numberOfLines={1}>
                  {dream.title || 'Bez názvu'}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text color={Colors.textMuted}>Takéto slovo sa v snoch nenašlo.</Text>
        )
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  results: { gap: Space.s, marginTop: Space.xs },
  row: { paddingTop: Space.s },
});
