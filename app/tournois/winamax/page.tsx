import type { Metadata } from "next";
import {
  getUnifiedTournaments,
  getAvailableDates,
  getParisTodayDate,
} from "@/lib/tournaments";
import { TournamentsDashboard } from "@/components/TournamentsDashboard";

export const metadata: Metadata = {
  title: "Tournois Winamax Aujourd'hui – Freerolls, Knockout & Buy-ins",
  description:
    "Programme complet des tournois Winamax du jour : freerolls gratuits, bounty knockouts, satellites et séries. Filtrez par buy-in et format. Mis à jour chaque nuit à 2h.",
};

export default function WinmaxPage() {
  const all = getUnifiedTournaments();
  const tournaments = all.filter((t) => t.platform === "winamax");
  const dates = getAvailableDates(tournaments);
  const today = getParisTodayDate();

  const todayTourneys = tournaments.filter((t) => t.date === today);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-amber-400 text-3xl font-bold">♠</span>
          <h1 className="text-3xl font-bold text-white">Tournois Winamax</h1>
        </div>
        <p className="text-slate-400">
          Programme complet des tournois Winamax Poker —{" "}
          <strong className="text-white">
            {todayTourneys.length} tournois aujourd'hui
          </strong>
          , dont{" "}
          {todayTourneys.filter((t) => t.format === "freeroll").length} freerolls
          gratuits.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Winamax est le leader du poker en ligne en France. Les données sont
          mises à jour chaque nuit à 2h00.
        </p>
      </div>

      {/* Dashboard */}
      <TournamentsDashboard
        tournaments={tournaments}
        dates={dates}
        today={today}
      />

      {/* Affiliate CTA */}
      <div className="mt-10 rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
        <h2 className="font-bold text-amber-400 text-lg">Rejoindre Winamax</h2>
        <p className="mt-1 text-sm text-slate-300">
          Jusqu'à <strong className="text-white">500€ offerts</strong> pour
          votre premier dépôt. Bonus exclusif joueurs français.
        </p>
        <a
          href="https://www.winamax.fr/poker/bonus-bienvenue"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mt-4 inline-block rounded-lg bg-amber-500 px-6 py-2.5 font-bold text-black hover:bg-amber-400 transition-colors"
        >
          Obtenir le bonus Winamax →
        </a>
      </div>
    </div>
  );
}
