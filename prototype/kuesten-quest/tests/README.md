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
- 09 Geisterfahrer
- 10 Neue Aufträge (Blitz-Eis, Kickflip-Serie)
- 11 Messung: Dreiecke, Zeichenaufrufe, Ladezeit pro Welt
- 12 Gehweg: Ollie und Kickflip auf den Bürgersteig
- 13 Skin-Editor (Teile kaufen und anlegen)
- 14 Tricks: Kickflip, Pop Shove-it, 360 Flip, Curb Grind
- 15 Ausblenden und Verschmelzen der Häuserblöcke (Dreiecke und Zeichenaufrufe)
- 16 Kanal: Wasser blockiert, Brücken passierbar
- 17 Hügel: Bodenhöhe, Bergauf, Gegenstände
- 18 Hochbahn: Strecke und Zug
- 19 Unterwelt: Leiter, Kopfstand, fester Pixel-Look, Rückweg
- 20 Serafin-Quest: Bettler, Releaser, Gedicht, Turm Tarxarox, Geist freilassen
- 21 Unterwelt: Zombies, Geister, Kürbis-Laternen, drei Aufträge
- 22 Graffiti: Dosen kaufen, Editor, Wand speichern
- 23 Opener: Logo-Splash, Tastendruck führt zum Avatar
- 24 Musik-Player im Rarepod
- 25 P-Mart: Laden betreten, Kaufen nur im Laden
- 26 Unterwelt-Minikarte: Leiter, Turm nach Serafins Scoops

Screenshots landen im Temp-Ordner des Systems.

## Messwerte (Software-Rendering, Stand 2026-11-01; Zeiten nur relativ)
Dreiecke pro Frame inklusive Schattendurchgang:

| Welt | Dreiecke | Zeichenaufrufe |
|---|---|---|
| 0 Port Lupo (Stadt) | 1,32 Mio. | 1060 |
| 1 Küste | 2,88 Mio. | 1509 |
| 2 Eis-Galaxie | 0,25 Mio. | 1323 |
| 3 Nacht-Stadt | 0,18 Mio. | 1584 |
| 4 Labor | 0,03 Mio. | 217 |
| 5 Atoll | 0,18 Mio. | 159 |

Befund: In Stadt und Küste gehen knapp die Hälfte der Dreiecke auf die Umrisslinien (jedes Objekt wird für den Rand ein zweites Mal gezeichnet), dazu kommt der Schattendurchgang. Ladezeit bis spielbereit im Headless-Test: etwa 12 bis 16 Sekunden.

**Mehrspieler-Tests (35, 36):** brauchen einen lokalen Worker. Vorher im Ordner `quasifornia`: `npx wrangler dev --local --port 8790 --var SITE_PASSWORD:testpw`. Läuft er nicht, melden sie "übersprungen" und gelten als bestanden. 35 prüft den Raum-Server mit echten WebSockets (Beitritt, Positionen, 5 Plätze, Verlassen, fremde Herkunft), 36 zwei Browser gegen den Raum (Skater sichtbar, Fahrt, Name, Uhr, Unterwelt, Namensfeld).

**Auswertungs-Tests (37, 38):** 37 prüft die Berechnung (`worker/stats.js`) mit erfundenen Daten ohne Server, 38 den ganzen Weg gegen einen lokalen Worker (Einsenden, getrennte Passwörter, Seite `/stats`, Spiel sendet Aufträge, Scoops und Fehler). Für 38 vorher: `npx wrangler dev --local --port 8790 --var SITE_PASSWORD:testpw --var STATS_PASSWORD:statspw` (ohne Worker meldet er "übersprungen").

**Gemeinsame Welt (39, 40, 41):** 39 prüft die Riesen-Dinos (gleicher Ort und Zeit nach der Uhr). 40 und 41 brauchen den lokalen Worker (siehe oben): 40 spielt die Polizei im Raum mit zwei Browsern durch (Warnung nur beim Sprüher, Wagen für alle sichtbar, zweiter Wagen, nur der Gejagte zahlt), 41 das Terminal (`/chat` mit Passwort, falsches Passwort, Nachrichten, Text nur als Text, Tastenschutz im Eingabefeld, `/verlassen`, Passwort fällt weg, wenn der Raum leer ist). 35 prüft zusätzlich die Polizei-Regeln des Servers.
