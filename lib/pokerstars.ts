import fs from "fs";
import path from "path";

export type PSFormat =
  | "freeroll"
  | "knockout"
  | "satellite"
  | "turbo"
  | "hyper"
  | "standard";

export interface PSTournament {
  id: string | null;
  platform: "pokerstars";
  name: string;
  nameRaw: string;
  date: string;
  time: string;
  buyinRaw: string;
  buyin: number;
  buyinCents: number;
  feeCents: number;
  guarantee: number | null;
  guaranteeText: string | null;
  format: PSFormat;
  special: boolean;
  gameInt: number;
  maxPlayers: number;
  url: string;
}

export interface PSData {
  updatedAt: string;
  platform: string;
  dateRange: { from: string | null; to: string | null };
  stats: {
    total: number;
    today: number;
    freerolls: number;
    specials: number;
    dates: number;
  };
  tournaments: PSTournament[];
}

const DATA_DIR = path.join(process.cwd(), "data");

function readJson<T>(file: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf-8")) as T;
  } catch {
    return null;
  }
}

export function getPSData(): PSData | null {
  return readJson<PSData>("pokerstars.json");
}

export function getTodayPSTournaments(data: PSData): PSTournament[] {
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Europe/Paris",
  });
  return data.tournaments.filter((t) => t.date === today);
}
