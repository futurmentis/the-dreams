import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, SectionList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Pressable, Text, TextInput, View } from '@/components/accessible';
import { MonthGrid } from '@/components/calendar';
import { Button, Eyebrow, IconButton, styles as ui } from '@/components/ui';
import { Colors, Radius, Size, Space } from '@/constants/theme';
import { useStore } from '@/data/store';
import { formatMonth, formatNumeric, formatShort, monthOf } from '@/lib/dates';
import { Dream, DreamFilter, emptyFilter, filterDreams, groupByMonth, isFilterActive } from '@/lib/dreams';

function describeFilter(filter: DreamFilter): string {
  const parts: string[] = [];
  if (filter.from || filter.to) {
    parts.push([filter.from ? `od ${formatNumeric(filter.from)}` : '', filter.to ? `do ${formatNumeric(filter.to)}` : ''].filter(Boolean).join(' '));
  }
  return [...parts, ...filter.themes].join(' · ');
}

export default function DreamsScreen() {
  const { dreams, word, setWord, filter, setFilter } = useStore();
  const [showCalendar, setShowCalendar] = useState(false);
  const filtered = isFilterActive(filter);
  const visible = filterDreams(dreams, word, filter);

  if (dreams.length === 0) {
    return (
      <SafeAreaView edges={['top']} style={styles.screen}>
        <Text variant="display" accessibilityRole="header" style={styles.heading}>
          Sny
        </Text>
        <View style={styles.center}>
          <Text variant="statement">Zatiaľ tu nie je žiadny sen.</Text>
          <Button label="Zapísať prvý sen" onPress={() => router.navigate('/write')} />
          <Button kind="secondary" label="Importovať staré sny" onPress={() => router.push('/transfer')} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <View style={styles.headingRow}>
        <Text variant="display" accessibilityRole="header">
          Sny
        </Text>
        <IconButton
          icon={showCalendar ? 'list' : 'calendar'}
          label={showCalendar ? 'Zobraziť zoznam snov' : 'Zobraziť kalendár snov'}
          onPress={() => setShowCalendar(!showCalendar)}
        />
      </View>
      <View style={styles.search}>
        <TextInput
          accessibilityLabel="Hľadať kľúčové slovo"
          placeholder="Hľadať slovo"
          value={word}
          onChangeText={setWord}
          returnKeyType="search"
          style={styles.input}
        />
        <IconButton
          icon="filter"
          label={filtered ? 'Filter je zapnutý, upraviť' : 'Filter podľa dátumu a témy'}
          filled={filtered}
          onPress={() => router.push('/filter')}
        />
      </View>
      {filtered ? (
        <Text variant="caption" color={Colors.textMuted} style={styles.summary}>
          {describeFilter(filter)}
        </Text>
      ) : null}
      {visible.length === 0 ? (
        <View style={styles.center}>
          <Text variant="statement">Takýto sen sa nenašiel.</Text>
          <Button
            kind="secondary"
            label="Zrušiť filter"
            onPress={() => {
              setWord('');
              setFilter(emptyFilter);
            }}
          />
        </View>
      ) : showCalendar ? (
        <DreamCalendar dreams={visible} />
      ) : (
        <SectionList
          sections={groupByMonth(visible)}
          keyExtractor={(dream) => dream.id}
          keyboardShouldPersistTaps="handled"
          stickySectionHeadersEnabled={false}
          contentContainerStyle={styles.list}
          renderSectionHeader={({ section }) => (
            <View style={styles.month}>
              <Eyebrow>{formatMonth(section.month)}</Eyebrow>
            </View>
          )}
          renderItem={({ item }) => <DreamRow dream={item} />}
        />
      )}
    </SafeAreaView>
  );
}

/** Dreams by day. Below the month are the dreams of the chosen day, or of the whole month when no day is chosen. */
function DreamCalendar({ dreams }: { dreams: Dream[] }) {
  const [month, setMonth] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const shownMonth = month ?? monthOf(dreams[0].date);
  const shown = dreams.filter((dream) => (day ? dream.date === day : monthOf(dream.date) === shownMonth));

  return (
    <ScrollView contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled">
      <MonthGrid
        month={shownMonth}
        selected={day}
        dreamDays={new Set(dreams.map((dream) => dream.date))}
        onMonthChange={(next) => {
          setMonth(next);
          setDay(null);
        }}
        onSelect={(next) => setDay(next === day ? null : next)}
      />
      <View style={styles.month}>
        <Eyebrow>{day ? formatShort(day) : formatMonth(shownMonth)}</Eyebrow>
      </View>
      {shown.length === 0 ? (
        <Text color={Colors.textMuted}>{day ? 'V tento deň nie je zapísaný sen.' : 'V tomto mesiaci nie je zapísaný sen.'}</Text>
      ) : (
        shown.map((dream) => <DreamRow key={dream.id} dream={dream} />)
      )}
    </ScrollView>
  );
}

function DreamRow({ dream }: { dream: Dream }) {
  return (
    <Pressable accessibilityRole="link" onPress={() => router.push({ pathname: '/dream/[id]', params: { id: dream.id } })} style={[ui.divider, styles.row]}>
      <Text variant="caption" color={Colors.textMuted}>
        {formatShort(dream.date)}
      </Text>
      <Text variant="dreamTitle" style={styles.title}>
        {dream.title || 'Bez názvu'}
      </Text>
      {dream.text ? (
        <Text variant="excerpt" color={Colors.textMuted} numberOfLines={2}>
          {dream.text}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  heading: { paddingHorizontal: Size.gutter, paddingTop: Space.xxl, marginBottom: Space.l },
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: Size.gutter, paddingRight: Space.s, paddingTop: Space.m, marginBottom: Space.s },
  search: { flexDirection: 'row', gap: Space.s, paddingHorizontal: Size.gutter, marginBottom: Space.s },
  input: { flex: 1, minHeight: Size.touchMin, borderRadius: Radius.medium, backgroundColor: Colors.surface, paddingHorizontal: 14 },
  summary: { paddingHorizontal: Size.gutter, marginBottom: Space.xs },
  list: { paddingHorizontal: Size.gutter, paddingBottom: Space.xl },
  month: { paddingTop: Space.l, paddingBottom: 10 },
  row: { paddingTop: 14, paddingBottom: 15 },
  title: { marginTop: 2, marginBottom: Space.xs },
  center: { flex: 1, justifyContent: 'center', paddingHorizontal: Size.gutter, gap: Space.m },
});
