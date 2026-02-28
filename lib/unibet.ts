/**
 * Generates synthetic Unibet tournament entries from their known recurring schedule.
 * Since Unibet's site blocks automated scraping, we model the schedule statically
 * and compute actual dates for the next 7 days.
 */

import type { UnifiedTournament } from "./tournaments";

const UNIBET_URL = "https://www.unibet.fr/poker/tournaments";

// ── Schedule definitions ──────────────────────────────────────────────────

interface RecurringEntry {
  slug: string;
  name: string;
  time: string;      // "HH:mm" Paris
  buyin: number;     // euros
  buyinRaw: string;
  guarantee: number; // euros
  format: "standard" | "turbo" | "knockout" | "freeroll";
  gameVariant: "nlhe" | "plo" | "other";
  special: boolean;
}

/** Runs every day */
const DAILY: RecurringEntry[] = [
  {
    slug: "freeroll-daily",
    name: "Unibet Freeroll Daily",
    time: "12:00",
    buyin: 0,
    buyinRaw: "0€",
    guarantee: 250,
    format: "freeroll",
    gameVariant: "nlhe",
    special: false,
  },
  {
    slug: "daily-5k",
    name: "Unibet Daily 5K",
    time: "18:30",
    buyin: 5,
    buyinRaw: "5€",
    guarantee: 5000,
    format: "standard",
    gameVariant: "nlhe",
    special: false,
  },
  {
    slug: "daily-10k",
    name: "Unibet Daily 10K",
    time: "19:00",
    buyin: 10,
    buyinRaw: "10€",
    guarantee: 10000,
    format: "standard",
    gameVariant: "nlhe",
    special: false,
  },
  {
    slug: "daily-20k",
    name: "Unibet Daily 20K",
    time: "20:00",
    buyin: 20,
    buyinRaw: "20€",
    guarantee: 20000,
    format: "standard",
    gameVariant: "nlhe",
    special: false,
  },
  {
    slug: "daily-30k",
    name: "Unibet Daily 30K Deep",
    time: "20:30",
    buyin: 30,
    buyinRaw: "30€",
    guarantee: 30000,
    format: "standard",
    gameVariant: "nlhe",
    special: false,
  },
  {
    slug: "night-turbo",
    name: "Unibet Night Turbo",
    time: "22:00",
    buyin: 5,
    buyinRaw: "5€",
    guarantee: 2000,
    format: "turbo",
    gameVariant: "nlhe",
    special: false,
  },
];

/** day: 0=Sunday, 1=Monday, …, 6=Saturday */
const WEEKLY: (RecurringEntry & { day: number })[] = [
  // Wednesday
  {
    slug: "weekly-50k",
    day: 3,
    name: "Unibet Weekly 50K",
    time: "20:00",
    buyin: 50,
    buyinRaw: "50€",
    guarantee: 50000,
    format: "standard",
    gameVariant: "nlhe",
    special: true,
  },
  // Thursday
  {
    slug: "bounty-builder",
    day: 4,
    name: "Unibet Bounty Builder",
    time: "20:00",
    buyin: 20,
    buyinRaw: "20€",
    guarantee: 10000,
    format: "knockout",
    gameVariant: "nlhe",
    special: false,
  },
  {
    slug: "turbo-thursday",
    day: 4,
    name: "Unibet Turbo Thursday",
    time: "21:00",
    buyin: 10,
    buyinRaw: "10€",
    guarantee: 5000,
    format: "turbo",
    gameVariant: "nlhe",
    special: false,
  },
  // Friday
  {
    slug: "deep-stack",
    day: 5,
    name: "Unibet Deep Stack Friday",
    time: "20:00",
    buyin: 30,
    buyinRaw: "30€",
    guarantee: 20000,
    format: "standard",
    gameVariant: "nlhe",
    special: false,
  },
  // Saturday
  {
    slug: "mini-series",
    day: 6,
    name: "Unibet Mini Series",
    time: "19:00",
    buyin: 10,
    buyinRaw: "10€",
    guarantee: 7500,
    format: "standard",
    gameVariant: "nlhe",
    special: false,
  },
  // Sunday
  {
    slug: "sunday-75k",
    day: 0,
    name: "Unibet Sunday 75K",
    time: "17:00",
    buyin: 55,
    buyinRaw: "55€",
    guarantee: 75000,
    format: "standard",
    gameVariant: "nlhe",
    special: true,
  },
  {
    slug: "sunday-mini",
    day: 0,
    name: "Unibet Sunday Mini",
    time: "17:00",
    buyin: 11,
    buyinRaw: "11€",
    guarantee: 10000,
    format: "standard",
    gameVariant: "nlhe",
    special: false,
  },
  {
    slug: "sunday-special",
    day: 0,
    name: "Unibet Sunday Special",
    time: "18:00",
    buyin: 100,
    buyinRaw: "100€",
    guarantee: 100000,
    format: "standard",
    gameVariant: "nlhe",
    special: true,
  },
  {
    slug: "sunday-bounty",
    day: 0,
    name: "Unibet Sunday Bounty",
    time: "19:00",
    buyin: 30,
    buyinRaw: "30€",
    guarantee: 20000,
    format: "knockout",
    gameVariant: "nlhe",
    special: false,
  },
  {
    slug: "late-sunday",
    day: 0,
    name: "Unibet Late Sunday Turbo",
    time: "22:00",
    buyin: 10,
    buyinRaw: "10€",
    guarantee: 5000,
    format: "turbo",
    gameVariant: "nlhe",
    special: false,
  },
];

// ── Generator ─────────────────────────────────────────────────────────────

function toUnified(
  entry: RecurringEntry,
  date: string
): UnifiedTournament {
  return {
    id: `unibet-${entry.slug}-${date}`,
    platform: "unibet",
    name: entry.name,
    date,
    time: entry.time,
    buyin: entry.buyin,
    buyinRaw: entry.buyinRaw,
    guarantee: entry.guarantee,
    format: entry.format,
    special: entry.special,
    gameVariant: entry.gameVariant,
    url: UNIBET_URL,
  };
}

/**
 * Returns Unibet tournaments for the next `days` days starting from `today`.
 * @param today  YYYY-MM-DD (Paris date)
 * @param days   number of days to generate (default 7)
 */
export function getUnibetTournaments(
  today: string,
  days = 7
): UnifiedTournament[] {
  const result: UnifiedTournament[] = [];

  for (let i = 0; i < days; i++) {
    const base = new Date(today + "T12:00:00Z");
    base.setUTCDate(base.getUTCDate() + i);
    const date = base.toISOString().slice(0, 10);
    const dayOfWeek = base.getUTCDay(); // 0=Sunday … 6=Saturday

    // Daily tournaments
    for (const entry of DAILY) {
      result.push(toUnified(entry, date));
    }

    // Weekly tournaments
    for (const entry of WEEKLY) {
      if (entry.day === dayOfWeek) {
        result.push(toUnified(entry, date));
      }
    }
  }

  return result;
}
