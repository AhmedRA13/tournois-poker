/**
 * Fetches PokerStars (FR) tournament schedule via their public GraphQL API.
 * No Apify needed — the API is publicly accessible.
 *
 * Endpoint: https://www.pokerstars.fr/api/v1-preview/mtt/graphql
 * Usage: node scripts/fetch_pokerstars.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_FILE = path.join(ROOT, "data", "pokerstars.json");

const API_URL = "https://www.pokerstars.fr/api/v1-preview/mtt/graphql";

// ── GraphQL query ─────────────────────────────────────────────────────────

const QUERY = `{
  tournaments {
    name
    buyIn
    fee
    prizePool
    gameInt
    structureInt
    legacyStatus
    whenStart
    currency
    maxPlayers
    minPlayers
  }
}`;

// ── Helpers ───────────────────────────────────────────────────────────────

/** Strip HTML tags from tournament name */
function stripHtml(html) {
  return html.replace(/<[^>]+>/g, "").trim();
}

/**
 * Extract the clean tournament name and guarantee from the raw name.
 * Raw format: "<font ...>$5.50 Mini Night Fight [Progressive KO],</font> <font ...>$2.5K Gtd</font>"
 */
function parseName(raw) {
  const clean = stripHtml(raw);
  // Split on last comma + Gtd pattern
  const gtdMatch = clean.match(/^(.*?),?\s*([\d.,]+[KMB]?\s*(?:Gtd|Garantis?|Seats?\s*Gtd|Chips?\s*Gtd).*)$/i);
  if (gtdMatch) {
    return {
      name: gtdMatch[1].replace(/,$/, "").trim(),
      guaranteeText: gtdMatch[2].trim(),
    };
  }
  return { name: clean, guaranteeText: null };
}

/**
 * Detect format from tournament name + structureInt
 * structureInt: 0=Regular, 1=Turbo, 2=Hyper-Turbo (observed empirically)
 * gameInt: 2=NLHE, 4=PLO, 6=Mixed, 17=HORSE, etc.
 */
function detectFormat(name, structureInt) {
  const n = name.toLowerCase();
  if (n.includes("freeroll")) return "freeroll";
  if (n.includes("hyper")) return "hyper";
  if (n.includes("turbo")) return "turbo";
  if (n.includes("progressive ko") || n.includes("prog. ko") || n.includes("pkr") || n.includes("bounty") || n.includes("[ko]")) return "knockout";
  if (n.includes("satellite") || n.includes("sat ") || n.includes("qualif") || n.includes("step") || n.includes("seats gtd")) return "satellite";
  if (structureInt === 2) return "hyper";
  if (structureInt === 1) return "turbo";
  return "standard";
}

/** Is it a special/featured tournament? */
function isSpecial(raw, guaranteeText) {
  const n = raw.toLowerCase();
  if (n.includes("-x-tourn-championship") || n.includes("-x-tourn-special")) return true;
  // Large guarantee > $10k
  if (guaranteeText) {
    const match = guaranteeText.match(/([\d,]+)\s*([KMB])/i);
    if (match) {
      const val = parseFloat(match[1].replace(",", ""));
      const mult = match[2].toUpperCase() === "K" ? 1000 : match[2].toUpperCase() === "M" ? 1000000 : 1000000000;
      if (val * mult >= 10000) return true;
    }
  }
  return false;
}

/**
 * Is this a real-money tournament (not play money)?
 * currency field is "EUR", "USD", or "PLAY" (play money).
 */
function isRealMoney(tournament) {
  const { currency, buyIn } = tournament;
  // Trust currency field when present
  if (currency === "PLAY") return false;
  if (currency === "EUR" || currency === "USD") return true;
  // Fallback: buyIn < 1,000,000 cents = < 10,000€ (real money range)
  return buyIn < 1_000_000;
}

// ── Fetch + transform ─────────────────────────────────────────────────────

async function fetchTournaments() {
  console.log("Fetching PokerStars MTT schedule via GraphQL…");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      Origin: "https://www.pokerstars.fr",
      Referer: "https://www.pokerstars.fr/poker/play-poker/tournaments/",
    },
    body: JSON.stringify({ query: QUERY }),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();

  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  const raw = json.data?.tournaments ?? [];
  console.log(`  Raw tournaments: ${raw.length}`);

  const tournaments = raw
    .filter(isRealMoney)
    .map((t) => {
      const { name: cleanName, guaranteeText } = parseName(t.name);
      const totalBuyinCents = (t.buyIn ?? 0) + (t.fee ?? 0);
      const buyinEuros = totalBuyinCents / 100;

      // whenStart is ISO 8601 UTC — convert to Paris local time
      let date = null;
      let time = null;
      if (t.whenStart) {
        const d = new Date(t.whenStart);
        date = d.toLocaleDateString("en-CA", { timeZone: "Europe/Paris" }); // YYYY-MM-DD
        time = d.toLocaleTimeString("fr-FR", {
          timeZone: "Europe/Paris",
          hour: "2-digit",
          minute: "2-digit",
        }); // HH:mm
      }

      // Guarantee in cents → euros
      const guaranteeEuros = t.prizePool ? t.prizePool / 100 : null;

      return {
        id: null, // PokerStars GraphQL doesn't expose a public ID
        platform: "pokerstars",
        name: cleanName,
        nameRaw: stripHtml(t.name),
        date,
        time,
        buyinRaw: totalBuyinCents === 0 ? "0€" : `${buyinEuros.toFixed(2).replace(".", ",")}€`,
        buyin: buyinEuros,
        buyinCents: totalBuyinCents,
        feeCents: t.fee ?? 0,
        guarantee: guaranteeEuros,
        guaranteeText,
        format: detectFormat(cleanName, t.structureInt),
        special: isSpecial(t.name, guaranteeText),
        gameInt: t.gameInt,
        maxPlayers: t.maxPlayers,
        url: "https://www.pokerstars.fr/poker/play-poker/tournaments/",
      };
    })
    .filter((t) => t.date !== null) // skip tournaments with no start time
    .sort((a, b) =>
      a.date !== b.date ? a.date.localeCompare(b.date) : a.time.localeCompare(b.time)
    );

  return tournaments;
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const tournaments = await fetchTournaments();

  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Paris" });
  const todayTournaments = tournaments.filter((t) => t.date === today);
  const freerolls = tournaments.filter((t) => t.format === "freeroll");
  const specials = tournaments.filter((t) => t.special);
  const dates = [...new Set(tournaments.map((t) => t.date))].sort();

  const output = {
    updatedAt: new Date().toISOString(),
    platform: "pokerstars",
    dateRange: { from: dates[0] ?? null, to: dates[dates.length - 1] ?? null },
    stats: {
      total: tournaments.length,
      today: todayTournaments.length,
      freerolls: freerolls.length,
      specials: specials.length,
      dates: dates.length,
    },
    tournaments,
  };

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2));

  console.log("\n✅ Saved to data/pokerstars.json");
  console.log(`   Total (real money): ${tournaments.length}`);
  console.log(`   Today (${today}): ${todayTournaments.length}`);
  console.log(`   Freerolls: ${freerolls.length}`);
  console.log(`   Specials: ${specials.length}`);
  console.log(`   Date range: ${dates[0]} → ${dates[dates.length - 1]}`);

  console.log(`\n── Today's first 10 PokerStars tournaments ──`);
  todayTournaments.slice(0, 10).forEach((t) => {
    const gtd = t.guarantee ? ` (${t.guarantee >= 1000 ? `${(t.guarantee / 1000).toFixed(0)}K` : t.guarantee}€ Gtd)` : "";
    const tag = t.special ? " ★" : "";
    console.log(`  ${t.time}  ${t.buyinRaw.padEnd(10)}  [${t.format.padEnd(9)}]  ${t.name}${gtd}${tag}`);
  });
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
