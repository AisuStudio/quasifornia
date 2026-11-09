/* Automatisch erzeugt aus BUSINESS-PLAN.xlsx (Stand 2026-11-08). Nicht von Hand ändern. Wird nur über /api/stats/plan ausgeliefert (Stats-Passwort). */
export const PLAN={
 "asof": "2026-11-08",
 "basis": "Gewinn",
 "ziel": [
  40000.0,
  100000.0
 ],
 "umsatzNoetig": [
  45072,
  111162
 ],
 "umsatz": [
  45372,
  111720
 ],
 "gewinn": [
  40521,
  101202
 ],
 "fix": [
  2800,
  6760
 ],
 "var": [
  2051,
  3758
 ],
 "quartale": [
  "J1 Q1",
  "J1 Q2",
  "J1 Q3",
  "J1 Q4",
  "J2 Q1",
  "J2 Q2",
  "J2 Q3",
  "J2 Q4"
 ],
 "umsatzQ": [
  0,
  6220,
  13732,
  25420,
  16900,
  26180,
  29340,
  39300
 ],
 "gewinnQ": [
  -700,
  5088,
  12277,
  23856,
  14519,
  23612,
  26656,
  36415
 ],
 "streams": [
  {
   "name": "Welten-Aufträge (Collabs)",
   "rev": [
    0,
    4000,
    4000,
    12000,
    5000,
    10000,
    10000,
    15000
   ],
   "j1": 20000,
   "j2": 40000
  },
  {
   "name": "Förderung",
   "rev": [
    0,
    0,
    5000,
    5000,
    5000,
    5000,
    5000,
    10000
   ],
   "j1": 10000,
   "j2": 25000
  },
  {
   "name": "Schul- & Workshop-Pakete",
   "rev": [
    0,
    0,
    1600,
    3200,
    3000,
    5000,
    6000,
    6500
   ],
   "j1": 4800,
   "j2": 20500
  },
  {
   "name": "Familien-Abo",
   "rev": [
    0,
    0,
    432,
    900,
    1440,
    1980,
    2520,
    3240
   ],
   "j1": 1332,
   "j2": 9180
  },
  {
   "name": "Merch & Sticker",
   "rev": [
    0,
    720,
    1200,
    1320,
    960,
    1200,
    1320,
    1560
   ],
   "j1": 3240,
   "j2": 5040
  },
  {
   "name": "Sponsoring / Billboards",
   "rev": [
    0,
    1500,
    1500,
    3000,
    1500,
    3000,
    4500,
    3000
   ],
   "j1": 6000,
   "j2": 12000
  }
 ],
 "spielerQ": [
  100,
  400,
  1200,
  2500,
  4000,
  5500,
  7000,
  9000
 ],
 "spielerNoetig": [
  939,
  9264
 ],
 "stunden": [
  17.8,
  35.6
 ],
 "auslastung": [
  1.18,
  1.42
 ],
 "foerderung": [
  {
   "name": "Games-Förderung des Bundes",
   "geber": "BMFTR, abgewickelt über DLR Projektträger",
   "art": "Zuschuss",
   "umsatz": "Ja",
   "betrag": "Nicht rückzahlbar, Quote nach Größe: bis 25 % (groß), bis 45 % (KMU), bis 50 % (Start-up bis 3 Jahre). Höchstzuschuss 8 Mio. €. Budget 2026 laut Haushalt ca. 125 Mio. €.",
   "stand": "Förderaufruf gilt seit 2025-07-18, längstens bis 2026-12-31. Danach neuer Aufruf zu erwarten, noch nicht gefunden.",
   "passung": "niedrig",
   "huerden": "Mindestprojektgröße 300.000 €. Verpflichtende Entwurfsberatung beim DLR. Kulturtest und USK-Alterskennzeichnung nötig. Eigenanteil entsprechend hoch.",
   "schritt": "Nur sinnvoll mit größerem Team oder Partner. Beim DLR nach dem neuen Aufruf 2027 fragen.",
   "quelle": "https://www.bmftr.bund.de/DE/Technologie/Games/Games_node.html"
  },
  {
   "name": "Games-Förderung Medienboard Berlin-Brandenburg",
   "geber": "Medienboard Berlin-Brandenburg",
   "art": "Darlehen",
   "umsatz": "Nein",
   "betrag": "Erfolgsbedingt rückzahlbares, zinsloses Darlehen. Prototyp: in der Regel 50 % (bis 80 %) der Entwicklungskosten, meist max. 300.000 €. Produktion: bis 50 %, meist max. 600.000 €. Eigenmittel mindestens 5 %. ILB-Gebühr 3 %.",
   "stand": "Merkblatt Stand 2026-02-25. Aktuelle Einreichtermine stehen auf medienboard.de. Berlin hat 2026 zusätzlich 1 Mio. € für Games bereitgestellt.",
   "passung": "mittel",
   "huerden": "Antragsgespräch mindestens 2 Wochen vor dem Termin. Kulturtest. Sitz in Berlin oder Brandenburg. Kein Gewinn kalkulierbar. Rückzahlung aus Erlösen.",
   "schritt": "Antragsgespräch buchen. Als Finanzierung für den Bau eines Prototyps prüfen, nicht als Umsatz.",
   "quelle": "https://www.medienboard.de/fileadmin/user_upload/pdf/Richtlinien-Merkblaetter/2026_02_25_Merkblatt_GAMES_UND_INTERAKTIVE_INHALTE.pdf"
  },
  {
   "name": "BzKJ-Förderprogramm: kindgerechte digitale Angebote",
   "geber": "Bundeszentrale für Kinder- und Jugendmedienschutz",
   "art": "Zuschuss",
   "umsatz": "Ja",
   "betrag": "2026: insgesamt bis 200.000 € für bis zu 6 Maßnahmen (rechnerisch ca. 33.000 € je Maßnahme). Antragsberechtigt auch Einzelunternehmen.",
   "stand": "Runde 2026: Frist war 2026-02-27, Maßnahmen bis 2026-11-30. Ob es 2027 eine neue Runde gibt, ist nicht bestätigt (Programm trägt das Jahr im Titel).",
   "passung": "hoch",
   "huerden": "Schwerpunkt Interaktion, Teilhabe, KI, Demokratiefähigkeit, Mobile First. Keine Vorprüfung von Konzepten möglich.",
   "schritt": "Ab Januar 2027 auf bzkj.de nach der Ausschreibung schauen. Bewerbung auf Kinder-Teilhabe und Mobile First zuschneiden.",
   "quelle": "https://www.bzkj.de/resource/blob/279196/7f06929876430f6833eae372455e3915/foerderprogramm-2026-data.pdf"
  },
  {
   "name": "Berliner Startup Stipendium",
   "geber": "Land Berlin über Inkubatoren (z. B. HWR)",
   "art": "Stipendium",
   "umsatz": "Ja",
   "betrag": "Bis 2.500 € pro Monat, 6 bis 36 Monate.",
   "stand": "Laut Senatsverwaltung: Batch IV Bewerbung Oktober bis November 2026, Start 2027-01-01. Fenster läuft evtl. noch, sofort prüfen.",
   "passung": "mittel",
   "huerden": "Meist technologie- und wissensbasierte Gründungen, Vollzeit im Inkubator, Durchführung in Berlin. Kreativ-/Games-Eignung hängt vom Inkubator ab.",
   "schritt": "Diese Woche bei den Inkubatoren nachfragen, ob ein Games-/Edtech-Projekt passt.",
   "quelle": "https://www.berlin.de/sen/web/presse/pressemitteilungen/2026/pressemitteilung.1653813.php"
  },
  {
   "name": "Press Start: Gründungsstipendium Games",
   "geber": "Bund (BKM), umgesetzt von Stiftung Digitale Spielekultur und game",
   "art": "Stipendium",
   "umsatz": "Ja",
   "betrag": "Betrag nicht gefunden. Programm ca. 8 Mio. € für 132 Geförderte, mit Workshops und Mentoring.",
   "stand": "Letzte Bewerbungsphase 2024-10-28 bis 2024-11-17. Keine neue Runde gefunden.",
   "passung": "mittel",
   "huerden": "Wohnsitz in Deutschland, bis zu 3 Gründer, Nebentätigkeit max. 10 h pro Woche, Pflichtworkshops.",
   "schritt": "games-stipendium.de beobachten oder bei der Stiftung nach einer Fortsetzung fragen.",
   "quelle": "https://www.games-stipendium.de/bewerbungsinformationen/"
  },
  {
   "name": "Creative Europe MEDIA: Video games and immersive content development",
   "geber": "EU-Kommission",
   "art": "Zuschuss",
   "umsatz": "Ja",
   "betrag": "Pauschalzuschuss (Lump Sum). Dritt-Quellen nennen bis ca. 200.000 € und bis 70 % der Kosten. Budget 2027: 13,5 Mio. €.",
   "stand": "Call CREA-MEDIA-2027-DEVVGIM: Frist 2027-02-02. Aufruf offen seit 2026-09-30.",
   "passung": "niedrig",
   "huerden": "Für narrative Spiele mit internationalem Marktpotenzial, Rechte müssen beim Antragsteller bleiben. Betragsangaben stammen aus Dritt-Quellen.",
   "schritt": "Creative Europe Desk Deutschland fragen, ob ein offenes Welten-Spiel passt.",
   "quelle": "https://www.gamesmarket.global/eu-funding-creative-europe-media-games-funding-round-open-until-february-1365435b3cb4698d66a5b7f36dcf95bf"
  },
  {
   "name": "Medienkompetenz-Projektförderung der mabb",
   "geber": "Medienanstalt Berlin-Brandenburg",
   "art": "Zuschuss",
   "umsatz": "Ja",
   "betrag": "Betrag nicht gefunden. Förderung über Ausschreibungsverfahren, Schwerpunkte wechseln.",
   "stand": "Keine aktuelle Ausschreibung zu Kindern und Spielen gefunden.",
   "passung": "mittel",
   "huerden": "Kommerzielle Projekte nicht förderfähig. Eher mit gemeinnützigem Partner (Schule, Verein) für den Workshop-Teil.",
   "schritt": "Ausschreibungen auf mabb.de beobachten. Partner für Workshop-Projekte suchen.",
   "quelle": "https://www.grantbite.com/de/funding/foerderung-medienkompetenz-berlin-brandenburg"
  },
  {
   "name": "Kultur- und Kreativpilot*innen Deutschland",
   "geber": "Bund, Kultur- und Kreativwirtschaft",
   "art": "Auszeichnung + Coaching",
   "umsatz": "Nein",
   "betrag": "Betrag nicht bestätigt. Etwa 32 Auszeichnungen pro Jahr, Coaching und Netzwerk.",
   "stand": "Letzte gefundene Frist 2024-07-01. Runde 2026 nicht gefunden.",
   "passung": "mittel",
   "huerden": "Nur online-Bewerbung (Idee, Team, Motivation). Spieleunternehmen waren schon unter den Ausgezeichneten.",
   "schritt": "kultur-kreativpiloten.de auf die nächste Runde beobachten.",
   "quelle": "https://kultur-kreativpiloten.de/wp-content/uploads/2024/05/pressemitteilung_kreativpiloten_bewerbungsstart_2024.pdf"
  }
 ],
 "prio": [
  {
   "name": "Creative Europe MEDIA: Video games and immersive content development",
   "standort": 5,
   "budget": 4,
   "datum": 4,
   "score": 4.4,
   "schritt": "Creative Europe Desk Deutschland fragen, ob ein offenes Welten-Spiel passt."
  },
  {
   "name": "Games-Förderung des Bundes",
   "standort": 5,
   "budget": 5,
   "datum": 2,
   "score": 4.25,
   "schritt": "Nur sinnvoll mit größerem Team oder Partner. Beim DLR nach dem neuen Aufruf 2027 fragen."
  },
  {
   "name": "BzKJ-Förderprogramm: kindgerechte digitale Angebote",
   "standort": 5,
   "budget": 2,
   "datum": 2,
   "score": 3.2,
   "schritt": "Ab Januar 2027 auf bzkj.de nach der Ausschreibung schauen. Bewerbung auf Kinder-Teilhabe und Mobile First zuschneiden."
  },
  {
   "name": "Berliner Startup Stipendium",
   "standort": 1,
   "budget": 3,
   "datum": 5,
   "score": 2.7,
   "schritt": "Diese Woche bei den Inkubatoren nachfragen, ob ein Games-/Edtech-Projekt passt."
  },
  {
   "name": "Kultur- und Kreativpilot*innen Deutschland",
   "standort": 5,
   "budget": 1,
   "datum": 1,
   "score": 2.6,
   "schritt": "kultur-kreativpiloten.de auf die nächste Runde beobachten."
  },
  {
   "name": "Press Start: Gründungsstipendium Games",
   "standort": 4,
   "budget": 2,
   "datum": 1,
   "score": 2.55,
   "schritt": "games-stipendium.de beobachten oder bei der Stiftung nach einer Fortsetzung fragen."
  },
  {
   "name": "Games-Förderung Medienboard Berlin-Brandenburg",
   "standort": 1,
   "budget": 4,
   "datum": 3,
   "score": 2.55,
   "schritt": "Antragsgespräch buchen. Als Finanzierung für den Bau eines Prototyps prüfen, nicht als Umsatz."
  },
  {
   "name": "Medienkompetenz-Projektförderung der mabb",
   "standort": 1,
   "budget": 2,
   "datum": 1,
   "score": 1.35,
   "schritt": "Ausschreibungen auf mabb.de beobachten. Partner für Workshop-Projekte suchen."
  }
 ],
 "canvas": {
  "kp": {
   "t": "Schlüsselpartner",
   "x": "• Artists und Musiker (Songs im Spiel; GEMA, Label, Verlag vorher klären)\n• Schulen und Bildungsträger (Workshops)\n• Förderer (Medienboard, BzKJ, EU)\n• Game-Erfahrene und Sound-Engineer (Freunde, Vertrag nötig)\n• Cloudflare und Supabase (Infrastruktur)"
  },
  "ka": {
   "t": "Schlüsselaktivitäten",
   "x": "• Welten und Quests bauen (Kern: Quests und Entdecken)\n• Collab-Welten im Auftrag umsetzen\n• Workshops und Schulpakete durchführen\n• Förderanträge schreiben\n• Community und Moderation (Kinder)"
  },
  "kr": {
   "t": "Schlüsselressourcen",
   "x": "• Offener Code und Prototyp im Browser\n• Cloudflare Workers und Durable Objects\n• Eigene Stil-Identität (Smarta Nova, Pastell-Moodboard)\n• Netzwerk zu Artists\n• Zeit des Gründerteams"
  },
  "vp": {
   "t": "Wertversprechen",
   "x": "Ein offenes, vernetztes Welten-Spiel im Browser, ohne Installer.\n\n• Quests und Entdecken statt Grind\n• Kein Permadeath: Avatar und Erfolge bleiben immer\n• Kein Bild-Upload, nur Paint im Spiel (sicher für Kinder)\n• Jeder kann eine eigene Welt forken und hosten\n• Keine Werbebanner, kein Echtgeld für Scoops"
  },
  "cr": {
   "t": "Kundenbeziehungen",
   "x": "• Crews und gemeinsame Quests\n• Eltern: Sicherheit und Komfort statt Spielvorteile\n• Collab-Partner: persönliche Betreuung, Bewerbung für Collabs\n• Schulen: Workshops mit Begleitung"
  },
  "ch": {
   "t": "Kanäle",
   "x": "• Web-App direkt im Browser (Link teilen)\n• Schulen, Workshops und Bildungsnetzwerke\n• Artists-Communities und deren Reichweite\n• Social Media und Messen (Vorschlag, noch offen)\n• Merch und Sticker als Sichtbarkeit"
  },
  "seg": {
   "t": "Kundensegmente",
   "x": "• Kinder und Jugendliche (Spielende)\n• Eltern (zahlen das Familien-Abo)\n• Schulen und Bildungsträger (Workshop-Pakete)\n• Artists, Marken, Museen (Collab-Welten, Sponsoring)\n• Förderer (Zuschuss statt Kunde)\n• Später: Creator mit eigenen Welten"
  },
  "cost": {
   "t": "Kostenstruktur",
   "x": "• Hosting und Datenbank (Cloudflare, Supabase)\n• Tools, Software, KI\n• Marketing und Community\n• Steuerberater, Recht, Marke\n• Musik- und Artist-Anteile\n• Eigene Zeit (Gehalt aktuell 0)\n\nZahlen: Tabelle unten, live aus Blatt Kosten."
  },
  "rev": {
   "t": "Einnahmequellen",
   "x": "• Welten-Aufträge (Collabs)\n• Förderung (Zuschüsse, nicht Darlehen)\n• Schul- und Workshop-Pakete\n• Familien-Abo (4 € pro Monat)\n• Merch und Sticker\n• Festpreis-Sponsoring / Billboards\n\nTabelle unten, live aus Blatt Plan."
  }
 }
};
