# Obrazovky

Spodný panel: **Sny**, **Zápis**, **Štatistiky**, **Nastavenia**. Obrazovky zámku panel nemajú.

Návrhy sú v `design/platno/project/`, kód v `app/src/app/`. Kalendár je spoločný komponent, Zápis a úprava snu zdieľajú jeden formulár.

## Prístup

| # | Obrazovka | Súbor | Obsah | Vedie na |
|---|---|---|---|---|
| 1 | Zámok | `Main.dc.html` | Pole na heslo, Odomknúť, Zabudnuté heslo | 5, 4 |
| 2 | Zámok, chyba | `Zamok-chyba.dc.html` | Stav po nesprávnom hesle | 5, 4 |
| 3 | Nové heslo | `Heslo-nove.dc.html` | Pri prvom spustení alebo zmene hesla | 3a |
| 3a | Záchranný kód | `Zachranny-kod.dc.html` | Kód a potvrdenie, že je odložený | 6 |
| 4 | Obnova hesla | `Obnova-hesla.dc.html` | Záchranný kód a nové heslo | 3a, 5 |

## Sny

| # | Obrazovka | Súbor | Obsah | Vedie na |
|---|---|---|---|---|
| 5 | Sny | `Sny.dc.html` | Hľadanie, filter, sny po mesiacoch alebo kalendár snov | 7, 9, 11, 13, 15 |
| 6 | Sny, prázdne | `Sny-prazdne.dc.html` | Prvé spustenie | 11, 17 |
| 7 | Filter | `Filter.dc.html` | Rozsah dátumov a témy | 5, 8 |
| 8 | Bez výsledkov | `Bez-vysledkov.dc.html` | Aktívny filter, zrušenie filtra | 5 |
| 9 | Detail snu | `Detail.dc.html` | Celý sen, upraviť, zmazať | 11, 10, 5 |
| 10 | Zmazať sen | `Zmazat.dc.html` | Potvrdenie nevratnej akcie | 5, 9 |

## Zápis

| # | Obrazovka | Súbor | Obsah | Vedie na |
|---|---|---|---|---|
| 11 | Zápis | `Zapis.dc.html` | Dátum, názov, text, témy, uloženie | 12, 9 |
| 12 | Výber dátumu | `Datum.dc.html` | Kalendár s bodkami pri dňoch so snom | 11 |

## Štatistiky

| # | Obrazovka | Súbor | Obsah | Vedie na |
|---|---|---|---|---|
| 13 | Štatistiky | `Statistiky.dc.html` | Počet snov, snov za mesiac, témy | 5 s filtrom podľa témy |
| 14 | Štatistiky, prázdne | `Statistiky-prazdne.dc.html` | Keď ešte nie sú sny | 11 |

## Nastavenia

| # | Obrazovka | Súbor | Obsah | Vedie na |
|---|---|---|---|---|
| 15 | Nastavenia | `Nastavenia.dc.html` | Rozcestník | 16, 17, 20, 3 |
| 16 | Export do MD | `Export-md.dc.html` | Mesiac alebo celé obdobie | systémové uloženie súboru |
| 17 | Presun do mobilu | `Presun.dc.html` | Vytvoriť súbor alebo ho importovať | 18 |
| 18 | Kontrola importu | `Import-nahlad.dc.html` | Počet nových a rovnakých snov | 5 |
| 20 | Hromadné témy | `Hromadne-temy.dc.html` | Pridanie témy snom podľa slova | 15 |

Správanie Androidu: zápis po opustení aplikácie ostane rozpísaný, aj keď sa zamkne. Uloženie a výber súboru rieši systémové okno Androidu.

Zmena hesla a nový záchranný kód najprv vyžiadajú aktuálne heslo vo vlastnej obrazovke `change-password`.

Obrazovka Import z Excelu (19) bola zrušená 7. 11. 2026, staré sny sa prevedú jednorazovo v počítači.
