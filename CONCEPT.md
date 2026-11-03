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
- **Graffiti:** überall sprühen (Fassaden, verbotene Wände), 48 Stunden Haltbarkeit, Server-Speicher in einem Cloudflare Durable Object (im Artifact nur lokal). Offen: Moderation (Meldeknopf, Alterseinstellung, Elternkonto), kein Upload-Schutz außer Größen- und Formatprüfung.
- **Polizei:** Countdown startet 2 s nach Beginn des Sprühens an einer verbotenen Wand (Tag 1 Minute, Nacht 3 Minuten). Zwei Polizisten auf Rollschuhen, Verfolgung im Sichtradius (42 m, Sichtlinie), dreimal aus dem Blick oder ruhig versteckt = Polizei gibt auf, bei Festnahme Nahaufnahme und 10 Scoops Strafe. Offen: Polizeistation zeichnet der Nutzer in die SVG (Label mit "Polizei" oder "Police"), dann starten sie dort. Idee: Anfahrt im Auto im Stil des gezeigten Hornet-Autos, Aussteigen im Sichtradius.
- **Systemisches Denken:** siehe Abschnitt "Leitthema: Ethical Hacking und systemisches Denken" (Quest-Ideen, Methode, offene Fragen).
- **Hosting:** Cloudflare-Worker mit Passwort (`SITE_PASSWORD`) und Durable-Object-Speicher; Push nach `main` löst das Deployment aus.

### Mehrspieler (Freundes-Raum, bis 5 Personen, Stand 2026-11-03)
- **Idee des Nutzers:** Nur für Freunde, höchstens 5 Personen, alle sehen dasselbe in Echtzeit, Quests kann jeder machen, auch wenn sie ein anderer schon gemacht hat. Die Polizei jagt, wer zuerst gesprüht hat; ein zweiter Wagen kann ausrücken (zum zweiten Sprüher, sonst hilft er nach 30 s bei der Jagd auf den Ersten); wer vor der Wache steht, sieht den Wagen ausrücken.
- **Gebaut (Schritt 1):** Raum als Cloudflare Durable Object mit WebSocket (`worker/room.js`, Route `/api/room/<name>`, hinter dem Passwortschutz, fremde Herkunft abgelehnt). Beitritt über `?raum=name`, auf dem Startbildschirm unter "Mit Freunden spielen (bis 5)" (erscheint nur, wo der Server antwortet). Der Server verteilt nur Positionen (ca. 10 Mal pro Sekunde, begrenzt auf 25 pro Sekunde und Spieler, Werte geprüft) und liefert die gemeinsame Uhr; er simuliert die Welt nicht. Andere Skater mit Skin und Namensschild, Punkt auf der Minikarte, gleiche Tageszeit für alle (Server-Uhr), Beitritt und Austritt werden gemeldet, Unterwelt und Oberwelt sehen sich nicht. Namensfeld auf dem Startbildschirm ("Dein Name", bis 12 Zeichen, nur Buchstaben und Zahlen); Spielstand, Scoops, Quests und Items bleiben pro Person. Ohne `?raum` ändert sich nichts (Einzelspieler).
- **Noch nicht (Schritt 2):** Polizei im Raum (gemeinsam, erster Sprüher, Streifenwagen, zweiter Wagen), Riesen-Dinos gemeinsam (heute pro Spieler), Emotes (gibt es noch nicht), Tricks der anderen animiert, Chat (bewusst nicht), Moderation.
- **Offen und ungeprüft:** Ob die WebSocket-Verbindung hinter dem Passwortschutz in Brave und auf Handys durchkommt (lokal und im Test funktioniert sie mit dem Passwort im Kopf der Anfrage). Handy-Leistung mit 5 Spielern. Der Name ist Freitext (nur Buchstaben und Zahlen), bei Freunden unkritisch, für Öffentlichkeit nicht.

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
