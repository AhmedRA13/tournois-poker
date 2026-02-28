/**
 * subscribe.mjs — Email capture endpoint for tournois-poker.fr
 *
 * Standalone Node.js HTTP server (no external deps) — run via pm2
 * Port: 3001
 * Endpoint: POST /api/subscribe
 * Emails stored in: /var/www/tournois-poker/emails.json (or DATA_FILE env var)
 *
 * Security: honeypot, rate limiting (3/IP/hour), disposable domain block, alias block
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ── Config ────────────────────────────────────────────────────────────────

const PORT = parseInt(process.env.PORT ?? "3001", 10);
const DATA_FILE = process.env.DATA_FILE ?? "/var/www/tournois-poker/emails.json";
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? "https://tournois-poker.fr";

// ── Rate limiting (in-memory, per IP) ────────────────────────────────────

const rateLimitMap = new Map(); // ip → [timestamps]

const RATE_LIMIT = 3;        // max requests
const RATE_WINDOW = 3600_000; // 1 hour in ms

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) ?? []).filter(
    (t) => now - t < RATE_WINDOW
  );
  if (timestamps.length >= RATE_LIMIT) return true;
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}

// Periodic cleanup of old rate limit entries (every 10 min)
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitMap) {
    const fresh = timestamps.filter((t) => now - t < RATE_WINDOW);
    if (fresh.length === 0) rateLimitMap.delete(ip);
    else rateLimitMap.set(ip, fresh);
  }
}, 600_000);

// ── Disposable email domains ─────────────────────────────────────────────

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.info", "guerrillamail.biz",
  "guerrillamail.de", "guerrillamail.net", "guerrillamail.org", "sharklasers.com",
  "spam4.me", "trashmail.com", "trashmail.me", "trashmail.at", "trashmail.io",
  "trashmail.net", "trashmail.org", "tempmail.com", "temp-mail.org", "temp-mail.io",
  "10minutemail.com", "10minutemail.net", "10minutemail.org", "10minutemail.de",
  "throwaway.email", "yopmail.com", "yopmail.fr", "cool.fr.nf", "jetable.fr.nf",
  "nospam.ze.tc", "nomail.xl.cx", "mega.zik.dj", "speed.1s.fr", "courriel.fr.nf",
  "mail-temporaire.fr", "maildrop.cc", "getairmail.com", "filzmail.com",
  "dispostable.com", "fakeinbox.com", "mailnesia.com", "mailnull.com",
  "spamgourmet.com", "spamgourmet.net", "spamgourmet.org", "spamspot.com",
  "mytemp.email", "tempinbox.com", "discard.email", "cuvox.de", "dayrep.com",
  "einrot.com", "fleckens.hu", "gustr.com", "incognitomail.com", "inoutmail.de",
  "odaymail.com", "superrito.com", "teleworm.us", "garliclife.com",
]);

// ── Email validation ──────────────────────────────────────────────────────

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function validateEmail(raw) {
  if (!raw || typeof raw !== "string") return { ok: false, reason: "missing" };

  const email = raw.trim().toLowerCase();

  if (!EMAIL_REGEX.test(email)) return { ok: false, reason: "invalid_format" };
  if (email.length > 320) return { ok: false, reason: "too_long" };

  // Block email aliases (user+tag@domain.com)
  const [localPart, domain] = email.split("@");
  if (!domain) return { ok: false, reason: "invalid_format" };

  if (localPart.includes("+")) {
    return { ok: false, reason: "alias_not_allowed" };
  }

  // Block disposable domains
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { ok: false, reason: "disposable_email" };
  }

  // Block subdomains of disposable services (e.g. user@spam.mailinator.com)
  for (const disposable of DISPOSABLE_DOMAINS) {
    if (domain.endsWith("." + disposable)) {
      return { ok: false, reason: "disposable_email" };
    }
  }

  return { ok: true, email };
}

// ── Email storage ─────────────────────────────────────────────────────────

function readEmails() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveEmail(email, ip) {
  const emails = readEmails();

  // Check for duplicate
  if (emails.some((e) => e.email === email)) {
    return { ok: false, reason: "already_subscribed" };
  }

  emails.push({
    email,
    ip: ip ?? "unknown",
    date: new Date().toISOString(),
  });

  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(emails, null, 2), "utf-8");
  return { ok: true };
}

// ── Request handling ──────────────────────────────────────────────────────

function getBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
      if (body.length > 4096) reject(new Error("body_too_large"));
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function getClientIp(req) {
  return (
    req.headers["x-real-ip"] ??
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ??
    req.socket.remoteAddress ??
    "unknown"
  );
}

function json(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(body);
}

// ── HTTP Server ───────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  // Health check
  if (req.method === "GET" && url.pathname === "/health") {
    json(res, 200, { ok: true, uptime: process.uptime() });
    return;
  }

  // Subscribe endpoint
  if (req.method === "POST" && url.pathname === "/api/subscribe") {
    const ip = getClientIp(req);

    // Rate limit
    if (isRateLimited(ip)) {
      json(res, 429, { ok: false, error: "rate_limit", message: "Trop de tentatives. Réessayez dans une heure." });
      return;
    }

    let body;
    try {
      body = JSON.parse(await getBody(req));
    } catch {
      json(res, 400, { ok: false, error: "invalid_json" });
      return;
    }

    // Honeypot check (bots fill this hidden field)
    if (body.website || body.phone || body.name_confirm) {
      // Silently succeed to not reveal honeypot
      json(res, 200, { ok: true });
      return;
    }

    // Validate email
    const validation = validateEmail(body.email);
    if (!validation.ok) {
      const messages = {
        missing: "Adresse email requise.",
        invalid_format: "Adresse email invalide.",
        too_long: "Adresse email trop longue.",
        alias_not_allowed: "Les adresses avec alias (user+tag@) ne sont pas acceptées.",
        disposable_email: "Les adresses email temporaires ne sont pas acceptées.",
      };
      json(res, 400, {
        ok: false,
        error: validation.reason,
        message: messages[validation.reason] ?? "Email invalide.",
      });
      return;
    }

    // Save
    const result = saveEmail(validation.email, ip);
    if (!result.ok) {
      if (result.reason === "already_subscribed") {
        // Don't reveal existence, just succeed
        json(res, 200, { ok: true });
        return;
      }
      json(res, 500, { ok: false, error: "storage_error" });
      return;
    }

    json(res, 200, {
      ok: true,
      message: "Merci ! Vous recevrez le guide par email.",
    });
    return;
  }

  // 404
  json(res, 404, { ok: false, error: "not_found" });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[subscribe] Server listening on http://127.0.0.1:${PORT}`);
});

server.on("error", (err) => {
  console.error("[subscribe] Server error:", err.message);
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("[subscribe] Shutting down...");
  server.close(() => process.exit(0));
});
