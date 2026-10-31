# Küsten-Quest (Prototyp)

Spielbarer Browser-Prototyp (Three.js), entstanden in der Brainstorming-Phase als Wegwerf-Seite, hier nur zur Sicherung und zum Weiterarbeiten aus anderen Sessions. Kein Projektgerüst, keine Abhängigkeiten im Repo. Der Name ist vorläufig.

Veröffentlichte Version: Artifact `https://claude.ai/artifact/CydYVrahez1Fq5JDYYHoQ5` (Version 18).

## Inhalt
- `dist/kuesten-quest.html`: fertige Einzeldatei (lädt three@0.160.0 von jsdelivr).
- `src/`: Quellen (`atoll.js` Atoll-Einstieg und Labor-Innenraum, `head.html` CSS, `body.html` UI, `setup.js` Szene und Licht, `game.js` Spiel, alle Welten, `acc_block.js` Avatar-Accessoires, `base-scene.html` Ausgangsszene mit Flora, Villen, Dino und Avatar-Code).
- `build.py`: setzt alles zusammen. `python3 build.py` baut `dist/kuesten-quest.html`; `--dev` baut `dist/dev.html` mit lokalem three (`node_modules/three@0.160.0` nötig).

## Stand
- Start ist die Stadt (Welt 0, Labyrinth). An der Küste im Westen beginnt das Rennen (Welt 1); zwei versteckte Portale in der Stadt führen in Welt 2 (Eis-Galaxie) und Welt 3 (Nacht-Stadt).
- Atoll-Einstieg: Labor in der Stadt (Enter = Aktion): gefesselter Mann diktiert Code-Ziffern 1 bis 6 (eine ist falsch), Ziffern 7 bis 10 stehen auf den Stadt-Items; 10-stelliges Code-Feld mit 3 Versuchen und 60 s Sperre; Eis vom Eiswagen korrigiert die falsche Ziffer; im Labor-Innenraum (Level 4) liegt der Schlüssel in einem verschraubten Schaltkasten (Schraubendreher nötig); danach bringt der Mann zum Atoll-Portal (Atoll selbst noch nicht gebaut).
- Atoll (Welt 5, Portal nach der Befreiung des Mannes): vier Rätsel (Caesar-Code, Logikgatter, Werks-PIN, Log-Muster), 10-Minuten-Countdown, Boot. `src/island.js`.
- Lebkuchenhaus in der Stadt (Block mit Weihnachtsbeleuchtung, Schild "Öffnet am ersten Advent"). Santa und das Weihnachtsspiel folgen später. `src/xmas.js`.
- Inventar (Taste I): fünf Items in der Stadt für die geplante Atoll-Quest, im Browser gespeichert.
- Mechanik: Skateboard-Wurf (Klick oder F), Kickflip (Shift), schubsende Skater, Boss-Flucht, Eis-Fressen, Avatar-Karussell, Pixel-Modus (P).
- Flora aus Regeln plus Seed. Keine Mehrspieler-Funktion (kommt erst mit Cloudflare).

## Hinweise
- Der Prototyp lief nur im Headless-Browser getestet, nicht auf Handys.
- Testskripte (Playwright) liegen nicht im Repo.
- Der Snapshot-Branch `snapshot-vor-sohnemann-2026-10-30` zeigt den Stand vorher.

## Musik
`dist/em-ocean.m4a`: em'ocean von Packed Rich feat. you_see, ndfloat, timekilla0118. DJ/Cuts: punch_float. Engineered/mastered by @_yasu2000. Album: The High End Theory (2023). Cover: Aisu.Studio. Genutzt mit Zustimmung von Packed Rich; weitere Tracks erst nach Freigabe.
