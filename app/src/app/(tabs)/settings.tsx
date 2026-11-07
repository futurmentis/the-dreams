import { Href, router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Pressable, Text, View } from '@/components/accessible';
import { Icon } from '@/components/icons';
import { Eyebrow, Screen, styles as ui } from '@/components/ui';
import { Colors, Size, Space } from '@/constants/theme';
import { useStore } from '@/data/store';

export default function SettingsScreen() {
  const { lock } = useStore();
  return (
    <Screen tabbed>
      <Text variant="display" accessibilityRole="header" style={styles.heading}>
        Nastavenia
      </Text>
      <Group title="Moje sny">
        <Row label="Export do MD" href="/export-md" />
        <Row label="Presun do nového mobilu" href="/transfer" />
        <Row label="Hromadné témy" href="/bulk-themes" />
      </Group>
      <Group title="Súkromie">
        <Row label="Zmeniť heslo" href="/change-password" />
        <Row label="Nový záchranný kód" href={{ pathname: '/change-password', params: { mode: 'code' } }} />
        <ActionRow label="Zamknúť teraz" onPress={lock} />
      </Group>
    </Screen>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Eyebrow>{title}</Eyebrow>
      <View style={styles.rows}>{children}</View>
    </View>
  );
}

function Row({ label, href }: { label: string; href: Href }) {
  return <ActionRow label={label} onPress={() => router.push(href)} chevron />;
}

function ActionRow({ label, onPress, chevron }: { label: string; onPress: () => void; chevron?: boolean }) {
  return (
    <Pressable onPress={onPress} style={[ui.divider, styles.row]}>
      <Text style={styles.label}>{label}</Text>
      {chevron ? <Icon name="forward" size={20} color={Colors.textMuted} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heading: { paddingTop: Space.m },
  group: { marginTop: Space.m, gap: Space.s },
  rows: {},
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Size.gutter },
  label: { flex: 1, fontSize: 16 },
});
