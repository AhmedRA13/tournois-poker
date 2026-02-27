import fs from "fs";
import path from "path";

export type TournamentFormat =
  | "freeroll"
  | "knockout"
  | "satellite"
  | "turbo"
  | "hyper"
  | "standard";

export interface Tournament {
  id: string;
  platform: "winamax" | "pokerstars" | "unibet";
  name: string;
  date: string;       // "YYYY-MM-DD"
  time: string;       // "HH:mm"
  buyinRaw: string;   // "50€"
  buyin: number;      // float in euros
  format: TournamentFormat;
  special: boolean;
  url: string;
}

export interface WinmaxData {
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
  tournaments: Tournament[];
}

const DATA_DIR = path.join(process.cwd(), "data");

function readJson<T>(file: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf-8")) as T;
  } catch {
    return null;
  }
}

export function getWinmaxData(): WinmaxData | null {
  return readJson<WinmaxData>("winamax.json");
}

export function getTodayTournaments(data: WinmaxData): Tournament[] {
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Europe/Paris",
  });
  return data.tournaments.filter((t) => t.date === today);
}
