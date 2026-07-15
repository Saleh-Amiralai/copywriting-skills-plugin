# Copywriting Skills — Installationsanleitung

Dieses Paket enthält fünf Claude-Code-Skills für Marketing-Copywriting, gebündelt in einem einzigen Plugin:

1. **email-marketing-copywriter** — Newsletter, Welcome-/Nurture-/Launch-Sequenzen, Re-Engagement, Copywriting-Techniken
2. **landing-page-copywriter** — Opt-in-/Squeeze-Pages für Freebies, Webinare, Challenges
3. **launch-strategist** — komplette Live-Launch-Methodik (Webinar/Challenge/Workshop), E-Mail-Sequenzen, Sales Pages
4. **ad-copywriter** — Meta-/Facebook-/Instagram-Ad-Copy, Hooks, Frameworks, Funnel-Stufen (TOF/MOF/BOF)
5. **social-media-copywriter** — Instagram, LinkedIn, Threads/X: Captions, Carousels, Reel-Hooks

Alle fünf sind bewusst allgemein gehalten (Englisch, markenneutral) — sie fragen vor dem Schreiben nach Zielgruppe, Markenstimme und Kontext, statt eine bestimmte Marke vorauszusetzen.

## Voraussetzung

Claude Code muss installiert sein (die `claude`-CLI). Falls nicht vorhanden: [claude.com/code](https://claude.com/code)

## Installation (2 Befehle)

In Claude Code (im Chat-Fenster) folgende zwei Befehle eingeben:

```
/plugin marketplace add Saleh-Amiralai/copywriting-skills-plugin
/plugin install copywriting-skills@copywriting-skills
```

Fertig. Die fünf Skills sind ab sofort aktiv — Claude zieht sie automatisch, sobald eine passende Anfrage kommt (z. B. "Schreib mir eine Willkommens-E-Mail-Sequenz" oder "Erstelle 5 Hook-Varianten für ein Reel").

## Testen

Einfach im Chat z. B. schreiben: *"Schreib mir eine Subject Line + Hook für eine Re-Engagement-E-Mail."* Wenn der Skill greift, wird das Ergebnis nach den Prinzipien aus `email-marketing-copywriter` aufgebaut (Trusted-Advisor-Ton, Framework-Struktur usw.).

## Deinstallieren

```
/plugin uninstall copywriting-skills@copywriting-skills
```

## Aktualisieren

Bei einer neuen Version: einfach den Ordner erneut ausführen lassen — `/plugin marketplace add Saleh-Amiralai/copywriting-skills-plugin` erkennt Änderungen im Repo automatisch.
