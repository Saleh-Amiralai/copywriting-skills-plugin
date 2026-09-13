# Copywriting Skills — Installationsanleitung

Dieses Paket enthält sechs Claude-Code-Skills für Marketing-Copywriting, gebündelt in einem einzigen Plugin:

1. **email-marketing-copywriter** — Newsletter, Welcome-/Nurture-/Launch-Sequenzen, Re-Engagement, Copywriting-Techniken
2. **landing-page-copywriter** — Opt-in-/Squeeze-Pages für Freebies, Webinare, Challenges
3. **launch-strategist** — komplette Live-Launch-Methodik (Webinar/Challenge/Workshop), E-Mail-Sequenzen, Sales Pages
4. **ad-copywriter** — Meta-/Facebook-/Instagram-Ad-Copy, Hooks, Frameworks, Funnel-Stufen (TOF/MOF/BOF)
5. **social-media-copywriter** — Instagram, LinkedIn, Threads/X: Captions, Carousels, Reel-Hooks
6. **youtube-transcriber** — transkribiert YouTube-Videos über Apify (Text, Timestamps, SRT, JSON), damit die anderen Skills echte Video-Inhalte repurposen können

Die fünf Copywriting-Skills sind bewusst allgemein gehalten (Englisch, markenneutral) — sie fragen vor dem Schreiben nach Zielgruppe, Markenstimme und Kontext, statt eine bestimmte Marke vorauszusetzen.

## Voraussetzung

Claude Code muss installiert sein (die `claude`-CLI). Falls nicht vorhanden: [claude.com/code](https://claude.com/code)

## Installation (2 Befehle)

In Claude Code (im Chat-Fenster) folgende zwei Befehle eingeben:

```
/plugin marketplace add Saleh-Amiralai/copywriting-skills-plugin
/plugin install copywriting-skills@copywriting-skills
```

Fertig. Die Skills sind ab sofort aktiv — Claude zieht sie automatisch, sobald eine passende Anfrage kommt (z. B. "Schreib mir eine Willkommens-E-Mail-Sequenz" oder "Erstelle 5 Hook-Varianten für ein Reel").

## YouTube-Transkription einrichten (Apify)

Der Skill `youtube-transcriber` holt Transkripte über [Apify](https://apify.com). Dafür braucht er einmalig einen API-Token:

1. Kostenlos bei Apify anmelden und unter [Settings → API & Integrations](https://console.apify.com/settings/integrations) einen Token kopieren.
2. Den Token als Umgebungsvariable setzen, **bevor** Claude Code gestartet wird (z. B. in `~/.zshrc` oder `~/.bashrc`):

   ```bash
   export APIFY_TOKEN="apify_api_..."
   ```

3. Claude Code neu starten. Danach reicht im Chat z. B.: *"Transkribiere https://www.youtube.com/watch?v=… und mach daraus 3 LinkedIn-Posts."*

Was dann passiert: Claude ruft `skills/youtube-transcriber/scripts/transcribe.mjs` auf (nur Node.js nötig, keine weiteren Abhängigkeiten). Standard-Actor ist `pintostudio/youtube-transcript-scraper` (ca. 0,01 $ pro Video, im Apify-Free-Tier enthalten). Andere Actors lassen sich per `--actor user/name` wählen.

Zusätzlich bringt das Plugin eine `.mcp.json` mit, die den [Apify-MCP-Server](https://mcp.apify.com) mit demselben Token verbindet — damit kann Claude bei Bedarf auch andere Apify-Actors (Channel-Scraper, Kommentare, Suche) nutzen. Ohne gesetzten `APIFY_TOKEN` bleibt dieser Server einfach inaktiv; die Copywriting-Skills funktionieren unabhängig davon.

## Testen

Einfach im Chat z. B. schreiben: *"Schreib mir eine Subject Line + Hook für eine Re-Engagement-E-Mail."* Wenn der Skill greift, wird das Ergebnis nach den Prinzipien aus `email-marketing-copywriter` aufgebaut (Trusted-Advisor-Ton, Framework-Struktur usw.).

## Deinstallieren

```
/plugin uninstall copywriting-skills@copywriting-skills
```

## Aktualisieren

Bei einer neuen Version: einfach den Ordner erneut ausführen lassen — `/plugin marketplace add Saleh-Amiralai/copywriting-skills-plugin` erkennt Änderungen im Repo automatisch.
