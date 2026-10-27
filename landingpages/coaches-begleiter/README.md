# Landingpage: Websites für Coaches und Begleiter

Eigenständige, animierte Landingpage (eine HTML-Datei, keine Build-Tools, keine JS-Bibliotheken) für die Zielgruppe aus dem Zielgruppenprofil „Was beschäftigt Menschen, die andere begleiten?“.

## Öffnen

`index.html` direkt im Browser öffnen oder auf einen beliebigen Webspace legen.

## Konzept

- Leitgedanke aus dem Profil: *Entlastung ermöglichen und dabei die eigene Stimme und Selbstbestimmung bewahren.*
- Bildwelt: zwei Frauenhände, die über die ganze Seite hinweg eine Bewegung vollziehen: offen und empfangend (Hero), Licht sammeln, ein goldener Spross, Licht weben, Linien ordnen sich zu einem Layout, im Footer entsteht zwischen den Händen ein leuchtender Rahmen mit der Website.
- Tonalität: du-Form, ruhig, konkret, ohne Verkaufsdruck, ohne künstliche Verknappung (Profil-Punkte 04, 15, 16).
- Aufbau: Hero · „Kennst du das?“ (Ich-Aussagen aus dem Profil als Laufband) · Leitgedanke mit drei Prinzipien · Ablauf in sechs Schritten · Leistung · „Du musst nicht fertig sein“ · Preisrahmen · Entscheidende Fragen (FAQ) · Erstgespräch mit Formular.

## Farbpalette

| Rolle | Wert |
|---|---|
| Grund (Bordeaux) | `#2b0911` / `#36101a` |
| Wein | `#5a1322` / `#7a1a2c` |
| Rot-Akzent | `#c1272d` / `#e0404a` |
| Amber-Licht | `#f0a24a` |
| Gold | `#d8b04c` |
| Gold hell | `#f3d98a` |
| Gold dunkel | `#a9843a` |
| Creme (Text) | `#f6ebda` |
| Gedämpft (Fließtext) | `#d6c1a9` |
| Glas-Panels | `rgba(38,8,15,.66)` |

Schriften: Cormorant Garamond (Display) und Manrope (Fließtext), geladen über Google Fonts.

## Bewegung und Interaktion

- Scroll-gesteuertes Video: Ein 25-Sekunden-Video der Hände liegt fix im Hintergrund (`.bg-video`). Der Scrollfortschritt der Seite steuert die Abspielposition (weich geglättet per `requestAnimationFrame`). Oben: offene Hände. Unten im Footer: der leuchtende Website-Rahmen. Das Video ist mit einem Keyframe alle 12 Frames kodiert, damit das Springen beim Scrollen flüssig bleibt.
- Alle Textgruppen liegen in halbtransparenten Glas-Panels (`.panel`), damit die Hände sichtbar bleiben und der Text lesbar ist.
- Wortweise Headline-Animation, aufsteigende Goldpartikel, Maus-Parallaxe im Hero.
- Laufband mit Zitaten (pausiert bei Hover), Scroll-Reveal für alle Abschnitte.
- Goldene Ranke, die sich beim Scrollen entlang der Ablauf-Schritte zeichnet.
- Magnetische Buttons, Karten mit Licht-Hover.
- `prefers-reduced-motion` wird respektiert.

## Bilder und Video

Alle Motive wurden mit Higgsfield erzeugt: sechs Schlüsselbilder (GPT Image 2.5, das erste Bild als Referenz für alle weiteren) und daraus fünf Clips mit Kling 3.0 (Start- und Endbild je Clip, je 5 Sekunden), per ffmpeg zu einem Video zusammengeschnitten (1280×720, 25 s, 3,8 MB).

Aktuell per URL vom Higgsfield-CDN eingebunden:

- Video: `.bg-video` (Hintergrund, scroll-gesteuert)
- Poster: Schlüsselbild 1 (offene Hände), wird gezeigt, bis das Video geladen ist

Für den Live-Betrieb beide Dateien herunterladen und lokal einbinden. Hinweis: Auf iOS Safari ist das Scrubben von Hintergrundvideos nicht immer zuverlässig; dort bleibt im Zweifel das Poster stehen.

## Platzhalter

`[Dein Name]`, `[PREIS]`, `[Jahr]`, `[deine E-Mail-Adresse]` sowie die Links zu Impressum und Datenschutz müssen ersetzt werden. Das Formular hat noch kein Ziel (`action="#"`).
