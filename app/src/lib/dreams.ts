import { monthOf, shiftMonth, today } from '@/lib/dates';

export type Dream = {
  id: string;
  date: string;
  title: string;
  text: string;
  themes: string[];
};

export type DreamFilter = {
  from: string | null;
  to: string | null;
  themes: string[];
};

export const emptyFilter: DreamFilter = { from: null, to: null, themes: [] };

export function isFilterActive(filter: DreamFilter): boolean {
  return !!filter.from || !!filter.to || filter.themes.length > 0;
}

/** Lowercase without diacritics, so "skola" finds "škola". */
export function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function dreamContains(dream: Dream, word: string): boolean {
  const needle = normalize(word.trim());
  if (!needle) return true;
  return [dream.title, dream.text, ...dream.themes].some((part) => normalize(part).includes(needle));
}

export function filterDreams(dreams: Dream[], word: string, filter: DreamFilter): Dream[] {
  return dreams.filter(
    (dream) =>
      dreamContains(dream, word) &&
      (!filter.from || dream.date >= filter.from) &&
      (!filter.to || dream.date <= filter.to) &&
      filter.themes.every((theme) => dream.themes.includes(theme)),
  );
}

export function sortNewestFirst(dreams: Dream[]): Dream[] {
  return [...dreams].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}

export function groupByMonth(dreams: Dream[]): { month: string; data: Dream[] }[] {
  const groups = new Map<string, Dream[]>();
  for (const dream of dreams) {
    const month = monthOf(dream.date);
    groups.set(month, [...(groups.get(month) ?? []), dream]);
  }
  return [...groups].map(([month, data]) => ({ month, data }));
}

/** Themes from the most used one down. */
export function themeCounts(dreams: Dream[]): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const dream of dreams) {
    for (const theme of dream.themes) counts.set(theme, (counts.get(theme) ?? 0) + 1);
  }
  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'sk'));
}

/** Dream counts for the last 12 months, oldest first. */
export function lastYearCounts(dreams: Dream[]): { month: string; count: number }[] {
  const current = monthOf(today());
  return Array.from({ length: 12 }, (_, i) => {
    const month = shiftMonth(current, i - 11);
    return { month, count: dreams.filter((dream) => monthOf(dream.date) === month).length };
  });
}

export function monthsSpan(first: string, last: string): number {
  const [firstYear, firstMonth] = first.split('-').map(Number);
  const [lastYear, lastMonth] = last.split('-').map(Number);
  return (lastYear - firstYear) * 12 + lastMonth - firstMonth + 1;
}

export function averagePerMonth(dreams: Dream[]): number {
  if (dreams.length === 0) return 0;
  const dates = dreams.map((dream) => dream.date).sort();
  return Math.round(dreams.length / monthsSpan(dates[0], dates[dates.length - 1]));
}

export function isSameDream(a: Pick<Dream, 'date' | 'title' | 'text'>, b: Pick<Dream, 'date' | 'title' | 'text'>): boolean {
  return a.date === b.date && a.title === b.title && a.text === b.text;
}

/** "1 sen", "3 sny", "5 snov" */
export function countDreams(count: number): string {
  if (count === 1) return '1 sen';
  if (count >= 2 && count <= 4) return `${count} sny`;
  return `${count} snov`;
}

/** "k 1 snu", "k 5 snom" */
export function toDreams(count: number): string {
  return count === 1 ? 'k 1 snu' : `k ${count} snom`;
}
