#!/usr/bin/env node
/**
 * transcribe.mjs — fetch a YouTube transcript through an Apify Actor.
 *
 * Zero dependencies (Node >= 18). Calls the Apify REST API synchronously
 * (run-sync-get-dataset-items), normalizes whatever the Actor returns into
 * a list of {start, dur, text} segments, and prints plain text / SRT / JSON.
 *
 * Usage:
 *   node transcribe.mjs <youtube-url-or-id> [more urls...] [options]
 *
 * Options:
 *   --lang <code>       Preferred caption language (e.g. de, en). Default: auto.
 *   --format <fmt>      text | segments | srt | json   (default: text)
 *   --out <path>        Write result to a file instead of stdout.
 *                       With several videos, "{id}" in the path is replaced.
 *   --actor <user/name> Apify Actor to run (default: pintostudio/youtube-transcript-scraper).
 *   --input <json>      Raw JSON input for a custom Actor (replaces the default input).
 *   --timeout <sec>     Actor run timeout in seconds (default: 180).
 *   --quiet             No progress messages on stderr.
 *
 * Environment:
 *   APIFY_TOKEN     required — from https://console.apify.com/settings/integrations
 *   APIFY_ACTOR     optional — same as --actor
 *   APIFY_API_BASE  optional — API base URL (default https://api.apify.com)
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const DEFAULT_ACTOR = "pintostudio/youtube-transcript-scraper";

// ---------------------------------------------------------------- args ----
const argv = process.argv.slice(2);
const opts = { lang: "", format: "text", out: "", actor: "", input: "", timeout: 180, quiet: false };
const targets = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  const next = () => {
    if (i + 1 >= argv.length) fail(`Missing value for ${a}`);
    return argv[++i];
  };
  if (a === "--lang") opts.lang = next();
  else if (a === "--format") opts.format = next();
  else if (a === "--out") opts.out = next();
  else if (a === "--actor") opts.actor = next();
  else if (a === "--input") opts.input = next();
  else if (a === "--timeout") opts.timeout = Number(next());
  else if (a === "--quiet" || a === "-q") opts.quiet = true;
  else if (a === "--help" || a === "-h") { usage(); process.exit(0); }
  else if (a.startsWith("--")) fail(`Unknown option ${a}`);
  else targets.push(a);
}

if (targets.length === 0) { usage(); process.exit(2); }
if (!["text", "segments", "srt", "json"].includes(opts.format)) fail(`Unknown --format ${opts.format}`);
if (!Number.isFinite(opts.timeout) || opts.timeout <= 0) fail("--timeout must be a positive number of seconds");

const token = (process.env.APIFY_TOKEN || "").trim();
if (!token) {
  fail(
    "APIFY_TOKEN is not set.\n" +
    "  1. Create a token at https://console.apify.com/settings/integrations\n" +
    "  2. export APIFY_TOKEN=apify_api_...   (or add it to your shell profile)"
  );
}

const actor = opts.actor || process.env.APIFY_ACTOR || DEFAULT_ACTOR;
const apiBase = (process.env.APIFY_API_BASE || "https://api.apify.com").replace(/\/+$/, "");

// --------------------------------------------------------------- main -----
const results = [];
for (const target of targets) {
  const videoId = extractVideoId(target);
  const videoUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : target;
  log(`→ ${videoUrl}  (actor: ${actor}${opts.lang ? `, lang: ${opts.lang}` : ""})`);

  const input = buildInput(videoUrl);
  const items = await runActor(actor, input);
  const segments = normalizeSegments(items);

  if (segments.length === 0) {
    log(`  ✗ No transcript returned. The video may have captions disabled, be private, or the Actor may need a different language.`);
    results.push({ videoId, videoUrl, segments: [], raw: items });
    continue;
  }
  const total = segments[segments.length - 1].start + (segments[segments.length - 1].dur || 0);
  log(`  ✓ ${segments.length} segments, ~${fmtClock(total)} of speech`);
  results.push({ videoId, videoUrl, segments, raw: items });
}

for (const r of results) {
  if (r.segments.length === 0) continue;
  const body = render(r, opts.format);
  if (opts.out) {
    const path = results.length > 1 || opts.out.includes("{id}")
      ? opts.out.replace("{id}", r.videoId || "video")
      : opts.out;
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, body);
    log(`  saved → ${path}`);
  } else {
    if (results.length > 1) process.stdout.write(`\n===== ${r.videoUrl} =====\n`);
    process.stdout.write(body.endsWith("\n") ? body : body + "\n");
  }
}

process.exit(results.every((r) => r.segments.length === 0) ? 1 : 0);

// ------------------------------------------------------------ helpers -----
function buildInput(videoUrl) {
  if (opts.input) {
    let raw;
    try { raw = JSON.parse(opts.input); } catch (e) { fail(`--input is not valid JSON: ${e.message}`); }
    // Let a custom input reference the current URL with "{url}" anywhere in a string.
    return JSON.parse(JSON.stringify(raw).replaceAll("{url}", videoUrl));
  }
  const input = { videoUrl };
  if (opts.lang) input.language = opts.lang;
  return input;
}

async function runActor(actorId, input) {
  const actorPath = actorId.replace("/", "~");
  const url = new URL(`${apiBase}/v2/acts/${actorPath}/run-sync-get-dataset-items`);
  url.searchParams.set("token", token);
  url.searchParams.set("timeout", String(opts.timeout));
  url.searchParams.set("clean", "true");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), (opts.timeout + 30) * 1000);
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: controller.signal,
    });
  } catch (e) {
    fail(`Request to Apify failed: ${e.name === "AbortError" ? "timed out" : e.message}`);
  } finally {
    clearTimeout(timer);
  }

  const text = await res.text();
  if (!res.ok) {
    let msg = text.slice(0, 500);
    try { msg = JSON.parse(text)?.error?.message || msg; } catch { /* keep raw */ }
    if (res.status === 401) msg = `Unauthorized — check APIFY_TOKEN. (${msg})`;
    if (res.status === 404) msg = `Actor "${actorId}" not found on Apify. (${msg})`;
    if (res.status === 402) msg = `Apify refused the run: out of credits / payment required. (${msg})`;
    fail(`Apify API ${res.status}: ${msg}`);
  }
  try {
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [data];
  } catch {
    fail(`Apify returned non-JSON output: ${text.slice(0, 200)}`);
  }
}

/**
 * Actors on the Apify store return transcripts in many shapes:
 *   [{start, dur, text}, ...]
 *   [{data: [{start, dur, text}]}]
 *   [{transcript: [{offset, duration, text}]}]
 *   [{segments: [...]}], [{captions: [...]}], [{transcript: "plain string"}], ...
 * Find the first array of {text} objects anywhere in the payload; fall back to
 * a plain-string transcript field.
 */
function normalizeSegments(items) {
  const found = findSegmentArray(items, 0);
  if (found) {
    return found
      .map((s) => ({
        start: toSeconds(s.start ?? s.offset ?? s.startTime ?? s.startMs ?? s.from ?? 0, s),
        dur: toSeconds(s.dur ?? s.duration ?? s.durationMs ?? 0, s),
        text: String(s.text ?? s.content ?? "").replace(/\s+/g, " ").trim(),
      }))
      .filter((s) => s.text);
  }
  const str = findStringField(items, ["transcript", "text", "fullText", "plainText", "captions"], 0);
  if (str) return [{ start: 0, dur: 0, text: str.replace(/\s+/g, " ").trim() }];
  return [];
}

function findSegmentArray(node, depth) {
  if (depth > 6 || node == null) return null;
  if (Array.isArray(node)) {
    if (node.length && node.every((x) => x && typeof x === "object" && typeof (x.text ?? x.content) === "string")) return node;
    for (const child of node) { const r = findSegmentArray(child, depth + 1); if (r) return r; }
    return null;
  }
  if (typeof node === "object") {
    // Prefer well-known keys first, then anything else.
    const keys = Object.keys(node).sort((a, b) => rank(a) - rank(b));
    for (const k of keys) { const r = findSegmentArray(node[k], depth + 1); if (r) return r; }
  }
  return null;
}
function rank(k) {
  const pref = ["segments", "transcript", "data", "captions", "subtitles", "items", "results"];
  const i = pref.indexOf(k);
  return i === -1 ? 99 : i;
}

function findStringField(node, names, depth) {
  if (depth > 6 || node == null) return null;
  if (Array.isArray(node)) { for (const c of node) { const r = findStringField(c, names, depth + 1); if (r) return r; } return null; }
  if (typeof node === "object") {
    for (const n of names) if (typeof node[n] === "string" && node[n].trim().length > 20) return node[n];
    for (const k of Object.keys(node)) { const r = findStringField(node[k], names, depth + 1); if (r) return r; }
  }
  return null;
}

function toSeconds(v, seg) {
  if (typeof v === "string") {
    if (/^\d{1,2}:\d{2}(:\d{2})?([.,]\d+)?$/.test(v)) {
      const [hms, frac = "0"] = v.replace(",", ".").split(".");
      const parts = hms.split(":").map(Number);
      const secs = parts.reduce((acc, p) => acc * 60 + p, 0);
      return secs + Number(`0.${frac}`);
    }
    v = Number(v);
  }
  if (!Number.isFinite(v)) return 0;
  // Milliseconds if the field name says so or the value is implausibly large.
  const msField = seg && ("startMs" in seg || "durationMs" in seg);
  return msField || v > 100000 ? v / 1000 : v;
}

function render(r, format) {
  const { segments } = r;
  if (format === "json") return JSON.stringify({ videoId: r.videoId, videoUrl: r.videoUrl, segments }, null, 2) + "\n";
  if (format === "srt") {
    return segments.map((s, i) =>
      `${i + 1}\n${fmtSrt(s.start)} --> ${fmtSrt(s.start + (s.dur || 2))}\n${s.text}\n`
    ).join("\n");
  }
  if (format === "segments") return segments.map((s) => `[${fmtClock(s.start)}] ${s.text}`).join("\n") + "\n";
  // text: join into readable paragraphs (break on long pauses or every ~90 s).
  const paras = [];
  let cur = [], paraStart = 0, lastEnd = 0;
  for (const s of segments) {
    const gap = s.start - lastEnd;
    if (cur.length && (gap > 3 || s.start - paraStart > 90)) { paras.push(cur.join(" ")); cur = []; paraStart = s.start; }
    if (!cur.length) paraStart = s.start;
    cur.push(s.text);
    lastEnd = s.start + (s.dur || 0);
  }
  if (cur.length) paras.push(cur.join(" "));
  const header = `# Transcript — ${r.videoUrl}\n\n`;
  return header + paras.join("\n\n") + "\n";
}

function extractVideoId(s) {
  if (/^[\w-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    if (u.hostname === "youtu.be") return u.pathname.slice(1, 12) || null;
    if (u.hostname.endsWith("youtube.com")) {
      if (u.searchParams.get("v")) return u.searchParams.get("v");
      const m = u.pathname.match(/\/(shorts|live|embed|v)\/([\w-]{11})/);
      if (m) return m[2];
    }
  } catch { /* not a URL */ }
  return null;
}

function fmtClock(sec) {
  sec = Math.max(0, Math.floor(sec));
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return (h ? `${h}:` : "") + `${String(m).padStart(h ? 2 : 1, "0")}:${String(s).padStart(2, "0")}`;
}
function fmtSrt(sec) {
  const ms = Math.round(sec * 1000);
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000), f = ms % 1000;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(f).padStart(3, "0")}`;
}

function log(msg) { if (!opts.quiet) process.stderr.write(msg + "\n"); }
function fail(msg) { process.stderr.write(`transcribe: ${msg}\n`); process.exit(1); }
function usage() {
  process.stderr.write(
`Usage: node transcribe.mjs <youtube-url-or-id> [more...] [--lang de] [--format text|segments|srt|json] [--out file] [--actor user/name] [--input '{json}'] [--timeout 180] [--quiet]
Requires APIFY_TOKEN in the environment.
`);
}
