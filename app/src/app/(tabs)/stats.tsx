import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Pressable, Text, View } from '@/components/accessible';
import { Button, Screen, styles as ui } from '@/components/ui';
import { Colors, Radius, Size, Space } from '@/constants/theme';
import { useStore } from '@/data/store';
import { formatMonth, formatMonthShort, fromISO } from '@/lib/dates';
import { averagePerMonth, countDreams, emptyFilter, lastYearCounts, themeCounts } from '@/lib/dreams';

const CHART_HEIGHT = 112;
const SHOWN_THEMES = 8;

export default function StatsScreen() {
  const { dreams, setWord, setFilter } = useStore();
  const [pickedMonth, setPickedMonth] = useState<string | null>(null);

  if (dreams.length === 0) {
    return (
      <SafeAreaView edges={['top']} style={styles.empty}>
        <Text variant="display" accessibilityRole="header" style={styles.emptyHeading}>
          Štatistiky
        </Text>
        <View style={styles.center}>
          <Text variant="statement">Štatistiky sa ukážu po prvom zápise.</Text>
          <Button label="Zapísať sen" onPress={() => router.navigate('/write')} />
        </View>
      </SafeAreaView>
    );
  }

  const months = lastYearCounts(dreams);
  const highest = Math.max(...months.map((item) => item.count), 1);
  const themes = themeCounts(dreams).slice(0, SHOWN_THEMES);
  const firstDate = dreams.map((dream) => dream.date).sort()[0];
  const shownMonth = months.find((item) => item.month === pickedMonth) ?? months[months.length - 1];
  const since = `${formatMonth(firstDate.slice(0, 7)).split(' ')[0].toLowerCase()} ${fromISO(firstDate).getFullYear()}`;

  const openTheme = (theme: string) => {
    setWord('');
    setFilter({ ...emptyFilter, themes: [theme] });
    router.navigate('/');
  };

  return (
    <Screen tabbed>
      <Text variant="display" accessibilityRole="header" style={styles.heading}>
        Štatistiky
      </Text>
      <View style={styles.totals}>
        <View style={ui.fill}>
          <Text variant="number">{dreams.length}</Text>
          <Text variant="caption" color={Colors.textMuted}>
            {dreams.length === 1 ? 'sen' : 'snov'} od {since}
          </Text>
        </View>
        <View style={ui.fill}>
          <Text variant="number">{averagePerMonth(dreams)}</Text>
          <Text variant="caption" color={Colors.textMuted}>
            snov priemerne za mesiac
          </Text>
        </View>
      </View>

      <View style={[ui.divider, styles.section]}>
        <Text variant="uiStrong">Snov za mesiac</Text>
        <Text variant="caption" color={Colors.textMuted}>
          {formatMonth(shownMonth.month)}: {countDreams(shownMonth.count)}
        </Text>
        <View style={styles.chart}>
          {months.map((item, index) => (
            <Pressable
              key={item.month}
              accessibilityLabel={`${formatMonth(item.month)}: ${countDreams(item.count)}`}
              onPress={() => setPickedMonth(item.month)}
              style={styles.barTarget}>
              <View
                style={[
                  styles.bar,
                  { height: Math.max((item.count / highest) * CHART_HEIGHT, 2) },
                  index === months.length - 1 && styles.barOngoing,
                ]}
              />
            </Pressable>
          ))}
        </View>
        <View style={styles.axis}>
          <Text variant="tab" color={Colors.textMuted}>
            {formatMonthShort(months[0].month)}
          </Text>
          <Text variant="tab" color={Colors.textMuted}>
            {formatMonthShort(months[months.length - 1].month)}
          </Text>
        </View>
      </View>

      <View style={[ui.divider, styles.section]}>
        <Text variant="uiStrong">Najčastejšie témy</Text>
        {themes.length === 0 ? (
          <Text color={Colors.textMuted}>Zatiaľ žiadny sen nemá tému.</Text>
        ) : (
          themes.map((theme) => (
            <Pressable
              key={theme.name}
              accessibilityRole="link"
              accessibilityLabel={`${theme.name}: ${countDreams(theme.count)}, zobraziť sny`}
              onPress={() => openTheme(theme.name)}
              style={styles.theme}>
              <Text numberOfLines={1} style={styles.themeName}>
                {theme.name}
              </Text>
              <View style={ui.fill}>
                <View style={[styles.themeBar, { width: `${(theme.count / themes[0].count) * 100}%` }]} />
              </View>
              <Text color={Colors.textMuted} style={styles.themeCount}>
                {theme.count}
              </Text>
            </Pressable>
          ))
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: Size.gutter },
  emptyHeading: { paddingTop: Space.xxl },
  center: { flex: 1, justifyContent: 'center', gap: Space.xl },
  heading: { paddingTop: Space.m },
  totals: { flexDirection: 'row', gap: Space.l, marginBottom: Space.s },
  section: { paddingTop: Space.l, gap: Space.xs, marginTop: Space.s },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: CHART_HEIGHT, marginTop: Space.m },
  barTarget: { flex: 1, height: CHART_HEIGHT, justifyContent: 'flex-end', paddingHorizontal: 3 },
  bar: { backgroundColor: Colors.accent, borderTopLeftRadius: Radius.small / 2, borderTopRightRadius: Radius.small / 2 },
  barOngoing: { opacity: 0.45 },
  axis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Space.xs },
  theme: { flexDirection: 'row', alignItems: 'center', gap: Space.s, minHeight: 44 },
  themeName: { width: 84, fontSize: 14 },
  themeBar: { height: 8, backgroundColor: Colors.accent, borderTopRightRadius: 4, borderBottomRightRadius: 4 },
  themeCount: { width: 32, textAlign: 'right', fontSize: 14 },
});
