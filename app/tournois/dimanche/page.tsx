import type { Metadata } from "next";
import {
  getUnifiedTournaments,
  getAvailableDates,
  getParisTodayDate,
} from "@/lib/tournaments";
import { TournamentsDashboard } from "@/components/TournamentsDashboard";

export const metadata: Metadata = {
  title: "Tournois Poker Dimanche – Sunday Million, Warm-Up, Winamax Series",
  description:
    "Programme complet des grands tournois poker du dimanche : Sunday Million, Sunday Warm-Up, tournois Winamax. Les plus grandes garanties de la semaine.",
};

/** Returns the next Sunday date (YYYY-MM-DD) at or after a given date */
function getNextSunday(from: string): string {
  const d = new Date(from + "T12:00:00Z");
  const day = d.getUTCDay(); // 0 = Sunday
  const daysUntilSunday = day === 0 ? 0 : 7 - day;
  d.setUTCDate(d.getUTCDate() + daysUntilSunday);
  return d.toISOString().slice(0, 10);
}

/** Returns all Sunday dates from a list */
function getSundayDates(dates: string[]): string[] {
  return dates.filter((d) => new Date(d + "T12:00:00Z").getUTCDay() === 0);
}

const SUNDAY_KEYWORDS =
  /\bsunday\b|dimanche|warm.?up|million|storm|supersonic|special|big game/i;

export default function DimanchePage() {
  const all = getUnifiedTournaments();
  const today = getParisTodayDate();
  const allDates = getAvailableDates(all);

  // Tournaments on Sundays OR with "Sunday" in the name
  const tournaments = all.filter(
    (t) =>
      new Date(t.date + "T12:00:00Z").getUTCDay() === 0 ||
      SUNDAY_KEYWORDS.test(t.name)
  );

  const dates = getAvailableDates(tournaments);
  const sundayDates = getSundayDates(allDates);
  const nextSunday = getNextSunday(today);

  const sundayTourneys = tournaments.filter((t) => t.date === nextSunday);
  const totalGtd = sundayTourneys.reduce(
    (sum, t) => sum + (t.guarantee ?? 0),
    0
  );

  function formatGtd(v: number): string {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M€`;
    if (v >= 1000) return `${Math.round(v / 1000)}K€`;
    return `${v}€`;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-purple-400 text-3xl">🏆</span>
          <h1 className="text-3xl font-bold text-white">
            Tournois du Dimanche
          </h1>
        </div>
        <p className="text-slate-400">
          Le dimanche est le jour des grandes garanties au poker en ligne.{" "}
          {sundayDates.length > 0 && sundayTourneys.length > 0 && (
            <>
              <strong className="text-white">
                {sundayTourneys.length} tournois
              </strong>{" "}
              dimanche prochain
              {totalGtd > 0 && (
                <>
                  {" "}
                  — plus de{" "}
                  <strong className="text-green-400">
                    {formatGtd(totalGtd)}
                  </strong>{" "}
                  garantis au total.
                </>
              )}
            </>
          )}
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Sunday Million, Sunday Warm-Up, Sunday Storm et les grandes séries
          Winamax — tous les dimanches.
        </p>
      </div>

      {/* Featured Sunday events info */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          {
            name: "Sunday Million",
            platform: "PokerStars",
            color: "border-red-500/30 bg-red-500/5",
            textColor: "text-red-400",
            desc: "Le plus grand tournoi hebdomadaire — 1M$ garanti chaque dimanche.",
          },
          {
            name: "Sunday Warm-Up",
            platform: "PokerStars",
            color: "border-red-500/20 bg-red-500/5",
            textColor: "text-red-400",
            desc: "Le classique du dimanche — 500K$ GTD avec un format accessible.",
          },
          {
            name: "Séries Winamax",
            platform: "Winamax",
            color: "border-amber-500/30 bg-amber-500/5",
            textColor: "text-amber-400",
            desc: "SISMIX, SMASK, Sunday Freeze : les événements phares de Winamax.",
          },
        ].map((e) => (
          <div
            key={e.name}
            className={`rounded-xl border p-4 ${e.color}`}
          >
            <div className={`font-bold text-sm ${e.textColor}`}>{e.name}</div>
            <div className="text-xs text-slate-500 mb-1">{e.platform}</div>
            <div className="text-xs text-slate-400">{e.desc}</div>
          </div>
        ))}
      </div>

      {/* Dashboard */}
      {dates.length > 0 ? (
        <TournamentsDashboard
          tournaments={tournaments}
          dates={dates}
          today={today}
        />
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900 py-16 text-center text-slate-500">
          <p className="text-4xl mb-3">📅</p>
          <p>Aucun tournoi dimanche dans les données disponibles.</p>
          <p className="text-sm mt-2">
            Les données sont mises à jour chaque nuit à 2h00.
          </p>
        </div>
      )}

      {/* Affiliate CTAs */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center">
          <div className="text-xl font-bold text-red-400 mb-1">
            ★ Sunday Million
          </div>
          <p className="text-sm text-slate-300 mb-4">
            1M$ garanti tous les dimanches sur PokerStars.
          </p>
          <a
            href="https://www.pokerstars.fr/poker/bonus-bienvenue/"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-block rounded-lg bg-red-600 px-5 py-2 font-bold text-white hover:bg-red-500 transition-colors text-sm"
          >
            Jouer sur PokerStars →
          </a>
        </div>
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-center">
          <div className="text-xl font-bold text-amber-400 mb-1">
            ♠ Winamax Dimanche
          </div>
          <p className="text-sm text-slate-300 mb-4">
            Séries et tournois spéciaux chaque dimanche sur Winamax.
          </p>
          <a
            href="https://www.winamax.fr/poker/bonus-bienvenue"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-block rounded-lg bg-amber-500 px-5 py-2 font-bold text-black hover:bg-amber-400 transition-colors text-sm"
          >
            Jouer sur Winamax →
          </a>
        </div>
      </div>
    </div>
  );
}
