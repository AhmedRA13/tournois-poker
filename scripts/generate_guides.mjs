/**
 * Generates poker strategy guide pages using the Claude API.
 * Saves each guide as data/guides/{slug}.json
 *
 * Usage:
 *   ANTHROPIC_API_KEY=xxx node scripts/generate_guides.mjs
 *   ANTHROPIC_API_KEY=xxx node scripts/generate_guides.mjs --slug bases-poker-texas-holdem
 *   ANTHROPIC_API_KEY=xxx node scripts/generate_guides.mjs --force   (regenerate all)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Anthropic from "@anthropic-ai/sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const GUIDES_DIR = path.join(ROOT, "data", "guides");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Guide definitions ────────────────────────────────────────────────────

const GUIDES = [
  // Débutant
  { slug: "bases-poker-texas-holdem", title: "Les bases du Texas Hold'em", category: "debutant", readTime: 10 },
  { slug: "regles-poker", title: "Règles complètes du poker", category: "debutant", readTime: 8 },
  { slug: "mains-poker-classement", title: "Classement des mains au poker", category: "debutant", readTime: 6 },
  { slug: "position-au-poker", title: "L'importance de la position au poker", category: "debutant", readTime: 7 },
  { slug: "pot-odds-poker", title: "Les pot odds : calcul et application", category: "debutant", readTime: 8 },
  { slug: "bankroll-management-poker", title: "Gestion de la bankroll au poker", category: "debutant", readTime: 7 },
  { slug: "poker-tight-agressif", title: "Jouer tight-agressif (TAG)", category: "debutant", readTime: 8 },
  { slug: "vocabulaire-poker", title: "Vocabulaire et glossaire du poker", category: "debutant", readTime: 6 },
  // Stratégie
  { slug: "bluff-au-poker", title: "Le bluff au poker : quand et comment", category: "strategie", readTime: 9 },
  { slug: "continuation-bet", title: "Le continuation bet (C-bet)", category: "strategie", readTime: 8 },
  { slug: "3-bet-poker", title: "Le 3-bet : guide complet", category: "strategie", readTime: 10 },
  { slug: "squeeze-play-poker", title: "Le squeeze play en poker", category: "strategie", readTime: 7 },
  { slug: "open-raise-poker", title: "Open raise : sizing et fréquences", category: "strategie", readTime: 8 },
  { slug: "defense-big-blind", title: "Défendre son big blind efficacement", category: "strategie", readTime: 8 },
  { slug: "range-poker", title: "Comprendre et construire ses ranges", category: "strategie", readTime: 10 },
  { slug: "gto-poker-introduction", title: "Introduction au GTO poker", category: "strategie", readTime: 10 },
  { slug: "equity-poker", title: "L'equity au poker : calcul et usage", category: "strategie", readTime: 7 },
  { slug: "expected-value-poker", title: "L'expected value (EV) au poker", category: "strategie", readTime: 8 },
  // Tournois MTT
  { slug: "mtt-strategie-poker", title: "Stratégie MTT complète", category: "tournoi", readTime: 12 },
  { slug: "deep-stack-poker", title: "Jouer efficacement en deep stack", category: "tournoi", readTime: 8 },
  { slug: "short-stack-poker", title: "Stratégie short stack en tournoi", category: "tournoi", readTime: 7 },
  { slug: "icm-tournoi-poker", title: "L'ICM : impact en tournoi", category: "tournoi", readTime: 9 },
  { slug: "final-table-poker", title: "Stratégie final table MTT", category: "tournoi", readTime: 9 },
  { slug: "strategie-satellite-poker", title: "Gagner les satellites poker", category: "tournoi", readTime: 8 },
  { slug: "steal-resteal-tournoi", title: "Steal et resteal en tournoi", category: "tournoi", readTime: 7 },
  { slug: "ante-strategie-poker", title: "Impact des antes sur la stratégie", category: "tournoi", readTime: 6 },
  { slug: "bb-ante-poker", title: "Le big blind ante : adaptation", category: "tournoi", readTime: 6 },
  { slug: "bankroll-management-mtt", title: "Bankroll management pour les MTT", category: "tournoi", readTime: 7 },
  // Formats spéciaux
  { slug: "plo-omaha-introduction", title: "Introduction au PLO / Omaha", category: "format", readTime: 9 },
  { slug: "spin-and-go-strategie", title: "Stratégie Spin & Go", category: "format", readTime: 8 },
  { slug: "hyper-turbo-poker", title: "Jouer les hyper-turbos", category: "format", readTime: 7 },
  { slug: "zoom-poker-strategie", title: "Stratégie Zoom / Fast Fold Poker", category: "format", readTime: 7 },
  // Poker en ligne
  { slug: "hud-poker-online", title: "Utiliser un HUD au poker en ligne", category: "online", readTime: 8 },
  { slug: "multi-tabling-poker", title: "Le multi-tabling : stratégie et limites", category: "online", readTime: 7 },
  { slug: "reads-sans-hud", title: "Prendre des reads sans HUD", category: "online", readTime: 7 },
  { slug: "tells-poker-live", title: "Les tells au poker live", category: "online", readTime: 8 },
  // Mental & outils
  { slug: "prise-de-notes-poker", title: "Prise de notes sur les adversaires", category: "mental", readTime: 6 },
  { slug: "revue-session-poker", title: "Comment analyser ses sessions", category: "mental", readTime: 7 },
  { slug: "mindset-poker", title: "Le mental au poker : gérer le tilt", category: "mental", readTime: 9 },
];

const CATEGORY_NAMES = {
  debutant: "Pour débutants",
  strategie: "Stratégie",
  tournoi: "Tournois MTT",
  format: "Formats spéciaux",
  online: "Poker en ligne",
  mental: "Mental & outils",
};

// ── Generator ────────────────────────────────────────────────────────────

async function generateGuide(guide) {
  const prompt = `Tu es un expert en poker rédacteur pour un site français de poker en ligne (tournois-poker.fr).

Génère un guide complet en FRANÇAIS pour le sujet : "${guide.title}" (catégorie: ${CATEGORY_NAMES[guide.category]}).

Le guide doit faire environ ${guide.readTime * 150} mots de contenu utile.

Réponds EXACTEMENT dans ce format avec ces séparateurs (ne change pas les séparateurs) :

===DESCRIPTION===
[Meta description SEO de 150-160 caractères, accrocheur]
===CONTENT===
[Contenu HTML : utilise <h2>, <h3>, <p>, <ul>, <li>, <ol>, <strong>, <em> uniquement. PAS de h1. PAS d'attributs HTML avec des guillemets. PAS de liens <a>.]
===FAQ_Q1===
[Question 1]
===FAQ_A1===
[Réponse concise (2-3 phrases)]
===FAQ_Q2===
[Question 2]
===FAQ_A2===
[Réponse]
===FAQ_Q3===
[Question 3]
===FAQ_A3===
[Réponse]
===FAQ_Q4===
[Question 4]
===FAQ_A4===
[Réponse]
===FAQ_Q5===
[Question 5]
===FAQ_A5===
[Réponse]
===END===

Consignes :
- Écriture claire, pédagogique, adaptée au niveau indiqué par la catégorie
- Exemples concrets avec des chiffres (tailles de mise, SPR, etc.) quand pertinent
- Mentionner les plateformes françaises Winamax et PokerStars quand applicable
- Ne PAS inventer de statistiques non vérifiables`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 8000,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText = message.content[0].text.trim();

  // Parse the text-delimited format
  function extractSection(text, startTag, endTag) {
    const start = text.indexOf(startTag);
    if (start === -1) return "";
    const contentStart = start + startTag.length;
    const end = endTag ? text.indexOf(endTag, contentStart) : text.length;
    return (end === -1 ? text.slice(contentStart) : text.slice(contentStart, end)).trim();
  }

  const description = extractSection(rawText, "===DESCRIPTION===", "===CONTENT===");
  const content = extractSection(rawText, "===CONTENT===", "===FAQ_Q1===");

  const faq = [];
  for (let i = 1; i <= 5; i++) {
    const q = extractSection(rawText, `===FAQ_Q${i}===`, `===FAQ_A${i}===`);
    const nextTag = i < 5 ? `===FAQ_Q${i + 1}===` : "===END===";
    const a = extractSection(rawText, `===FAQ_A${i}===`, nextTag);
    if (q && a) faq.push({ q, a });
  }

  if (!description || !content) {
    throw new Error("Failed to extract description or content from response");
  }

  const data = { description, content, faq };

  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Paris" });

  return {
    slug: guide.slug,
    title: guide.title,
    description: data.description,
    category: guide.category,
    readTime: guide.readTime,
    updatedAt: today,
    content: data.content,
    faq: data.faq ?? [],
  };
}

// ── Main ─────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const forceAll = args.includes("--force");
  const slugArg = args.find((a) => a.startsWith("--slug="))?.split("=")[1]
    ?? (args.indexOf("--slug") !== -1 ? args[args.indexOf("--slug") + 1] : null);

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY not set");
    process.exit(1);
  }

  fs.mkdirSync(GUIDES_DIR, { recursive: true });

  // Which guides to generate
  let toGenerate = GUIDES;
  if (slugArg) {
    toGenerate = GUIDES.filter((g) => g.slug === slugArg);
    if (toGenerate.length === 0) {
      console.error(`Unknown slug: ${slugArg}`);
      process.exit(1);
    }
  } else if (!forceAll) {
    // Skip already generated
    const existing = new Set(
      fs.readdirSync(GUIDES_DIR)
        .filter((f) => f.endsWith(".json"))
        .map((f) => f.replace(".json", ""))
    );
    toGenerate = GUIDES.filter((g) => !existing.has(g.slug));
    if (toGenerate.length === 0) {
      console.log("✅ All guides already generated. Use --force to regenerate.");
      return;
    }
  }

  console.log(`Generating ${toGenerate.length} guide(s)…\n`);

  let success = 0;
  let failed = 0;

  for (const guide of toGenerate) {
    process.stdout.write(`  ${guide.slug}… `);
    try {
      const data = await generateGuide(guide);
      const outPath = path.join(GUIDES_DIR, `${guide.slug}.json`);
      fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
      console.log(`✅ (${data.content.length} chars)`);
      success++;
    } catch (err) {
      console.log(`❌ ${err.message}`);
      failed++;
    }

    // Small delay between calls to avoid rate limits
    if (toGenerate.indexOf(guide) < toGenerate.length - 1) {
      await new Promise((r) => setTimeout(r, 800));
    }
  }

  console.log(`\nDone: ${success} generated, ${failed} failed.`);
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
