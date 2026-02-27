/**
 * Normalizes Winamax and PokerStars tournament data into a unified format.
 * Server-only (reads from disk).
 */

import { getWinmaxData } from "./winamax";
import { getPSData } from "./pokerstars";

export type TFormat = "freeroll" | "knockout" | "satellite" | "turbo" | "hyper" | "standard";
export type TVariant = "nlhe" | "plo" | "other";
export type TPlatform = "winamax" | "pokerstars" | "unibet";

export interface UnifiedTournament {
  id: string;
  platform: TPlatform;
  name: string;
  date: string;        // YYYY-MM-DD
  time: string;        // HH:mm (Paris local)
  buyin: number;       // euros
  buyinRaw: string;    // "50€"
  guarantee: number | null; // euros, null = not available
  format: TFormat;
  special: boolean;
  gameVariant: TVariant;
  url: string;
}

// ── Game variant detection ────────────────────────────────────────────────

const PLO_KEYWORDS = /\bplo\b|omaha|courchevel/i;
const OTHER_KEYWORDS = /stud|razz|horse|draw|badugi|game|mixed/i;

function variantFromName(name: string): TVariant {
  if (PLO_KEYWORDS.test(name)) return "plo";
  if (OTHER_KEYWORDS.test(name)) return "other";
  return "nlhe";
}

/** PokerStars gameInt → variant */
function variantFromGameInt(gameInt: number): TVariant {
  if ([2].includes(gameInt)) return "nlhe";                           // NLHE
  if ([3, 4, 11, 107].includes(gameInt)) return "plo";               // PLO variants
  return "other";                                                     // Stud, Draw, Mixed, etc.
}

// ── Normalizers ───────────────────────────────────────────────────────────

export function getUnifiedTournaments(): UnifiedTournament[] {
  const wmxData = getWinmaxData();
  const psData = getPSData();

  const out: UnifiedTournament[] = [];

  if (wmxData) {
    for (const t of wmxData.tournaments) {
      out.push({
        id: `wmx-${t.id}`,
        platform: "winamax",
        name: t.name,
        date: t.date,
        time: t.time,
        buyin: t.buyin,
        buyinRaw: t.buyinRaw,
        guarantee: null,          // not available in Winamax HTML scrape
        format: t.format as TFormat,
        special: t.special,
        gameVariant: variantFromName(t.name),
        url: t.url,
      });
    }
  }

  if (psData) {
    for (const t of psData.tournaments) {
      out.push({
        id: `ps-${t.id ?? t.name.slice(0, 20)}-${t.time}`,
        platform: "pokerstars",
        name: t.name,
        date: t.date ?? "",
        time: t.time ?? "00:00",
        buyin: t.buyin,
        buyinRaw: t.buyinRaw,
        guarantee: t.guarantee,
        format: t.format as TFormat,
        special: t.special,
        gameVariant: variantFromGameInt(t.gameInt),
        url: t.url,
      });
    }
  }

  // Sort by date then time
  out.sort((a, b) =>
    a.date !== b.date ? a.date.localeCompare(b.date) : a.time.localeCompare(b.time)
  );

  return out;
}

/** Returns all unique dates (sorted) across all platforms */
export function getAvailableDates(tournaments: UnifiedTournament[]): string[] {
  return [...new Set(tournaments.map((t) => t.date))].sort();
}

/** Returns today's date in Paris timezone */
export function getParisTodayDate(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Paris" });
}

/** Returns current Paris time as "HH:mm" */
export function getParisCurrentTime(): string {
  return new Date().toLocaleTimeString("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
  });
}
