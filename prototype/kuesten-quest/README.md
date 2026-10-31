# Küsten-Quest (Prototyp)

Spielbarer Browser-Prototyp (Three.js), entstanden in der Brainstorming-Phase als Wegwerf-Seite, hier nur zur Sicherung und zum Weiterarbeiten aus anderen Sessions. Kein Projektgerüst, keine Abhängigkeiten im Repo. Der Name ist vorläufig.

Veröffentlichte Version: Artifact `https://claude.ai/artifact/CydYVrahez1Fq5JDYYHoQ5` (Version 18).

## Inhalt
- `dist/kuesten-quest.html`: fertige Einzeldatei (lädt three@0.160.0 von jsdelivr).
- `src/`: Quellen (`head.html` CSS, `body.html` UI, `setup.js` Szene und Licht, `game.js` Spiel, alle Welten, `acc_block.js` Avatar-Accessoires, `base-scene.html` Ausgangsszene mit Flora, Villen, Dino und Avatar-Code).
- `build.py`: setzt alles zusammen. `python3 build.py` baut `dist/kuesten-quest.html`; `--dev` baut `dist/dev.html` mit lokalem three (`node_modules/three@0.160.0` nötig).

## Stand
- Start ist die Stadt (Welt 0, Labyrinth). An der Küste im Westen beginnt das Rennen (Welt 1); zwei versteckte Portale in der Stadt führen in Welt 2 (Eis-Galaxie) und Welt 3 (Nacht-Stadt).
- Mechanik: Skateboard-Wurf (Klick oder F), Kickflip (Shift), schubsende Skater, Boss-Flucht, Eis-Fressen, Avatar-Karussell, Pixel-Modus (P).
- Flora aus Regeln plus Seed. Keine Mehrspieler-Funktion (kommt erst mit Cloudflare).

## Hinweise
- Der Prototyp lief nur im Headless-Browser getestet, nicht auf Handys.
- Testskripte (Playwright) liegen nicht im Repo.
- Der Snapshot-Branch `snapshot-vor-sohnemann-2026-10-30` zeigt den Stand vorher.
