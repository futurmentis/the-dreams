# the Dreams: koncept produktu

Stav: schválené používateľom 7. 11. 2026. Toto je zdroj pravdy pre funkcie a štruktúru.

## 1. Vízia

Súkromný denník snov v jednom mobile, kam sen rýchlo zapíšem a kde ho neskôr nájdem.

## 2. Pre koho

Len pre autora aplikácie, na jeho vlastnom Android mobile. Inštalácia cez APK, bez Google Play.

## 3. Osobnosť

Tichá a pokojná. Aplikácia nekomentuje, nevykladá sny, nič nepripomína a nič nehodnotí.

## 4. Štruktúra

| Sekcia | Jedna úloha |
|---|---|
| **Sny** | Nájsť a prečítať si zapísaný sen. |
| **Zápis** | Zapísať alebo upraviť sen. |
| **Štatistiky** | Ukázať, ako často a o čom snívam. |
| **Nastavenia** | Export, import, hromadné témy, heslo a záchranný kód. |
| **Zámok** | Pustiť do aplikácie len toho, kto pozná heslo. |

## 5. Funkcie

**Zápis:** názov, text, dátum a témy. Pole na nič iné nie je. Za jednu noc môže byť aj viac snov. Dátum sa dá vybrať aj spätne.

**Kalendár snov:** Sny sa dajú prepnúť zo zoznamu na mesačný kalendár. Bodka znamená sen. Pod kalendárom sú sny vybraného dňa, bez výberu dňa sny celého mesiaca. Hľadanie a filter platia aj tu.

**Filtrovanie:** podľa dátumu aj kľúčového slova, oboje naraz. Kľúčové slovo hľadá v názve, v texte aj v témach.

**Témy:** vyberám ich alebo dopisujem, aplikácia ponúka už použité. Importované sny sa dajú označiť hromadne podľa slova.

**Štatistiky:** počet snov v čase, najčastejšie témy, ako často snívam.

**Hromadné témy:** sú v Nastaveniach, patria k správe snov.

**Export do MD:** za jeden mesiac alebo za celé obdobie.

**Presun do nového mobilu:** jeden súbor na export a jeden krok na import. Súbor nie je zašifrovaný (rozhodnutie používateľa).

**Import starých snov:** jednorazovo zo súboru Word. Skript `scripts/word-na-sny.mjs` ho v počítači prevedie na prenosový súbor, ktorý sa importuje cez Presun. Skutočný obsah snov sa pri vývoji nečíta.

**Zámok:** pri otvorení sa zadáva celé heslo. Po návrate po aspoň 1 minúte mimo aplikácie sa zamkne. Pri zabudnutom hesle pomôže záchranný kód, ktorý sa zobrazí pri prvom spustení. Odtlačok prsta sa nepoužíva.

## 6. Rozsah MVP

Všetko v časti 5. Aplikácia je iba po slovensky.

Nie je v MVP: výklad snov, AI, pripomienky, fotky, hlasový zápis, synchronizácia, účty.

## 7. Nepriestrelné pravidlá

1. Sny nikdy neopustia mobil, pokiaľ ich používateľ sám neexportuje.
2. Aplikácia nemá povolenie na internet, server, účet ani analytiku.
3. Sny sú v mobile zašifrované a bez hesla alebo záchranného kódu sa k nim nikto nedostane.
4. Aplikácia sny nevykladá, nehodnotí a nedáva žiadne rady.
5. Žiadna akcia nesmie zmazať sny bez potvrdenia.
6. Import nikdy nesmie potichu prepísať existujúce sny.
7. Ukážkové dáta sú vždy vymyslené.

## 8. Úspech

- Zápis snu po prebudení trvá menej ako minútu.
- Staré sny sú v aplikácii a dajú sa nájsť do pár sekúnd.
- Presun do iného mobilu prebehne bez straty jediného snu.

## 9. AI

Aplikácia AI nepoužíva.

## 10. Otvorené rozhodnutia

