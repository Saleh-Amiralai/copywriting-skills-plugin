# Landingpage: Websites für Coaches und Begleiter

Eigenständige, animierte Landingpage (eine HTML-Datei, keine Build-Tools, keine JS-Bibliotheken) für die Zielgruppe aus dem Zielgruppenprofil „Was beschäftigt Menschen, die andere begleiten?“.

## Öffnen

`index.html` direkt im Browser öffnen oder auf einen beliebigen Webspace legen.

## Konzept

- Leitgedanke aus dem Profil: *Entlastung ermöglichen und dabei die eigene Stimme und Selbstbestimmung bewahren.*
- Bildwelt: heilende Hände, aus denen goldenes Licht wächst (Spross, Samen, Lebensbaum).
- Tonalität: du-Form, ruhig, konkret, ohne Verkaufsdruck, ohne künstliche Verknappung (Profil-Punkte 04, 15, 16).
- Aufbau: Hero · „Kennst du das?“ (Ich-Aussagen aus dem Profil als Laufband) · Leitgedanke mit drei Prinzipien · Ablauf in sechs Schritten · Leistung · „Du musst nicht fertig sein“ · Preisrahmen · Entscheidende Fragen (FAQ) · Erstgespräch mit Formular.

## Farbpalette

| Rolle | Wert |
|---|---|
| Grund (Oxblood) | `#170507` / `#200a0e` |
| Wein | `#4a0f18` / `#6a1623` |
| Rot-Akzent | `#c1272d` / `#e0404a` |
| Gold | `#d8b04c` |
| Gold hell | `#f3d98a` |
| Gold dunkel | `#a9843a` |
| Creme (Text) | `#f4e8d6` |
| Gedämpft (Fließtext) | `#cdb9a3` |

Schriften: Cormorant Garamond (Display) und Manrope (Fließtext), geladen über Google Fonts.

## Bewegung und Interaktion

- Wortweise Headline-Animation, aufsteigende Goldpartikel aus den Händen, Maus-Parallaxe im Hero.
- Laufband mit Zitaten (pausiert bei Hover), Scroll-Reveal für alle Abschnitte.
- Goldene Ranke, die sich beim Scrollen entlang der Ablauf-Schritte zeichnet.
- Magnetische Buttons, Karten mit Licht-Hover, Bild-Enthüllung per Clip-Path, atmendes Lebensbaum-Bild.
- `prefers-reduced-motion` wird respektiert.

## Bilder

Die drei Bilder wurden mit Higgsfield (GPT Image 2.5) erzeugt und sind aktuell per URL vom Higgsfield-CDN eingebunden. Für den Live-Betrieb die Dateien herunterladen, als WebP speichern und lokal einbinden:

- Hero (3:2): Hände mit goldenem Spross
- Ablauf (21:9): Lebensbaum aus Händen
- Anfangen (4:5): Hand mit goldenem Samen

## Platzhalter

`[Dein Name]`, `[PREIS]`, `[Jahr]`, `[deine E-Mail-Adresse]` sowie die Links zu Impressum und Datenschutz müssen ersetzt werden. Das Formular hat noch kein Ziel (`action="#"`).
