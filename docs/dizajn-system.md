# Dizajnový systém: Nočná kniha

Hodnoty sú v `design/tokens.json`. Tieto dva súbory musia ostať v zhode.

Vybrané používateľom 7. 11. 2026. Aplikácia pôsobí ako súkromná kniha čítaná v noci: tichá, tmavá a bez ozdôb.

## Farby

| Token | Hodnota | Použitie |
|---|---|---|
| `background` | `#12141F` | Podklad obrazoviek |
| `surface` | `#1C1F2E` | Polia, karty, spodný panel |
| `surfaceRaised` | `#262A3C` | Nevybrané témy, dialóg |
| `line` | `#2E3145` | Oddeľovače |
| `text` | `#ECE6D8` | Hlavný text |
| `textMuted` | `#A9A595` | Dátumy, ukážky, popisy |
| `accent` | `#E2BD7A` | Hlavná akcia, vybraná položka, stĺpce grafu |
| `onAccent` | `#1B1608` | Text na zlatom podklade |
| `danger` | `#EE9C8A` | Zmazanie, chyba, upozornenie na nezašifrovaný súbor |

Zlatá sa používa striedmo: jedna hlavná akcia na obrazovku a vybrané položky.

## Písmo

- **Literata:** všetko, čo patrí snu (názov, text, ukážka) a veľké nadpisy.
- **DM Sans:** ovládanie, dátumy a popisy.

Obe písma sa pridajú priamo do aplikácie, aby fungovali bez internetu. Obe majú slovenskú diakritiku.

## Komponenty

- **Spodný panel:** Sny, Zápis, Štatistiky, Nastavenia. Vybraná položka je zlatá a tučnejšia, nespolieha sa len na farbu.
- **Hlavné tlačidlo:** výška 52 px, zlaté, jedno na obrazovku.
- **Druhotné tlačidlo:** výška 52 px, podklad `surface`.
- **Pole:** výška 52 px, podklad `surface`, popis nad poľom.
- **Téma:** výška 36 px v zázname, vybraná je zlatá. Na vybranej je aj znak fajky.
- **Riadok snu:** dátum, názov, dve riadky ukážky, oddeľovač.
- **Upozornenie:** text s ikonou v rámčeku, nikdy iba farba.
- **Dialóg:** pre nevratnú akciu, stmavený podklad, dve tlačidlá.

## Grafy

Grafy používajú jeden odtieň (`accent`). Prebiehajúci mesiac je tlmený, lebo ešte nie je celý. Ťuknutie na stĺpec ukáže presný počet. Čísla sú vždy v texte, nikdy nie v akcentovej farbe.

## Prístupnosť

- Kontrast textu je aspoň 4,5 : 1.
- Dotykové ciele majú aspoň 48 px.
- Ikonové tlačidlá majú popis pre čítačku obrazovky.
- Aplikácia rešpektuje veľké písmo v Androide a zapnuté obmedzenie pohybu.

## Texty

Po slovensky a bez rodu. Krátke vety, žiadne hodnotenie snov ani rady.
