// Dreams keep their date as text in the form YYYY-MM-DD, so time zones can never shift a day.

const DAYS = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'];
const MONTHS = ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Október', 'November', 'December'];
const MONTHS_OF = ['januára', 'februára', 'marca', 'apríla', 'mája', 'júna', 'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra'];

export const WEEKDAYS_SHORT = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

export function toISO(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function fromISO(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function today(): string {
  return toISO(new Date());
}

/** "Sobota 7. novembra 2026" */
export function formatLong(iso: string): string {
  const date = fromISO(iso);
  return `${DAYS[date.getDay()]} ${date.getDate()}. ${MONTHS_OF[date.getMonth()]} ${date.getFullYear()}`;
}

/** "Sobota 7. 11." */
export function formatShort(iso: string): string {
  const date = fromISO(iso);
  return `${DAYS[date.getDay()]} ${date.getDate()}. ${date.getMonth() + 1}.`;
}

/** "7. 11. 2026" */
export function formatNumeric(iso: string): string {
  const date = fromISO(iso);
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
}

/** "7. novembra" */
export function formatDayMonth(iso: string): string {
  const date = fromISO(iso);
  return `${date.getDate()}. ${MONTHS_OF[date.getMonth()]}`;
}

/** "November 2026" from "2026-11" */
export function formatMonth(month: string): string {
  const [year, number] = month.split('-').map(Number);
  return `${MONTHS[number - 1]} ${year}`;
}

/** "nov 2026" from "2026-11" */
export function formatMonthShort(month: string): string {
  const [year, number] = month.split('-').map(Number);
  return `${MONTHS[number - 1].slice(0, 3).toLowerCase()} ${year}`;
}

export function monthOf(iso: string): string {
  return iso.slice(0, 7);
}

export function shiftMonth(month: string, by: number): string {
  const [year, number] = month.split('-').map(Number);
  return toISO(new Date(year, number - 1 + by, 1)).slice(0, 7);
}

/** Calendar cells of a month, Monday first; null marks an empty cell before the 1st. */
export function monthCells(month: string): (string | null)[] {
  const [year, number] = month.split('-').map(Number);
  const leading = (new Date(year, number - 1, 1).getDay() + 6) % 7;
  const length = new Date(year, number, 0).getDate();
  const days = Array.from({ length }, (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`);
  return [...Array<null>(leading).fill(null), ...days];
}
