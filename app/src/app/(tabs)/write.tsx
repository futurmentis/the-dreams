import { router } from 'expo-router';
import { Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DreamForm } from '@/components/dream-form';
import { Colors } from '@/constants/theme';
import { useStore } from '@/data/store';

export default function WriteScreen() {
  const { draft, setDraft, clearDraft, addDream } = useStore();
  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <DreamForm
        value={draft}
        onChange={setDraft}
        onSave={async () => {
          try {
            const id = await addDream(draft);
            clearDraft();
            router.navigate('/');
            router.push({ pathname: '/dream/[id]', params: { id } });
          } catch {
            Alert.alert('Sen sa nepodarilo uložiť', 'Text ostal v zápise, skús to znova.');
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
});
