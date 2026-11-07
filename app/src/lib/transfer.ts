import { formatLong, formatMonth } from '@/lib/dates';
import type { Dream } from '@/lib/dreams';

export type IncomingDream = Omit<Dream, 'id'>;

const APP = 'the-dreams';
const VERSION = 1;

export function serializeTransfer(dreams: Dream[]): string {
  const clean = dreams.map(({ date, title, text, themes }) => ({ date, title, text, themes }));
  return JSON.stringify({ app: APP, version: VERSION, dreams: clean }, null, 2);
}

function isDream(value: any): value is IncomingDream {
  return (
    !!value &&
    typeof value.date === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(value.date) &&
    typeof value.title === 'string' &&
    typeof value.text === 'string' &&
    Array.isArray(value.themes) &&
    value.themes.every((theme: unknown) => typeof theme === 'string')
  );
}

/** The dreams of a transfer file, or null when the file is not a valid one. */
export function parseTransfer(content: string): IncomingDream[] | null {
  try {
    const file = JSON.parse(content);
    if (file?.app !== APP || file.version !== VERSION || !Array.isArray(file.dreams) || !file.dreams.every(isDream)) return null;
    return file.dreams.map(({ date, title, text, themes }: IncomingDream) => ({ date, title, text, themes }));
  } catch {
    return null;
  }
}

/** Oldest dream first, so the file reads like a diary. `month` is "2026-11", or null for all of them. */
export function buildMarkdown(dreams: Dream[], month: string | null): string {
  const heading = month ? `# the Dreams: ${formatMonth(month)}` : '# the Dreams: všetky sny';
  const sections = [...dreams]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((dream) => {
      const themes = dream.themes.length > 0 ? `\n\nTémy: ${dream.themes.join(', ')}` : '';
      return `## ${dream.title || 'Bez názvu'}\n\n${formatLong(dream.date)}\n\n${dream.text}${themes}`;
    });
  return `${[heading, ...sections].join('\n\n')}\n`;
}
