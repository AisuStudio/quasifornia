# Küsten-Quest (Prototyp)

Spielbarer Browser-Prototyp (Three.js) mit einem Cloudflare-Worker (Passwortschutz, Räume, Speicher). Der Name ist vorläufig. Konzept und Entscheidungen stehen in `../../CONCEPT.md`.

## Inhalt
- `dist/kuesten-quest.html`: fertige Einzeldatei (lädt three@0.160.0 von jsdelivr). Der Worker liefert sie aus.
- `src/`: Quellen. `head.html` (CSS), `body.html` (Oberfläche), `setup.js` (Szene, Licht), `game.js` (Spiel, Rarepod, Hauptstadt-Welten), `karte.js` (Karte, Gebäude, Polizei, Riesen, Skatepark), `atoll.js`, `island.js`, `pmart.js` (Laden), `bauen.js` (Baukasten), `ubiq.js` (Glitches), `unter.js` (Unterwelt), `bettler.js`, `xmas.js`, `graffiti.js`, `multi.js` (Räume, Chat), `foto.js` (Kamera), `karten.js` (Sammelkarten), `stats.js` (Auswertung), `dose.js` (Sprühdosen), `amart.js` (A-Mart-Logo und Banderole), `avateur.js` (Schaufenster des L’Avateur), `garage.js` (Akira’s Garage), `decals/` (SVG-Vorlagen für den Aufdruck), `acc_block.js`, `base-scene.html`, `fonts/` (Smarta Nova), `map/` (Karte als JSON).
- `build.py`: setzt alles zusammen. `python3 build.py` baut `dist/kuesten-quest.html`, `--dev` baut `dist/dev.html` mit lokalem three (`npm install` nötig).
- `tools/`: `make-map.js` (Karte aus SVG, Playwright), `karten-upload.js` (Sammelkarten in den R2-Bucket), Logo-Skripte.
- `tests/`: Playwright-Smoke-Tests. `python3 build.py --dev && node tests/run.js` (siehe `tests/README.md`). Einige Tests brauchen den lokalen Worker.
- `../../worker/`: Cloudflare-Worker (`index.js`, `room.js`, `stats.js`, `glitch.js`, `musik.js`), `../../wrangler.jsonc`.

## Stand (06.11.2026)
Stadt Port 36 (Karte aus SVG, Tag und Nacht), Skaten mit Tricks, Skatepark, Hochbahn, Polizei, Riesen-Dinos, Graffiti (Server), Rarepod (Inventar, Aufträge, Scoops, Laden, Editor, Musik, Terminal, Decks, Fotos, Karten), A-Mart mit Innenraum, Baukasten für Bauplätze, Atoll-Quest, Unterwelt, UBIQ-Glitches (geteilt über den Server), Räume mit bis zu 5 Spielern (Chat, Polizei, Fotos zeigen), Kamera, Sammelkarten, Auswertung. Details und offene Fragen: `CONCEPT.md`.

## Hinweise
- Läuft getestet im Headless-Browser (Software-Rendering), nicht auf Handys.
- Daten außerhalb des Repos (Cloudflare R2): Bucket `sound` (Musik), Bucket `designs` (`decks/` und `karten/`). Sammelkarten und Moodboard liegen privat im Repo `AisuStudio/lore`.
- Schrift: Smarta Nova (eigene Schrift, nur Regular), eingebettet.

## Musik
Die Musik liegt im Cloudflare-R2-Bucket `sound` (nicht im Repo, Worker liefert sie unter `/musik/<datei>`): em'ocean von Packed Rich feat. you_see, ndfloat, timekilla0118. DJ/Cuts: punch_float. Engineered/mastered by @_yasu2000. Album: The High End Theory (2023). Cover: Aisu.Studio. Genutzt mit Zustimmung von Packed Rich; weitere Tracks erst nach Freigabe.

## Passwortschutz (Cloudflare)
`worker/index.js` schützt die ganze Seite inklusive Song mit einem Passwort (HTTP-Anmeldung, Benutzername egal). Das Passwort steht nicht im Repo: In Cloudflare unter Workers & Pages > quasifornia > Settings > Variables and Secrets ein Secret namens `SITE_PASSWORD` anlegen. Ohne dieses Secret bleibt die Seite gesperrt (Status 503). Die Startseite ist `/` und zeigt `kuesten-quest.html`. Die Auswertung (`/stats`) hat ein eigenes Passwort: Secret `STATS_PASSWORD` (ersatzweise gilt das Seitenpasswort). Dasselbe Passwort schützt den Planner (`/planner`, Planungsdokument in einem Durable Object `Planner`, Seite `dist/planner.html` von Hand gepflegt wie `dist/stats.html`). Beim ersten Deploy läuft die Migration v5 (neue Klasse). Versionen des Planners (automatisch höchstens alle 10 Minuten und bei starkem Schrumpfen, die letzten 50; benannte bleiben, höchstens 100) liegen in einer SQLite-Tabelle im selben Durable Object. Der Planner kennt mehrere Dokumente: den Hauptplan (`/planner`) und Entwürfe (`/planner?d=<id>`, höchstens 20), je mit eigenem Stand und eigenen Versionen; alle hinter demselben Passwort. Agent-Link: Je Dokument lässt sich im Planner ein Lese-Link erzeugen (`/agent/planner/<token>`, Markdown, mit `?format=json` als JSON), der ohne Passwort funktioniert, nur lesen kann und sich erneuern oder widerrufen lässt. Er liefert immer den zuletzt gespeicherten Stand; wer ihn hat, liest den ganzen Plan.
