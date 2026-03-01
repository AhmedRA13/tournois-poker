/**
 * weekly_newsletter.mjs — Weekly poker newsletter via Brevo
 *
 * Sends a weekly email to all subscribers with:
 * - Top 5 MTT of the week (from existing data)
 * - Link to the weekly top tournois article (if generated)
 * - Strategy tip from a random guide
 * - Bonus CTA
 *
 * Usage: node scripts/weekly_newsletter.mjs
 * Cron: every Sunday at 09:00 (after weekly_top_tournois at 08:00)
 *
 * If BREVO_API_KEY is not set, logs what would be sent (dry run).
 * Error logging: ~/batch-log.txt
 */

import fs from "fs";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DATA_FILE = process.env.DATA_FILE ?? "/var/www/tournois-poker/emails.json";
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

const BREVO_API_KEY = process.env.BREVO_API_KEY ?? "";
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL ?? "newsletter@tournois-poker.fr";
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME ?? "Tournois Poker";
const SITE_URL = "https://tournois-poker.fr";

// ── Logging ────────────────────────────────────────────────────────────────

function log(msg) {
  const line = `[${new Date().toISOString()}] [weekly_newsletter] ${msg}`;
  console.log(line);
}

function logError(msg, err) {
  const line = `[${new Date().toISOString()}] [weekly_newsletter] ERROR: ${msg}${err ? " — " + (err.message ?? err) : ""}\n`;
  console.error(line.trim());
  try { fs.appendFileSync(BATCH_LOG, line); } catch {}
}

// ── Helpers ───────────────────────────────────────────────────────────────

function getToday() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Paris" });
}

function readJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch { return null; }
}

function fmtBuyin(n) {
  if (!n || n === 0) return "Freeroll";
  return `${n}€`;
}

function fmtEuros(n) {
  if (!n || n === 0) return null;
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

function dayLabel(dateStr) {
  const d = new Date(dateStr + "T12:00:00Z");
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
}

// ── Load subscribers ───────────────────────────────────────────────────────

function loadSubscribers() {
  const data = readJSON(DATA_FILE);
  if (!Array.isArray(data)) return [];
  return data.map((e) => (typeof e === "string" ? e : e.email)).filter(Boolean);
}

// ── Load top tournaments ───────────────────────────────────────────────────

function loadTop5Tournaments(today) {
  const wmxData = readJSON(path.join(ROOT, "data", "winamax.json"));
  const psData = readJSON(path.join(ROOT, "data", "pokerstars.json"));

  const tournaments = [
    ...((wmxData?.tournaments ?? []).map((t) => ({ ...t, platform: "winamax" }))),
    ...((psData?.tournaments ?? []).map((t) => ({ ...t, platform: "pokerstars" }))),
  ];

  const upcoming = tournaments.filter(
    (t) => t.date >= today && t.format !== "freeroll" && t.buyin >= 5
  );

  const scored = upcoming.map((t) => ({
    ...t,
    score: (t.special ? 1000000 : 0) + (t.guarantee ?? 0) + t.buyin * 10,
  }));

  scored.sort((a, b) => b.score - a.score || a.date.localeCompare(b.date));

  // Deduplicate by name
  const seen = new Set();
  const top = [];
  for (const t of scored) {
    const key = t.name.toLowerCase().replace(/\s+/g, "");
    if (!seen.has(key)) {
      seen.add(key);
      top.push(t);
    }
    if (top.length >= 5) break;
  }
  return top;
}

// ── Load random strategy tip ───────────────────────────────────────────────

function loadRandomStrategyTip() {
  const guidesDir = path.join(ROOT, "data", "guides");
  if (!fs.existsSync(guidesDir)) return null;

  const files = fs.readdirSync(guidesDir).filter((f) => f.endsWith(".json"));
  const stratFiles = files.filter((f) => {
    const d = readJSON(path.join(guidesDir, f));
    return d?.category === "strategie";
  });

  if (stratFiles.length === 0) return null;

  const pick = stratFiles[Math.floor(Math.random() * stratFiles.length)];
  const guide = readJSON(path.join(guidesDir, pick));
  if (!guide) return null;

  // Extract first FAQ as tip, or first paragraph of content
  if (guide.faq?.length > 0) {
    const faq = guide.faq[0];
    return {
      title: guide.title,
      slug: guide.slug,
      tip: faq.a,
      tipTitle: faq.q,
    };
  }

  // Fallback: first 200 chars of content
  const snippet = (guide.content ?? "").replace(/#+\s/g, "").slice(0, 200);
  return {
    title: guide.title,
    slug: guide.slug,
    tip: snippet + "…",
    tipTitle: `Conseil stratégie : ${guide.title}`,
  };
}

// ── Find this week's article ───────────────────────────────────────────────

function findWeeklyArticle(today) {
  const newsDir = path.join(ROOT, "data", "news");
  if (!fs.existsSync(newsDir)) return null;

  const files = fs.readdirSync(newsDir)
    .filter((f) => f.includes("top-tournois-semaine") && f.endsWith(".json"))
    .sort()
    .reverse();

  if (files.length === 0) return null;

  // Prefer this week's article
  const thisWeek = files.find((f) => f.startsWith(today));
  const article = readJSON(path.join(newsDir, thisWeek ?? files[0]));
  return article;
}

// ── Build email HTML ───────────────────────────────────────────────────────

function buildEmailHtml(top5, stratTip, weeklyArticle, today) {
  const todayFr = new Date(today + "T12:00:00Z").toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const tournamentRows = top5
    .map((t) => {
      const platform = t.platform === "winamax" ? "Winamax" : "PokerStars";
      const guarantee = t.guarantee ? ` · Garantie ${fmtEuros(t.guarantee)}` : "";
      const special = t.special ? " ⭐" : "";
      return `
        <tr style="border-bottom:1px solid #334155">
          <td style="padding:8px 0;color:#f1f5f9;font-weight:600">${t.name}${special}</td>
          <td style="padding:8px 0;color:#94a3b8;text-align:center">${platform}</td>
          <td style="padding:8px 0;color:#f59e0b;text-align:center;font-weight:600">${fmtBuyin(t.buyin)}</td>
          <td style="padding:8px 0;color:#94a3b8;text-align:right">${dayLabel(t.date)} ${t.time}${guarantee}</td>
        </tr>`;
    })
    .join("");

  const articleSection = weeklyArticle
    ? `
      <div style="margin:24px 0;padding:16px;background:#1e293b;border-radius:8px;border:1px solid #334155">
        <p style="margin:0 0 8px;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em">Article de la semaine</p>
        <a href="${SITE_URL}/news/${weeklyArticle.slug}/" style="color:#f59e0b;font-weight:600;text-decoration:none;font-size:16px">${weeklyArticle.title}</a>
        <p style="margin:8px 0 0;color:#94a3b8;font-size:14px">${weeklyArticle.summary ?? ""}</p>
        <a href="${SITE_URL}/news/${weeklyArticle.slug}/" style="display:inline-block;margin-top:12px;padding:8px 16px;background:#f59e0b;color:#000;font-weight:700;border-radius:6px;text-decoration:none;font-size:13px">Lire l'article →</a>
      </div>`
    : "";

  const stratSection = stratTip
    ? `
      <div style="margin:24px 0;padding:16px;background:#1e293b;border-radius:8px;border-left:3px solid #f59e0b">
        <p style="margin:0 0 6px;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em">Conseil stratégie de la semaine</p>
        <p style="margin:0 0 6px;color:#f1f5f9;font-weight:600;font-size:14px">${stratTip.tipTitle}</p>
        <p style="margin:0 0 10px;color:#94a3b8;font-size:14px;line-height:1.6">${stratTip.tip}</p>
        <a href="${SITE_URL}/guide/${stratTip.slug}/" style="color:#f59e0b;font-size:13px;text-decoration:none">Lire le guide complet : ${stratTip.title} →</a>
      </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Programme poker de la semaine</title></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px">
      <a href="${SITE_URL}" style="color:#f59e0b;font-size:20px;font-weight:800;text-decoration:none">♠ Tournois Poker</a>
      <p style="color:#64748b;font-size:13px;margin:4px 0 0">Programme poker du ${todayFr}</p>
    </div>

    <!-- Top 5 tournaments -->
    <div style="background:#1e293b;border-radius:12px;border:1px solid #334155;padding:20px;margin-bottom:24px">
      <h2 style="margin:0 0 16px;color:#f1f5f9;font-size:16px">🏆 Top 5 tournois de la semaine</h2>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead>
          <tr style="border-bottom:1px solid #475569">
            <th style="padding:6px 0;color:#64748b;font-weight:600;text-align:left">Tournoi</th>
            <th style="padding:6px 0;color:#64748b;font-weight:600;text-align:center">Site</th>
            <th style="padding:6px 0;color:#64748b;font-weight:600;text-align:center">Buy-in</th>
            <th style="padding:6px 0;color:#64748b;font-weight:600;text-align:right">Quand</th>
          </tr>
        </thead>
        <tbody>${tournamentRows}</tbody>
      </table>
      <a href="${SITE_URL}" style="display:inline-block;margin-top:14px;color:#f59e0b;font-size:13px;text-decoration:none">Voir tous les tournois →</a>
    </div>

    ${articleSection}
    ${stratSection}

    <!-- Bonus CTA -->
    <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
      <p style="margin:0 0 4px;color:#f59e0b;font-weight:700;font-size:15px">Nouveau sur le poker en ligne ?</p>
      <p style="margin:0 0 14px;color:#cbd5e1;font-size:13px">Jusqu'à <strong style="color:#fff">1 300€ de bonus cumulés</strong> sur Winamax, PokerStars et Unibet.</p>
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
        <a href="https://www.winamax.fr/poker/bonus-bienvenue" style="display:inline-block;padding:10px 18px;background:#f59e0b;color:#000;font-weight:700;border-radius:6px;text-decoration:none;font-size:13px">Winamax 500€</a>
        <a href="https://www.pokerstars.fr/poker/bonus-bienvenue/" style="display:inline-block;padding:10px 18px;background:#dc2626;color:#fff;font-weight:700;border-radius:6px;text-decoration:none;font-size:13px">PokerStars 600€</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;color:#475569;font-size:12px">
      <p style="margin:0 0 4px">Vous recevez cet email car vous êtes abonné à <a href="${SITE_URL}" style="color:#64748b">tournois-poker.fr</a></p>
      <p style="margin:0">© ${new Date().getFullYear()} Tournois Poker · Jeu responsable : 18+ · <a href="https://www.joueurs-info-service.fr" style="color:#64748b">Joueurs Info Service</a></p>
    </div>

  </div>
</body>
</html>`;
}

// ── Send via Brevo ─────────────────────────────────────────────────────────

function sendBrevoEmail(to, subject, htmlContent) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      sender: { name: BREVO_SENDER_NAME, email: BREVO_SENDER_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent,
    });

    const options = {
      hostname: "api.brevo.com",
      path: "/v3/smtp/email",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
        "api-key": BREVO_API_KEY,
        Accept: "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (c) => { data += c; });
      res.on("end", () => {
        if (res.statusCode === 201) {
          resolve({ ok: true });
        } else {
          resolve({ ok: false, status: res.statusCode, body: data });
        }
      });
    });

    req.on("error", (err) => resolve({ ok: false, error: err.message }));
    req.setTimeout(10000, () => { req.destroy(); resolve({ ok: false, error: "timeout" }); });
    req.write(payload);
    req.end();
  });
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const today = getToday();
  log("Starting weekly newsletter…");

  // Load data
  const subscribers = loadSubscribers();
  log(`Subscribers: ${subscribers.length}`);

  if (subscribers.length === 0) {
    log("No subscribers — nothing to send");
    return;
  }

  const top5 = loadTop5Tournaments(today);
  log(`Top 5 tournaments loaded: ${top5.length}`);

  const stratTip = loadRandomStrategyTip();
  log(`Strategy tip: ${stratTip?.slug ?? "none"}`);

  const weeklyArticle = findWeeklyArticle(today);
  log(`Weekly article: ${weeklyArticle?.slug ?? "none"}`);

  // Build email
  const todayFr = new Date(today + "T12:00:00Z").toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
  const subject = `🃏 Programme poker ${todayFr} — Top tournois de la semaine`;
  const html = buildEmailHtml(top5, stratTip, weeklyArticle, today);

  // Dry run if no Brevo API key
  if (!BREVO_API_KEY) {
    log("DRY RUN (no BREVO_API_KEY) — would send to:");
    subscribers.slice(0, 3).forEach((e) => log(`  → ${e}`));
    if (subscribers.length > 3) log(`  … and ${subscribers.length - 3} more`);
    log(`Subject: ${subject}`);
    log(`HTML length: ${html.length} chars`);
    log("Set BREVO_API_KEY to enable real sending");
    return;
  }

  // Send to each subscriber (rate-limited: 1 per 200ms)
  let sent = 0;
  let failed = 0;

  for (const email of subscribers) {
    const result = await sendBrevoEmail(email, subject, html);
    if (result.ok) {
      sent++;
    } else {
      failed++;
      logError(`Failed to send to ${email}: ${JSON.stringify(result)}`);
    }
    // Rate limit: ~5 emails/sec
    await new Promise((r) => setTimeout(r, 200));
  }

  log(`✓ Newsletter sent: ${sent} success, ${failed} failed`);

  if (failed > 0 && sent === 0) {
    logError("All sends failed");
    process.exit(1);
  }
}

main().catch((err) => {
  logError("Fatal error", err);
  process.exit(1);
});
