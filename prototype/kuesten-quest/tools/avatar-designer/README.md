# Avatar-Designer (intern, Prototyp v0)

Ein internes Werkzeug zum Entwerfen von Avataren. Es ist **noch nicht Teil des Spiels** und nicht mit dem Spiel verbunden.

## Starten
Im Ordner `prototype/kuesten-quest` einen Webserver starten und die Seite öffnen:

```
python3 -m http.server 8080
# dann im Browser: http://localhost:8080/tools/avatar-designer/
```

## Was es kann (v0)
- **Teile mit Netz:** Kopf, Rumpf, Arm, Bein, Schuh. Jedes Teil hat ein Pixelnetz (Kreuz-Muster, wie bei Minecraft-Skins). Arm, Bein und Schuh gibt es einmal, links ist rechts gespiegelt.
- **Zonenfarben:** Grundfarbe je Teil aus der festen Palette.
- **Malen** mit fester Palette (24 Farben), **Spiegeln** an der Mittelachse (Vorder-, Rück-, Oberseite im Gesicht, linke und rechte Seite gegeneinander), **Radieren**, **Füllen** (bleibt in der Fläche), **Zurück**.
- **Aufkleber (Decals):** 8×8-Bilder (Stern, Herz, Blitz, Lächeln, Auge, Streifen), in einer eigenen Ebene über dem Malen, mit Spiegelkopie.
- **Körperform:** Regler für Rumpfhöhe, Breite, Gliedmaßen und Kopf.
- **Speichern:** im Browser (localStorage) oder als JSON (Datensatz "AvatarSpec", Version 1). Beim Einlesen werden Werte begrenzt und ungültige Einträge verworfen.

## Was es noch nicht kann
- Andere Arten (insectoid, reptiloid, canid, ...): brauchen eigene Teile-Sätze und Skelette.
- Animation, glTF-Export, Kleidung als eigene Teile mit freiem Malen, Relief-Ebene.
- Hochladen von Bildern: ist absichtlich nicht vorgesehen (Regel des Projekts: nur Malen mit fester Auflösung und Palette).
- Anbindung an das Spiel, Spieler-Zugang.

## Datensatz
`{ v:1, species:'humanoid', body:{height,width,limb,head}, zones:{skin,top,bottom,shoes} (Palettenindex), paint:{teil:[Palettenindex je Pixel]}, decals:[{part,x,y,id,c,flip}] }`
Der Kern ist allgemein gehalten (Teile, Netz, Zonen, Malen, Decals), damit später weitere Arten, Tiere, Werkzeuge und Fahrzeuge dazukommen können.

Test: `node tests/59-avatar-designer.js`
