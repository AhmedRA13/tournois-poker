import type { Metadata } from "next";
import {
  getUnifiedTournaments,
  getAvailableDates,
  getParisTodayDate,
} from "@/lib/tournaments";
import { TournamentsDashboard } from "@/components/TournamentsDashboard";

export const metadata: Metadata = {
  title: "Programme des Tournois Poker – Winamax, PokerStars, Unibet",
  description:
    "Programme complet des tournois de poker en ligne en France. Winamax, PokerStars, Unibet — filtrez par buy-in, format, garantie. Mis à jour chaque nuit.",
};

export default function HomePage() {
  const tournaments = getUnifiedTournaments();
  const dates = getAvailableDates(tournaments);
  const today = getParisTodayDate();

  const todayTourneys = tournaments.filter((t) => t.date === today);
  const totalToday = todayTourneys.length;
  const totalSpecials = todayTourneys.filter((t) => t.special).length;
  const totalFreerolls = todayTourneys.filter(
    (t) => t.format === "freeroll"
  ).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Hero */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-white md:text-4xl">
          Programme des Tournois Poker en Ligne
        </h1>
        <p className="mt-2 text-slate-400">
          {totalToday > 0
            ? `${totalToday.toLocaleString("fr-FR")} tournois aujourd'hui · ${totalSpecials} spéciaux · ${totalFreerolls} freerolls`
            : "Winamax · PokerStars · Unibet — mis à jour chaque nuit"}
        </p>
      </div>

      {/* Stats bar */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            label: "Tournois aujourd'hui",
            value: totalToday,
            color: "text-white",
          },
          {
            label: "Événements spéciaux",
            value: totalSpecials,
            color: "text-amber-400",
          },
          {
            label: "Freerolls gratuits",
            value: totalFreerolls,
            color: "text-green-400",
          },
          { label: "Plateformes", value: 2, color: "text-white" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-center"
          >
            <div className={`text-3xl font-bold ${s.color}`}>
              {s.value.toLocaleString("fr-FR")}
            </div>
            <div className="mt-1 text-xs text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Interactive dashboard */}
      <TournamentsDashboard
        tournaments={tournaments}
        dates={dates}
        today={today}
      />

      {/* Affiliate CTA */}
      <div className="mt-12 rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
        <h2 className="text-lg font-bold text-amber-400">
          Nouveau sur le poker en ligne ?
        </h2>
        <p className="mt-1 text-sm text-slate-300">
          Profitez des meilleures offres de bienvenue — jusqu'à{" "}
          <strong className="text-white">500€ offerts</strong> sur Winamax et
          PokerStars.
        </p>
        <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="https://www.winamax.fr/poker/bonus-bienvenue"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="rounded-lg bg-amber-500 px-6 py-2.5 font-bold text-black hover:bg-amber-400 transition-colors"
          >
            Bonus Winamax →
          </a>
          <a
            href="https://www.pokerstars.fr/poker/bonus-bienvenue/"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="rounded-lg bg-red-600 px-6 py-2.5 font-bold text-white hover:bg-red-500 transition-colors"
          >
            Bonus PokerStars →
          </a>
        </div>
      </div>
    </div>
  );
}
