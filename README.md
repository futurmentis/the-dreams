# the Dreams

**Súkromný denník snov pre Android, v slovenskom jazyku.**

*A private, offline dream journal for Android. The app is in Slovak only.*

the Dreams je jednoduchá slovenská aplikácia na zapisovanie snov. Sen zapíšeš hneď po prebudení, neskôr ho nájdeš podľa dátumu, slova alebo témy a v štatistikách vidíš, ako často a o čom snívaš. Celá aplikácia aj jej texty sú po slovensky.

Aplikácia funguje úplne bez internetu. Nemá účet, server ani analytiku a sny nikdy neopustia mobil, pokiaľ ich sám neexportuješ.

## Čo aplikácia vie

- **Zápis snu:** názov, text, dátum a témy. Za jednu noc môže byť aj viac snov.
- **Sny:** zoznam po mesiacoch alebo kalendár, kde bodka znamená sen.
- **Hľadanie a filter:** podľa slova (aj bez diakritiky), dátumu a tém.
- **Štatistiky:** počet snov, priemer za mesiac, graf za posledný rok a najčastejšie témy.
- **Hromadné témy:** pridanie témy všetkým snom, v ktorých sa nachádza zvolené slovo.
- **Export do MD:** sny za jeden mesiac alebo za celé obdobie v čitateľnom súbore.
- **Presun do nového mobilu:** jeden súbor na export a jeden krok na import. Rovnaké sny sa preskočia, nič sa neprepíše.
- **Zámok:** heslo a záchranný kód pre prípad, že heslo zabudneš. Po minúte mimo aplikácie sa zamkne.

## Súkromie a bezpečnosť

- Sny sú v mobile v databáze zašifrovanej cez SQLCipher.
- Kľúč k databáze je uložený dvakrát a zamknutý heslom aj záchranným kódom (scrypt, XChaCha20-Poly1305). Heslo ani kód sa nikde neukladajú.
- APK nemá povolenie na internet a zálohovanie do cloudu je vypnuté.
- Bez hesla alebo záchranného kódu sa k snom nedostane nikto, ani autor aplikácie.
- Súbory z exportu a presunu **nie sú zašifrované**, zaobchádzaj s nimi opatrne.

## Technológia

Expo SDK 58 (React Native, TypeScript, expo-router), expo-sqlite so SQLCipher, @noble/hashes a @noble/ciphers.

## Spustenie a výroba APK

```bash
cd app
npm install
npx expo start --web            # náhľad v prehliadači s vymyslenými snami
node tests/logic.test.mjs       # testy šifrovania a súborov
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
```

Šifrovaná databáza funguje len v zostavenom APK, nie v Expo Go.

## Štruktúra projektu

| Cesta | Obsah |
|---|---|
| `app/` | Kód aplikácie |
| `docs/` | Koncept, dizajnový systém a zoznam obrazoviek |
| `design/` | Návrhy obrazoviek a dizajnové tokeny |
| `scripts/` | Pomocné skripty (prevod denníka z Wordu, zdieľanie APK v lokálnej sieti) |

## Licencia

[MIT](LICENSE)
