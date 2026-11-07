import { TabList, TabSlot, Tabs, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pressable, Text, View } from '@/components/accessible';
import { Icon, IconName } from '@/components/icons';
import { Colors, Size } from '@/constants/theme';

const tabs: { name: string; href: '/' | '/write' | '/stats' | '/settings'; label: string; icon: IconName }[] = [
  { name: 'index', href: '/', label: 'Sny', icon: 'book' },
  { name: 'write', href: '/write', label: 'Zápis', icon: 'plus' },
  { name: 'stats', href: '/stats', label: 'Štatistiky', icon: 'bars' },
  { name: 'settings', href: '/settings', label: 'Nastavenia', icon: 'sliders' },
];

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs>
      <TabSlot style={{ flex: 1 }} />
      <TabList asChild>
        <View accessibilityLabel="Hlavná navigácia" style={StyleSheet.flatten([styles.bar, { height: Size.tabBar + insets.bottom, paddingBottom: insets.bottom }])}>
          {tabs.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
              <TabButton icon={tab.icon} label={tab.label} />
            </TabTrigger>
          ))}
        </View>
      </TabList>
    </Tabs>
  );
}

function TabButton({ icon, label, isFocused, onPress, onLongPress }: TabTriggerSlotProps & { icon: IconName; label: string }) {
  const color = isFocused ? Colors.accent : Colors.textMuted;
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: !!isFocused }}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tab}>
      <Icon name={icon} color={color} />
      <Text variant={isFocused ? 'tabActive' : 'tab'} color={color} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.line, backgroundColor: Colors.background },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
});
