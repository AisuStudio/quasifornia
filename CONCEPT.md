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
- (Seit 2026-11-02 ersetzt durch die Halbinsel-Karte, siehe unten; die Rasterstadt läuft nur noch unter `?alt=1`.) Die 5×5-Blockmap gab es zuerst: Sie ist **Welt 0, die Stadt** des Prototyps (siehe "Welten im Prototyp"): 5×5 Blöcke, 6×6 Kreuzungen, Labyrinth per Seed, fünf Gebäudetypen, drei Portale in Sackgassen, Minikarte, die sich beim Fahren füllt. Offen dort: Leben in der Stadt, Innenräume, 10×10 zu schwer für Handys. Der Hub-Gedanke baut darauf auf: Gebäude der 5×5-Stadt werden zu Quest-Portalen, statt dass Portale nur in Sackgassen versteckt sind.
- Offen: Was löst ein neues Gebäude aus (abgeschlossene Quest, Sammelgut, Zeit)? Wer platziert sie (automatisch oder Spieler)? Passt "Countdown auf dem Atoll" als ein Gebäude/Portal?

### Inventar (Idee vom Nutzer, 2026-10-31)
Die Figur hat ein Inventar. Fortbewegungsmittel wie das Skateboard verschwinden darin, danach läuft man zu Fuß. Im Inventar tauchen Tools, Schlüssel, USB-Sticks usw. auf, die in Quests gebraucht werden.
- Technisch unkritisch: Inventar ist eine Liste von Item-IDs im Spielerzustand (Zustand-Store plus IndexedDB). Skateboard weg- und herholen ist ein Wechsel des Bewegungsmodus (Rapier-Controller für Laufen/Skaten) plus Ein-/Ausblend-Animation.
- Passt zu: Sierra-Rätseln (Fundstück benutzen), Escape-Quest (USB-Stick, Schlüssel, Tools), Gebäude als Quest-Portale (Schlüssel öffnet ein Gebäude), Emotes/Belohnungen.
- Offen: Welche Items sind global (Identität, "unantastbar") und welche gehören zum lokalen Weltzustand und können verloren gehen? Empfehlung: Fortbewegungsmittel und Erfolge global, Quest-Items lokal je Welt. Wie groß (feste Slots oder Liste)? Bedienung auf Mobil (Antippen statt Hotbar)?

- **Stand im Prototyp (2026-10-31):** Das Inventar gibt es als erste Fassung. Fünf Gegenstände liegen in der Stadt, je einer vor einem passenden Gebäude (Café, Laden, Büro, Wohnhaus, Burger-Laden): Funkzettel, Schraubendreher, USB-Stick, Wartungs-Handbuch und als Bonus der Möwen-Bon (geheime Schmuggler-Losung). Sie sind für die Atoll-Quest gedacht (Funkspruch, Alarm, Patrouillen-Log, Kamera-PIN, Bonus). Das Fenster ("I" oder Knopf) pausiert das Spiel und zeigt gefundene Items mit Beschreibung und Verwendung, ungefundene als "?" mit Ortshinweis. Gespeichert wird im Browser (localStorage), Skateboard steht als fester Eintrag drin. Entscheidung: Hub-Items reisen zwischen Stadt und Quest mit, sind also nicht "lokal je Welt". Offen: Atoll-Welt selbst, Einlösen der Items, Wegwerfen, Server-Speicherung (Supabase).

### Atoll-Einstieg: Labor, gefesselter Mann, 10-stelliger Code (Idee vom Nutzer, 2026-11-01)
Der Zugang zum Atoll ist eine Quest in der Stadt (Hub), keine einfache Portal-Suche.
**Ablauf:**
1. **Gefesselter Mann:** Vor einem besonderen Labor-Gebäude in der Stadt liegt ein gefesselter Mann. Er erzählt, dass Kriminelle den Reaktor übernommen haben und die Insel gerettet werden muss. Er diktiert einen 10-stelligen Code, der die Labor-Tür öffnet.
2. **Code-Eingabe:** 3 Versuche, danach sperrt die Tür für eine Zeit (Brute-Force-Schutz, passend zur Security-Literacy der Escape-Quest).
3. **Eis:** Während der Sperre kann man dem Mann ein Eis bringen. Er trägt Handschellen, der Schlüssel liegt im Labor.
4. **Im Labor:** Den Schlüssel suchen, damit der Mann befreit werden kann.
5. **Danach:** Der befreite Mann bringt einen zum Atoll-Portal.
**Festlegungen (Vorschläge, vom Nutzer mit "Genau" angenommen):**
- **Code zusammengesetzt:** Der Mann diktiert die Ziffern 1 bis 6, die Ziffern 7 bis 10 stehen auf den Stadt-Items (Funkzettel, Schraubendreher, USB-Stick, Wartungs-Handbuch). Die Items haben damit einen echten Zweck.
- **Hörfehler:** Eine der diktierten Ziffern ist falsch (der Mann ist erschöpft). Das Eis macht ihn gesprächig, und er korrigiert sie. So entsteht aus Sperre und Eis ein sinnvoller Kreis (probieren, scheitern, helfen, richtig weiterkommen).
- **Notizen:** Die bekannten Ziffern stehen in einer Code-Notiz im Inventar, damit man nichts auswendig lernen muss.
- **Eis-Quelle:** Ein Eiswagen in der Stadt.
- **Sperrzeit:** 60 Sekunden mit sichtbarem Countdown.
- **Schlüsselsuche:** Der Schlüssel liegt im Labor in einem verschraubten Schaltkasten, dafür braucht man den Schraubendreher aus der Stadt. Der Möwen-Bon (Bonus) verweist auf ein Möwen-Poster neben dem richtigen Kasten. Zwei Attrappen (Spind, Schreibtisch) sind leer.
- **Atoll:** Hinter dem Portal liegt die Insel mit den vier Rätselsystemen der Escape-Quest. Das Labor ist der Eingang; der Reaktor ersetzt den Atomtest-Countdown nicht zwingend, die Dringlichkeit bleibt offen.
**Stand 2026-11-01: A, B und C im Prototyp umgesetzt** (siehe `prototype/kuesten-quest/README.md`). **Atoll gebaut (2026-11-01):** Insel mit vier Systemen (Funkhütte: Caesar-Code mit Verschiebungsregler, Alarmkasten: Logikgatter UND/ODER/NICHT, Kamera-Mast: Werks-PIN 4711 mit 3 Versuchen und 30 s Sperre, Wachhaus: patrouille.log und Muster erkennen), Hauptgate mit vier Lampen, Reaktor (rot, nach dem Öffnen grün), 10-Minuten-Countdown, Boot am Steg, Möwen-Imbiss (Bon gibt +60 s). Schraubendreher und USB-Stick sind Pflicht, Funkzettel und Handbuch geben die Hinweise. Scheitern setzt die Insel zurück (kein Permadeath).
**Bauplan:** A Konzept, B Stadt-Teil (Labor-Gebäude, Mann mit Dialog, Code-Eingabe mit Sperre, Eiswagen), C Labor-Innenraum mit Schlüsselsuche, Befreiung und Portal. Das Atoll selbst ist noch nicht gebaut (Portal führt vorerst zu einem Hinweis).
**Offen:** Dauer und Schwierigkeit der Sperre, ob Kriminelle als Gegner auftauchen, Ton für Kinder (Reaktor, Kriminelle), ob der Mann ein wiederkehrender Charakter wird.

### Weihnachtsspiel im Lebkuchenhaus (Idee vom Nutzer, 2026-11-01)
In der Stadt steht ein **Lebkuchenhaus mit Weihnachtsbeleuchtung**. Dahinter liegt ein eigenes **Weihnachtsspiel**. Vor dem Haus steht **Santa Claus**, dem man ein paar **Fragen beantworten** muss, um hineinzukommen.
- **Zeitplan:** Das Haus ist schon gebaut, mit einem Schild "Öffnet am ersten Advent". Das Weihnachtsspiel und Santa folgen später (erster Advent 2026: 29. November).
- **Passt zu:** Küstenstadt als Hub (jedes Gebäude ein Zugang zu einer Quest), saisonale Inhalte, Quiz-Dialoge wie beim gefesselten Mann.
- **Offen:** Welche Fragen (Weihnachtswissen, Rätsel, Rechnen?), wie viele Fehler erlaubt sind, ob Santa Items verlangt, wie das Weihnachtsspiel aussieht (Wichtelwerkstatt, Schlittenrennen?), ob das Haus nur im Advent zugänglich ist (Datum prüfen) oder dauerhaft.
- **Hinweis:** Haus nur aus Grundformen mit Zuckerguss, Gumdrops, Zuckerstangen und blinkenden Lichterketten.

### Musik-Player der Figur (Idee vom Nutzer, 2026-10-31)
Die Figur hat einen eigenen Player mit Lieblingssongs, es werden nach und nach mehr. Erster Track: "EM'OCEAN" (Freunde des Nutzers aus Tokyo und München, 3:57), Coverart vom Nutzer. Quelle liegt lokal in `sound/` (WAV bleibt per .gitignore außerhalb des Repos), Web-Fassung `sound/em-ocean.m4a` (AAC 160 kbit/s, 4,7 MB).
- Hintergrund (Blog `https://www.aisu.studio/home-blog/the-high-end-theory`, Juli 2023): Die EP "The High End Theory" entstand als Fernprojekt zwischen dem Münchner Beatmaker Packed Rich und fünf Musikern aus Japan (Jazzy Hip Hop und Lo-Fi), Cover von Aisu.Studio (Nutzer), vermittelt über Alex Föll (WSG, Blockopera). Credits dort: Packed Rich (Produzent), you_see, ndfloat, timekilla0118 (MCs), punch_float (DJ/Cuts), @_yasu2000 (Engineering/Mastering). Ob "EM'OCEAN" auf dieser EP liegt, steht im Blog nicht; Zuordnung und Credits pro Track beim Nutzer erfragen.
- Der Player ist ein Inventar-Item (siehe Inventar): Songs können wie Fundstücke freigeschaltet werden (Belohnung für Quests, Fund in der Stadt).
- Tracks als Daten, nicht im Code: Playlist-Liste mit Titel, Künstler, Cover, Datei, Lizenz/Credit. Playlist pro Figur, Welten können zusätzlich einen eigenen Soundtrack im Manifest haben.
- Technik: Browser starten Ton erst nach einer Geste (Start-Button), Schalter für Musik an/aus, AAC statt WAV wegen Größe. Streaming je Titel statt alles vorab laden.
- Rechte: Öffentliches Repo und öffentliche Seite, daher pro Track Zustimmung der Urheber nötig, Credit im Spiel. Ein Track pro Freund bedeutet Auswahl und Kuratierung.
- Offen: Eigene Musik von Nutzern hochladen? (Widerspricht "kein Upload" und wirft Rechte- und Moderationsfragen auf, daher vorerst nein.) Läuft Musik weiter beim Weltwechsel? Mit anderen geteilter Player (Crew hört mit)?

### Notiz-Ideen des Nutzers (2026-11-01, nur aufgenommen, nicht priorisiert)
Orte und Fortbewegung:
- U-Bahn nach Downtown (kostet Scoops); Schiffe und Boote; Transportation Builder.
- Straßennamen in der Stadt.
- Wolken eher im Stil von Eizin Suzuki.
- Sticker-Gag: "Nett hier, aber waren Sie schon mal auf Andromeda?"

Währung und Wirtschaft:
- Scoops (Eiskugeln) sind nicht mit echtem Geld kaufbar. Es gibt wöchentlich einen festen Betrag, mehr verdient man mit Quests. Verwendung: Reisen und Portale, Aussehen, neue Spiele und Level (Wunsch des Sohnes).
- Casino (mathematisch): Rätsel-verpackte Mathe-Games, man verdient Scoops.
- Rarepod: das spielinterne Smartphone (Musik, Fotos, Karten, Blogs, Nachrichten, Quest-News/Jobs, Scoop-Konto als Bezahlsystem).
- E-Mail-Adresse mit Spielername.
- Es gibt Levels.

Bauen und Gestalten:
- Graffiti: An großen Wänden kann man sprühen, dafür braucht man Dosen (gegen Scoops im Laden). Gesprüht wird in einem 2D-Paint-Editor, teilbar. Graffiti bleibt, bis jemand drübersprüht; mit Likes bleibt es länger geschützt.
- Avatar-Builder für das Bau-Team.
- Weihnachtsquest: Krippe aus Fundstücken im Haus zusammenstellen. Das Haus hat einen riesigen Keller mit Schneelandschaft und Mini-Dinos. Ist die Krippe fertig, teilt man sie und braucht mindestens 5 Likes.

Lernziel und Easter Egg:
- Kinder sollen systemisches Denken lernen.
- Easter Egg: Keller mit Hausmeister, in dem man den Tech-Stack besichtigen kann (Datenbank usw.). Wie man an den Schlüssel kommt, ist offen.

Offene Fragen aus der Notiz:
- Was braucht ein Multiplayer-Test? Wie lässt sich das Spiel technisch verschlanken, ohne visuell zu verlieren (alles 2D)? Was braucht es für eine eigene Domain?
- Name klären (Quasifornia).
- Geschäftsmodell trotz Freemium und freier Software (Merch-Shop?); Business-Plan.
- Wie meldet man sich als Contributor an und fügt Welten hinzu? Sinnvoll: ein Worldpack zum Herunterladen, auf das der Browser zugreift?
- Multiplayer als offene Welt mit Orten auf Planeten.
- Kollaborationsvertrag für Artist- und Konstruktions-Collabs.
- Musik: Ansatz wie GTA-Radio, aber Indie; weitere Artist-Collabos geplant; Rechte-Go pro Song noch einzuholen (Stand: Packed Rich hat mündlich zugesagt).

### Karte: Halbinsel Port Lupo (Entwurf vom Nutzer, 2026-11-02, gebaut, ersetzt die Rasterstadt)
Die Stadt ist jetzt eine Halbinsel nach dem SVG des Nutzers (`prototype/kuesten-quest/src/map/Map_1.svg`). Die alte 5×5-Rasterstadt mit Mauer gibt es nur noch unter `?alt=1`, Standard ist die neue Karte. Der Nutzer pflegt die Karte selbst und fügt nur hinzu, ändert nichts Bestehendes.
- **Pipeline (seit 2026-11-03 aus Affinity):** `src/map/map.svg` (fester Name, wird bei jedem Update überschrieben; `Map_1.svg` ist nur noch Historie) → `node tools/make-map.js` → `src/map/map.json` → `src/karte.js`. Der Maßstab wird automatisch aus der breitesten weißen Linie (Hauptstraße = 15 Einheiten, aktuell 62,5 in Affinity, Faktor 4,1667) abgeleitet, 1 Karteneinheit = 0,5 m. Erkennung zuerst über Ebenennamen (z. B. `Palmen`, `Bench`, `Hafenmauer`, Ziffern am Ende egal), dann über Farben mit Toleranz; Gruppen-Transformationen und auf mehrere `<text>` verteilte Labels ("Basketball" + "Court") werden berücksichtigt; unbekannte Ebenen, Farben und Beschriftungen erscheinen als Warnung. Die Anleitung steht im Kopf von `make-map.js`. Straßen mindestens 11 Einheiten breit.
- **SVG-Konventionen:** beige = Land (der Inselumriss), blau = Meer, rot durchgezogen = Hochbahn über der Erde, rot gestrichelt = Untergrund (S-Bahn/U-Bahn, bisher nur Minikarte), graue Fläche = Parkplatz, Buchstabenmarker: C = Café Pengu, B = AstroBurger (angenommen). Hügel sind aus der Karte entfernt.
- **Strand (Entscheidung 2026-11-02):** Strand ist das Land außerhalb der Straßen (der beige Inselumriss). Keine Mauer, keine Kante: Der Strand schließt direkt an, ist aber zunächst nicht betretbar (Sperre später, Vorschlag: Absperrband mit Schild). Noch nicht gebaut.
- **Küstenrennen:** vorne im Westen an der Uferpromenade (Küstentor).
- **Gebaut:** Gelände mit Wasser, Straßen, Gehsteigen, Parks, Parkplätzen, 44 Gebäude (Café, Burger, P-Mart, Labor, Lebkuchenhaus, Casino, Resort, Einkaufszentrum, Turm), Hochbahn mit Rampe und Tunnelmund, Zug, Minikarte (150 px = 300 m), 2 Portale, Items, Unterwelt mit Leiter und Turm Tarxarox, 5 Graffiti-Wände. Kollision per Raster (Wasser und Gebäude blockieren). Tempo in Port Lupo 1,6× (Reise 7,2, Höchst 14,1; Schätzwert).
- **Automatisch platziert (Nutzer kann per Marker verschieben):** Portale, Leiter-Busch, Tarxarox, Graffiti-Wände, Serafin.
- **Offen:** Häfen und Marinas (Nutzer zeichnet sie konkret), Gesamtkarte per Taste oder im Rarepod (die Minikarte zeigt nur 300 m), Haltestelle und Mitfahren in der S-Bahn, Untergrund-Strecken, Festland und Atoll-Insel (bisher nur Gelände), Beach Volley, X-Fit, Basketball, Marina Club Casino als Mathe-Casino, Bordstein-Grind und Performance auf der neuen Karte ungetestet, ein schwarzer Fleck am Horizont in einer Brückenansicht ungeklärt.

### Stand Port Lupo (2026-11-03, Prototyp auf Branch notizen-ideen, Test 01–34)
- **Sportplätze (gebaut, aus map.json `courts` + Labels):** Basketball Court (Fläche mit Label "Basketball Court"): Markierungen, zwei Körbe, Maschendrahtkäfig mit einer Öffnung (zur nächsten Straße, seitlich versetzt wegen des Korbpfostens). X-Fit (Label "X-Fit"): Outdoor-Fitness mit Klimmzugstangen, Barren, Ringen, Klettergerüst, Bank, Schild. Beach-Volleyball (Label "Beach Volley", Fläche im Park, x≈2066–2121, y≈1267–1308): Sand, Spielfeldlinien, Netz, Ball. Zaun, Geräte, Pfosten und Netz blockieren, die Spielflächen sind befahrbar. Minikarte: Marker B, X und V. Karte unverändert, nur ergänzt. Die Kollisionsmaske hat 0,5 m Auflösung, dünnere Teile bekommen eine Mindestdicke.
- **Später (nicht gebaut):** ein zweites Beach-Volleyball-Feld am Strand.
- **Neue Karte `QF_Map_2` (map.svg, 2026-11-03):** Alle 44 alten Gebäude sind erhalten (3 bis 5 Einheiten verschoben, Küste im Süden leicht umgezeichnet), dazu neu: **Polizeiwache** (Label "Police", Schild POLIZEI, blaues Band, Wappen, Dachlicht; die Polizisten starten vor der Tür), **Schule** (Fahne, Uhr), **Surf Shop** (bunte Surfbretter vor dem Haus), **zwei Beach Shacks** (Markise, Schild), **Warehouse** (Rolltore, Dachlüfter). Steht eine Beschriftung neben dem Haus statt darin, wird sie dem nächsten freien Gebäude bis 22 m zugeordnet. Neue Ebenen: **Palmen** (20 gezeichnete hohe Palmen, zusätzlich zu den automatischen), **Bench** (17 Parkbänke, auf 3,4 m Länge begrenzt, blockieren), **Hafenmauer** (graue Mauer, 2,3 m hoch, blockiert, auf der Minikarte sichtbar). Weitere Marker auf der Minikarte für Polizei (!), Schule (S), Surf Shop (W), Beach Shack (s), Warehouse (L) und Leuchtturm (▲).
- **Leuchtturm und Tarxarox:** Der rosa Kreis an der Westküste (Label "Leuchtturm / Tarxarox") ist oben ein roter-weißer Leuchtturm mit Galerie, Laterne und drehendem Lichtstrahl (nur nachts), unten in der Unterwelt steht an derselben Stelle der Turm Tarxarox (ersetzt die automatische Platzierung). Oben ist der Leuchtturm nur sichtbar, unten verschwindet er. Serafin-Quest geprüft: von der Leiter zum Turm führt ein freier Weg, die Aktion "Aufzug hinauf (Tarxarox)" erscheint am Turmfuß.
- **Offen bei der neuen Karte:** zwei weiße Formen ohne Ebenennamen (bei etwa x 1832–1861, y 1438–1560) werden ignoriert und als Warnung ausgegeben; Innenräume gibt es für die neuen Gebäude nicht; das Atoll ("Atoll Lab & Bunker") ist weiter nur Gelände. Die Maske hat 0,5 m Auflösung, dünne Teile (Zaun, Bänke, Mauer) blockieren großzügiger.
- **Unterwelt-Steuerung:** Vorwärts und Rückwärts sind vertauscht (W oder Pfeil hoch bremst, S oder Pfeil runter fährt), links/rechts wie oben. Touch hat dafür jetzt eine Bremse-Taste. Turm Tarxarox unverändert.
- **Look (Pacific Sim):** Tag-und-Nacht-Zyklus (30 Minuten, Start am Mittag), Pastellfarben, Filmkorn, Meer mit Verlauf und Schaumkante, natürliche hohe Palmen, Painted-Lady-Häuser (Giebel, Erker, Türmchen) und Art-déco-Kronen, Bahnhofshalle, Retro-Autos, rosa Kaiju-Statuen. Offen: dritte Kaiju-Statue, Rollschuh-Passanten, Leistung auf Handys prüfen (über 1,4 Mio. Dreiecke, über 1200 Zeichenaufrufe).
- **Graffiti:** überall sprühen (Fassaden, verbotene Wände), Haltbarkeit vorerst ein Jahr (früher 48 Stunden; der Nutzer lässt die Graffiti erstmal hängen, später vielleicht ein Reinigungsjob), Server-Speicher in einem Cloudflare Durable Object (im Artifact nur lokal). Offen: Moderation (Meldeknopf, Alterseinstellung, Elternkonto), kein Upload-Schutz außer Größen- und Formatprüfung.
- **Polizei:** Countdown startet 2 s nach Beginn des Sprühens an einer verbotenen Wand (Tag 1 Minute, Nacht 3 Minuten). Zwei Polizisten auf Rollschuhen, Verfolgung im Sichtradius (42 m, Sichtlinie), dreimal aus dem Blick oder ruhig versteckt = Polizei gibt auf, bei Festnahme Nahaufnahme und 10 Scoops Strafe. Offen: Polizeistation zeichnet der Nutzer in die SVG (Label mit "Polizei" oder "Police"), dann starten sie dort. Idee: Anfahrt im Auto im Stil des gezeigten Hornet-Autos, Aussteigen im Sichtradius.
- **Systemisches Denken:** siehe Abschnitt "Leitthema: Ethical Hacking und systemisches Denken" (Quest-Ideen, Methode, offene Fragen).
- **Hosting:** Cloudflare-Worker mit Passwort (`SITE_PASSWORD`) und Durable-Object-Speicher; Push nach `main` löst das Deployment aus.

### Mehrspieler (Freundes-Raum, bis 5 Personen, Stand 2026-11-03)
- **Idee des Nutzers:** Nur für Freunde, höchstens 5 Personen, alle sehen dasselbe in Echtzeit, Quests kann jeder machen, auch wenn sie ein anderer schon gemacht hat. Die Polizei jagt, wer zuerst gesprüht hat; ein zweiter Wagen kann ausrücken (zum zweiten Sprüher, sonst hilft er nach 30 s bei der Jagd auf den Ersten); wer vor der Wache steht, sieht den Wagen ausrücken.
- **Gebaut (Schritt 1):** Raum als Cloudflare Durable Object mit WebSocket (`worker/room.js`, Route `/api/room/<name>`, hinter dem Passwortschutz, fremde Herkunft abgelehnt). Beitritt über `?raum=name`, auf dem Startbildschirm unter "Mit Freunden spielen (bis 5)" (erscheint nur, wo der Server antwortet). Der Server verteilt nur Positionen (ca. 10 Mal pro Sekunde, begrenzt auf 25 pro Sekunde und Spieler, Werte geprüft) und liefert die gemeinsame Uhr; er simuliert die Welt nicht. Andere Skater mit Skin und Namensschild, Punkt auf der Minikarte, gleiche Tageszeit für alle (Server-Uhr), Beitritt und Austritt werden gemeldet, Unterwelt und Oberwelt sehen sich nicht. Namensfeld auf dem Startbildschirm ("Dein Name", bis 12 Zeichen, nur Buchstaben und Zahlen); Spielstand, Scoops, Quests und Items bleiben pro Person. Ohne `?raum` ändert sich nichts (Einzelspieler).
- **Noch nicht (Schritt 2):** Polizei im Raum (gemeinsam, erster Sprüher, Streifenwagen, zweiter Wagen), Riesen-Dinos gemeinsam (heute pro Spieler), Emotes (gibt es noch nicht), Tricks der anderen animiert, Chat (bewusst nicht), Moderation.
- **Offen und ungeprüft:** Ob die WebSocket-Verbindung hinter dem Passwortschutz in Brave und auf Handys durchkommt (lokal und im Test funktioniert sie mit dem Passwort im Kopf der Anfrage). Handy-Leistung mit 5 Spielern. Der Name ist Freitext (nur Buchstaben und Zahlen), bei Freunden unkritisch, für Öffentlichkeit nicht.

### Mehrspieler Schritt 2 und Terminal-Chat (Stand 2026-11-04)
- **Gebaut:** Riesen-Dinos laufen nach der Server-Uhr, alle sehen denselben Dino am selben Ort. Polizei im Raum: Der erste Sprüher wird gejagt, nur er sieht Warnung und Countdown, alle sehen Streifenwagen und Polizisten, nur der Gejagte zahlt (10 Scoops). Ein zweiter Sprüher bekommt einen zweiten Wagen, ein dritter wird abgewiesen. Der Browser des Gejagten rechnet die Polizei, der Server verteilt nur Rollen und Daten.
- **Terminal im Rarepod (Reiter "Terminal", Tester-Idee):** `/chat name passwort` erstellt einen Raum oder tritt bei, `/verlassen`, `/hilfe`; Text ohne `/` geht an alle im Raum. Wer als Erster in einen leeren Raum kommt, legt das Passwort fest (Server speichert nur einen Hash); es gilt, bis der Raum leer ist. Nachrichten höchstens 200 Zeichen, nicht gespeichert, nur als Text angezeigt. Eingehende Nachrichten erscheinen unten links für 14 s.
- **Bewusst nicht:** globaler Chat, Verlauf, Moderation (geschlossene Beta; vor einer öffentlichen Version pro Welt abschaltbar machen). Geheimbefehle ("Hacks") und eine Doku-Seite dafür kommen erst später.
- **Steuerung und Anstoßen (gebaut, 2026-11-04):** Fahren nur mit WASD, Pfeiltasten sind Tricks (↑ Kickflip, ← Pop Shove-it, → 360 Flip, Shift/Q/R weiter als Ersatz). Beim Beschleunigen stößt der Skater mit dem hinteren Bein an (Ausfallschritt, Oberkörper und Arme gehen mit), ab ca. 60 % Höchsttempo rollt er nur noch; die Arme zappeln beim Fahren weniger. Alt/Option-Kombis gibt es noch nicht (es gibt erst drei Tricks). Andere Spieler sehen die Anstoß-Animation noch nicht.
- **Boards (2026-11-04):** Popsicle-Form mit abgerundeten Enden und Kicktails, Formen als Tabelle `BOARD_SHAPES` (Breite, Länge, Kicktail, Dicke), neue Formen später als Eintrag. Geplant: Grafik auf dem Deck über das Paint-Feature (kein Upload), alte Popsicle-Designs des Nutzers kommen vom anderen Rechner.
- **P-Mart-Innenraum (gebaut, 2026-11-04):** Die Ladentür in Port Lupo führt in einen eigenen Raum (Level 7, wie das Labor): Gondelregale mit Sprühdosen und Skins, ein leeres Regal "Boards · bald", Kühlregale, Kasse mit Kassiererin, Ausgang unten. Am Regal oder an der Kasse öffnet sich der Laden im Rarepod (Kaufen mit Scoops), beim Dosenregal scrollt er zu den Dosen. Bei laufender Polizeijagd kommt man nicht hinein. Offen: Waren sind noch Deko (gekauft wird im Rarepod), andere Spieler sehen einen nicht im Laden, weitere Läden (Hotel) fehlen.
- **Baukasten und Builder (gebaut, 2026-11-04, Version 1):** Bauplätze sind rote Umrisse (Linienfarbe `#e26868`, Ebene "Bauplatz") in der Karte, 17 Stück im Nordosten (13 bis 35 m, 130 bis 545 m²). Ein Text darin bestimmt den Typ: Residential/Wohn = Wohngrundstück (Häuser, Garten, Dach), Commercial/Gewerbe = Gewerbegrundstück (Tür, Schaufenster, Neonschild), ohne Text = frei. Das Raster liegt über dem schiefen Umriss, nur Zellen innerhalb sind baubar; +z zeigt zur nächsten Straße. Fallback ohne Umrisse: Text `Bauplatz` oder `Bauplatz 24` als Quadrat. Am Bauplatz startet der Builder direkt im Spiel: Kamera kreist über dem Grundstück, Gitter mit 2-m-Zellen, bis 6 Stockwerke. Klick setzt, Rechtsklick entfernt, Ziehen dreht die Kamera, Rad zoomt, R dreht, Z macht rückgängig, P ist der Pinsel, X der Radierer, Esc speichert. Jede Zelle hat ein Teil (38 Teile: Formen wie Würfel, Platte, Rundturm, Torbogen, Treppe; Dächer wie Satteldach, Tonne, Pyramide, Kuppel, Dachgarten, Solar; Garten wie Baum, Palme, Teich, Pool, Zaun, Bank) und je Seite eine Deko (Fenster in fünf Formen, Tür, Rolltor, Glastür, Balkon, Markise, Neonschild). 12 Pastellfarben. Fertige Häuser versperren den Weg. Bauauftrag (Version 1): vier Bauteile, eine Tür, zwei Fenster, ein Dach, dann einmalig 50 Scoops. Teile sind Einträge in `BAU_PARTS` (`src/bauen.js`): neue Formen, Möbel, Sicherheitstechnik später dort ergänzen.
- **Organische Formen (Tester-Idee Fuller, gebaut):** Teile 'Geodätische Kuppel', Blase, Ei, Ufo-Scheibe, Muschel, Röhre (Reiter "Organisch") und Drehung in 45°-Schritten. Kurven und Winkel sind damit möglich; echte freie Formen (Splines, Wände auf beliebigen Linien) sind nicht gebaut.
- **Karte QF_Map_3 (2026-11-04):** Neu: 17 Bauplätze, Skatepark, Park- und Lieferzone (vierter Parkplatz), Backoffice, mehr Palmen und Bänke. Die Pipeline fügt zerlegte Textfragmente jetzt zusammen (Affinity zerlegte "P" + "-Mart"). `src/map/Map_2.svg` ist die letzte Vorversion.
- **Skatepark (gebaut, 2026-11-04):** Der Sportplatz mit der Beschriftung "Skatepark" bekommt Betonboden, einen befahrbaren Pool (Mulde mit 1,6 m Tiefe, organisch runde Form, flacher Boden und nach oben gekrümmte Wand, die zum Rand hin steiler wird, mit Rohr als Rand; Gefälle beschleunigt und bremst). Der Zaun läuft an der Straße um den ganzen Block (nicht nur um den Sportplatz-Umriss), mit zwei offenen Toren; der Rest der Fläche ist Aufenthaltsbereich mit Bänken am Zaun und Pflanzkübeln in den Ecken. Hochbahn-Säulen stehen nie im Block (sie rücken entlang der Trasse nach außen). Der Pool (Radius bis 7,5 m) liegt im freiesten Punkt des Blocks mit mindestens 2,2 m Abstand zum Zaun, Zaun rundherum und ein offenes Tor zur nächsten Straße. Der Zaun verhindert, dass man von außen in den Pool fällt. Offen: Rampen, Rails und Treppen im Park, Tricks an der Poolkante (Coping), weitere Becken.
- **Backoffice (2026-11-04):** Die Anmeldung für die Lagerhalle ist ein Gebäude mit Schild und einer Aktion; heute nur ein Hinweis "kommt bald". Lagerjobs müssen geplant werden.
- **Musik und Decks aus Cloudflare R2 (gebaut, 2026-11-04):** Die Buckets heißen `sound` (Binding MUSIK) und `designs` (Binding DESIGNS, Ordner `decks/`). Der Worker liefert `/api/musik` (Liste, Titel aus der Datei `musik.json` im Bucket oder dem Dateinamen) und `/musik/<datei>` (Streaming mit Range), dazu `/api/designs` und `/designs/<pfad>`; alles hinter dem Seitenpasswort. Im Rarepod: Musik mit Titelliste und Vor/Zurück, Reiter "Decks" mit Vorschau; das gewählte Design liegt auf der Oberseite des Boards (Querformat wird gedreht). Ohne R2 bleibt `em-ocean.m4a` neben der Seite. Offen: `dist/em-ocean.m4a` liegt noch im öffentlichen Repo (kann raus, sobald der Bucket-Track bestätigt ist; bleibt in der Historie); Titelangaben in `musik.json` anlegen; ob die Deck-Bilder richtig herum liegen (Nase und Heck), müssen Tester prüfen; Deck-Grafik nur auf der Oberseite, nicht auf Unterseite und Kicktails.
- **Offen beim Bauen:** Häuser werden pro Person im Browser gespeichert, andere sehen sie nicht (Server-Speicher wie beim Graffiti fehlt); Innenräume und Möbel (Häuser sind noch nicht betretbar); die eigentlichen Bauaufträge (Wünsche von Figuren, Anforderungen je Auftrag) müssen geplant werden; Stil-Vielfalt über Victorians und Büros hinaus ist über die Teile möglich, weitere Fassaden- und Dachformen kommen mit dem Feedback; Kamera kann in Nachbarhäusern stecken; Grafiken auf Boards und Fassaden später über das Paint-Feature.
- **Offen:** Tippen im Rarepod pausiert das eigene Spiel; ein Chat-Schnellzugriff ohne Pause ist nicht gebaut. Der Browser des Gejagten ist für die Polizei zuständig (Pause oder Tab zu wirkt sich aus). Ungeprüft auf echtem Cloudflare.
- **Reihenfolge laut Nutzer (Stand 2026-11-04):** 1 Steuerung (WASD, Pfeile/Shift für Tricks), 2 Anstoß-Animation und natürlichere Arme und Beine, 3 Terminal mit Chat (gebaut), dann 4 PMart-Innenraum (erster betretbarer Raum), 5 Bau-Quests mit Baukasten (Möbel, Fenster, Türen, Pflanzen; Quests müssen erst geplant werden). Zurückgestellt: neue Songs von Packed Rich (nur fürs Spiel freigegeben, Dateien müssen erst umgerechnet werden, Speicherort offen) und Sicherheitssystem-Reparaturen (brauchen die geplanten Quests). Spiel vorerst nur für Desktop.

### Glitches und die Dose UBIQ (Idee des Nutzers, 2026-11-05, Version 1 gebaut)
- **Umfang:** Höchstens etwa 2 % des Spiels. Kein Hauptthema, fast ein Easter Egg und ein Wink an die Erwachsenen. Deshalb klein halten: wenige Stellen, keine eigenen Karten-Markierungen, kein Radar, keine Gaswellen, keine Belohnungs-Skins in Version 1.
- **Idee:** Eine besondere Sprühdose **UBIQ** (Wink auf Philip K. Dicks "Ubik"; heißt bewusst nicht Ubik) mit dem Zusatz **"Phill's Phantastic Phormula"** (Wortspiel auf die Initialen P.K.D.). Endgültiges Design folgt vom Nutzer. Sie repariert Glitches: verschränkte Figuren oder Items (stecken in Wand oder Objekt), Hänger (beim Drehen im Objekt gefangen), Dinge unter oder über dem Boden. Das Ding wird "erlöst", an einen besseren Ort gesetzt, dafür gibt es Scoops.
- **Lore:** Die Glitches sickern wie Giftgas aus der Unterwelt. Nur als Andeutung in Dialogen, nicht als eigene Quest-Linie.
- **Echte Fehler als Sicherheitsnetz:** Das Spiel erkennt Verschränkungen selbst (Position in fester Rasterzelle) und meldet jeden Fund an `/stats` (Typ, Ort). Die Ursachen echter Bugs werden trotzdem repariert; wer eingeklemmt ist, wird nach einigen Sekunden auch ohne Dose befreit.
- **Werte (Entwurf):** Dose 30 Scoops im P-Mart, 5 Ladungen, Nachfüllen 25, 15 Scoops pro Reparatur.
- **Belohnung:** Nur wer repariert bekommt Scoops. Mithelfer bekommen nichts (lässt sich nicht nachvollziehen).
- **Geteilter Zustand (gebaut):** Ein repariertes Ding ist für alle repariert. Ein kleines Durable Object (`worker/glitch.js`, `/api/glitch`) merkt sich die Kennungen; wer zuerst repariert, bekommt die Scoops und verbraucht eine Ladung (atomar, auch bei gleichzeitigen Versuchen). Alle anderen sehen den Glitch nach spätestens 45 s als repariert; versuchen sie es früher, kommt "Schon repariert von NAME" ohne Verlust einer Ladung. Ohne Server (Artifact, offline) bleibt es lokal. Zurücksetzen: Knopf "Glitch-Stände zurücksetzen" auf `/stats` (nur mit Auswertungs-Passwort). Wichtige Sammelgegenstände dürfen nie von UBIQ abhängen: UBIQ verändert nur ihren Ort, eingesammelt wird weiter pro Person.
- **Später:** Neue Glitches, die aus der Unterwelt nachsickern (zeitgesteuert über die gemeinsame Uhr), kommen in einer eigenen Runde, sobald die Glitch-Logik gut festgelegt ist.
- **Orte:** Collectibles, Portale und NPCs haben feste Stellen (nichts wird zufällig neu verteilt), deshalb sind echte Fehlerstellen immer dieselben.
- **Gebaut (Version 1, lokal pro Person):** Dose UBIQ im P-Mart (Reiter Laden, 30 Scoops, 5 Ladungen, Nachfüllen 25) und im Inventar. Drei feste Glitch-Stellen: ein Passant in der Wand nahe der Leiter zur Unterwelt, ein Kristall, der sich durch eine Wand beim P-Mart dreht, ein Brett, das senkrecht im Boden vor dem Skatepark-Tor steckt. Sie flackern (Farbversatz, Aussetzer); an ihnen steht die Aktion "UBIQ sprühen". Die Reparatur gibt 15 Scoops, setzt das Ding an einen besseren Ort und wird gespeichert (`kq-ubiq`). Ohne Dose oder bei leerer Dose erklärt ein Hinweis, wo es Nachschub gibt. Sicherheitsnetz: Sammelgegenstände in festen Rasterzellen werden automatisch zum Glitch (`item`), als Ereignis `glitch` an `/stats` gemeldet (Karte "Glitches (UBIQ)") und lassen sich ebenso reparieren.
- **Idee (Nutzer, 2026-11-05): Der Kristall beim P-Mart ist der Übergang nach unten.** Er soll teilweise **pixelig** sein, als hätte er eine **zweite Pixel-Hülle** (Vorgeschmack auf den festen Pixel-Look der Unterwelt). Wie der Übergang funktioniert, ist offen. Umsetzungsmöglichkeiten: Hülle aus kleinen leuchtenden Würfeln um den Kristall, die flackern und teils fehlen; beim Berühren ein Pixel-Auflösen des Bildes und Ankunft in der Unterwelt; oder: Die Reparatur **öffnet** den Übergang, statt ihn zu schließen.
- **Folge (Nutzer, 2026-11-05): Die Leiter zur Unterwelt entfällt,** der Kristall ist der Eingang. **Serafin** muss dem Spieler dann erklären, was unten zu tun ist, denn dort wartet eine Quest. Der Nutzer denkt noch darüber nach. Abhängigkeiten, die dabei zu beachten sind: (1) Die Serafin-Quest und die Unterwelt-Tests setzen heute die Leiter voraus (auch der Weg zurück nach oben). (2) Der Glitch "Passant in der Wand" steht bei der Leiter. (3) Wenn die Reparatur den Kristall erst öffnet, wird UBIQ **Pflicht** und ist kein Easter Egg mehr; Ausweg: Der Kristall funktioniert ohne UBIQ, oder Serafin gibt die Dose als Geschenk des Mentors (Heldenreise).
- **Positions-Anzeige (gebaut, 2026-11-05):** Taste **V** zeigt unten links x, z, Blickwinkel (0° = Norden, im Uhrzeigersinn, mit Himmelsrichtung), Höhe, Ort (Stadt, Unterwelt, Level) und die Build-Kennung; Klick kopiert die Zeile. Gedacht für die Glitch-Inventur, damit Funde sofort einen Ort haben. Der Zustand wird gemerkt.
- **Idee (Nutzer, 2026-11-05): Reinigungsjob und Wandbild-Auftrag.** Die Graffiti bleiben erstmal an den Wänden. Mögliche Aufträge: Wände reinigen (Scoops) und das Gegenstück, eine große freie Wand als legales Wandbild bemalen (Kachel für Kachel mit dem vorhandenen Editor, Fortschrittsanzeige, Belohnung bei etwa 70 %, keine Polizei). Wand, Auftraggeber und Dauer sind offen.
- **Ideensammlung (Nutzer, 2026-11-05), noch nichts entschieden oder gebaut:** (1) **UBIQ ist nicht käuflich.** Man bekommt die Dose **in der Unterwelt, wenn man den "Dude" befreit hat** (vermutlich der Geist aus der Serafin-Quest; Bestätigung ausstehend). Sie ist damit das Geschenk des Mentors in der Heldenreise und ein Belohnungsgegenstand. Folgen: Karte im P-Mart-Laden entfällt, Nachfüllen anders lösen (Quelle in der Unterwelt?), Tests 48 und 49 anpassen. (2) **Das Anwenden fühlt sich noch formal und ohne Magie an** (Enter drücken, Scoops). Das soll später verbessert werden; erst Ideen sammeln.
- **Namen und Bezüge (Nutzer, 2026-11-05):** Der **Dude** ist der **befreite Geist** aus der Serafin-Quest; man bekommt UBIQ in der Unterwelt von ihm. **Serafin könnte Phillip heißen** und der Geist **Horselover** (Wink an Philip K. Dick). Dann ist "Phill's Phantastic Phormula" Serafins Rezept, und der Geist trägt die Formel in die Unterwelt. Nur Wink, keine Inhalte aus Dicks Büchern übernehmen.
- **Zwei Währungen (Idee des Nutzers):** Später könnte es in der Unterwelt einen eigenen P-Mart mit wilden, anderen Waren geben, und dort sammelt man **nicht Scoops, sondern etwas anderes** (zwei Währungen). Vorschlag von Claude: **Sporen** (aus dem Myzel, das lebende Netz) als Unterwelt-Währung, Scoops bleiben die Währung von Port Lupo. Vorteile: Die Welten fühlen sich verschieden an, kein Preis-Durcheinander. Kosten: zusätzliche Anzeige, Balance und Tests. Entscheidung offen.
- **Fund (Nutzer, 2026-11-05): Der neue Kristall ist sichtbar, aber der Spieler steht dabei in einer Überlappung zweier Gebäude (Inneres der Wand).** Der Nutzer findet das gut: Der Kristall **erscheint mitten im Glitch**. Idee: Diese Überlappung nördlich des P-Mart (Büroturm und rosa Haus, etwa x −26, z 45) bewusst als **Glitch-Raum** stehen lassen und gestalten (Pixel, Flackern, kein Feststecken), mit dem Kristall als Eingang nach unten. Andere zufällige Gebäudeüberlappungen (17 weitere Paare) bleiben Korrekturkandidaten.
- **Ideen für mehr Magie beim Anwenden (Vorschläge von Claude, nur gesammelt):** die Dose summt oder tickt stärker, je näher ein Glitch ist (wie ein Zähler); Dose schütteln vor dem Sprühen (Haltetaste, Phill-Formel mischen); der Glitch löst sich Pixel für Pixel auf und setzt sich "nass" neu zusammen; die betroffene Figur spricht zuerst gebrochen, dann Wort für Wort klar; ein Funkenregen, den alle in der Nähe sehen; ein kurzer Spruch von "Phill" aus der Dose; Zutaten für die Formel (zum Beispiel Myzel oder Kupfer aus der Unterwelt) statt Kauf.
- **Offen:** Endgültiges Design der Dose (jetzt Platzhalter); eingeklemmte Spieler werden bisher nur wie vorher befreit (kein UBIQ-Bezug); mehr Stellen nur bei Bedarf (Umfang bleibt klein).

### Meta-Geschichte: Emmet Ray, der Hyperraum und die Unterwelt (Idee des Nutzers, 2026-11-05, Konzept)
- **Kern:** Die Glitches aus der Unterwelt entstehen, weil sich **Emmet Ray** per Transformation in den Hyperraum hat transportieren lassen. **Präzisierung des Nutzers:** Er ging **digital** in den **Nano-Hyperraum**, also **nicht in die Weite, sondern nach innen** (ins Allerkleinste). Der Spieler erfährt mit der Zeit, warum es die Unterwelt gibt, und versucht, die Ursache zu beheben (nicht nur Symptome mit UBIQ).
- **Aufbau:** Heldenreise nach Campbell und Vogler mit Mentoren (Serafin ist bereits Mentor). Nicht linear und nicht "durchzuspielen" wie Minecraft, eher wie eine **Serie**: Das Gesamtbild setzt sich nach und nach aus Episoden, Funden und Gesprächen zusammen.
- **Umfang:** Die UBIQ-Dose bleibt das kleine Easter Egg (etwa 2 %). Die Meta-Geschichte ist die verborgene tiefere Ebene, die man entdecken kann, aber nie braucht, um das Spiel zu spielen.
- **Zwei Richtungen (Vorschlag):** **Nach außen** führt das Megalevel (Planet verlassen, mit Mekkie), **nach innen** führt der Weg zur Ursache (Unterwelt, dann der Nano-Hyperraum). Die Maßstabsleiter: Planet, Port Lupo (Menschengröße), Unterwelt, Nano. Die Glitches wären die Stellen, an denen das Allerkleinste durchsickert (Pixel, Flackern). Die Reparatur von Mekkie von kleinen Teilen aus (Schraube, Sensor) wäre schon der Einstieg in die Richtung nach innen. Später könnte ein Zoom-Level den Spieler selbst klein machen.
- **Der Kreis schließt sich (Idee des Nutzers, Anspielung auf Rudy Ruckers "zirkulare Skala"):** In Ruckers Roman *Spacetime Donuts* (1981) führt der Weg ins Kleinste zurück ins Größte; Frank Zappa ist laut Rucker ein Einfluss auf das Buch. Für Quasifornia: **Das Megalevel (nach außen) und der Nano-Hyperraum (nach innen) sind derselbe Ort.** Wer mit Mekkie den Planeten verlässt, kommt dort an, wo Emmet verschwunden ist. Die Maßstabsleiter ist ein Ring: Planet, Port Lupo, Unterwelt, Nano, und wieder Planet. Das Ende der Heldenreise (Rückkehr mit dem Elixier) fällt so mit dem Anfang zusammen. Deutsche Ausgabe (laut Nutzer, Wikipedia-Eintrag zu Rucker): *Gödel, Zappa, Rock'n'Roll. Ein Roman vom Paradies der Zukunft*, übersetzt von Udo Breger, Fischer Taschenbuch 8713, Frankfurt a. M. 1989, ISBN 3-596-28713-8. Das ist *Spacetime Donuts* (1981).
- **Referenz: Rudy Rucker, *Postsingular* (2007, unter Creative-Commons-Lizenz, Fortsetzung *Hylozoic* 2009):** Nanoroboter ("Nants") wollen die Erde in eine virtuelle Kopie (vEarth) verwandeln; eine Parallelwelt ("Hibrane") ist größer und langsamer; ein süchtig machender Teil des Netzes ("Big Pig"); am Ende ersetzen neue Wesen die Nanoroboter und bilden eine Planeten-Oberseele (Gaia). Berührungspunkte mit Quasifornia: digitale Zweitwelt (Emmets Weg), nach innen und nach außen als Maßstab, die Unterwelt als anderes Tempo, Heilung statt Zerstörung. Nur als Anregung, keine Figuren oder Handlung übernehmen.
- **Offen:** Wer Emmet Ray genau ist und wie er zu Aisu, zum Gegenspieler und zu El-Mano steht; wie die Heldenreise-Stationen auf Port Lupo, Atoll, Unterwelt und Hyperraum verteilt werden; ob Episoden zeitgesteuert über die gemeinsame Uhr erscheinen (gemeinsame Live-Momente für alle). Neue Glitches kommen erst in einer eigenen Runde, wenn die Glitch-Logik feststeht.

### Mentoren, Robotik-Werkstatt und der Weg zum nächsten Megalevel (Idee des Nutzers, 2026-11-05, Konzept)
- **Zwei Mentoren:** **Serafin** ist der spirituelle Mentor, der **Mann vom Labor** der weltliche. Nach getaner Atoll-Arbeit bringt der Labor-Mann den Spieler zu einer **Robotik-Werkstatt**.
- **Werkstatt:** Dort lernt man etwas Robotik. Ein **defekter, unfertiger Kampfanzug-Roboter (Mecha)** steht dort; man versteht und repariert ihn von kleinen Teilen aus. Ist er fertig, kann man den **Planeten zum nächsten Megalevel verlassen**.
- **Vorher:** Rund um Port Lupo (Name noch offen) gibt es weitere Quests; Reihenfolge nicht erzwungen.
- **Anknüpfungspunkte im Spiel:** Die Karte hat schon eine **Lagerhalle** und das **Backoffice (Anmeldung Lagerhalle)**, die Werkstatt könnte dort liegen. Sammelgegenstände (Funkzettel, Schraubendreher, USB-Stick, Handbuch) und der Baukasten (Teile, Farben) können für die Reparatur wiederverwendet werden. Die Robotik-Lernschritte passen zu "systemisches Denken" (Experiment statt Anleitung).
- **Vorschlag zur Geschichte:** Emmets Fluchtmaschine schoss über das Ziel hinaus. Regelungstechnisch heißt das **Überschwingen**. Der Spieler lernt beim Bau, sein Fahrzeug **sauber zu regeln**, also das Gegenteil. Das gibt dem Lernpfad eine Bedeutung.
- **Look (Moodboard `moodboard/Pacific Sim/image_038` und `image_039`):** Mekkie ist ein **richtiger, riesiger Mecha** im Spielzeug-Stil des Moodboards: rosa und gelb, prall wie aufblasbar, mit Sonnenbrille, Goldketten, Kopfhörern und Zuckerwatte, mitten in einer bunten Großstadt. Auf dem Moodboard begleitet ihn ein grüner Drache, und eine Person sitzt auf der Schulter. Das passt zu den aufblasbaren Dinos und zum runden Flat-Look des Spiels. Größe ungefähr wie die Riesen-Dinos (etwa 20 m).
- **Innen realistisch (Idee des Nutzers):** Außen ein pastellfarbener Spielzeug-Riese, **innen echte moderne Robotik**, die man nicht sehen muss, aber beim Reparieren versteht (vereinfacht, stilisiert, nicht als Simulation). Bausteine, vom Kleinen zum Großen: (1) **Strom** (Batterie, Sicherungen, Kabel und Datenbus), (2) **Sensoren** (Gyroskop und Lagesensor, Kraft- und Winkelsensoren, Kamera), (3) **Aktuatoren** (Elektromotor mit Getriebe, hydraulische Zylinder, pneumatische Muskeln; welcher gehört wohin, Drehmoment), (4) **Regelung** (Regelkreis, Rückkopplung, Überschwingen vermeiden; knüpft an Emmets Fluchtmaschine an), (5) **Gleichgewicht** (Schwerpunkt, Standfläche, "warum fällt Mekkie um?"), (6) **Kühlung und Wartung**, (7) **Sicherheit** (Notaus, Schnittstellen absichern; passt zum Leitthema Ethical Hacking).
- **Warum ein Riese so schwer ist (Lernmoment):** Wird etwas doppelt so groß, wächst das Gewicht viel schneller als die Kraft (Quadrat-Kubik-Gesetz). Deshalb ist Mekkie **leicht gebaut wie ein aufblasbares Spielzeug** (pneumatische Muskeln, Leichtbau-Rahmen). So passt die Optik zur Technik. (Aus dem Gedächtnis; vor Nutzung im Spiel mit einer Quelle prüfen.)
- **Reparaturweg (Entwurf):** Schraube und Kabel, dann Sensor, Gelenk, Bein, Gleichgewicht, Gehen, am Ende der Sprung zum Megalevel. Jede Reparatur macht einen Teil von Mekkie sichtbar lebendig (Lichter, Bewegung).
- **Name (entschieden):** Der Roboter heißt **Mekkie** (Mecha). "Mobile Suit" ist ein geschützter Begriff aus Gundam und wird nicht verwendet. Der Name ist, wie alle Namen im Projekt, vorläufig, bis der Gesamtname feststeht.
- **Größe und Werkstatt:** Ein 20-m-Mecha passt nicht in die Lagerhalle (etwa 9 m hoch). Möglich: Teile liegen in der Lagerhalle, der Rumpf steht in einem Hangar oder am Hafen; oder Mekkie wächst Stück für Stück sichtbar auf einer Werft.
- **Offen:** Wo genau die Werkstatt liegt; was die Lernschritte im Einzelnen sind (Schaltkreise, Sensoren, Antriebe, Regelkreise); wie das Megalevel heißt und aussieht; wie viele Quests vorher Pflicht sind.

### Auswertung der Beta (Analytics, Stand 2026-11-03)
- **Gebaut:** Die Spiele schicken alle 15 Sekunden ein kleines Paket an `/api/stats` (eigene Kennung je Sitzung und je Gerät, ohne Konto). Ein Durable Object mit SQLite (`worker/stats.js`) speichert Sitzungen und Ereignisse 90 Tage lang. Die Seite **`/stats`** zeigt alles an, Zahlen auch als Rohdaten unter `/api/stats/summary`. Da es eine geschlossene Beta ist, wird nichts anonymisiert außer dem, was die Spieler selbst eingeben (Name); der Datenschutz ist für die Beta bewusst zurückgestellt und muss vor einem öffentlichen Start neu bewertet werden.
- **Was gezählt wird:** Spieler online (mit Level, Raum, Scoops, fps), Spieler und Spielzeit pro Tag, aktive Sitzungen pro Stunde (48 Stunden), Ø und Median der Sitzungslänge, wiederkehrende Spieler, Trichter (geöffnet, gestartet, Gegenstand, Portal, erster Auftrag, Unterwelt, Serafin bezahlt, Geist befreit), gelöste Aufträge mit Mediandauer, Scoops (eingenommen und ausgegeben nach Grund, Kontostand), Fehler im Browser (mit Ort), Hänger (Gas gedrückt, 4 Sekunden nicht vom Fleck, auf einer Karte) und automatische Befreiungen, Bildrate und Ruckler je Gerät und Grafikkarte, Verbindungsprobleme im Raum, Polizei, Graffiti, Welten, Tricks, Spielversionen.
- **Passwort:** `STATS_PASSWORD` in Cloudflare (Settings, Variables and Secrets, als Secret) schützt die Auswertung zusätzlich. Ist es nicht gesetzt, gilt das Seitenpasswort. Die Auswertung hat bewusst ein eigenes Passwort, damit nicht alle Tester die Zahlen der anderen sehen.
- **Sitzungen zählen erst, wenn ein Spiel losgeht** (nicht schon auf dem Startbildschirm). Alte Einträge ohne Spiel verschwinden nur über den Zurücksetzen-Knopf auf `/stats`.
- **Aus:** `?nostats=1` im Link schaltet das Senden ab, in den Tests ist es aus (nur mit `?stats=1` an).
- **Offen:** Die Zeitreihen beginnen erst mit dem ersten Deployment. Ob ein Tester die Seite offen lässt, wird nach 45 Sekunden ohne Paket als offline gezählt. Heatmap der Spielwege, Absprungstellen und Vergleich zwischen Versionen sind nicht gebaut. Sitzungen ohne Aktivität werden mitgezählt, wenn das Fenster sichtbar bleibt.

### Hochbahn an der Mauer (Idee vom Nutzer, 2026-11-01)
Eine Hochbahn-Strecke (S-Bahn) läuft auf Stützen durch die Stadt, immer wieder fährt ein Zug vorbei.
- Stufe 1 (gebaut im Prototyp): Die Trasse kommt von Süden, läuft gerade über die Straße bei x=25 durch die Stadt (über die Kanalbrücke), biegt vor der Nordmauer in einer Kurve nach rechts (Nordost) ab und verlässt die Stadt. Etwa 620 m lang. Die Stützen stehen auf dem Gehweg hinter dem Bordstein (nicht auf der Straße) und tragen die Trasse über einen langen Ausleger, darunter ist die Straße frei (man fährt durch). Wo kein Gehweg ist (äußere Ringstraße), gibt es keine Stützen, die Trasse spannt weiter. Ein Zug mit vier bunten Wagen und beleuchteten Fenstern kommt alle 30 bis 50 Sekunden vorbei, mit tiefem Grollen und leichtem Beben in der Nähe. (Erste Fassung lief an der Mauer entlang, geändert nach Skizze des Nutzers.)
- Stufe 2 (später): Eine Station in einem anderen Bezirk, über die man mitfahren und reisen kann (Scoops). Außerdem die Möglichkeit, den Zug zu besprühen (siehe Graffiti: Dosen gegen Scoops, 2D-Paint-Editor).
- Stufe 3 (Multiplayer): Ist jeder Wagen voll besprüht, wird der Zug automatisch gereinigt, damit wieder Platz ist.
- Offen: Fahrplan und Haltestellen, ob man auf dem Zug mitfahren darf, Moderation der Sprühbilder.

### Unterwelt: Spiegelstadt (Idee vom Nutzer, 2026-11-01)
Ein Gebüsch in einer ruhigen Ecke von Port Lupo (Südwest) verbirgt eine Leiter nach unten. Unten liegt die Unterwelt.
- Look: Die Stadt steht kopf (3D-Spiegelstadt), dunkel, Sci-Fi-düster mit Halloween-Anklängen (Gräber, Kürbisse, Kabel, Code-Regen). Palette: Schwarz, Türkis (nicht Matrix-Grün), Kürbis-Orange, etwas Lila. Kindgerecht gruselig, nicht blutig. Referenzen: Nether in Minecraft, Ghosts 'n Goblins.
- Vektor und Pixel sind klar getrennt: Oben immer glatter Vektor-Look, unten immer fester Pixel-Look. Es gibt keinen Schalter (die P-Taste ist entfernt).
- Gebaut (Stufe 1, Prototyp): Leiter im Gebüsch, Kopfstand-Ansicht (Bild senkrecht gespiegelt, Steuerung normal), fester Pixel-Look mit eigener Türkis-Lila-Orange-Palette, dunkles Licht, Gräber, Kürbisse, Kabel zwischen den Laternen, türkiser Code-Regen, tiefes Brummen. Quest-Objekte der oberen Stadt (Portale, Gegenstände, Labor) sind unten ausgeblendet. Der Zug der Hochbahn fährt auch unten.
- Später: Quests (Auftragssystem), Gegner (Zombies, Geister, Fledermäuse, Boss), eigene Gegenstände und echtes 2D (Jump-and-Run im Stil von Ghosts 'n Goblins).
- Wünsche des Nutzers (2026-11-03, offen): Der Turm Tarxarox ist zu weit weg und soll näher an die Leiter. Die Steuerung unten soll ebenfalls kopfstehen (Richtung noch klären: links/rechts, vorne/hinten oder beides).
- Name: "Upside Down" gehört zu Stranger Things und sollte nicht der Name sein. Ideen: Kopfstand-Lupo, Unter-Lupo, Spiegel-Lupo.

### Marktplatz für bezahlte Worldpacks (Idee vom Nutzer, 2026-11-01, später)
Die Basis bleibt kostenlos, später gibt es eventuell einen Marktplatz für bezahlte Worldpacks. Nicht im MVP.
- Voraussetzungen: festes Paketformat (Manifest), Konten, sichere Skript-Umgebung (Lua oder QuickJS), Moderation (Kinder), Bezahlung (zum Beispiel Stripe), Mehrwertsteuer, Provision, klare Rechte- und Credit-Regeln (Kollaborationsvertrag).
- Scoops bleiben unverkäuflich. Bezahlt wird in Euro, Packs haben eine eigene Lizenz, damit der freie Teil frei bleibt.
- Vorschlag zum Testen: erst ein oder zwei kuratierte Packs mit Freunden und Artists einzeln verkaufen, bevor ein Marktplatz gebaut wird.

### Quest: Serafin und sein Geist (Idee vom Nutzer, 2026-11-01, im Prototyp gebaut)
Serafin, ein Bettler, sitzt an der Kanalbrücke in Port Lupo.
- Gibt man ihm mindestens 3 Scoops, bedankt er sich, gibt einen Releaser (Gegenstand im Rarepod) und ein Gedicht mit dem Tipp zum Eingang der Unterwelt:
  "Tief im Busch, da musst du suchen, / zwischen Gumpern, zwischen Buchen, / hinab, hinauf zum Tarxarox, / meinen Geist zur Freiheit lockst."
- Gumper sind hüpfende Ballonpflanzen. Das Gebüsch mit der Leiter steht zwischen zwei Gumpern und zwei Buchen (Südwest-Ecke).
- Tarxarox ist ein hoher Turm in der Unterwelt (Südost-Ecke). Man fährt zum Aufzug am Fuß ("hinab, hinauf"), oben schwebt der gefangene Geist, der Gegenpart von Serafin.
- Mit dem Releaser lässt man den Geist frei. Belohnung: 30 Scoops (Auftrag "Serafin und sein Geist", einmalig). Danach sagt Serafin, er fühle sich leichter.
- Offen: Serafins Hintergrundgeschichte, weitere Quests mit ihm, ob der Geist später als Begleiter zurückkehrt.

### Leitthema: Ethical Hacking und systemisches Denken (Idee vom Nutzer, 2026-11-03, Konzept)
Das ganze Spiel bringt Kindern Schritt für Schritt Ethical Hacking (White Hat) bei: beobachten, Muster erkennen, Vermutung aufstellen, testen, Lücke finden und melden. Ziel ist systemisches und kritisches Denken, spielerisch.
- **Struktur:** Jeder Bezirk hat eine Hauptquest oder einen Endboss. Jeder Bezirk vermittelt ein Denkprinzip, der Boss ist die Prüfung dazu. Der Nutzer entwickelt die Quests nach und nach.
- **Mentor: Serafin** (Vorschlag des Nutzers). Der Bettler an der Kanalbrücke entpuppt sich als Hacking-Mentor. Seine Hintergrundgeschichte ist damit die offene Frage aus der Serafin-Quest.
- **Hackbare Orte:** Computer, Bankautomaten, Parkterminals und Ähnliches.
- **White-Hat-Rahmen:** Man hackt nicht, um sich zu bereichern. Ein Bösewicht hat ein System manipuliert, man findet die Lücke, meldet sie dem Besitzer und bekommt Belohnung und Ruf (Bug-Bounty-Prinzip). Passt zur Polizei-Mechanik: Illegal bleibt illegal.
- **Kein Zauberknopf:** Hacken ist ein echtes Rätsel, kein Minispiel mit Tastendruck. Vorbilder: Kinder-CTFs (picoCTF), Human Resource Machine.
- **Graffiti als Nachricht:** Im Multiplayer können Tags verschlüsselte Nachrichten tragen (Caesar- oder Symbolschlüssel), nur wer den Schlüssel hat, kann sie lesen. Kein Freitext, sondern ein festes Vokabular aus Symbolen und Phrasen (Schutz vor Grooming und Beleidigungen, DSGVO und Jugendschutz).
- **Lernkurve (Skizze, noch keinen Bezirken zugeordnet):** 1. Beobachten (Muster, Abläufe, Ampelzyklen), 2. Logik (Reihenfolgen, Bedingungen), 3. Passwörter und Social Engineering (Passwort auf dem Post-it im Café), 4. Verschlüsselung (Graffiti-Codes), 5. Netzwerke (das Parkterminal hängt an den Ampeln), 6. Phishing erkennen, 7. verantwortungsvoll melden statt ausnutzen.
- **Systemisches Denken in Port Lupo (Quest-Ideen, Stand 2026-11-03, noch nichts gebaut):** Jede Idee übt ein Denkmuster an einem System, das es im Spiel schon gibt oder leicht gibt:
  1. **Polizei-Schleife** (Verzögerung, Rückkopplung): Sprühen löst nach 1 Minute (nachts 3) die Polizei aus, das Risiko hängt von Tag und Nacht ab. Quest: "Finde heraus, wann man am besten sprüht." Das System ist gebaut, es muss nur nachvollziehbar werden. Empfohlener Anfang.
  2. **Eiswagen und Scoops** (Angebot, Nachfrage, Bestand): begrenzter Vorrat, Kunden je nach Tageszeit. Quest: "Halte den Wagen den ganzen Tag im Geschäft."
  3. **Hochbahn reparieren** (Abhängigkeiten): Der Zug fährt nicht, weil mehrere Dinge zusammenhängen (Strom, Haltestelle, Schranke). Man muss die Kette erkennen. Gut mit dem Hacking-Rahmen verbindbar (Ampeln, Terminals, Netzwerke).
  4. **Unterwelt-Spiegelstadt** (Wirkung über Ebenen): Was oben passiert, ändert unten etwas. Quest: "Ändere oben etwas, damit unten Ruhe einkehrt."
  5. **Strand und Promenade** (Neben- und Fernwirkungen): Eine Aktion hat einen schönen und einen unerwünschten Effekt. Quest: "Mach die Promenade lebendig, ohne dass es chaotisch wird."
- **Methode (kein Vortrag):** Experiment statt Anleitung (eine Sache ändern, Folge sehen); Vorhersage vor dem Test (3 Antworten zur Wahl, danach zeigt das Spiel das echte Ergebnis); Systemkarte im Rarepod (Pfeile "mehr X führt zu mehr Y"), die sich füllt, sobald man einen Zusammenhang erkannt hat, als Fortschritt statt Punktestand; mehrere gleichwertige Lösungen, damit kein Quiz entsteht. Serafin als Mentor kann Hinweise geben, ohne zu erklären.
- **Offen (zusätzlich):** Zielalter der Quests (bestimmt, wie komplex die Systemkarte sein darf); allein oder mit Crew spielbar (gemeinsames Rätseln ist stärker, braucht Mehrspieler).
- **Offen:** Welche Bezirke es gibt und welches Prinzip wohin gehört; wer der Bösewicht ist; fachliche Prüfung der Rätsel.

### Aisukurimu: Aisu als Hauptgeschichte (Idee vom Nutzer, 2026-11-03, Konzept)
Aisu ist die Eistüten-Figur aus dem Comic "Aisukurimu" des Nutzers (aisukurimu.com, 2015/16). Die kleine Eistüte kam bei vielen gut an. Vorschlag: Aisu wird die Hauptgeschichte des Spiels.
- **Figuren aus den Comics:**
  - **Aisu:** männlich, naiv, begeistert ("amazaking!"), stammt vom Planeten **Vanilla IV** ("vanilla and chocolate, a honey atmosphere and a blueberry moon"). Kommt halb geschmolzen in einen Kühlschrank. Ein Scanner findet bei ihm "no artificial consciousness", sondern "materialised soul, emotion waves": Er ist nicht von dieser Welt. (Passt zu "Port Vanilla" auf der Namensliste.)
  - **Mirku:** Milchtüte, fürsorglich, nimmt Aisu auf und erklärt ihm die Welt.
  - **Flasche von 1897:** alter Weiser aus dem Keller ("I've seen many come and go").
  - **El-Mano:** einfach irgendein Typ mit Kühlschrank, die Hand von außen. Die Bewohner halten ihn für einen Gott; er weiß nicht, dass sie leben. Gegenseitige Unwissenheit über das System.
  - **Der Wissenschaftler mit der Sternbrille** (Folgen #13 bis #16, Name offen): gehört zur Seed-Seite (die Guten). Untersucht Aisu, um das Lebendige zu verstehen, "before the others". Sein Roboter-Spion **Rufus** (Propellermütze) beobachtet die Kühlschrank-Bewohner.
  - **Carl und die Dosen** (betrunken, Zigaretten) spielen keine Rolle (Entscheidung Nutzer). Auch Sätze wie "I wonder how he tastes" fallen weg.
- **Gegenspieler (nicht aus Aisukurimu, aus der ersten Quasifornia-Story):** ein Thanos-artiger Machtmensch, der Daten und Überwachung kontrolliert und über Transhumanismus auf der Hyper-Ebene im Cyberspace zur Göttlichkeit will. Er und seine Leute sind "die anderen". Seiner Technik fehlt echtes Bewusstsein, deshalb ist Aisus Seele für ihn interessant. Wende: Sein Durchbruch schießt übers Ziel hinaus und führt ihn zum lebendigen Ursprung statt zur Göttlichkeit. Fürs Kinderspiel eher Umkehr als Untergang. Archetyp, keine reale Person (kein Name, kein Aussehen, kein Firmenbezug). Offen: Name; ob er und der Wissenschaftler sich kennen (zum Beispiel frühere Kollegen, einer Seed-Seite, einer Kontroll-Seite); wo er landet (Vanilla IV?).
- **Zwei Leuchttürme:** (1) Leuchtturm/Tarxarox an der Westküste von Port Lupo (oben klassischer Leuchtturm, unten Tarxarox, siehe Karte). (2) **Roter Sand** (Vorbild: Leuchtturm Roter Sand vor Bremerhaven, rot-weiß gestreift): einsam mitten im Meer, abgeschieden, noch nicht auf der Karte. Kommt schon in den Aisukurimu-Illustrationen vor (Aisu im Sturm vor dem Leuchtturm; "Tower of Power").
- **Parallelen zum Spiel:** Labor bzw. Atoll Lab & Bunker; Aisus Heimat = Eis-Galaxie (Welt 2, Boss Galaxzilla); Rufus und "artificial consciousness" = Hacking-Thema (Überwachung, KI oder echt?); Schmelzen statt Sterben passt zu Scoops und Eis-Fressen.
- **Story-Vorschlag:** Aisu strandet (im Sturm bei Roter Sand?) und landet in Port Lupo. Der Gegenspieler und seine Leute wollen sein Geheimnis. Der Spieler hilft Aisu mit der Seed-Seite, das System zu durchschauen und nach Hause zu kommen. Jeder Bezirk ist ein Schritt, Vanilla IV bzw. die Eis-Galaxie ist das Finale. Aisu ist Begleiter und Maskottchen (Neuling wie der Spieler, natürliches Tutorial), Mirku Helferin, die Flasche von 1897 ein zweiter Weiser neben Serafin (Hacking-Mentor) oder mit ihm zusammengelegt. Kernaussage für Kinder: Technik ist mächtig, aber das Lebendige lässt sich nicht kopieren.
- **Offen:** weitere Folgen sichten (aisukurimu.com ist in der Cloud-Session gesperrt; bisher nur hochgeladene Bilder); Hologramm-Figur mit Klaviertasten-Zähnen aus einer Illustration (wer ist das?).

### Motive aus einem Romanentwurf des Nutzers (2026-11-03, nur Motive, keine Figuren)
Der Nutzer hatte einen Romanentwurf (Erwachsenen-Satire), den er vermutlich nicht weiterverfolgt. Nicht übernehmen: Handlung, Figuren, derbe Kosmologie, Gewalt. Übernehmbar als Motive (zweite Ebene für Erwachsene nach Simpsons-Art nur über Anspielungen, nicht über Handlung):
- **Überwachungsnetz einer Firma** (im Entwurf "Cupro-Light", ein allsehendes Licht-Netz): Werkzeug des Gegenspielers. Hacking-Lernziel: Überwachung erkennen, offline gehen.
- **Lebendes Netz gegen totes Netz:** Pflanzen, Gumper, Myzel tragen geheime Nachrichten; Kabel und Code-Regen (Unterwelt) sind das tote Netz.
- **Ruf und Antwort als Melodie:** Musik als Botschaft (Musik-Player der Figur).
- **Versteckte Knoten / Samenverstecke:** über alle Bezirke verstreute Sammelobjekte, die zusammen etwas wiederherstellen.
- **Crew statt Pyramide:** Multiplayer-Ziel, gemeinsam etwas Zerbrochenes wiederherstellen.
- **Arche:** eine Yacht im Marina als Zuflucht.
- **Spurensuche (OSINT) und Schreibstil erkennen:** Lernmodule, mit dem Dreh "eigene Privatsphäre schützen", nicht andere enttarnen. Zum Beispiel erkennen, wer einen Graffiti-Tag geschrieben hat.
- **Gebaut statt geboren:** Kopien und Uploads gegen echtes Bewusstsein (Aisu).
- **Easter Eggs für Erwachsene:** ein Buch "Atlas Shards" im Regal, ein Firmenschild des Überwachungsnetzes, ein Pfandhaus mit seltsamem Ring.

### Art-Brush-Wellen (Technik des Nutzers aus den Aisukurimu-Illustrationen, 2026-11-03, Idee)
In Illustrator hat der Nutzer Motive (Schuppen, Dosen, Rippen) mit Art Brushes entlang von Pfaden gebogen und so amorphe Wellenbewegungen erzeugt.
- **Im Spiel:** dasselbe Prinzip in Three.js. Ein Motiv wird viele Male entlang einer Kurve gesetzt und an der Kurvenrichtung ausgerichtet (InstancedMesh, handytauglich). Verschiebt man die Motive mit der Zeit entlang der Kurve, rollen die Wellen.
- **Ablauf:** In Affinity zeichnet der Nutzer nur den Pfad (zum Beispiel Ebene "Welle"), der Parser liest ihn, das Spiel setzt das Motiv darauf.
- **Einsatz:** Sturm-Meer um Roter Sand, Zwischenszene "Aisus Ankunft im Sturm", Motiv-Wellen in der Unterwelt (Kabel, Kürbisse).

### Unterwelt: Gegner und Aufträge (im Prototyp gebaut, 2026-11-01)
Gegner und Sammelobjekte in der Spiegelstadt, nach dem Vorbild von Ghosts 'n Goblins, aber kindgerecht.
- Kürbis-Zombies: Ein Kürbis mit Gesicht auf einem Körper steigt aus einem Erdhügel, wenn man näher als etwa 34 m kommt, und folgt dem Spieler langsam. Zwölf Stück, sie kommen nach 28 Sekunden wieder.
- Geister: Weiße, türkis leuchtende Tuchgeister schweben heran, durch Wände. Sieben Stück.
- Treffer ("Autsch"): Wer berührt wird, wird zurückgestoßen und fast zum Stehen gebracht. Kein Scoop-Verlust.
- Waffe: Das Skateboard (Mausklick, F oder E) wirft den nächsten Gegner um.
- Kürbis-Laternen: Acht leuchtende Kürbisse mit Lichtstrahl liegen verteilt auf den Gehwegen.
- Aufträge (Rarepod): Grabwächter (6 Zombies, 10 Scoops), Geisterjagd (4 Geister, 10 Scoops), Kürbisernte (8 Laternen, 12 Scoops). Fortschritt wird gespeichert, Belohnung nur einmal.
- Später: Boss, mehr Gegnerarten (Fledermäuse, Kabel-Schlangen), Waffen-Upgrades, echte 2D-Abschnitte.

### Graffiti-Editor mit Dosen (im Prototyp gebaut, 2026-11-01)
Aus der Notiz des Nutzers: Man sprüht an die große Wand, braucht dafür Dosen gegen Scoops, und das Graffito bleibt, bis jemand drübersprüht.
- Dosen: Sechs Farben (Türkis, Pink, Gelb, Orange, Weiß, Schwarz), im Rarepod unter "Laden" für je 2 Scoops. Jede Dose enthält Farbe für ein großes Bild und lässt sich nachfüllen.
- Wände: Fünf Graffiti-Wände an der Innenseite der Mauer. Aktion "Wand besprühen" in der Nähe.
- Editor: 2D-Paint-Fenster mit fester Auflösung (128 × 64 Pixel), nur die Farben der gekauften Dosen, drei Pinselgrößen, Rückgängig, Fertig oder Abbrechen (Esc). Passt zur Vorgabe "feste Auflösung, nur Paint im Spiel, kein Bild-Upload".
- Das Bild wird im Browser gespeichert und bleibt auf der Wand. Auftrag "Street-Artist" (mindestens 400 Sprühpunkte, 8 Scoops).
- Später: Teilen und Likes (mit Likes bleibt ein Bild länger geschützt), Überschreiben durch andere im Multiplayer, Moderation, Zug besprühen (Hochbahn-Station), automatisches Reinigen des Zuges, wenn jeder Wagen voll ist, optionale Paletten pro Welt.

### Startbildschirm in drei Schritten (Idee vom Nutzer, 2026-11-01, gebaut)
1. Avatar auswählen (Karussell).
2. Quest wählen: 1. Erkunde die Stadt (Leicht), 2. Skate Contest (Mittel, das Küsten-Rennen), 3. Rette die Insel (Schwer). Weitere Welten sind unter "Weitere Welten (zum Ausprobieren)" eingeklappt.
3. Steuerung ansehen und mit "Los geht's" starten.
- "Rette die Insel" ist die Atoll-Quest: Sie startet in Port Lupo (Gegenstände sammeln, Mann am Labor befreien, Portal), erst dann folgt das Atoll mit den vier Rätseln.
- Enter geht einen Schritt weiter, in Schritt 2 wählt es die Stadt. Jeder Schritt passt in den Viewport.
- Fehlerbehebung: Die HTML-Datei hatte keine Zeichenkodierung angegeben, dadurch erschienen Umlaute und Pfeile auf manchen Servern kaputt (zum Beispiel "GÃ¶rtel"). Jetzt steht `<meta charset="utf-8">` und ein Viewport-Tag am Anfang.

### Logo (vom Nutzer, 2026-11-01)
Datei `prototype/kuesten-quest/src/logo/port36_logo.svg`: weißer Schriftzug "PORT 36" in kantiger, leicht gewellter Schrift (575 × 200, nur ein Pfad pro Zeichen, 2 KB). Wird beim Bauen inline in die HTML-Datei gesetzt und steht auf dem Startbildschirm über "Küsten-Quest" mit rosa Schatten.
- Die 36 passt zum Raster von Port Lupo: 6 × 6 Kreuzungen. Ob "Port 36" der Projektname wird, ist noch nicht entschieden (Marken- und Domainprüfung offen, siehe Abschnitt Name).

### Unterwelt-Minikarte und P-Mart (2026-11-01, gebaut)
- Unten sind die Straßennamen kopfüber und kaum lesbar. Deshalb zeigt die Minikarte dort den Weg: die Leiter als türkises L (immer) und, sobald man Serafin die 3 Scoops gegeben hat, den Turm Tarxarox als orangenes T mit gestrichelter Linie vom Spieler. Die Umgebung des Turms ist auf der Karte aufgedeckt. Oben gezeigte Marker (Läden, Portale, Gegenstände, Küste) sind unten ausgeblendet. Nach dem Befreien des Geistes verschwindet das T.
- P-Mart: Die fünf Läden in Port Lupo sind Convenience-Stores im japanischen Stil mit blauer Banderole (rosa Streifen) rundherum, Schiebetür, Geldautomaten, Fahrrad und Standschild. Kaufen (Skins, Teile, Farben, Sprühdosen) geht nur im Laden ("P-Mart betreten"), im Rarepod kann man alles ansehen. Auf der Minikarte zeigt ein blaues P die Läden.

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
  - **Welt 0, die Stadt:** 5×5 Blöcke, 6×6 Kreuzungen, Labyrinth per Zufallscode (Seed), 18 Straßenstücke mit "GESPERRT"-Sperren. Fünf Gebäudetypen (Wohnhaus, Laden, Café, Büro, Burger) mit Schildern, 150 Pflanzen aus Formeln, Zuschauer, 2D-Skyline mit Victorians als Staffelung. **Start ist die Stadt (Stand 2026-10-31):** Im Westen liegt die Küste mit Tor "KÜSTEN-RENNEN", Startlinie, Strand und Meer; wer sie erreicht, startet das Rennen (Welt 1). Zwei Portale in Sackgassen führen in Welt 2 und 3; Portal-Radar ("kalt bis heiß") und eine Minikarte, die sich beim Fahren füllt. "Zurück zur Stadt" aus jeder Welt. Offen: 10×10 (zu schwer für Handys), Leben in der Stadt (Passanten, Autos, Skater), Innenräume, Boss in der Stadt.
  - **Welt 1, Küste:** Promenade mit Villen, Meer, Konfetti, Zuschauer; Boss Goldzilla (Eiskugeln sammeln, dann Flucht zum Portal).
  - **Welt 2, Eis-Galaxie:** Regenbogen-Weg im Weltall mit Galaxie-Eiskugeln, Riesen-Eishörnchen, Alien-Publikum, leichterer Schwerkraft; Boss Galaxzilla (Name von Anton).
  - **Welt 3, Nacht-Stadt:** Dächer mit Lücken, Neon-Schilder, Feuerwerk, Wunderkerzen-Eis; Sprünge über Lücken, Neustart bei Absturz; Boss Neonzilla.
- **Spielmechanik im Prototyp (Ideen von Anton):** Skateboard-Wurf (Klick/F) auf Boss und Rivalen, 2 s Cooldown, Board kommt zurück; Kickflip (Shift) mit Applaus der Zuschauer; nervende Rivalen-Skater, die schubsen (Drüberspringen hilft) und sich abschießen lassen; Eis-Fressen, wenn der Boss trifft (der Avatar wird zu Eis, bleibt aber unantastbar, passend zu "kein Permadeath"); Avatar-Karussell mit elf Figuren, Accessoires (Ketten, Brillen, Hüte, Kronen); Pixel-Modus (P).
- **Visuelle Staffelung:** Hinten helle 2D-Skyline, davor zwei Ringe gezeichneter Victorian-Reihen (Dunst, dann kräftiger), davor die 3D-Welt. Wolken als 2D-Sprites, die immer zur Kamera zeigen.
- **Infrastruktur-Plan (Reihenfolge):** (1) Cloudflare Pages für den Prototyp, (2) Worker mit Durable Object pro Welt für den Zwei-Spieler-MVP und Geister-Läufe, (3) Supabase erst, wenn Konten und dauerhafte Daten gebraucht werden (globale Identität, Erfolge). Cloudflare-Konto ist angelegt und mit GitHub verbunden. **Schritt 1 erledigt (2026-10-31):** Der Prototyp läuft unter https://quasifornia.aisustudio-berlin.workers.dev (Workers mit Static Assets, `wrangler.jsonc` im Repo-Wurzelverzeichnis, Build kopiert `kuesten-quest.html` nach `index.html`, Deploy bei jedem Push auf `main`). Stack bleibt Kandidat, Implementierungsphase noch nicht freigegeben (der Prototyp liegt nur als Sicherung auf dem Branch `prototype-kuesten-quest`).
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
- Testrendering (2026-11-01): Die Straßenschilder in Port Lupo sind jetzt kalifornisches Grün (#0b6b4a, weißer Rand) und verwenden Smarta Nova, sobald die Schrift geladen ist. Die Schrift liegt jetzt im Repo (`prototype/kuesten-quest/src/fonts/smarta-nova.otf`) und wird beim Bauen als Base64 in die HTML-Datei eingebettet. Wegen der fehlenden Umlaute werden ä, ö, ü, ß auf den Schildern als ae, oe, ue, ss geschrieben (Schalter SN_NOUML in `game.js`, auf false setzen, sobald die Umlaute in der Schrift sind).

## Tech-Stack-Kandidaten
- Client: Three.js + React Three Fiber, Rapier (Physik), three-vrm, simplex-noise
- Multiplayer: Cloudflare Workers + Durable Objects (ein Objekt pro Welt), ggf. PartyKit
- Auth und Daten: Supabase
- Hosting: Cloudflare Pages
- Skript-Sandbox: Lua (wasmoon) oder QuickJS
- Nicht geeignet: Vercel (Serverless, keine dauerhaften WebSockets)

## Name (Stand 2026-11-01, noch offen)
Entschieden: **Port Lupo** ist der Hub, die Hauptstadt im Spiel. Ein Ort, keine Figur und an keine Person gebunden. Der Stadtname darf im Spiel stehen.
Offen bleibt der **Projektname**. Er wird nicht fest in Code, UI oder Texte geschrieben, bis er entschieden ist.

Kriterien (nach Anton und seinen Freunden testen: aufschreiben und aussprechen lassen):
- Kurz und lautgetreu, damit Kinder ihn richtig schreiben. Möglichst ein Wort oder zwei kurze.
- Er sollte die Kernhandlung beschreiben (wie Minecraft: mine und craft, Fortnite: Fort und Nite im ursprünglichen Modus). Unser Kern: Quests und Entdecken, dazu Reisen, Meer, Portale.
- Gut auffindbar und schützbar. Vor der Entscheidung bei EUIPO und DPMA sowie bei der Domain prüfen. Das ist noch nicht geschehen.

Kandidaten mit Einschätzung:
- Port Quest: beschreibt das Spiel am direktesten, aber sehr allgemein. Favorit-Richtung, zusammen mit Port Lupo als Hub.
- Port Lupo: einzigartig, leicht zu schreiben, klingt gut; als Stadtname gesetzt. Als Projektname sagt es nichts über das Spiel (Lupo heißt Wolf; VW Lupo ist ein Auto).
- Port Luna: schön, aber Amazon Luna ist ein Cloud-Gaming-Dienst, Verwechslungsrisiko. Rückt zudem gedanklich an Fortnite (Nacht).
- Q Port: kurz, behält das Q von Quasifornia. Aussprache "Kju" offen.
- Port Lane, Port Hill, Port West, Pacific West: sehr allgemein, schwer schützbar oder auffindbar.
- Port Vanilla: eigenständig, aber zu lang und Schreibweise (Doppel-L) für Kinder schwierig.
- Port Ventura (PortAventura, Freizeitpark) und Port Sierra (Sierra Entertainment): wegen bestehender Namen gestrichen.
- Idee "Maze Quest: Port Lupo" (2026-11-01): Muster "Spielname: Weltname", wiederholbar für weitere Welten (zum Beispiel Unterwelt oder Collab-Welten). Bedenken: "Maze" (Labyrinth) passt kaum noch, weil die Stadt inzwischen ein offenes Raster ist (nur drei Pflanzenwände), und "Maze Quest" ist sehr allgemein (nicht auf Marken geprüft). Empfehlung: Muster behalten, als Spielname bleibt Port Quest die Richtung, also "Port Quest: Port Lupo".
- Ähnlichkeit zu Fortnite: "Port" und "Fort" liegen einen Buchstaben auseinander. Kein Hindernis, aber Namen mit "Night" oder "Nite" vermeiden.
- "Port" bleibt: steht für Portal, Meer und Reisen. Nachteil: allein nicht schützbar, bei Entwicklern auch "Netzwerkanschluss". Alternative zum Hafen-Gedanken (nur falls nötig): Bay, Dock.

## Roadmap und Geschäftsmodell (Stand 2026-11-01)
Ziel des Nutzers: Studio-Standbein für AisuStudio. Ressourcen in den nächsten 6 bis 12 Monaten: regelmäßig Zeit, kleines Budget.

Roadmap (Plan des Nutzers):
1. Spiel als einfachen Multiplayer, Invite-only, stabilisieren. Spielspaß zuerst. Nächster Test: Raum per Einladungslink, Avatare sehen sich, ein Rennen.
2. Mit befreundeten Artists Musik-Deals schließen (Songs im Spiel nutzen dürfen; fließt Geld, bekommen sie einen Anteil).
3. Freunde einbinden: Game-Erfahrene (D&D, Brawler) für Quests, Balance und Kampfgefühl; ein Sound-Engineer für Mix, Effekte und Radio. Vorher klären, ob bezahlt, mit Anteil oder ehrenamtlich, schriftlich (siehe Kollaborationsvertrag).
4. Werbung als Billboards in den Straßen, nur Branding, erst wenn der Spielspaß steht und eventuell ab etwa 1000 Nutzern.

Geschäftsmodell-Ideen (Vorschlag, nicht entschieden):
- Jetzt: Welten als Auftrag (Collab-Welten für Artists, Marken, Museen, Schulen), Förderprogramme (Games, Kultur, Bildung; aktuelle Programme noch recherchieren), Merch und Sticker.
- In 6 bis 12 Monaten: Schul- und Workshop-Pakete (Quests als Lerneinheiten, Ziel "systemisches Denken").
- Später mit Reichweite: Familien-Abo für Eltern (Sicherheit und Komfort, keine Spielvorteile), gehostete Welten für Creator und Schulen.
- Tabus: Banner und Popups im Spiel, Echtgeld für Scoops. Datenverkauf und geschlossener Code offen: Wie offen das System sein soll, ist noch nicht entschieden (Idee: Bewerbung für Collabs, dann bekommt man einen Fork).
- Billboards: bei etwa 1000 Nutzern kaum Einnahmen, eher Festpreis-Sponsoring. Früh nutzbar als Gegenleistung für Artists (Album oder Konzert bewerben). Klar kennzeichnen, keine Kaufaufforderungen an Kinder, kein Tracking.
- Realistische Rechnung: 10 000 aktive Spieler, 3 % zahlen 4 Euro im Monat ergeben etwa 1200 Euro im Monat. Das Spiel allein trägt kein Studio, daher Aufträge und Förderung.
- Offen: Lizenzmodell (Code offen, Marke und Assets wie Musik eigen?).

Rechte und Recht (vor weiteren Musik-Zusagen klären):
- GEMA: Sind Artists GEMA-Mitglieder, haben sie ihre Rechte meist abgetreten und dürfen nicht frei lizenzieren. Nachfragen: GEMA-Mitglied, Label (Blockopera?), Verlag?
- Masterrechte (Aufnahme) und Verlagsrechte (Komposition) können verschiedenen Personen gehören.
- Vertrag mindestens: Umfang (nur im Spiel), Credit, Definition des Anteils (Prozent wovon), Laufzeit, Entfernen auf Wunsch. Anwalt oder Vorlage nutzen.
- Stand Musik: "em'ocean" (Packed Rich feat. you_see, ndfloat, timekilla0118; DJ/Cuts punch_float; Album The High End Theory, 2023) ist im Spiel eingebunden. Packed Rich hat mündlich per WhatsApp zugesagt, schriftliche Freigabe und weitere Rechteinhaber offen. Weitere Tracks erst nach Freigabe.
- Kinder als Zielgruppe: DSGVO und Jugendschutz (Einwilligung der Eltern, Moderation) früh einplanen.

## Auftragssystem (Vorschlag, Stand 2026-11-01)
Gerüst für Spielinhalt und Spielzeit: Alles, was man tut, ist ein Auftrag mit fester Form. Passt zu Antons Antwort ("Jemand gibt mir einen Auftrag") und zum Rarepod (Quest-News und Jobs).

Ein Auftrag besteht aus fünf Teilen:
1. Ziel: sammeln, ankommen, ausliefern, Rätsel lösen, Tricks-Punkte, beschützen oder verfolgen.
2. Ort: Welt und Bereich (zum Beispiel Küste, Nacht-Stadt).
3. Regel: Variante, zum Beispiel Zeitlimit, nur mit Hilfsblock, rutschiger Boden, Verfolger.
4. Team: 1 bis 4 Spieler, mit verteilten Rollen.
5. Belohnung: Scoops, gelegentlich Gegenstand oder Aussehen.

Folgen:
- Inhalt wächst durch Kombination (6 Ziele, 5 Welten, 5 Regeln ergeben viele Aufträge).
- Zielgröße: ein Auftrag dauert 3 bis 5 Minuten, eine Sitzung hat 6 bis 8. Das Auftragsbrett am Rarepod bietet jeweils ein paar an. So tragen die ersten 30 Minuten.
- Modulare Autorenschaft: Neue Aufträge als einfache Datei, ohne Engine-Wissen (Freunde mit D&D- und Brawler-Erfahrung, Artists in ihren Welten, Collab-Bewerber). Passt zu Worldpack und Fork-Idee.
- Multiplayer: Ein Auftrag kennt von Anfang an die Teamgröße.
- Das Atoll ist ein Kampagnen-Auftrag (Kette aus Aufträgen mit Story). Die Sci-Fi-Rahmenstory kann dort ansetzen.
- Entdecken und Bauen bleiben frei. Aufträge sind das Gerüst, nicht der ganze Inhalt.

Start (Vorschlag): drei Ziele, die schon fast vorhanden sind: sammeln (Eiskugeln), ankommen (Rennen), Rätsel (Atoll). Lieber wenige gut gebaute Ziele als viele halbe.
Offen: Dateiformat der Aufträge, Auftragsbrett (Rarepod-Oberfläche), Scoops-Preise (zum Beispiel Reise ins nächste Portal), ob Scoops in allen Welten verdient werden.

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
