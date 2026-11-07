import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text, View } from '@/components/accessible';
import { DreamForm } from '@/components/dream-form';
import { BackRow } from '@/components/ui';
import { Colors, Size } from '@/constants/theme';
import { DreamDraft, useStore } from '@/data/store';

export default function EditDreamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dreams, updateDream } = useStore();
  const dream = dreams.find((item) => item.id === id);
  const [value, setValue] = useState<DreamDraft | null>(dream ?? null);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <BackRow />
      </View>
      {value ? (
        <DreamForm
          value={value}
          onChange={setValue}
          onSave={async () => {
            try {
              await updateDream(id, value);
              router.back();
            } catch {
              Alert.alert('Sen sa nepodarilo uložiť', 'Text ostal v zápise, skús to znova.');
            }
          }}
        />
      ) : (
        <Text variant="statement" style={styles.header}>
          Tento sen už tu nie je.
        </Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Size.gutter },
});
