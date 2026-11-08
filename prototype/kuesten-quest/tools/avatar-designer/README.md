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
