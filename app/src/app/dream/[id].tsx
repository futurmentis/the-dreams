import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

import { Text, View } from '@/components/accessible';
import { BackRow, ConfirmDialog, IconButton, Screen, Tag, styles as ui } from '@/components/ui';
import { Colors, Space } from '@/constants/theme';
import { useStore } from '@/data/store';
import { formatLong } from '@/lib/dates';

export default function DreamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dreams, deleteDream } = useStore();
  const [confirming, setConfirming] = useState(false);
  const dream = dreams.find((item) => item.id === id);

  if (!dream) {
    return (
      <Screen>
        <BackRow />
        <Text variant="statement">Tento sen už tu nie je.</Text>
      </Screen>
    );
  }

  const title = dream.title || 'Bez názvu';
  return (
    <Screen>
      <BackRow
        right={
          <View style={styles.actions}>
            <IconButton icon="pencil" label="Upraviť sen" onPress={() => router.push({ pathname: '/edit/[id]', params: { id: dream.id } })} />
            <IconButton icon="trash" label="Zmazať sen" color={Colors.danger} onPress={() => setConfirming(true)} />
          </View>
        }
      />
      <View>
        <Text variant="caption" color={Colors.textMuted}>
          {formatLong(dream.date)}
        </Text>
        <Text variant="display" accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
      </View>
      <Text variant="dreamBody" selectable>
        {dream.text}
      </Text>
      {dream.themes.length > 0 ? (
        <View style={[ui.chips, styles.themes]}>
          {dream.themes.map((theme) => (
            <Tag key={theme} label={theme} />
          ))}
        </View>
      ) : null}
      {confirming ? (
        <ConfirmDialog
          title="Zmazať sen?"
          message={`Sen „${title}“ sa natrvalo odstráni a nedá sa vrátiť.`}
          confirm="Zmazať sen"
          cancel="Nechať sen"
          onCancel={() => setConfirming(false)}
          onConfirm={async () => {
            setConfirming(false);
            try {
              await deleteDream(dream.id);
              router.back();
            } catch {
              Alert.alert('Sen sa nepodarilo zmazať', 'Skús to znova.');
            }
          }}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', marginRight: -Space.m },
  title: { marginTop: Space.xs },
  themes: { marginTop: Space.s },
});
