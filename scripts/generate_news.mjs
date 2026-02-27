/**
 * Generate a daily poker news article using Claude claude-sonnet-4-6 + web_search.
 * Saves to data/news/YYYY-MM-DD-[slug].json
 *
 * Usage: ANTHROPIC_API_KEY=... node scripts/generate_news.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Anthropic from "@anthropic-ai/sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const NEWS_DIR = path.join(ROOT, "data", "news");

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
  console.error("Error: ANTHROPIC_API_KEY not set");
  process.exit(1);
}

// ── Slugify ───────────────────────────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

// ── Today's date ──────────────────────────────────────────────────────────

function getToday() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Paris" });
}

// ── Build the prompt ──────────────────────────────────────────────────────

function buildPrompt(today) {
  const [year, month, day] = today.split("-");
  const dateStr = new Date(today).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `Tu es rédacteur SEO spécialisé poker pour le site tournois-poker.fr.

Aujourd'hui c'est le ${dateStr}.

**Ta mission :**
1. Recherche sur le web la news poker la plus intéressante du jour ou de la semaine en cours pour le marché français (Winamax, PokerStars France, Unibet, PMU Poker, tournois online, résultats SCOOP/Winamax Series, WSOP, EPT, WPT, actualité poker français).
2. Rédige un article SEO en français de 450-550 mots sur ce sujet.

**Format de réponse — JSON uniquement, rien d'autre :**
{
  "title": "Titre H1 accrocheur de 55-65 caractères max, avec le mot clé principal",
  "metaDescription": "Description méta de 145-155 caractères, actionnable, avec mot clé",
  "slug": "url-slug-en-kebab-case-court",
  "category": "resultats|tournoi|serie|strategie|actualite",
  "tags": ["tag1", "tag2", "tag3"],
  "summary": "Résumé de 1-2 phrases pour la page index",
  "content": "Article complet en markdown. Utilise ## pour les sous-titres. Inclus 2-3 liens vers des ressources pertinentes en markdown [texte](url). Minimum 450 mots."
}

Le contenu doit être original, informatif, bien structuré pour le SEO, et sans faute d'orthographe.`;
}

// ── Call Claude with web_search ───────────────────────────────────────────

async function generateArticle(today) {
  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  console.log("Calling Claude claude-sonnet-4-6 with web_search…");

  // Use streaming to handle potentially long tool use + generation
  const messages = [];
  const tools = [{ type: "web_search_20250305", name: "web_search" }];

  // First turn: ask Claude to search and write
  let response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    tools,
    messages: [{ role: "user", content: buildPrompt(today) }],
  });

  messages.push({ role: "user", content: buildPrompt(today) });
  messages.push({ role: "assistant", content: response.content });

  // Agentic loop: handle tool calls until stop_reason is "end_turn"
  let iterations = 0;
  while (response.stop_reason === "tool_use" && iterations < 5) {
    iterations++;
    const toolUses = response.content.filter((b) => b.type === "tool_use");
    console.log(`  Tool calls: ${toolUses.map((t) => `${t.name}("${t.input?.query ?? ""}")`).join(", ")}`);

    // Build tool results
    const toolResults = toolUses.map((tu) => ({
      type: "tool_result",
      tool_use_id: tu.id,
      // Claude handles tool execution server-side for web_search
      content: tu.output ?? [],
    }));

    messages.push({ role: "user", content: toolResults });

    response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      tools,
      messages,
    });

    messages.push({ role: "assistant", content: response.content });
  }

  // Extract final text response
  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock) throw new Error("No text response from Claude");

  const raw = textBlock.text.trim();
  console.log(`  Response length: ${raw.length} chars`);

  // Extract JSON from response (might be wrapped in ```json ... ```)
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, raw];
  const jsonStr = jsonMatch[1].trim();

  let article;
  try {
    article = JSON.parse(jsonStr);
  } catch {
    // Fallback: try to find JSON object directly
    const objMatch = raw.match(/\{[\s\S]*\}/);
    if (!objMatch) throw new Error("Could not parse JSON from Claude response");
    article = JSON.parse(objMatch[0]);
  }

  return article;
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const today = getToday();
  console.log(`Generating news article for ${today}…`);

  // Check if we already generated one today
  const existing = fs.existsSync(NEWS_DIR)
    ? fs.readdirSync(NEWS_DIR).filter((f) => f.startsWith(today) && f.endsWith(".json"))
    : [];
  if (existing.length > 0) {
    console.log(`  Article already exists: ${existing[0]} — skipping.`);
    console.log("  (Delete the file to regenerate.)");
    return;
  }

  const article = await generateArticle(today);

  // Validate required fields
  const required = ["title", "slug", "content", "metaDescription"];
  for (const field of required) {
    if (!article[field]) throw new Error(`Missing field: ${field}`);
  }

  // Ensure slug is safe
  article.slug = slugify(article.slug || article.title);
  article.date = today;
  article.generatedAt = new Date().toISOString();

  // Word count
  const wordCount = article.content.split(/\s+/).length;
  console.log(`  Title: ${article.title}`);
  console.log(`  Slug: ${article.slug}`);
  console.log(`  Word count: ${wordCount}`);
  console.log(`  Category: ${article.category}`);

  // Save
  fs.mkdirSync(NEWS_DIR, { recursive: true });
  const filename = `${today}-${article.slug}.json`;
  fs.writeFileSync(path.join(NEWS_DIR, filename), JSON.stringify(article, null, 2));

  console.log(`\n✅ Saved to data/news/${filename}`);
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  if (err.message.includes("tool_use")) {
    console.error("Hint: web_search tool may require special access. Check your API tier.");
  }
  process.exit(1);
});
