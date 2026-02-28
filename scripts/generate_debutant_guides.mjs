/**
 * generate_debutant_guides.mjs
 * Generates beginner guide content using Claude Haiku and saves to data/debutant/
 *
 * Usage:
 *   node scripts/generate_debutant_guides.mjs            # generate missing
 *   node scripts/generate_debutant_guides.mjs --force    # regenerate all
 *   node scripts/generate_debutant_guides.mjs --slug=xxx # one guide
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data", "debutant");

const client = new Anthropic();

// ── Slug metadata ──────────────────────────────────────────────────────────

const GUIDES = [
  {
    slug: "comment-commencer-poker-online",
    title: "Comment commencer le poker en ligne en France",
    angle: "Guide pratique pas-à-pas pour créer son compte, choisir sa room (Winamax ou PokerStars), comprendre le lobby et jouer ses premiers tournois. Mentionner les aspects légaux (ANJ), les bonus de bienvenue et les 3 premières étapes concrètes.",
    links: ["/tournois/winamax/", "/tournois/pokerstars/", "/guide/debutant/quelle-room-choisir-france/", "/guide/debutant/gestion-bankroll-debutant/"],
  },
  {
    slug: "quelle-room-choisir-france",
    title: "Quelle room de poker choisir en France en 2025",
    angle: "Comparatif Winamax vs PokerStars vs Unibet pour un débutant : programme de tournois, niveau des joueurs, logiciel, bonus, dépôt minimum. Verdict clair à la fin.",
    links: ["/tournois/winamax/", "/tournois/pokerstars/", "/guide/debutant/winamax-vs-pokerstars/", "/guide/debutant/comment-commencer-poker-online/"],
  },
  {
    slug: "winamax-vs-pokerstars",
    title: "Winamax vs PokerStars : comparatif complet pour les tournois MTT",
    angle: "Comparatif approfondi pour les joueurs de tournois : garanties, horaires, formats, niveaux de jeu, soft money, logiciel, HUD, rakeback. Tableau comparatif inclus.",
    links: ["/tournois/winamax/", "/tournois/pokerstars/", "/guide/debutant/quelle-room-choisir-france/", "/guide/debutant/quel-buy-in-choisir-pour-commencer/"],
  },
  {
    slug: "combien-argent-pour-debuter-mtt",
    title: "Combien d'argent faut-il pour débuter les MTT ?",
    angle: "Calcul du capital minimum recommandé selon la règle des 50-100 buy-ins. Exemples concrets : 50 BI à 5€ = 250€ de départ. Inclure une section sur ce qui arrive si on descend sous ce seuil.",
    links: ["/tournois/winamax/", "/guide/debutant/gestion-bankroll-debutant/", "/guide/debutant/quel-buy-in-choisir-pour-commencer/", "/guide/bonus-poker/"],
  },
  {
    slug: "difference-cash-game-mtt",
    title: "Cash game vs tournoi MTT : quelle différence ?",
    angle: "Expliquer clairement les différences : structure (rebuy vs éliminé), objectifs (maximiser EV vs survivre), variance, ICM, gestion de session. Quel format convient mieux à quel profil de joueur.",
    links: ["/tournois/winamax/", "/guide/debutant/comment-fonctionne-un-tournoi-mtt/", "/guide/debutant/difference-mtt-sit-and-go/", "/guide/debutant/gestion-bankroll-debutant/"],
  },
  {
    slug: "comment-fonctionne-un-tournoi-mtt",
    title: "Comment fonctionne un tournoi de poker MTT ?",
    angle: "Expliquer pas-à-pas : inscription et buy-in, starting stack, niveaux de blindes, pause breaks, late registration, rebuy/add-on, prize pool, bulle, places payées, heads-up final.",
    links: ["/tournois/winamax/", "/tournois/pokerstars/", "/guide/debutant/comprendre-les-blindes-et-antes/", "/guide/debutant/difference-cash-game-mtt/"],
  },
  {
    slug: "comprendre-les-blindes-et-antes",
    title: "Comprendre les blindes et les antes au poker",
    angle: "Expliquer le rôle des small blind, big blind et antes. Comment augmentent-ils ? Impact sur le M-ratio et la stratégie. Différence entre BB-ante et antes classiques. Exemples concrets avec tableaux.",
    links: ["/tournois/winamax/", "/guide/debutant/comment-fonctionne-un-tournoi-mtt/", "/guide/debutant/quel-buy-in-choisir-pour-commencer/", "/guide/debutant/gestion-bankroll-debutant/"],
  },
  {
    slug: "comment-fonctionne-bounty-knockout",
    title: "Comment fonctionnent les tournois bounty et knockout ?",
    angle: "Expliquer KO standard, PKO (Progressive Knockout) et Mystery Bounty. Comment calculer la valeur d'un call avec une prime en jeu. Exemples concrets. Winamax KO vs PS Bounty Builder.",
    links: ["/tournois/bounty/", "/tournois/pokerstars/", "/guide/debutant/comment-fonctionne-un-tournoi-mtt/", "/guide/debutant/quel-buy-in-choisir-pour-commencer/"],
  },
  {
    slug: "comprendre-la-variance-poker",
    title: "Comprendre la variance au poker : guide débutant",
    angle: "Définir la variance, expliquer pourquoi même un bon joueur peut perdre longtemps, notion d'EV positive. Comment suivre ses résultats, la loi des grands nombres, durée d'un downswing typique.",
    links: ["/guide/debutant/gestion-bankroll-debutant/", "/guide/debutant/les-erreurs-classiques-debutant/", "/tournois/winamax/", "/guide/bonus-poker/"],
  },
  {
    slug: "gestion-bankroll-debutant",
    title: "Gestion de bankroll pour débutants au poker",
    angle: "Règles pratiques : 50-100 BI pour MTT, 20-30 BI pour SNG, 25 stacks pour cash. Quand monter de stakes, quand descendre, comment tracker ses résultats. Exemples chiffrés.",
    links: ["/guide/debutant/combien-argent-pour-debuter-mtt/", "/guide/debutant/comprendre-la-variance-poker/", "/tournois/winamax/", "/guide/bonus-poker/"],
  },
  {
    slug: "difference-mtt-sit-and-go",
    title: "MTT vs Sit & Go : quelle différence choisir ?",
    angle: "Comparer MTT (timing fixe, gros prize pools) vs SNG (démarre quand plein, durée prévisible). Variantes SNG : 2-9 joueurs, turbos, spins. ICM spécifique aux SNG. Recommandation selon profil.",
    links: ["/tournois/pokerstars/", "/guide/debutant/comment-fonctionne-un-tournoi-mtt/", "/guide/debutant/difference-cash-game-mtt/", "/guide/debutant/quel-buy-in-choisir-pour-commencer/"],
  },
  {
    slug: "comment-lire-une-range-poker",
    title: "Comment lire une range au poker (débutant)",
    angle: "Introduire la notion de range (ensemble de mains possibles). Notations : AKo, AKs, 77+, etc. Pourquoi penser en ranges et non en mains. Exercice pratique pour lire la range adverse.",
    links: ["/guide/debutant/les-erreurs-classiques-debutant/", "/guide/debutant/comment-fonctionne-un-tournoi-mtt/", "/tournois/winamax/", "/guide/bonus-poker/"],
  },
  {
    slug: "lexique-poker-debutant",
    title: "Lexique du poker : 80 termes essentiels pour débutants",
    angle: "Dictionnaire formaté avec 80 termes classés alphabétiquement ou par catégorie (actions, positions, formats, stratégie). Chaque terme en 1-3 phrases. Format facile à scanner.",
    links: ["/guide/debutant/comment-commencer-poker-online/", "/guide/debutant/comprendre-les-blindes-et-antes/", "/tournois/winamax/", "/tournois/pokerstars/"],
  },
  {
    slug: "les-erreurs-classiques-debutant",
    title: "Les 10 erreurs classiques des débutants au poker",
    angle: "Top 10 erreurs avec exemples concrets : jouer trop de mains, limping, pas de sizing, tilt, ignorer la position, sur-valuer les paires moyennes, etc. Pour chaque erreur : pourquoi c'est mauvais + comment corriger.",
    links: ["/guides/erreurs-mtt.pdf", "/guide/debutant/gestion-bankroll-debutant/", "/tournois/winamax/", "/guide/bonus-poker/"],
  },
  {
    slug: "quel-buy-in-choisir-pour-commencer",
    title: "Quel buy-in choisir pour commencer les tournois MTT ?",
    angle: "Guide pratique : selon votre bankroll (100€ → 1€-2€ buy-ins, 500€ → 5€-10€, 1000€ → 10€-20€). Freerolls pour débuter sans risque, micro-stakes, progression. Tableau récapitulatif.",
    links: ["/tournois/freeroll/", "/guide/debutant/gestion-bankroll-debutant/", "/tournois/winamax/", "/guide/bonus-poker/"],
  },
];

// ── Text delimiter parser ──────────────────────────────────────────────────

function extractSection(text, startTag, endTag) {
  const start = text.indexOf(startTag);
  if (start === -1) return "";
  const end = endTag ? text.indexOf(endTag, start) : text.length;
  return text.slice(start + startTag.length, end === -1 ? undefined : end).trim();
}

function parseGuideOutput(raw) {
  const description = extractSection(raw, "===DESCRIPTION===", "===CONTENT===");
  const content = extractSection(raw, "===CONTENT===", "===FAQ_Q1===");
  const faqs = [];
  for (let i = 1; i <= 6; i++) {
    const q = extractSection(raw, `===FAQ_Q${i}===`, `===FAQ_A${i}===`);
    const aEnd = i < 6 ? `===FAQ_Q${i + 1}===` : "===END===";
    const a = extractSection(raw, `===FAQ_A${i}===`, aEnd);
    if (q && a) faqs.push({ q, a });
  }
  return { description, content, faq: faqs };
}

// ── Generator ─────────────────────────────────────────────────────────────

async function generateGuide(guide) {
  const prompt = `Tu es un expert en poker en ligne en France. Génère un article complet en français pour le guide débutant suivant.

Titre: ${guide.title}
Angle et contenu: ${guide.angle}
Liens internes à inclure naturellement dans le contenu: ${guide.links.join(", ")}

RÈGLES IMPORTANTES:
- 800 à 1200 mots de contenu
- Écriture accessible pour un débutant total
- 3 à 5 sections H2, sous-sections H3 si nécessaire
- HTML sémantique (h2, h3, p, ul, li, strong, a href="...")
- Les liens internes doivent apparaître naturellement dans le texte (2 à 4 liens)
- Exemples concrets et chiffrés
- Ton pédagogique et bienveillant, jamais condescendant
- 5 questions-réponses FAQ spécifiques et utiles

FORMAT DE SORTIE OBLIGATOIRE (utiliser exactement ces délimiteurs):
===DESCRIPTION===
[meta description 150-160 caractères, accrocheur, avec mot-clé principal]
===CONTENT===
[contenu HTML complet, h2/h3/p/ul/li/strong/a, 800-1200 mots]
===FAQ_Q1===
[question 1]
===FAQ_A1===
[réponse 1, 2-4 phrases]
===FAQ_Q2===
[question 2]
===FAQ_A2===
[réponse 2]
===FAQ_Q3===
[question 3]
===FAQ_A3===
[réponse 3]
===FAQ_Q4===
[question 4]
===FAQ_A4===
[réponse 4]
===FAQ_Q5===
[question 5]
===FAQ_A5===
[réponse 5]
===END===`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 6000,
    messages: [{ role: "user", content: prompt }],
  });

  return response.content[0].text;
}

// ── Main ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const forceAll = args.includes("--force");
const singleSlug = args.find((a) => a.startsWith("--slug="))?.split("=")[1];

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const toGenerate = singleSlug
  ? GUIDES.filter((g) => g.slug === singleSlug)
  : GUIDES;

let generated = 0;
let skipped = 0;
let failed = 0;

for (const guide of toGenerate) {
  const outPath = path.join(DATA_DIR, `${guide.slug}.json`);

  if (!forceAll && !singleSlug && fs.existsSync(outPath)) {
    console.log(`⏭  Skip: ${guide.slug}`);
    skipped++;
    continue;
  }

  console.log(`⚙  Generating: ${guide.slug}`);
  try {
    const raw = await generateGuide(guide);
    const parsed = parseGuideOutput(raw);

    if (!parsed.content || parsed.content.length < 200) {
      console.error(`✗  Content too short for ${guide.slug}`);
      failed++;
      continue;
    }

    const output = {
      slug: guide.slug,
      title: guide.title,
      description: parsed.description || guide.title,
      content: parsed.content,
      faq: parsed.faq,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");
    console.log(`✓  Saved: ${guide.slug} (${parsed.faq.length} FAQs, ${parsed.content.length} chars)`);
    generated++;

    // Polite delay between API calls
    if (generated < toGenerate.length) await new Promise((r) => setTimeout(r, 800));
  } catch (err) {
    console.error(`✗  Error for ${guide.slug}:`, err.message);
    failed++;
  }
}

console.log(`\nDone: ${generated} generated, ${skipped} skipped, ${failed} failed.`);
