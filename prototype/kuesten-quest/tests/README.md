# Smoke-Tests (Playwright)

Sie laden das Spiel im Headless-Browser (Software-Rendering) und spielen Abläufe über den Test-Hook `window.__qa`.
Sie sind **Smoke-Tests**: Sie fangen Abstürze und Seitenfehler ab und drucken Zustände aus. **Prüfzeilen** enden mit `true` (in Ordnung) oder `false`. `node tests/run.js` lässt einen Test scheitern, wenn er abstürzt, eine `ERR`-Zeile druckt oder eine Zeile mit `false`, `NaN` oder `undefined` endet. Negative Prüfungen werden so geschrieben, dass `true` gut bedeutet (`!(Wert)`). Reine Zustandszeilen werden nicht bewertet.

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
- 25 A-Mart: Laden betreten, Kaufen nur im Laden
- 26 Unterwelt-Minikarte: Leiter, Turm nach Serafins Scoops

Screenshots landen im Temp-Ordner des Systems.

## Messwerte (Software-Rendering, Stand 2026-11-01; Zeiten nur relativ)
Dreiecke pro Frame inklusive Schattendurchgang:

| Welt | Dreiecke | Zeichenaufrufe |
|---|---|---|
| 0 Port 36 (Stadt) | 1,32 Mio. | 1060 |
| 1 Küste | 2,88 Mio. | 1509 |
| 2 Eis-Galaxie | 0,25 Mio. | 1323 |
| 3 Nacht-Stadt | 0,18 Mio. | 1584 |
| 4 Labor | 0,03 Mio. | 217 |
| 5 Atoll | 0,18 Mio. | 159 |

Befund: In Stadt und Küste gehen knapp die Hälfte der Dreiecke auf die Umrisslinien (jedes Objekt wird für den Rand ein zweites Mal gezeichnet), dazu kommt der Schattendurchgang. Ladezeit bis spielbereit im Headless-Test: etwa 12 bis 16 Sekunden.

**Mehrspieler-Tests (35, 36):** brauchen einen lokalen Worker. Vorher im Ordner `quasifornia`: `npx wrangler dev --local --port 8790 --var SITE_PASSWORD:testpw`. Läuft er nicht, melden sie "übersprungen" und gelten als bestanden. 35 prüft den Raum-Server mit echten WebSockets (Beitritt, Positionen, 5 Plätze, Verlassen, fremde Herkunft), 36 zwei Browser gegen den Raum (Skater sichtbar, Fahrt, Name, Uhr, Unterwelt, Namensfeld).

**Auswertungs-Tests (37, 38):** 37 prüft die Berechnung (`worker/stats.js`) mit erfundenen Daten ohne Server, 38 den ganzen Weg gegen einen lokalen Worker (Einsenden, getrennte Passwörter, Seite `/stats`, Spiel sendet Aufträge, Scoops und Fehler). Für 38 vorher: `npx wrangler dev --local --port 8790 --var SITE_PASSWORD:testpw --var STATS_PASSWORD:statspw` (ohne Worker meldet er "übersprungen").

**Gemeinsame Welt (39, 40, 41):** 39 prüft die Riesen-Dinos (gleicher Ort und Zeit nach der Uhr). 40 und 41 brauchen den lokalen Worker (siehe oben): 40 spielt die Polizei im Raum mit zwei Browsern durch (Warnung nur beim Sprüher, Wagen für alle sichtbar, zweiter Wagen, nur der Gejagte zahlt), 41 das Terminal (`/chat` mit Passwort, falsches Passwort, Nachrichten, Text nur als Text, Tastenschutz im Eingabefeld, `/verlassen`, Passwort fällt weg, wenn der Raum leer ist). 35 prüft zusätzlich die Polizei-Regeln des Servers.

**Steuerung (42):** Pfeiltasten fahren nicht mehr, sie lösen Tricks aus (↑ Kickflip, ← Pop Shove-it, → 360 Flip; Shift/Q/R gehen weiter), WASD fährt. Außerdem: Die Anstoß-Animation läuft beim Beschleunigen, nicht bei Reisetempo und nicht ohne Gas.

**Läden und Bauen (43, 44):** 43 prüft den A-Mart-Innenraum (hinein, Regale und Kasse öffnen den Laden, Wände und Regale blockieren, hinaus vor die Tür, bei Polizei gesperrt). 44 prüft den Builder mit echten Mausklicks (setzen, stapeln, Fenster an der Wand, Rechtsklick, Zurück, Pinsel, Kamera ziehen, Speichern, Kollision, Belohnung nur einmal, Abbrechen, Neu laden).

**Karte, Musik, Decks (45, 46, 47):** 45 prüft die neue Karte (17 Bauplätze mit Typ und Umriss, Skatepark mit Pool, Zaun und Tor, Backoffice). 46 und 47 brauchen den lokalen Worker mit lokalen R2-Buckets (nach Änderungen an `wrangler.jsonc` neu starten): 46 prüft Musikliste, Titel, Streaming mit Range, ungültige Namen und Passwortschutz, 47 dasselbe für die Decks und dass das Design auf dem Board liegt.

**UBIQ (48, 37):** 48 prüft Kauf und Nachfüllen im A-Mart, die drei Glitch-Stellen, Reparatur (Ladung, Scoops, Ort, Speicher), leere Dose und die automatische Erkennung einer verschränkten Sammelstelle samt Meldung an `/stats`. 37 prüft zusätzlich die Auswertung der Glitch-Ereignisse.

**Geteilte Glitches (49):** braucht den lokalen Worker. Prüft die Schnittstelle (nur der Erste gewinnt, auch gleichzeitig, ungültige Kennungen, Passwortschutz, Zurücksetzen nur mit Auswertungs-Passwort) und zwei Browser: A repariert und bekommt Scoops, B versucht es zu spät und bekommt nichts, verliert keine Ladung und sieht den Glitch als repariert; der Abgleich zeigt B Reparaturen von A.

**Positions-Anzeige (in 42):** Taste V zeigt x, z, Blickwinkel (0° = Norden, im Uhrzeigersinn), Höhe, Ort und Stand; Klick kopiert die Zeile. Für die Glitch-Inventur.

**Rarepod-Kamera (50):** Foto mit Polaroid-Rahmen (JPEG, Ort, Datum, Koordinaten, Blickwinkel), Bild nicht leer, Galerie bleibt nach Neuladen (IndexedDB), Taste C, Reiter Fotos, Aktionen, Löschen. Mit lokalem Worker zusätzlich: "An den Raum zeigen" kommt bei anderen an, ungültige und zu große Fotos werden verworfen.

**Sammelkarten (51):** Kein Worker nötig, Karten und Bilder kommen per `page.route`. Prüft die Ziehung (7 Karten je Pack, Seltenheit nach Gewicht, letzte Karte mindestens "guarantee"), Kaufen nur im A-Mart und nur mit genug Scoops, Rarepod-Reiter Karten (Sammlung, Pack öffnen, Karten starten verdeckt, aufdecken, Detailkarte), Speichern nach Neuladen, Kartenpack im Laden, Kartenregal im A-Mart.

**Graffiti-Härtung (52):** Startet einen eigenen lokalen Worker (Port 8791, frischer Speicher, Obergrenze 3 Bilder). Prüft: nur echte Kennungen (Gebäude 0 bis 80, Kante 0 bis 40, Feld 0 bis 24, Wände w1 bis w9), nur PNG mit genau 128 × 64 Pixeln, kein Text, nicht zu groß, Obergrenze für die Zahl der Bilder (507), Überschreiben bleibt möglich, Bremse gegen Dauerfeuer (429).

**Sprühdosen (53):** Form aus der Vorlage (Höhe zu Breite 2,64 wie `PHs_can.svg`), Teile, Material je Farbe geteilt und für UBIQ eigenes, Texturen aus der SVG geladen (Phil's-Rot, Weiß, Farbmarke in der Dosenfarbe, UBIQ-Schriftzug), Regal im A-Mart mit 48 Dosen.

**L’Avateur, Außenseite (54):** Das lachsrote Haus im Süden wird als `avateur` erkannt (per Label "Avateur" in der Karte oder als nächstes freies Haus bei 1812,1588), vier verschiedene Wesen (Pink-Blob, Skater, Dino, Goldzilla) in den Auslagen, ungefähr gleich hoch und innerhalb der Fenster, der Erker ist gesperrt, Weg und Stufe davor sind frei, das Logo ist als Textur geladen.
