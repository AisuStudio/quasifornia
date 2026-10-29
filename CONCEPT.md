# QUASIFORNIA – Konzept

Status: Brainstorming. Kein Code.

Name: "Quasifornia" ist der Projektname. Der endgültige Name ist offen und wird vom Nutzer mit seinem Sohn gefunden.

## Idee in einem Satz
Ein offenes, vernetztes Welten-Spiel als Web-App, inspiriert von der OASIS aus "Ready Player One", aber Open Source, dezentral gehostet und mit agentischem Weltenbau.

## Entscheidungen
- MVP ist eine Web-App im Browser, kein Installer.
- Open Source: Basis-Code auf GitHub, jeder kann eine eigene Welt forken und hosten.
- Welten haben eigene Regeln (Manifest), verbunden durch Portale.
- Kein Permadeath: globale Identität (Avatar, Erfolge) ist unantastbar, nur lokaler Weltzustand kann verloren gehen.
- Kein Bild-Upload: Texturen und Skins nur per Paint-Feature im Spiel (wie Blockbench), feste Auflösung, optional Paletten pro Welt.
- Entwicklung startet mit Claude Code.
- **Kern: Quests und Entdecken.** Crews und Teilen sind Verstärker, nicht Kern. Erschaffen speist den Kern (Erbauer liefern Quests und Welten).
- Fortbewegung ist **nicht der Kern**, sondern Mittel zum Zweck: der Weg zwischen Quests, Welten und Inseln und auch in der Welt selbst. Sie ist Fun on top und vermittelt Selbstwirksamkeit (man spürt, dass man etwas kann und bewirkt). Sie muss sich gut anfühlen, trägt aber nicht allein das Spiel.

## Ideenpool (nicht priorisiert)

### Welten und Bauen
- Prozedurale Welten wie No Man's Sky (Seed + Skript), keine groben Minecraft-Blöcke
- Hybrid: glattes Terrain, modulare Bauteile, feine Details
- Agentisches bzw. teilagentisches Bauen über eine Skriptsprache ("Küstenstadt, mediterran, Hafen im Süden" → Regeln und Parameter)
- Kachelbare Materialien im 2D-Editor malen, per Triplanar Mapping projiziert
- Avatare als VRM, direkt bemalbar

### Modi
- Kreativ, Survival, Hardcore, PvP, pro Welt im Manifest deklariert
- Portal zeigt Regeln und Risiko vor dem Eintritt
- Risiko nur in verifizierten Welten

### Fortbewegung (Rolle: Mittel zum Zweck und Fun on top, siehe Entscheidungen)
- Fahrzeuge, Bikes, Boards, Gleiter, Fluggeräte
- Referenzen: Motocross Madness, Tony Hawk's Pro Skater, Test Drive, Flugsimulatoren, Mario Kart, Tears of the Kingdom
- Herausforderungen von Erbauern: Zeitrennen, Trick-Lines, Ringe
- Ghost-Runs, per Link teilbar
- Offen: feste Fahrzeugklassen mit Tuning oder frei gebaute Gefährte

### Spielarten und Quests
- Brawler-Arenen (Brawl Stars), kurze Runden
- Jump-and-Run-Parcours (Super Mario), versteckte Geheimnisse
- Mathe-Rätsel versteckt als Quests (Zahlencodes, Muster, Sprungwinkel)
- Physik-Puzzles in der Welt (Zelda-Schreine)
- Easter-Egg-Jagd über mehrere Welten (Halliday-Prinzip)

### Sozial
- Notizen mit Ortsanker: privat als Standard, teilbar
- Geteilte Notiz = Teleport-Link, funktioniert auch außerhalb des Spiels
- Reisetagebuch als Profil
- Emotes (Wunsch vom Sohn des Nutzers): Gesten und Animationen des Avatars, z. B. Tanzen, Winken, Jubeln. Offene Fragen: Fester Satz oder frei erweiterbar? Freischaltbar über Quests? Passen sie zum Paint-/VRM-Avatar (Animationen für VRM)?

### Weitere
- Pflanzen und Wachstum
- Browser in der Welt: im MVP iframes plus synchronisiertes YouTube, später ggf. gestreamter Browser oder Desktop-Client (Electron)
- Marktplatz mit 10 % Gebühr (zweitrangig, nicht im MVP)

### Referenz: One Piece
Vom Nutzer genannte Kernideen: **Fortbewegung** (Schiff als Reisemittel zwischen Inseln), **Quests**, **Crews**, **Konkurrenz** (Rivalen, Kopfgelder), **Freiheit** (selbst bestimmen, wohin man fährt).
Mögliche Übersetzung, noch nicht entschieden:
- Inselwelten durch Reisen verbunden, passt zu Welten + Portalen
- Fortbewegung als Weg zwischen Welten und Herausforderungen, nicht nur als Mechanik
- Crews als Gruppen (gemeinsame Läufe, Ghost-Runs, Team-Ranglisten)
- Konkurrenz über Zeitrennen, Ranglisten, Duelle
- Freiheit: offene Welt, kein Zwang zu einem Pfad; Quests und Easter-Egg-Jagd als Angebot
- Manga-Ästhetik (vgl. Serie `_Manga Zilla`)

## Look & Feel (aus `Inspirarion/`)
Eigene Stable-Diffusion-Bilder aus dem letzten Jahr, 5 Serien, ca. 245 Dateien, 322 MB:
- `_Goldzilla` (15): goldenes Kaiju auf Skateboard in Pastell-Stadt
- `_Ice Truck` (8)
- `_Manga Zilla` (41)
- `_Pacific Sim` (90): dunstige Küstenstraße mit Palmen, Ballons, fliegender Kreatur
- `_Skate riot` (91): aufblasbares gelbes Dino zwischen Palmen und rosa Villen, Strand

Stichprobe (3 Bilder): Kalifornien-Küstenkulisse (Palmen, Pastellrosa, Türkis, Strand), riesige Kaiju/Dinos als Skater oder aufblasbare Figuren, Mischung aus Skate-Kultur und Monsterfilm. Das passt direkt zu "Quasifornia" und zum Kandidaten Fortbewegung (Skateboard, Tony Hawk).

Weitere Inspiration: https://www.aisu.studio/ai-su ("AI-SU EXPERIMENTS", unbearbeitete Stable-Diffusion-Serien, Dominik Heilig):
- Pacific Sim: futuristisches, durchgedrehtes Kalifornien ("way beyond Philip K. Dick")
- Skate or Dai: außer Kontrolle geratener Skate-Wettbewerb, unbeschwerter Futurismus
- Goldzilla: Kaiju-Serie ("How much can I shine?")
- Tropical Storm: 2049, Metropole in Südostasien nach der technologischen Singularität
Tonalität: Pop-Kultur-Explosion, unbeschwerter Futurismus gemischt mit Dystopie, gewollter Uncanny-Valley-Effekt. Skate or Dai ist fast schon ein Spielkonzept (Skate-Contest als Herausforderung).

Entschieden: Die Bilder sind nur Moodboard (Stil und Farben), sie kommen nicht im Spiel vor. Als WebP (ca. 27 MB) unter `moodboard/` im Repo, damit sie auch mobil erreichbar sind. Die Originale (PNG, PSD) liegen nur lokal in `Inspirarion/` und sind per .gitignore ausgeschlossen.

## Farben (aus `Inspirarion/`, per k-means aus den Bildern gezogen)
Vom Nutzer gewünscht: aus den Inspirationen nur die Farben nehmen.
- **Hauptakzent Himmel/Meer-Türkis:** `#2499bb` (32 % der gesättigten Pixel), dazu `#1cafd1`, `#5b94ad`, `#78a0ae`
- **Gold/Gelb (Goldzilla, aufblasbares Dino):** `#f0cf36`, `#dcb64c`, `#cfa442`, `#be8d24`, `#a66b28`
- **Pink-Akzent (Villen, Reifen):** `#d54291`; gedämpft `#ae9395`, `#d3a5b0`
- **Neutrale Basis, warm/dunstig (Pacific Sim, Skate riot):** `#3f3936`, `#655855`, `#857978`, `#c6babb`, `#eae8e8`, Schwarz `#141416`
- **Nacht/Violett (Ice Truck):** `#1f1d28`, `#312e42`, `#444764`
- **Manga Zilla:** reine Graustufen (`#f6f7f6` bis `#0f0e0f`), nur für Kontrast/Manga-Look
Hinweis: Mittelwerte aus vielen Bildern sind gedämpft. Für ein UI die gesättigten Akzente (Türkis, Gold, Pink) gezielt gegen die dunkle Neutralbasis setzen. Vorschlag, noch nicht entschieden.

## Typografie
- Systemschrift (UI): **Smarta Nova**. Vorläufige Quelle: `/Users/domdom/Documents/Claude/fontane-share/public/fonts/hero/smarta-nova.woff2` (aus dem Projekt fontane-share, noch nicht ins Repo kopiert).
- Vollversion (Quelle): `/Users/domdom/Documents/FONTS/FONTANE/smarta-nova.otf` (23 KB, 139 Glyphen, Ziffern vorhanden). Die woff2 aus fontane-share ist nur ein Subset (2 KB).
- Lücke: **keine Umlaute** (ä ö ü Ä Ö Ü ß fehlen in der OTF). Entschieden: Der Nutzer ergänzt die Umlaute in der Schrift selbst, kein Fallback nötig. Danach die neue OTF/woff2 als Quelle eintragen.
- Lizenz ist unkritisch: Die Schrift hat der Nutzer selbst gemacht.

## Tech-Stack-Kandidaten
- Client: Three.js + React Three Fiber, Rapier (Physik), three-vrm, simplex-noise
- Multiplayer: Cloudflare Workers + Durable Objects (ein Objekt pro Welt), ggf. PartyKit
- Auth und Daten: Supabase
- Hosting: Cloudflare Pages
- Skript-Sandbox: Lua (wasmoon) oder QuickJS
- Nicht geeignet: Vercel (Serverless, keine dauerhaften WebSockets)

## MVP-Skizze (vorläufig)
- Zwei prozedurale Welten, verbunden durch ein Portal
- Mehrere Avatare gleichzeitig
- Gastmodus, Login erst zum Speichern oder Teilen
- Paint-Feature für eine Textur und einen Skin
- Notiz mit Ortsanker, teilbar per Link

## Aufgabe des Sohnes (Stand 2026-10-29)
Der Sohn des Nutzers überlegt zwei Dinge:
1. Wie soll das Spiel heißen?
2. Welche drei Hauptaufgaben (Säulen) hat es? Beispiele vom Nutzer: Build, Quest, Fight/Brawl.
Einordnung: Quests und Entdecken ist bereits als Kern entschieden. Bewegung ist Mittel zum Zweck. Die drei Säulen sollten dazu passen oder den Kern bewusst ergänzen (Kandidaten aus dem Ideenpool: Quest, Build, Brawl, Race, Explore, Crew).
Emotes: Wunsch des Sohnes, Rolle noch offen (Ausdruck, Belohnung oder Spielmechanik; Empfehlung: Belohnung, später Mechanik).

## Offene Fragen
Status: Der Nutzer klärt die folgenden Punkte mit seinem Sohn (Stand 2026-10-29), inklusive Projektname und erster Quest.
1. Kernschleife: Was macht man in den ersten zehn Minuten, warum kommt man wieder? (Bewegung verbindet, aber was ist das Ziel, das sie verbindet: Quests, Entdecken, Crew, Erschaffen?)
2. Zielgruppe: Kinder, Kreative, Retro-Gamer?
3. Abgrenzung zu Roblox, Minecraft, Hyperfy
4. ~~Kernwert~~ Entschieden: Quests und Entdecken. Offen bleibt die Time to Value: Was ist die erste Quest, die nach wenigen Minuten belohnt?
5. Skriptsprache: Lua oder JavaScript, wie mächtig?
6. Ziel des MVP: Lernprojekt, Pitch oder Community-Test?
