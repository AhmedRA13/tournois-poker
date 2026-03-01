/**
 * weekly_top_tournois.mjs — Weekly top tournaments news article
 *
 * Generates a news article "Top 10 tournois de la semaine" from existing
 * data/winamax.json and data/pokerstars.json files.
 * Saves to data/news/YYYY-MM-DD-top-tournois-semaine.json
 *
 * Usage: node scripts/weekly_top_tournois.mjs
 * Cron: every Sunday at 08:00
 *
 * Error logging: ~/batch-log.txt
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const NEWS_DIR = path.join(ROOT, "data", "news");
const BATCH_LOG = path.join(process.env.HOME ?? "/root", "batch-log.txt");

// ── Logging ────────────────────────────────────────────────────────────────

function log(msg) {
  const line = `[${new Date().toISOString()}] [weekly_top_tournois] ${msg}`;
  console.log(line);
}

function logError(msg, err) {
  const line = `[${new Date().toISOString()}] [weekly_top_tournois] ERROR: ${msg}${err ? " — " + (err.message ?? err) : ""}\n`;
  console.error(line);
  try {
    fs.appendFileSync(BATCH_LOG, line);
  } catch {}
}

// ── Helpers ───────────────────────────────────────────────────────────────

function getToday() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Paris" });
}

function readJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    logError(`Could not read ${filePath}`, e);
    return null;
  }
}

function fmtEuros(n) {
  if (!n || n === 0) return "Gratuit";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtBuyin(n) {
  if (!n || n === 0) return "Freeroll";
  if (n < 1) return `${(n * 100).toFixed(0)} centimes`;
  return `${n}€`;
}

function dayLabel(dateStr) {
  const d = new Date(dateStr + "T12:00:00Z");
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

// ── Load tournaments ───────────────────────────────────────────────────────

function loadTournaments() {
  const wmxPath = path.join(ROOT, "data", "winamax.json");
  const psPath = path.join(ROOT, "data", "pokerstars.json");

  const tournaments = [];

  const wmxData = readJSON(wmxPath);
  if (wmxData?.tournaments) {
    for (const t of wmxData.tournaments) {
      tournaments.push({ ...t, platform: "winamax" });
    }
  }

  const psData = readJSON(psPath);
  if (psData?.tournaments) {
    for (const t of psData.tournaments) {
      tournaments.push({ ...t, platform: "pokerstars" });
    }
  }

  return tournaments;
}

// ── Select top 10 ─────────────────────────────────────────────────────────

function selectTop10(tournaments, today) {
  // Filter to upcoming (today + 7 days), non-freeroll, special or big guarantee
  const upcoming = tournaments.filter((t) => {
    if (t.date < today) return false;
    if (t.format === "freeroll") return false;
    if (t.buyin < 5) return false;
    return true;
  });

  // Score: specials first, then by guarantee desc, then buyin desc
  const scored = upcoming.map((t) => ({
    ...t,
    score:
      (t.special ? 1000000 : 0) +
      (t.guarantee ?? 0) +
      t.buyin * 10,
  }));

  scored.sort((a, b) => b.score - a.score || a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  // Deduplicate by name (keep first occurrence per name)
  const seen = new Set();
  const top = [];
  for (const t of scored) {
    const key = t.name.toLowerCase().replace(/\s+/g, "");
    if (!seen.has(key)) {
      seen.add(key);
      top.push(t);
    }
    if (top.length >= 10) break;
  }

  return top;
}

// ── Generate article ───────────────────────────────────────────────────────

function generateArticle(top10, today, weekStr) {
  const platformLabel = (p) =>
    p === "winamax" ? "Winamax" : p === "pokerstars" ? "PokerStars" : "Unibet";

  const platformPath = (p) =>
    p === "winamax"
      ? "/tournois/winamax/"
      : p === "pokerstars"
        ? "/tournois/pokerstars/"
        : "/tournois/unibet/";

  const lines = [
    `## Top 10 des tournois de poker en ligne — Semaine du ${weekStr}`,
    "",
    `Chaque semaine, notre équipe sélectionne pour vous les **10 tournois incontournables** de la semaine sur Winamax et PokerStars. Garanties, formats, buy-ins : voici ce qu'il ne faut pas manquer.`,
    "",
    "---",
    "",
  ];

  top10.forEach((t, i) => {
    const platform = platformLabel(t.platform);
    const guarantee = t.guarantee ? ` · Garantie ${fmtEuros(t.guarantee)}` : "";
    const formatLabel = {
      knockout: "PKO/Bounty",
      satellite: "Satellite",
      turbo: "Turbo",
      hyper: "Hyper-Turbo",
      freeroll: "Freeroll",
      standard: "Standard",
    }[t.format] ?? t.format;

    lines.push(`### ${i + 1}. ${t.name}`);
    lines.push("");
    lines.push(
      `**Plateforme :** [${platform}](${platformPath(t.platform)}) · **Buy-in :** ${fmtBuyin(t.buyin)} · **Format :** ${formatLabel}${guarantee}`
    );
    lines.push(
      `**Quand :** ${dayLabel(t.date)} à ${t.time}`
    );
    if (t.special) {
      lines.push(
        `⭐ *Événement spécial — à ne pas manquer cette semaine !*`
      );
    }
    lines.push("");
    lines.push(
      `> Inscrivez-vous directement depuis le lobby ${platform} ou consultez [notre programme complet](${platformPath(t.platform)}).`
    );
    lines.push("");
    lines.push("---");
    lines.push("");
  });

  lines.push("## Comment ne rien rater ?");
  lines.push("");
  lines.push(
    `Retrouvez l'ensemble des tournois de la semaine filtrables par buy-in, format et plateforme sur notre [programme complet des tournois poker en ligne](/). Mis à jour chaque nuit.`
  );
  lines.push("");
  lines.push("### Comparer les plateformes");
  lines.push("");
  lines.push(
    `Vous hésitez entre Winamax et PokerStars ? Consultez notre [comparatif complet des rooms poker](/comparer-rooms/) pour choisir la plateforme adaptée à votre profil.`
  );
  lines.push("");
  lines.push("### Bonus de bienvenue");
  lines.push("");
  lines.push(
    `Nouveau sur le poker en ligne ? Profitez jusqu'à **1 300€ de bonus cumulés** sur les trois plateformes. [Voir les offres bonus →](/guide/bonus-poker/)`
  );

  return lines.join("\n");
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const today = getToday();
  const [year, month, day] = today.split("-");

  // Compute week start (Monday)
  const todayDate = new Date(`${today}T12:00:00+01:00`);
  const dow = todayDate.getDay(); // 0=Sun
  const monday = new Date(todayDate);
  monday.setDate(todayDate.getDate() - ((dow + 6) % 7));
  const weekStr = monday.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  });

  const outputSlug = `top-tournois-semaine-${today}`;
  const outputPath = path.join(NEWS_DIR, `${today}-${outputSlug}.json`);

  // Don't regenerate if already exists
  if (fs.existsSync(outputPath)) {
    log(`Article already exists: ${outputPath} — skipping`);
    return;
  }

  log(`Generating weekly top tournaments article for ${today}…`);

  const tournaments = loadTournaments();
  log(`Loaded ${tournaments.length} tournaments total`);

  if (tournaments.length === 0) {
    logError("No tournament data found — aborting");
    process.exit(1);
  }

  const top10 = selectTop10(tournaments, today);
  log(`Selected ${top10.length} top tournaments`);

  if (top10.length === 0) {
    logError("Could not find any suitable tournaments for top 10 — aborting");
    process.exit(1);
  }

  const content = generateArticle(top10, today, weekStr);
  const topNames = top10.slice(0, 3).map((t) => t.name).join(", ");

  const article = {
    slug: outputSlug,
    date: today,
    title: `Top 10 Tournois Poker de la Semaine — ${weekStr}`,
    metaDescription: `Les 10 meilleurs tournois poker en ligne cette semaine : ${topNames} et plus. Garanties, buy-ins, horaires — tout pour ne rien manquer.`,
    category: "tournoi",
    tags: ["top-tournois", "winamax", "pokerstars", "semaine", "programme"],
    summary: `Sélection des 10 tournois de poker en ligne incontournables pour la semaine du ${weekStr} : ${topNames} et plus.`,
    content,
    generatedAt: new Date().toISOString(),
  };

  if (!fs.existsSync(NEWS_DIR)) fs.mkdirSync(NEWS_DIR, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(article, null, 2), "utf-8");
  log(`✓ Saved: ${outputPath}`);
  log(`Title: ${article.title}`);
}

main().catch((err) => {
  logError("Fatal error", err);
  process.exit(1);
});
