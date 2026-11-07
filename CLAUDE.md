# the Dreams – projekt

Súkromný denník snov pre jeden Android mobil. Zápis snu, filtrovanie, štatistiky tém, export a presun do nového mobilu, všetko offline a za heslom.

**Hlavná myšlienka:** Sen rýchlo zapíšem a neskôr ho nájdem, a nikto iný sa k nemu nedostane.

Projekt je **uzavretý (2026-11-07)**: APK beží v mobile používateľa so skutočnými snami a kalendárom. Pri pokračovaní začni sekciou Stav. Technológia: Expo (React Native), zašifrovaná SQLite databáza v mobile, bez servera a bez povolenia na internet. Inú technológiu nevyberaj bez súhlasu.

## Kde čo je

| Cesta | Obsah |
|---|---|
| `docs/koncept-produktu.md` | Pôvodný koncept. **Zdroj pravdy** pre funkcie a štruktúru. |
| `design/smery-varianty.html` | Tri dizajnové smery, vybraný je A. |
| `design/tokens.json` | Farby, písmo, rozostupy. |
| `docs/dizajn-system.md` | Komponenty a pravidlá dizajnu. |
| `docs/obrazovky.md` | Zoznam obrazoviek a prepojení. |
| `docs/kontrola-grafiky.md`, `docs/revizia-logiky.md` | Kontrola návrhov pred kódom. |
| `design/platno/project/` | Zdroj návrhov obrazoviek. |
| `app/` | Kód aplikácie (Expo SDK 58, expo-router). Práca s mobilom je v `app/src/data/device.ts`, webový náhľad s ukážkovými snami v `device.web.ts`. |
| `scripts/word-na-sny.mjs` | Jednorazový prevod Wordu na prenosový súbor. Vypisuje len počty. |
| `output/*.json` | Skutočné sny, nikdy nesmú do gitu ani do chatu. |
| `design/vyrob-ikony.mjs` | Vyrobí ikonu a splash do `app/assets/images/`. |
| `backup/` | Zálohy pred väčšími zmenami. |
| `output/` | Hotové výstupy. |
| GitHub | Účet `futurmentis`. Do gitu nikdy nepatria sny, súbory z `output/` ani APK. |

**Živý návrh:** https://claude.ai/artifact/PSR2JyENvAVHpCe26Efcxu

## Jazyk

Aplikácia je po slovensky. Texty v rozhraní sú bez rodu.

## Nepriestrelné princípy produktu

Majú prednosť pred akoukoľvek funkciou. Ak by návrh alebo kód išiel proti nim, zastav sa a opýtaj sa.

1. Sny nikdy neopustia mobil, pokiaľ ich používateľ sám neexportuje.
2. Aplikácia nemá povolenie na internet, server, účet ani analytiku.
3. Sny sú v mobile zašifrované a bez hesla alebo záchranného kódu sa k nim nikto nedostane.
4. Aplikácia sny nevykladá, nehodnotí a nedáva žiadne rady.
5. Žiadna akcia nesmie zmazať sny bez potvrdenia.
6. Import nikdy nesmie potichu prepísať existujúce sny.
7. Ukážkové dáta sú vždy vymyslené.

Skutočné sny používateľa sa nečítajú ani neposielajú cez Claude. Pri vývoji sa používajú iba vymyslené dáta.

## Štruktúra aplikácie

Každá sekcia má jednu úlohu, nepridávaj do nej veci, ktoré patria inam.

- **Sny** – nájsť a prečítať si zapísaný sen
- **Zápis** – zapísať alebo upraviť sen
- **Štatistiky** – ukázať, ako často a o čom snívam
- **Nastavenia** – export, import, hromadné témy, heslo a záchranný kód
- **Zámok** – pustiť do aplikácie len toho, kto pozná heslo

## Ako pracovať na projekte

- Postupuj podľa skillu `tvorba-aplikacie`.
- Pred zmenou funkcie si prečítaj príslušnú časť konceptu. Ak niečo chýba, navrhni riešenie a opýtaj sa.
- Pri zmene dizajnu aktualizuj `design/tokens.json` aj `docs/dizajn-system.md`.
- Rozsah MVP je v koncepte. Funkcie na neskôr nerob, kým o ne nikto nepožiada.

## Aktuálne zameranie

Nič, projekt je uzavretý. Ďalšia práca len na požiadanie používateľa.

## Stav

- **2026-11-07:** Založený projekt, zapísaný koncept, pripravené tri dizajnové smery v `design/smery-varianty.html`.
- **Spustenie návrhov:** `node design/nahlad-server.mjs . 19010`, potom `http://localhost:19010/design/smery-varianty.html`
- **2026-11-07:** Vybraný smer A, Nočná kniha. Hotové tokeny, dizajnový systém, zoznam a 21 návrhov obrazoviek, kontrola bez pretečenia.
- **2026-11-07:** Návrhy schválené. Hotové rozhranie všetkých obrazoviek v `app/`, preklikané vo webovom náhľade. Heslo, ukladanie, šifrovanie, MD súbor a výber súborov sú zatiaľ len ukážka. Neoverené na skutočnom mobile.
- **Spustenie náhľadu:** v priečinku `app` príkaz `npx.cmd expo start --web --port 19006`. Web používa ukážkové sny a heslo si nastavíš pri každom načítaní.
- **Testy logiky:** v priečinku `app` príkaz `node tests/logic.test.mjs`.
- **2026-11-07:** Starý denník vo Worde prevedený na prenosový súbor v `output/`, mimo gitu. Pridané SQLCipher, kľúč zamknutý heslom aj kódom (scrypt, XChaCha20), automatické zamknutie a skutočné súbory. Obrazovka Import z Excelu a vývojové prepínače zrušené.
- **2026-11-07:** APK overené v mobile vrátane importu.
- **2026-11-07:** V Snoch pribudol kalendár snov, prepína sa ikonou vedľa nadpisu. Overené vo webovom náhľade.
- **Do mobilu:** APK cez Wi-Fi zdieľa `node scripts/zdielaj-subory.mjs <subor>`.
- **2026-11-07:** Kalendár aj obnova prístupu overené v mobile. Projekt uzavretý.
- **Pri aktualizácii APK:** inštalovať cez starú verziu (Aktualizovať), nikdy neodinštalovať, inak sa zmažú sny. APK sa podpisuje testovacím kľúčom z `app/android`, priečinok `android` nie je v gite, preto sa po `expo prebuild` na inom PC aktualizácia nemusí dať nainštalovať.
- **Nápady na neskôr (zatiaľ nechcené):** pripomienka zálohy, skrytie obsahu v zozname aplikácií, priebežné ukladanie zápisu, správa tém, podobné sny, obľúbené sny, opakujúce sa slová. AI: odporúčaný export do MD a Claude mimo aplikácie, AI cez internet v aplikácii by porušila pravidlá 1 a 2.
- **Pri zabudnutom kóde:** kód ignoruje len medzery a veľkosť písmen. Možné vylepšenie: tolerovať pomlčky a zámeny O/0/I/1.

## Rozhodnuté

- **2026-11-07:** Staré sny prišli zo súboru Word, nie z Excelu. Jednorazový prevod v počítači je jednoduchší ako import Wordu v mobile. Pole s náladou sa prevezme ako téma.
- **2026-11-07:** Aplikácia sa zamkne po návrate po aspoň 1 minúte mimo nej. Rozpísaný zápis ostáva v pamäti.
- **2026-11-07:** Dizajnový smer Nočná kniha. Tmavý podklad je šetrný po prebudení a Literata sa dobre číta. Kalendár z Ranného zošita je pri výbere dátumu.
- **2026-11-07:** Android, inštalácia cez APK bez Google Play. Používateľ má Android a aplikácia je len pre neho.
- **2026-11-07:** Expo a zašifrovaná SQLite bez servera. Rovnaký overený základ ako Tuli, dáta ostávajú v mobile.
- **2026-11-07:** Odomknutie iba heslom, záchranný kód pri zabudnutí. Odtlačok prsta sa nepoužíva, tak si to používateľ vybral.
- **2026-11-07:** Presunový súbor nie je zašifrovaný, je to vedomé rozhodnutie používateľa po vysvetlení rizika.
- **2026-11-07:** Polia snu sú názov, text, dátum a témy, nič navyše.
- **2026-11-07:** Témy sa zadávajú ručne s návrhmi už použitých a dajú sa hromadne doplniť podľa slova.

## Otvorené rozhodnutia

- Odstrániť nepoužité balíky zo šablóny.
