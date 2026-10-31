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
- **Escape-Quest "Countdown auf dem Atoll"** (Idee aus einem anderen Chat, ursprünglich als Minecraft-Mod-Konzept): Du strandest allein auf einer verlassenen Forschungsinsel, gleich startet ein Atomtest, das letzte Boot legt bald ab. Vier gesicherte Systeme stehen zwischen dir und der Freiheit. Gelöst wird mit Köpfchen statt Gewalt; der Countdown liefert Dringlichkeit. Jede Hürde ist eine echte White-Hat-Methode (ethisches Hacken: Systeme verstehen, um sie zu schützen; keine Opfer, nichts wird beschädigt):
  1. Funkspruch entschlüsseln: Kryptographie und Code-Analyse (warum schwache Codes knackbar sind)
  2. Alarm umkehren: Logik und Schaltungsdenken, Logikgatter (wie Systeme ja/nein entscheiden)
  3. Kamera mit Werks-PIN: Passwort-Sicherheit (Standard-Passwörter sind die häufigste echte Lücke)
  4. Patrouillen-Log lesen: Forensik und Spurenanalyse (Muster in Logdaten)
  Bonus: Wer aufmerksam ist, findet die geheime Schmuggler-Losung. Neugier wird belohnt, nicht Zerstörung. Lerneffekt: Security Literacy, spielerisch statt Theorie.
  Einordnung: Passt zum Kern Quests und Entdecken, zu "Mathe-Rätsel versteckt als Quests" und zu den Physik-/Rätselschreinen. Insel passt zu den Inselwelten (One Piece), Countdown zur Flucht-Dynamik des Prototyps "Küsten-Quest". Noch offen: Eigene Welt/Insel oder Quest-Typ in vielen Welten? Zielalter (Inhalt ist atomtest-/hackerlastig, Tonalität für jüngere Kinder prüfen, vgl. Kinderschutz). Quelle: früherer Chat, nicht Teil des Minecraft-Mods CW3K.

### Küstenstadt als Hub (Idee vom Nutzer, 2026-10-31)
In der Küstenstadt entstehen nach und nach Gebäude. Jedes Gebäude teleportiert zu einer anderen Quest. Die Stadt wächst also mit dem Fortschritt und ist zugleich das Menü der Quests. Verbindet Kern (Quests), Portale und Belohnung (neues Gebäude = neue Quest).
- Die 5×5-Blockmap gibt es schon: Sie ist **Welt 0, die Stadt** des Prototyps (siehe "Welten im Prototyp"): 5×5 Blöcke, 6×6 Kreuzungen, Labyrinth per Seed, fünf Gebäudetypen, drei Portale in Sackgassen, Minikarte, die sich beim Fahren füllt. Offen dort: Leben in der Stadt, Innenräume, 10×10 zu schwer für Handys. Der Hub-Gedanke baut darauf auf: Gebäude der 5×5-Stadt werden zu Quest-Portalen, statt dass Portale nur in Sackgassen versteckt sind.
- Offen: Was löst ein neues Gebäude aus (abgeschlossene Quest, Sammelgut, Zeit)? Wer platziert sie (automatisch oder Spieler)? Passt "Countdown auf dem Atoll" als ein Gebäude/Portal?

### Inventar (Idee vom Nutzer, 2026-10-31)
Die Figur hat ein Inventar. Fortbewegungsmittel wie das Skateboard verschwinden darin, danach läuft man zu Fuß. Im Inventar tauchen Tools, Schlüssel, USB-Sticks usw. auf, die in Quests gebraucht werden.
- Technisch unkritisch: Inventar ist eine Liste von Item-IDs im Spielerzustand (Zustand-Store plus IndexedDB). Skateboard weg- und herholen ist ein Wechsel des Bewegungsmodus (Rapier-Controller für Laufen/Skaten) plus Ein-/Ausblend-Animation.
- Passt zu: Sierra-Rätseln (Fundstück benutzen), Escape-Quest (USB-Stick, Schlüssel, Tools), Gebäude als Quest-Portale (Schlüssel öffnet ein Gebäude), Emotes/Belohnungen.
- Offen: Welche Items sind global (Identität, "unantastbar") und welche gehören zum lokalen Weltzustand und können verloren gehen? Empfehlung: Fortbewegungsmittel und Erfolge global, Quest-Items lokal je Welt. Wie groß (feste Slots oder Liste)? Bedienung auf Mobil (Antippen statt Hotbar)?

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

### Offene Ideen (Brainstorming, nicht entschieden)
- **Zwei Ebenen, eine Welt:** Oberfläche für Kids (Skaten, Dinos, Ballons, Paint, Crews: bunt, rund, ohne Vorwissen). Zweite Ebene für Eltern und Nerds (trockener Erzähler, Sierra-artige Rätsel, D&D-Anspielungen, Retro-Look, versteckte Referenzen), die nur auffällt, wenn man sie sucht. Keine getrennten Zielgruppen-Welten, Eltern und Kinder sollen zusammen spielen können.
- **Retro-Look als Welt-Manifest-Option:** Glitch, Scanlines, Pixel/CRT als Stil einzelner Welten, die man bewusst betritt.
- **Glitch als Shader/Postprocessing:** RGB-Versatz, verschobene Zeilen, Rauschen, z. B. bei Portal-Übergängen; passt zum gewollten Uncanny-Look. Auch als Pinsel-Option im Paint-Feature denkbar (Pinsel = Stempel mit Abstand, Streuung, Zufall; Illustrator-Pinsel lassen sich nicht übernehmen).
- **Tiefenschärfe (Depth of Field):** Postprocessing in Three.js/R3F, unterstützt den aufblasbaren Miniatur-Look. Kostet GPU-Leistung, daher als abschaltbare Qualitätsoption (v. a. Mobil).
- **Spielleiter-Agent (D&D) und Sierra-Prinzipien:** Agent als Spielleiter mit Erzählerstimme, Quests als Rätsel mit Fundstücken, lustiges Scheitern (Respawn mit Spruch, vereinbar mit "kein Permadeath"), Fähigkeiten wachsen durch Benutzen. Würfel, Klassen und Text-Parser vorerst nicht. Noch offen: feste Erzählerstimme oder pro Welt per Manifest.
- **Gemeinsames Color Grading / Licht als Bindeglied:** Ein einheitlicher Farbton über das ganze Bild (Postprocessing, aus der Palette), damit Kids-Ebene, Retro-Ebene und Welten nicht getrennt voneinander wirken. Dazu Hemisphären-Licht, Dunst in Himmelsfarbe und weiche Kontaktschatten unter Figuren (billig, läuft überall). SSAO/GTAO als abschaltbare Qualitätsoption zusammen mit Tiefenschärfe. Echtes Global Illumination zu teuer für den MVP. Pro Welt per Manifest anpassbar (z. B. Nachtwelt, Retro-Welt).
- **Pixel-Modus (Retro-Look, günstiger):** Szene in niedriger Auflösung rendern (Test: 400×300, 4-fache Pixelgröße), per Nearest-Neighbor hochskalieren, dazu feste Farbpalette, Dithering und Outline per Shader. Rund 16-mal weniger Pixel als HD, spart vor allem bei Schatten, Dunst und Postprocessing; die Dreieckszahl bleibt gleich. Kann Retro-Ebene und Sparmodus für schwache Geräte zugleich sein (als wählbarer Modus oder Hauptlook, noch offen). Erste Probe wirkt kräftiger als HD (siehe `test-rendering/05-knallt-hd-vs-pixel/`). Offen: Palette erweitern (Grün, Hauttöne, Pastelle), Figuren und Kamera größer wählen, damit Avatare lesbar bleiben; Dithering-Rauschen auf Haut und Häusern.
- **Was "knallt" (Erkenntnis aus den Tests):** große Motive aus Froschperspektive, Gegenlicht mit farbigem Fülllicht, Outlines, kräftig gesättigte Farben, gefärbte statt graue Flächen (Straße, Schatten), wenig Unschärfe.
- **Algorithmische Flora (No-Man's-Sky-Prinzip):** Pflanzenarten sind Regeln plus Seed, keine Modelle: L-System (Verzweigung), Phyllotaxis (Blattstellung), Kugelketten für Schläuche und Stämme, Rauschwerte (simplex-noise) für Höhe, Biegung, Farbe. Aus einer Zahl entsteht die Pflanze deterministisch, übertragen wird nur der Seed (passt zu Multiplayer und dezentralem Hosting). Arten und Parameter pro Welt per Manifest, der Weltenbau-Agent kann Arten entwerfen. Passt zur runden Formensprache (aufblasbare Stämme, Ballonkronen). Test mit fünf Arten (Wulstpalme, Ballonbaum, Spiralpflanze, Pilz-Schirm, Schlauchranke) in `test-rendering/08-flora-algorithmisch/`; wirkt eigenständig, läuft auch im Pixel-Modus. Offen: Arten stärker voneinander unterscheiden (Silhouette), Instancing, LOD und Billboards für große Bestände, Leistung auf Handys.
- **Bühne und Actors (visuelle Hierarchie):** Drei Wichtigkeitsstufen. Bühne (Himmel, Boden, Gebäude, Flora): gedämpft (Test: Sättigung ca. 0,7, in der eigenen Farbe entsättigt, nicht zum Violett gemischt), dünne oder keine Outlines. Requisiten (Autos, Rampen, Hütchen, bemalte Flächen): mittel. Actors (Avatare, Dino, Ballons, Quest-Objekte, Portale): voll gesättigt, dicke Outlines, Rim-Light. Wichtigkeit kann sich dynamisch ändern (Quest-Objekt rückt in die Actor-Stufe). Umsetzung billig über Materialfarbe pro Objekt, funktioniert auch im Pixel-Modus. Stärke der Dämpfung pro Welt per Manifest. Test: `test-rendering/09-buehne-und-actors/`.
- **Farbfamilien pro Element:** Jedes Element bekommt eine Palette statt freier Buntheit. Flora: eine Welt-Farbe, ±30° Nachbarfarben, ca. 10 % Komplementär-Akzent (Blütenmitten, einzelne Ballons), Stämme gedämpft in derselben Familie. Gebäude: warme Familie (Rosa, Pfirsich, Gelb) mit Türkis-Akzent an einzelnen Häusern. Straße: Violett einfarbig. Welt-Farbe der Flora ist ein Parameter (Seed bleibt gleich, nur die Farbe ändert sich). Test: `test-rendering/10-farbfamilien-flora/`. Offen: Licht- und Dunstfarbe ebenfalls aus dem Manifest ableiten statt fest rosa (sonst wird Grün durch rosa Licht grau); Akzente wirken noch zu schwach.
- **Moodboard, zweiter Durchgang (Erkenntnisse):** Dreiklang ist Gelb, Pink und Mint/Teal-Grün (nicht Blau-Türkis). Painted-Ladies-Reihen sind bunt gemischt (Rosa, Mint, Gelb, Hellblau). Skate-riot-Szenen haben fast immer Zuschauermengen am Rand, Konfetti und Müll auf dem Boden, Graffiti-Wände, Pastell-SUVs und seltsame Gefährte (Rollschuhe, kleine Räder mit riesigen rosa Rädern). Figuren tragen klobige Sneaker, Goldketten, Sonnenbrillen, Puffer-Jacken. Im Prototyp umgesetzt: Mint als dritter Farbton, bunte Villenreihe, Zuschauer, Bodenkonfetti, klobige Sneaker, gezeichnete 2D-Wolken (Billboards plus Himmelsschicht). Noch offen: Graffiti-Wände, seltsame Gefährte, Neon-Schilder, Feuerwerk.
- **Welt 2 als Eis-Galaxie (aus Ice Truck):** Eiswagen im All vor Galaxien und Ringplaneten, Violett-Orange-Verläufe. Passt als Ziel hinter dem Portal des Prototyps (Welt 2).
- **Manga-Zwischenbilder (aus Manga Zilla):** Schwarzweiße Manga-Panels (Tokyo Tower, Halbton-Raster) als Erzähler-Zwischenbilder oder Cutscenes, passend zur Sierra-Erzählerstimme und zum "zweiten Ebene"-Prinzip.
- **Prototyp "Küsten-Quest" (Artifact, kein Code im Repo):** Spielbar im Browser, ca. 1 Minute: fünf Eiskugeln sammeln, dann Flucht vor aufblasbarem Dino zum Portal. Zeigt Erzählerstimme, Bühne/Actors-Stufen, Pixel-Modus, algorithmische Flora und das Prinzip "Avatar und Erfolge unantastbar, nur lokaler Weltzustand geht verloren" (Aufgeblasen-Respawn). Multiplayer (Geister-Läufe, 2 Spieler live) bewusst erst mit Cloudflare (Workers und Durable Objects), nicht im Artifact (Verbindungen dort blockiert).
- **Welten im Prototyp (Stand Artifact v18, Quellen in `prototype/kuesten-quest/`):** Vier Welten, alle aus Grundformen, Regeln und Seeds gebaut.
  - **Welt 0, die Stadt:** 5×5 Blöcke, 6×6 Kreuzungen, Labyrinth per Zufallscode (Seed), 18 Straßenstücke mit "GESPERRT"-Sperren. Fünf Gebäudetypen (Wohnhaus, Laden, Café, Büro, Burger) mit Schildern, 150 Pflanzen aus Formeln, Zuschauer, 2D-Skyline mit Victorians als Staffelung. Drei Portale sind in Sackgassen versteckt und führen in Welt 1 bis 3; Portal-Radar ("kalt bis heiß") und eine Minikarte, die sich beim Fahren füllt. "Zurück zur Stadt" aus jeder Welt. Offen: 10×10 (zu schwer für Handys), Leben in der Stadt (Passanten, Autos, Skater), Innenräume, Boss in der Stadt.
  - **Welt 1, Küste:** Promenade mit Villen, Meer, Konfetti, Zuschauer; Boss Goldzilla (Eiskugeln sammeln, dann Flucht zum Portal).
  - **Welt 2, Eis-Galaxie:** Regenbogen-Weg im Weltall mit Galaxie-Eiskugeln, Riesen-Eishörnchen, Alien-Publikum, leichterer Schwerkraft; Boss Galaxzilla (Name von Anton).
  - **Welt 3, Nacht-Stadt:** Dächer mit Lücken, Neon-Schilder, Feuerwerk, Wunderkerzen-Eis; Sprünge über Lücken, Neustart bei Absturz; Boss Neonzilla.
- **Spielmechanik im Prototyp (Ideen von Anton):** Skateboard-Wurf (Klick/F) auf Boss und Rivalen, 2 s Cooldown, Board kommt zurück; Kickflip (Shift) mit Applaus der Zuschauer; nervende Rivalen-Skater, die schubsen (Drüberspringen hilft) und sich abschießen lassen; Eis-Fressen, wenn der Boss trifft (der Avatar wird zu Eis, bleibt aber unantastbar, passend zu "kein Permadeath"); Avatar-Karussell mit elf Figuren, Accessoires (Ketten, Brillen, Hüte, Kronen); Pixel-Modus (P).
- **Visuelle Staffelung:** Hinten helle 2D-Skyline, davor zwei Ringe gezeichneter Victorian-Reihen (Dunst, dann kräftiger), davor die 3D-Welt. Wolken als 2D-Sprites, die immer zur Kamera zeigen.
- **Infrastruktur-Plan (Reihenfolge):** (1) Cloudflare Pages für den Prototyp, (2) Worker mit Durable Object pro Welt für den Zwei-Spieler-MVP und Geister-Läufe, (3) Supabase erst, wenn Konten und dauerhafte Daten gebraucht werden (globale Identität, Erfolge). Cloudflare-Konto ist angelegt und mit GitHub verbunden. Stack bleibt Kandidat, Implementierungsphase noch nicht freigegeben (der Prototyp liegt nur als Sicherung auf dem Branch `prototype-kuesten-quest`).
- **Offene Idee von Anton:** "Minecraft-Escape-Puzzle" als Modus oder Level; Details noch nicht erklärt. Vermutlich gemeint: die Escape-Quest "Countdown auf dem Atoll" (siehe Ideenpool, Spielarten und Quests), die aus dem Minecraft-Mod-Konzept stammt. Zu bestätigen.
- **Kinderschutz:** Regeln für Chat, Crews und Fremde, ggf. Eltern-Modus; Tonalität (Dystopie/Uncanny) für jüngere Kinder dosieren. Zielalter noch offen.

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

Entschieden (Formensprache): Figuren und Objekte bestehen aus runden Grundformen (Kugel, Kapsel, Zylinder), das wirkt "aufblasbar" und passt zu Dinos, Ballons und Reifen. Vorteile: wenig Daten, prozedural erzeugbar (auch durch den Weltenbau-Agenten), günstige Rapier-Collider, einheitlicher Look über fremde Welten, einfach für das Paint-Feature. Architektur darf kantig bleiben (Mix aus rund und kantig). Offen: LOD/Instancing wegen Dreieckszahl glatter Formen; Wiedererkennung über Farbe und Silhouette statt Detail.

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
