# Designer (intern, Prototyp)

Ein internes Werkzeug zum Entwerfen von Avataren und später weiteren Dingen. Es ist **noch nicht Teil des Spiels** und nicht mit dem Spiel verbunden. Es ändert keine Datei des Spiels.

## Starten
Im Ordner `prototype/kuesten-quest` einen Webserver starten und die Seite öffnen:

```
python3 -m http.server 8080
# dann im Browser: http://localhost:8080/tools/avatar-designer/
```

## Aufbau
- `index.html`: Rahmen mit **Reitern**: Avatar (aktiv), Mobs und Tiere, Props und Werkzeuge, Fahrzeuge, Gebäude, Landschaften (alle "bald", mit kurzer Erklärung). Jeder Reiter ist eine eigene Seite im Rahmen.
- Reiter Avatar, zwei Modi:
  - `round.html` **Rund (Avatare des Spiels)**: bildet die vier jetzigen Avatare nach (Pink, Blau, Gelb, Händler). Runde Formen in einer Gelenk-Hierarchie, eigener Bau-Code, eigenes Format **AvatarSpec v2**. Die Gelenknamen entsprechen denen im Spiel (hips, thigh, shin, foot, torso, shoulder, elbow, head), damit sie sich später über einen Umsetzer zusammenführen lassen.
  - `pixel.html` **Pixel-Netz (Experiment)**: eckige Teile mit Pixelnetz, Malen mit Spiegelung, Füllen, Aufkleber (8×8). Gedacht für Kleidung und Aufkleber später.

## Rund-Modus (v2, erste Runde)
- Vier Vorlagen als Daten abgeschrieben (Stand 2026-11-08).
- **Zubehör an Ankern:** Kopf (Haare: ohne, Kappe, Dutt, Puff, Helm), Gesicht (Kopfhörer), Hals (Kette), Rücken (Rucksack), Handgelenk (Uhr), Knie (Schoner), Rumpf (Steppjacke).
- **Farbzonen:** Haut, Oberteil, Hose, Sohle, Haare, Brillengläser, Brillenrahmen, Streifen, Rucksack, Schoner, Kopfhörer.
- **Regler:** Gesamtgröße, Kopf, Rumpfbreite, Beine, Arme, dazu im Hüftbereich **Hüfte: Eintauchen** (Oberschenkel taucht in die Hüfte, Standard 0 = wie im Spiel), **Hüftbreite** und **Oberschenkel dick**.
- **Posen:** Skaten (wie im Spiel), Stehen (Füße am Boden, ohne Brett), Gehen (Vorschau als einfacher Zyklus, nur im Editor; im Spiel gibt es noch keine Gehbewegung).
- Ansicht: Skateboard und Kontur ein- und ausschaltbar. Die Kontur ist hier ein einfacher Ersatz und nicht dieselbe wie im Spiel.
- Speichern im Browser, JSON anzeigen und übernehmen, als Datei laden. Beim Einlesen werden Werte begrenzt und Ungültiges verworfen.

AvatarSpec v2: `{ v:2, species:'humanoid', name, body:{size,head,legs,arms,torso,hipDip,hipW,thighTop}, slots:{skin,top,bot,sole,hc,lens,frame,stripe,pack,pads,phones}, acc:{hair,watch,chain,quilt,pack,pads,phones} }`

## Was noch nicht geht
- Teile mit der Maus verschieben und skalieren, Aufkleber auf runden Flächen, eigene Paletten.
- Andere Arten, Animation, glTF-Export, Server-Speicher für die Designer (geplant, Seiten-Passwort, Versionen).
- Verbindung zum Spiel: Der Vergleich mit den Spielbildern fehlt noch (Kontur und Pose sind nachgebaut, nicht geprüft).
- Hochladen von Bildern ist absichtlich nicht vorgesehen.

Tests: `node tests/59-avatar-designer.js` (Pixel-Netz), `node tests/60-avatar-rund.js` (Rund und Reiter).

## Reiter Gebäude (haus.html)
Setzt Häuser aus denselben Teilen wie der Builder im Spiel. Der Katalog (Formen, Organisch, Dächer, Fenster & Türen, Garten), die 12 festen Farben, das Zellenformat und Export/Import liegen in `src/bau-teile.js`. Das Spiel und der Designer laden genau diese Datei, neue Teile also nur dort ergänzen.
Bedienung: Linksklick setzt, Rechtsklick radiert, Ziehen dreht die Kamera, Mausrad zoomt, Z macht rückgängig, R dreht das Teil. Das Export-JSON ist das Spielformat (`{cells:{"x,y,z":[teil,farbe,drehung,[4 Seiten]]}}`) und lässt sich im Spiel mit `bauLoadInto` laden (Test 61).
Nicht enthalten: Bauplätze der Karte, Aufträge und Belohnung.

## Server-Speicher
Avatar- und Haus-Entwürfe lassen sich auf dem Server speichern (Leiste "Auf dem Server (mit Versionen)", `srv.js`, Worker `worker/entwuerfe.js`).
- Ablage im Bucket `designs` unter `entwuerfe/<art>/<kennung>/<version>.json`. Jede Speicherung ist eine neue Version, es wird nie überschrieben und nie gelöscht.
- Zugang nur mit dem Seitenpasswort (wie alles unter `/api`). Der Server prüft Größe (höchstens 64 KB), Form und Werte, begrenzt auf 50 Entwürfe je Art und 20 Versionen je Entwurf und bremst auf 20 Speicherungen pro Minute und Adresse (`ENTW_RATE`).
- Die Seite liegt auf dem Server unter `/designer/` (`build.py` kopiert sie nach `dist/designer/`). Lokal oder im Artefakt meldet die Leiste "Kein Server hier".
- Test 62 braucht einen lokalen Worker: `npx wrangler dev --local --port 8790 --var SITE_PASSWORD:testpw --var STATS_PASSWORD:statspw --var ENTW_RATE:60`.

## Mesh-Avatar mit Texture-Painter (mesh.html)
Unterreiter "Mesh (Low Poly)" im Reiter Avatar. Eine Figur aus einem Stück (rund 480 Dreiecke), per Code erzeugt, an denselben Gelenken wie die Avatare im Spiel (hips, torso, head, thigh, shin, foot, shoulder, elbow, jeweils L/R) mit weichem Übergang (Skinning, höchstens zwei Knochen je Ecke). Posen Stehen, Gehen, Skaten wie im Rund-Modus.
- **Textur:** 64 × 64 Pixel, jedes Pixel eine Palettennummer (12 Farben, Platzhalter: die Farben des Haus-Builders). Kein Bild-Upload. Dargestellt ohne Glättung (Schalter "Geglättet" zum Vergleich).
- **Flächen:** Kopf, Rumpf, Arm L/R, Bein L/R, Fuß L/R und "Kappen" (Enden) liegen als feste Rechtecke in der Textur. Spiegeln malt links/rechts gleichzeitig (Kopf und Rumpf an der Mittelachse, Arme, Beine und Füße als Paar).
- **Malen:** direkt auf der Figur (ziehen) oder auf der abgewickelten Fläche. Stift, Füllen (nur innerhalb einer Fläche), Pipette, Zurück. Auf der Figur zieht man daneben oder mit der rechten Maustaste, um zu drehen.
- **Format AvatarMesh v1:** `{v:1, kind:'mesh', species:'humanoid', name, pal:'bau12', tex:'<4096 Zeichen aus 0-9, a, b>'}`. Nicht kompatibel mit AvatarSpec v2 (Rund-Modus). Server-Art `mesh` (Prüfung der Textur in `worker/entwuerfe.js`).
- **Nicht enthalten:** Zubehör, Kleidung, eigener Körperbau (Regler), Import fremder Meshes (glTF). Test 63.
