# QUASIFORNIA

Offenes, vernetztes Welten-Spiel als Web-App (Inspiration: OASIS aus "Ready Player One"), Open Source, dezentral gehostet, mit agentischem Weltenbau. Repo: github.com/AisuStudio/quasifornia

Hinweis: "Quasifornia" ist nur der Projektname. Der endgültige Name ist noch offen (der Nutzer überlegt ihn mit seinem Sohn); ihn nicht fest in Code, UI oder Texten verankern.

## Phase
Prototyp. Es gibt einen spielbaren Browser-Prototyp unter `prototype/kuesten-quest` (Three.js, Build mit `python3 build.py`, Tests mit `node tests/run.js`) und einen Cloudflare-Worker unter `worker/`. **Code wird nur auf ausdrückliches "bauen" des Nutzers geschrieben**; sonst Fragen stellen, Optionen mit Empfehlung nennen und nichts anfangen. **Nach `main` wird nur auf ausdrückliches "merge" gebracht** (`main` deployt die passwortgeschützte Seite). Entwickelt wird auf dem Branch `notizen-ideen`.

## Dokumente
- `CONCEPT.md`: Ideenpool, Entscheidungen, offene Fragen. Konzept und Entscheidungen zu dem, was gebaut ist oder im öffentlichen Repo stehen darf; bei Entscheidungen zu Gebautem dort nachführen (neue Ideen und Lore siehe unten, privates Repo).
- `Inspirarion/`: Moodboard des Nutzers, eigene Stable-Diffusion-Bilder (Kalifornien-Pastell, Kaiju auf Skateboards, aufblasbare Dinos). Nur als Stilreferenz lesen, nicht ändern, nicht committen (322 MB).
- Privates Repo `AisuStudio/lore` (nicht öffentlich machen): neue Konzepte und Lore (`quasifornia/KONZEPTE.md`), Sammelkarten (`quasifornia/karten/`), komplettes Moodboard (`quasifornia/moodboard/`), Wettbewerber. **Neue Konzepte kommen dorthin**, in `CONCEPT.md` nur, was schon im Spiel steht. Songs, Designs und Karten-Bilder liegen im Cloudflare-R2 (Buckets `sound` und `designs`), nie im öffentlichen Repo.

## Feste Vorgaben
- MVP: Web-App im Browser, kein Installer.
- Open Source; jeder kann eine eigene Welt forken und hosten.
- Welten haben ein Manifest (eigene Regeln), verbunden durch Portale.
- Kein Permadeath: globale Identität (Avatar, Erfolge) unantastbar, nur lokaler Weltzustand kann verloren gehen.
- Kein Bild-Upload: Texturen/Skins nur über das Paint-Feature im Spiel, feste Auflösung, optional Paletten pro Welt.

- Kern: Quests und Entdecken. Crews und Teilen verstärken, Bewegung ist Mittel zum Zweck (Fun on top, Selbstwirksamkeit).

- Systemschrift: Smarta Nova (Details und offene Prüfpunkte in `CONCEPT.md`, Abschnitt Typografie). Noch nichts kopiert oder eingebunden.

## Stack-Kandidaten (noch nicht final)
Three.js + React Three Fiber, Rapier, three-vrm, simplex-noise; Cloudflare Workers + Durable Objects (ggf. PartyKit); Supabase; Cloudflare Pages; Skript-Sandbox Lua (wasmoon) oder QuickJS. Vercel ist ungeeignet (keine dauerhaften WebSockets).

## Arbeitsweise
- Sprache: Deutsch.
- Bei Konzeptfragen: Fragen stellen, Optionen mit Empfehlung nennen, Entscheidungen in `CONCEPT.md` festhalten.
- Offene Fragen einzeln und priorisiert klären, nicht alle auf einmal.
- Kein Scope-Creep: Marktplatz u. Ä. sind explizit nicht im MVP.
