---
name: youtube-transcriber
description: Transcribe YouTube videos via Apify and hand the transcript to the copywriting skills. Fetches the captions/transcript of any public YouTube video (URL, youtu.be link, Shorts, or video ID) through an Apify Actor and returns clean text, timestamped segments, SRT, or JSON. Use this skill whenever the user shares a YouTube link and wants a transcript, a summary, quotes, show notes, or wants to repurpose the video into emails, social posts, ads, landing pages, or launch content — even if they don't say "transcribe" or mention Apify.
---

# YouTube Transcriber (Apify)

This skill lets Claude pull the transcript of a YouTube video through [Apify](https://apify.com) so the other skills in this plugin (social-media-copywriter, email-marketing-copywriter, ad-copywriter, launch-strategist, landing-page-copywriter) can repurpose real spoken content instead of guessing.

There are two ways to reach Apify. Prefer the script — it is deterministic, cheap on context, and works in every Claude Code surface.

| Path | When to use |
|---|---|
| **`scripts/transcribe.mjs`** (default) | Any transcription job. Zero dependencies, Node ≥ 18, one command. |
| **Apify MCP server** (`.mcp.json` in this plugin) | When the user wants to browse other Apify Actors (channel scrapers, comments, search) or the script's default Actor doesn't fit. |

## Prerequisite: `APIFY_TOKEN`

Both paths need an Apify API token in the environment:

1. Create/copy a token at <https://console.apify.com/settings/integrations>.
2. Export it before starting Claude Code (or put it in the shell profile / `.env` the user sources):
   ```bash
   export APIFY_TOKEN="apify_api_..."
   ```
3. Verify inside the session: `echo ${APIFY_TOKEN:+set}` should print `set`.

If the token is missing, the script exits with a clear message. **Do not ask the user to paste the token into the chat** — point them to the export above instead, and never echo the token into files, logs, or commits.

## Running a transcription

```bash
node "${CLAUDE_PLUGIN_ROOT}/skills/youtube-transcriber/scripts/transcribe.mjs" "<youtube-url-or-id>" [options]
```

(If `CLAUDE_PLUGIN_ROOT` is not set in the shell, use the path of this skill folder directly.)

Options:

| Option | Meaning |
|---|---|
| `--lang de` | Preferred caption language (`de`, `en`, …). Omit to auto-detect. Try the video's spoken language first; fall back to `en` (auto-generated captions are usually in the spoken language). |
| `--format text` | `text` (default, readable paragraphs), `segments` (`[m:ss] line`), `srt`, or `json` |
| `--out path` | Write to a file instead of stdout. With several videos use `{id}` in the path, e.g. `--out transcripts/{id}.md`. |
| `--actor user/name` | Use a different Apify Actor (default: `pintostudio/youtube-transcript-scraper`, ~$0.01 per video). |
| `--input '{"urls":["{url}"]}'` | Raw JSON input for a custom Actor; `{url}` is replaced by the video URL. |
| `--timeout 180` | Actor run timeout in seconds. |
| `--quiet` | Suppress progress lines on stderr. |

Several URLs/IDs can be passed in one call.

### Recommended workflow

1. **Save long transcripts to a file, don't dump them into the chat.** Anything over ~10 minutes of video gets large; run with `--out transcripts/{id}.md`, then read only the parts you need (or read the file in chunks). Short clips (< 5 min) can go straight to stdout.
2. **Confirm what came back.** The script prints `✓ N segments, ~mm:ss of speech` on stderr. If the duration is far shorter than the video, captions were probably partial — mention that to the user.
3. **Then hand off.** Pass the transcript (or the relevant excerpt) into the skill the user actually needs — e.g. [social-media-copywriter](../social-media-copywriter/SKILL.md) for repurposing into posts, [email-marketing-copywriter](../email-marketing-copywriter/SKILL.md) for a newsletter, [launch-strategist](../launch-strategist/SKILL.md) for a webinar replay follow-up.
4. **Quote faithfully.** When you pull quotes or numbers from the transcript, use the speaker's actual words — auto-captions can garble names and figures, so flag anything that looks off rather than silently "fixing" it.

### Examples

```bash
# Plain text, German captions preferred
node scripts/transcribe.mjs "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --lang de

# Timestamped segments for show notes / chapter markers
node scripts/transcribe.mjs dQw4w9WgXcQ --format segments --out transcripts/dQw4w9WgXcQ.txt

# SRT subtitles for a video editor
node scripts/transcribe.mjs "https://youtu.be/dQw4w9WgXcQ" --format srt --out subs.srt

# Batch: three videos into one folder
node scripts/transcribe.mjs ID1 ID2 ID3 --out transcripts/{id}.md --quiet
```

## Troubleshooting

| Symptom | What it means / what to do |
|---|---|
| `APIFY_TOKEN is not set` | Export the token (see above) and restart the session. |
| `Apify API 401` | Token is wrong or revoked — regenerate it in the Apify console. |
| `Apify API 402` | The Apify account has no credits left (free tier includes a monthly allowance; this Actor costs about one cent per video). |
| `Apify API 404 … not found` | The `--actor` name is misspelled, or the Actor was unpublished. Try the default Actor or search the store: <https://apify.com/store?search=youtube%20transcript>. |
| `No transcript returned` | Video is private/age-gated, has captions disabled, or has no captions in the requested language. Retry without `--lang`, or with `--lang en`. |
| Timeout | Very long videos can exceed 180 s; raise `--timeout 300`. |

## Using the Apify MCP server instead

The plugin ships an `.mcp.json` that connects to `https://mcp.apify.com` with the same `APIFY_TOKEN`, pre-loaded with the transcript Actor plus Apify's Actor search/docs tools. Once the plugin is enabled and the token is exported, tools like `call-actor` / `pintostudio-slash-youtube-transcript-scraper` show up in `/mcp`. Use that path when the user wants to explore other Actors (YouTube channel/comment scrapers, TikTok, Instagram, web search); for a plain transcript the script above is faster and returns cleaner text.
