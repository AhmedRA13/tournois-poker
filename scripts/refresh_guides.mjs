/**
 * refresh_guides.mjs — Refresh 5 random guides every 15 days
 *
 * Picks guides that haven't been updated in 15+ days and regenerates
 * their content via Claude Haiku to keep content fresh for SEO.
 *
 * Usage: ANTHROPIC_API_KEY=xxx node scripts/refresh_guides.mjs
 * Cron: every 15 days at 03:00
 *
 * Error logging: ~/batch-log.txt
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Anthropic from "@anthropic-ai/sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const GUIDES_DIR = path.join(ROOT, "data", "guides");
const BATCH_LOG = path.join(process.env.HOME ?? "/root", "batch-log.txt");

// Load .env.local
const envPath = path.join(ROOT, ".env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf-8")
    .split("\n")
    .forEach((line) => {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    });
}

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  const msg = "ANTHROPIC_API_KEY not set — skipping refresh_guides";
  console.error(msg);
  process.exit(0); // Don't fail cron
}

const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// ── Config ─────────────────────────────────────────────────────────────────

const GUIDES_TO_REFRESH = 5;       // number of guides to refresh per run
const MIN_AGE_DAYS = 15;           // only refresh guides older than this

// ── Logging ────────────────────────────────────────────────────────────────

function log(msg) {
  const line = `[${new Date().toISOString()}] [refresh_guides] ${msg}`;
  console.log(line);
}

function logError(msg, err) {
  const line = `[${new Date().toISOString()}] [refresh_guides] ERROR: ${msg}${err ? " — " + (err.message ?? err) : ""}\n`;
  console.error(line.trim());
  try { fs.appendFileSync(BATCH_LOG, line); } catch {}
}

// ── Helpers ───────────────────────────────────────────────────────────────

function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

function daysSince(isoDate) {
  if (!isoDate) return 9999;
  const diff = Date.now() - new Date(isoDate).getTime();
  return diff / (1000 * 60 * 60 * 24);
}

// ── Select guides to refresh ───────────────────────────────────────────────

function selectGuidesToRefresh() {
  if (!fs.existsSync(GUIDES_DIR)) {
    log("Guides directory not found — nothing to refresh");
    return [];
  }

  const files = fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith(".json"));
  const candidates = [];

  for (const file of files) {
    const data = readJSON(path.join(GUIDES_DIR, file));
    if (!data) continue;
    const age = daysSince(data.updatedAt);
    candidates.push({ file, data, age });
  }

  // Sort by age (oldest first) — only consider those older than MIN_AGE_DAYS
  const stale = candidates
    .filter((c) => c.age >= MIN_AGE_DAYS)
    .sort((a, b) => b.age - a.age);

  // Shuffle within the top-20 oldest to add some randomness
  const pool = stale.slice(0, 20);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, GUIDES_TO_REFRESH);
}

// ── Generate refreshed content ─────────────────────────────────────────────

const TEXT_DELIMITER = "|||FIELD|||";

function buildRefreshPrompt(guide) {
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  });

  return `Tu es rédacteur SEO expert en poker pour tournois-poker.fr.

Nous sommes le ${today}. Mets à jour et améliore ce guide poker existant.

**Guide à actualiser :**
- Titre: ${guide.title}
- Catégorie: ${guide.category}
- Slug: ${guide.slug}
- Temps de lecture: ${guide.readTime ?? 8} min
- Description actuelle: ${guide.description ?? ""}

**Instructions :**
1. Conserve la structure et les informations correctes
2. Améliore le contenu : exemples plus récents, meilleure lisibilité, sous-titres optimisés pour le SEO
3. Mets à jour les références aux plateformes françaises (Winamax, PokerStars, Unibet)
4. Ajoute des liens internes naturels vers /guide/bonus-poker/ et /comparer-rooms/ si pertinent
5. Minimum 700 mots pour le content
6. Génère 5 FAQ pertinentes et différentes de la version précédente si possible

**Format de réponse — utilise EXACTEMENT ce format avec les délimiteurs :**

DESCRIPTION${TEXT_DELIMITER}[description SEO de 150-160 caractères]
CONTENT${TEXT_DELIMITER}[contenu markdown complet, min 700 mots, ## pour sous-titres]
FAQ_1_Q${TEXT_DELIMITER}[question 1]
FAQ_1_A${TEXT_DELIMITER}[réponse 1, 2-3 phrases]
FAQ_2_Q${TEXT_DELIMITER}[question 2]
FAQ_2_A${TEXT_DELIMITER}[réponse 2]
FAQ_3_Q${TEXT_DELIMITER}[question 3]
FAQ_3_A${TEXT_DELIMITER}[réponse 3]
FAQ_4_Q${TEXT_DELIMITER}[question 4]
FAQ_4_A${TEXT_DELIMITER}[réponse 4]
FAQ_5_Q${TEXT_DELIMITER}[question 5]
FAQ_5_A${TEXT_DELIMITER}[réponse 5]`;
}

function parseGuideResponse(raw, guide) {
  const extract = (key) => {
    const pattern = new RegExp(`${key}${TEXT_DELIMITER.replace(/\|/g, "\\|")}([\\s\\S]*?)(?=\\n[A-Z_0-9]+${TEXT_DELIMITER.replace(/\|/g, "\\|")}|$)`);
    const m = raw.match(pattern);
    return m ? m[1].trim() : null;
  };

  const description = extract("DESCRIPTION") ?? guide.description;
  const content = extract("CONTENT") ?? guide.content;

  const faq = [];
  for (let i = 1; i <= 5; i++) {
    const q = extract(`FAQ_${i}_Q`);
    const a = extract(`FAQ_${i}_A`);
    if (q && a) faq.push({ q, a });
  }

  return { description, content, faq };
}

async function refreshGuide(item) {
  const { file, data } = item;
  const filePath = path.join(GUIDES_DIR, file);

  log(`Refreshing: ${data.slug} (last updated ${Math.round(item.age)}d ago)`);

  let response;
  try {
    response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 3000,
      messages: [{ role: "user", content: buildRefreshPrompt(data) }],
    });
  } catch (err) {
    logError(`Claude API error for ${data.slug}`, err);
    return false;
  }

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock) {
    logError(`No text response for ${data.slug}`);
    return false;
  }

  const parsed = parseGuideResponse(textBlock.text, data);

  if (!parsed.content || parsed.content.length < 300) {
    logError(`Content too short for ${data.slug}: ${parsed.content?.length ?? 0} chars`);
    return false;
  }

  const updated = {
    ...data,
    description: parsed.description ?? data.description,
    content: parsed.content,
    faq: parsed.faq.length > 0 ? parsed.faq : data.faq,
    updatedAt: new Date().toISOString(),
  };

  try {
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
    log(`✓ Refreshed ${data.slug} (${parsed.content.length} chars content, ${parsed.faq.length} FAQ)`);
    return true;
  } catch (err) {
    logError(`Write error for ${data.slug}`, err);
    return false;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  log("Starting guide refresh run…");

  const toRefresh = selectGuidesToRefresh();

  if (toRefresh.length === 0) {
    log("No guides need refreshing (all updated recently)");
    return;
  }

  log(`Selected ${toRefresh.length} guides to refresh: ${toRefresh.map((g) => g.data.slug).join(", ")}`);

  let successCount = 0;
  for (const item of toRefresh) {
    const ok = await refreshGuide(item);
    if (ok) successCount++;
    // Small delay between API calls
    await new Promise((r) => setTimeout(r, 2000));
  }

  log(`Done: ${successCount}/${toRefresh.length} guides refreshed successfully`);

  if (successCount === 0 && toRefresh.length > 0) {
    logError("All refresh attempts failed");
    process.exit(1);
  }
}

main().catch((err) => {
  logError("Fatal error", err);
  process.exit(1);
});
