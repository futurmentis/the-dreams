import { shiftMonth, today, monthOf } from '@/lib/dates';
import { Dream } from '@/lib/dreams';

// Invented dreams for the preview only. Real dreams never appear in the code.
const recent: Omit<Dream, 'id'>[] = [
  { date: '2026-11-07', title: 'Vlak cez jazero', text: 'Vlak išiel po hladine a nikto sa nečudoval. Za oknami plávali kone a na stanici čakala moja stará učiteľka s kufrom plným listov.\n\nPovedala, že tento vlak ide len raz. Potom sa voda zdvihla až k oknám a všetko stíchlo.', themes: ['voda', 'cesta'] },
  { date: '2026-11-05', title: 'Škola bez konca', text: 'Chodby boli dlhšie, než si pamätám. Na všetkých dverách bolo napísané to isté číslo.', themes: ['škola'] },
  { date: '2026-11-03', title: 'Let nad Tatrami', text: 'Stačilo sa odraziť a zem ostala dole. Hory boli úplne ticho.', themes: ['lietanie'] },
  { date: '2026-11-01', title: 'Neznámy dom', text: 'V dome pribudla izba, ktorú nikto nepoznal. Svietilo v nej malé okno.', themes: ['dom'] },
];

const older: { title: string; text: string; themes: string[] }[] = [
  { title: 'Povodeň v knižnici', text: 'Knihy plávali po chodbe a voda z nich vymývala písmená.', themes: ['voda'] },
  { title: 'Skúška z ničoho', text: 'V lavici ležal prázdny test a všetci už odchádzali.', themes: ['škola'] },
  { title: 'Most nad oblakmi', text: 'Most viedol do mesta, ktoré poznám len zo sna.', themes: ['cesta'] },
  { title: 'Večera u starej mamy', text: 'Stôl bol prestretý pre celú rodinu a v rádiu hrala známa pieseň.', themes: ['rodina'] },
  { title: 'Krídla z papiera', text: 'Krídla sa skladali samé a vietor ich niesol ponad strechy.', themes: ['lietanie'] },
  { title: 'More v pivnici', text: 'Schody viedli do pivnice a tam začínalo more.', themes: ['voda', 'dom'] },
  { title: 'Autobus bez šoféra', text: 'Autobus zastavoval na miestach, kde kedysi stáli domy.', themes: ['cesta'] },
];

const lastYear = [7, 9, 6, 8, 11, 8, 14, 13, 10, 7, 12];

export const sampleDreams: Dream[] = (() => {
  const current = monthOf(today());
  const dreams: Omit<Dream, 'id'>[] = [...recent];
  let index = 0;
  const addMonth = (month: string, count: number) => {
    for (let i = 0; i < count; i++) {
      const template = older[index % older.length];
      const day = String(((index * 5) % 27) + 1).padStart(2, '0');
      dreams.push({ ...template, date: `${month}-${day}` });
      index++;
    }
  };
  lastYear.forEach((count, i) => addMonth(shiftMonth(current, i - 11), count));
  for (let back = 12; back < 34; back++) addMonth(shiftMonth(current, -back), 5);
  return dreams.map((dream, i) => ({ ...dream, id: `sample-${i}` }));
})();
