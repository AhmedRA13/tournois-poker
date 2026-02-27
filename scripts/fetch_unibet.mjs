/**
 * Fetches Unibet France tournament schedule via Apify Playwright scraper.
 * The Unibet lobby is a Vue.js SPA that requires JS rendering.
 *
 * Usage: APIFY_TOKEN=... node scripts/fetch_unibet.mjs
 * Or: add APIFY_TOKEN to .env.local
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_FILE = path.join(ROOT, "data", "unibet.json");

// Load .env.local
const envPath = path.join(ROOT, ".env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf-8")
    .split("\n")
    .forEach((line) => {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m) process.env[m[1]] = m[2].trim();
    });
}

const APIFY_TOKEN = process.env.APIFY_TOKEN;
if (!APIFY_TOKEN) {
  console.error("Error: APIFY_TOKEN not set in .env.local or environment.");
  process.exit(1);
}

const APIFY_BASE = "https://api.apify.com/v2";
const ACTOR_ID = "apify~playwright-scraper";

// ── Apify Actor input ─────────────────────────────────────────────────────

/**
 * The pageFunction runs inside the Playwright browser context.
 * It navigates to the Unibet poker tournament lobby, waits for content, and extracts data.
 */
const PAGE_FUNCTION = `async function pageFunction({ page, request, log }) {
  // Wait for page to be fully rendered (SPA)
  await page.waitForTimeout(5000);

  // Try to find tournament elements
  // Unibet uses various class names — try multiple selectors
  const selectors = [
    '[data-qa="tournament-item"]',
    '.tournament-item',
    '.tournament-row',
    '.tourney-row',
    '[class*="tournament"]',
    '[class*="tourney"]',
    'table tr',
    '.lobby-row',
  ];

  let items = [];
  for (const selector of selectors) {
    const found = await page.$$(selector);
    if (found.length > 0) {
      log.info('Found ' + found.length + ' elements with selector: ' + selector);
      for (const el of found) {
        const text = await el.innerText().catch(() => '');
        if (text.trim()) items.push({ selector, text: text.trim() });
      }
      break;
    }
  }

  // Also capture the full page text to analyze structure
  const bodyText = await page.evaluate(() => {
    // Look for any script tags with tournament data (embedded JSON)
    const scripts = document.querySelectorAll('script[type="application/json"], script[id*="state"]');
    const data = [];
    scripts.forEach(s => { if (s.textContent.length > 100) data.push(s.textContent.slice(0, 2000)); });
    return {
      title: document.title,
      url: window.location.href,
      hasLogin: !!document.querySelector('[class*="login"], [class*="signin"], [href*="login"]'),
      scriptData: data,
      bodySnippet: document.body.innerText.slice(0, 3000),
    };
  });

  return {
    url: request.url,
    items,
    pageInfo: bodyText,
    timestamp: new Date().toISOString(),
  };
}`;

// ── Apify helpers ─────────────────────────────────────────────────────────

async function apifyPost(path, body) {
  const res = await fetch(`${APIFY_BASE}${path}?token=${APIFY_TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Apify API error: ${JSON.stringify(json)}`);
  return json;
}

async function apifyGet(path) {
  const res = await fetch(`${APIFY_BASE}${path}?token=${APIFY_TOKEN}`);
  return res.json();
}

async function waitForRun(runId, maxWaitMs = 120_000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    await new Promise((r) => setTimeout(r, 5000));
    const run = await apifyGet(`/actor-runs/${runId}`);
    const status = run.data?.status;
    process.stdout.write(`  Run status: ${status}\r`);
    if (status === "SUCCEEDED") return run.data;
    if (["FAILED", "ABORTED", "TIMED-OUT"].includes(status)) {
      throw new Error(`Apify run ${status}: ${run.data?.statusMessage || ""}`);
    }
  }
  throw new Error("Apify run timed out after 2 minutes");
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log("Starting Apify Playwright run for Unibet…");

  const startResult = await apifyPost(`/acts/${ACTOR_ID}/runs`, {
    startUrls: [{ url: "https://www.unibet.fr/poker/tournaments" }],
    pageFunction: PAGE_FUNCTION,
    proxyConfiguration: { useApifyProxy: true },
    maxRequestsPerCrawl: 1,
    maxConcurrency: 1,
    launchContext: {
      launchOptions: {
        headless: true,
        args: ["--lang=fr-FR", "--no-sandbox"],
      },
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    },
  });

  const runId = startResult.data?.id;
  if (!runId) throw new Error(`No runId in response: ${JSON.stringify(startResult)}`);
  console.log(`  Run started: ${runId}`);

  const runData = await waitForRun(runId);
  console.log(`\n  Run succeeded in ${runData.stats?.runTimeSecs?.toFixed(0) ?? "?"}s`);

  const datasetId = runData.defaultDatasetId;
  const dataset = await apifyGet(`/datasets/${datasetId}/items`);
  const items = Array.isArray(dataset) ? dataset : dataset.items ?? [];

  console.log(`  Dataset items: ${items.length}`);

  if (items.length === 0) {
    console.warn("  ⚠️  No data extracted from Unibet. The page may require authentication.");
  } else {
    // Log what we found for debugging
    for (const item of items) {
      console.log("\n  Page info:");
      console.log("    Title:", item.pageInfo?.title);
      console.log("    Has login prompt:", item.pageInfo?.hasLogin);
      console.log("    Body snippet:", item.pageInfo?.bodySnippet?.slice(0, 200));
      console.log("    Extracted items:", item.items?.length ?? 0);
    }
  }

  // Save raw data for debugging
  const output = {
    updatedAt: new Date().toISOString(),
    platform: "unibet",
    status: items.length > 0 ? "ok" : "no_data",
    note: "Unibet requires authentication for full lobby — showing public data only",
    rawItems: items,
    tournaments: [], // TODO: parse once structure is known
    stats: { total: 0, today: 0, freerolls: 0, specials: 0 },
  };

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2));
  console.log("\n✅ Saved to data/unibet.json");
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
