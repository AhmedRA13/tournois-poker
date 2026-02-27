/**
 * Scrapes https://www.winamax.fr/les-tournois_planning
 * Extracts the $tournaments inline JS variable and saves to data/winamax.json
 *
 * Usage: node scripts/fetch_winamax.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_FILE = path.join(ROOT, "data", "winamax.json");
const PLANNING_URL = "https://www.winamax.fr/les-tournois_planning";

// ── Fetch HTML ─────────────────────────────────────────────────────────────

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

// ── Extract $tournaments variable ──────────────────────────────────────────

/**
 * Returns the last occurrence of `$tournaments = {...}` in the HTML.
 * (The page has two declarations — first is empty `{}`, second has real data.)
 */
function extractTournaments(html) {
  // Match: $tournaments = { ... }; — greedy to get the last/longest match
  const matches = [...html.matchAll(/\$tournaments\s*=\s*(\{[\s\S]*?\});/g)];
  if (!matches.length) throw new Error("$tournaments variable not found in HTML");

  // The last non-empty match has the real data
  for (let i = matches.length - 1; i >= 0; i--) {
    const json = matches[i][1];
    if (json !== "{}") {
      return JSON.parse(json);
    }
  }
  return {};
}

// ── Derive tournament metadata from name ──────────────────────────────────

/**
 * Detect tournament format from its name.
 * @returns "knockout" | "satellite" | "freeroll" | "turbo" | "hyper" | "standard"
 */
function detectFormat(name, buyinEuros) {
  if (buyinEuros === 0) return "freeroll";
  const n = name.toLowerCase();
  if (n.includes("ko") || n.includes("knockout") || n.includes("bounty") || n.includes("hit&run")) return "knockout";
  if (n.includes("sat ") || n.includes("satellite") || n.includes("qualif")) return "satellite";
  if (n.includes("hyper")) return "hyper";
  if (n.includes("turbo")) return "turbo";
  return "standard";
}

/**
 * Is this a special / highlighted tournament? (Winamax Series, big guarantees, named events)
 * Heuristic: ALL_CAPS name (like ANDROMEDA, CENTAURUS, PEGASUS…) or contains "Series".
 */
function isSpecial(name) {
  // Fully uppercase word of 4+ chars = Winamax named tournament
  if (/\b[A-Z]{4,}\b/.test(name)) return true;
  if (/series|million|festival|open|championship/i.test(name)) return true;
  return false;
}

/**
 * Parse a buyin string like "50€", "0,50€", "0.25€", "0€" into a float.
 */
function parseBuyin(str) {
  const cleaned = str.replace(/€/g, "").replace(",", ".").trim();
  return parseFloat(cleaned) || 0;
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log("Fetching Winamax planning page…");
  const html = await fetchHtml(PLANNING_URL);
  console.log(`  HTML size: ${(html.length / 1024).toFixed(0)} KB`);

  console.log("Extracting $tournaments…");
  const raw = extractTournaments(html);

  const slots = Object.keys(raw);
  console.log(`  Date-hour slots: ${slots.length}`);

  // Flatten into an array of tournament objects with full metadata
  const tournaments = [];
  for (const slotKey of slots) {
    // slotKey format: "YYYY-MM-DD-HH"
    const [year, month, day, hour] = slotKey.split("-");
    const date = `${year}-${month}-${day}`;

    for (const t of raw[slotKey]) {
      const buyinEuros = parseBuyin(t.buyin);
      tournaments.push({
        id: t.id,
        platform: "winamax",
        name: t.name,
        date,
        time: t.time,       // "HH:mm" local Paris time
        buyinRaw: t.buyin,  // original string e.g. "50€"
        buyin: buyinEuros,  // float in euros
        format: detectFormat(t.name, buyinEuros),
        special: isSpecial(t.name),
        url: `https://www.winamax.fr/poker/tournament.php?ID=${t.id}`,
      });
    }
  }

  // Sort by date then time
  tournaments.sort((a, b) =>
    a.date !== b.date
      ? a.date.localeCompare(b.date)
      : a.time.localeCompare(b.time)
  );

  // Stats
  const today = new Date().toISOString().slice(0, 10);
  const todayTournaments = tournaments.filter((t) => t.date === today);
  const freerolls = tournaments.filter((t) => t.format === "freeroll");
  const specials = tournaments.filter((t) => t.special);
  const dates = [...new Set(tournaments.map((t) => t.date))].sort();

  const output = {
    updatedAt: new Date().toISOString(),
    platform: "winamax",
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

  console.log("\n✅ Saved to data/winamax.json");
  console.log(`   Total tournaments: ${tournaments.length}`);
  console.log(`   Today (${today}): ${todayTournaments.length}`);
  console.log(`   Freerolls: ${freerolls.length}`);
  console.log(`   Special events: ${specials.length}`);
  console.log(`   Date range: ${dates[0]} → ${dates[dates.length - 1]}`);

  // Preview first 10 tournaments of today
  console.log(`\n── Today's first 10 tournaments ──────────────────────────`);
  todayTournaments.slice(0, 10).forEach((t) => {
    const tag = t.special ? " ★ SPECIAL" : "";
    console.log(
      `  ${t.time}  ${t.buyinRaw.padEnd(8)}  [${t.format.padEnd(9)}]  ${t.name}${tag}`
    );
  });
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
