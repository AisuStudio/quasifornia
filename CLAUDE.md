# QUASIFORNIA

Offenes, vernetztes Welten-Spiel als Web-App (Inspiration: OASIS aus "Ready Player One"), Open Source, dezentral gehostet, mit agentischem Weltenbau. Repo: github.com/AisuStudio/quasifornia

Hinweis: "Quasifornia" ist nur der Projektname. Der endgültige Name ist noch offen (der Nutzer überlegt ihn mit seinem Sohn); ihn nicht fest in Code, UI oder Texten verankern.

## Phase
Brainstorming. **Noch keinen Code schreiben**, keine Projektstruktur, keine Dependencies anlegen, solange der Nutzer die Implementierungsphase nicht ausdrücklich freigibt.

## Dokumente
- `CONCEPT.md`: Ideenpool, Entscheidungen, offene Fragen. Single Source of Truth für das Konzept; bei neuen Entscheidungen dort nachführen.
- `Inspirarion/`: Moodboard des Nutzers, eigene Stable-Diffusion-Bilder (Kalifornien-Pastell, Kaiju auf Skateboards, aufblasbare Dinos). Nur als Stilreferenz lesen, nicht ändern, nicht committen (322 MB).

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
- In der Brainstorming-Phase: Fragen stellen, Optionen mit Empfehlung nennen, Entscheidungen in `CONCEPT.md` festhalten.
- Offene Fragen einzeln und priorisiert klären, nicht alle auf einmal.
- Kein Scope-Creep: Marktplatz u. Ä. sind explizit nicht im MVP.
