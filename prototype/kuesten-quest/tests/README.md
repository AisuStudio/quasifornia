# Smoke-Tests (Playwright)

Sie laden das Spiel im Headless-Browser (Software-Rendering) und spielen Abläufe über den Test-Hook `window.__qa`.
Sie sind **Smoke-Tests**: Sie fangen Abstürze und Seitenfehler ab und drucken Zustände aus. Nicht jeder Wert wird automatisch geprüft.

## Ausführen
```
cd prototype/kuesten-quest
npm install
npx playwright install chromium   # nur beim ersten Mal
npm test                          # baut dist/dev.html und startet alle Skripte
npm test -- -v                    # mit voller Ausgabe
```
Ein einzelnes Skript: `python3 build.py --dev && node tests/05-insel.js`

## Skripte
- 01 Start in der Stadt, Küstenrennen
- 02 Portale in Welt 2 und 3, Rand-Sperren
- 03 Inventar
- 04 Atoll-Einstieg (Labor, Code-Tür, Mann, Schlüssel, Portal)
- 05 Insel (vier Rätsel, Tor, Boot, Countdown)
- 06 Lebkuchenhaus (Aktion am Schild)
- 07 Scoops, Aufträge, Rarepod
- 08 Laden (Skins)

Screenshots landen im Temp-Ordner des Systems.
