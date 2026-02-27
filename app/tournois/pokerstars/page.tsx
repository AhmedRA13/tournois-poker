import type { Metadata } from "next";
import {
  getUnifiedTournaments,
  getAvailableDates,
  getParisTodayDate,
} from "@/lib/tournaments";
import { TournamentsDashboard } from "@/components/TournamentsDashboard";

export const metadata: Metadata = {
  title: "Tournois PokerStars France – Sunday Million, Garanties & Satellites",
  description:
    "Programme complet des tournois PokerStars France : Sunday Million 1M$, Warm-Up, freerolls, satellites EPT. Filtrez par buy-in et garantie. Mis à jour chaque nuit.",
};

export default function PokerStarsPage() {
  const all = getUnifiedTournaments();
  const tournaments = all.filter((t) => t.platform === "pokerstars");
  const dates = getAvailableDates(tournaments);
  const today = getParisTodayDate();

  const todayTourneys = tournaments.filter((t) => t.date === today);
  const gtdCount = todayTourneys.filter(
    (t) => t.guarantee && t.guarantee > 0
  ).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-red-400 text-3xl font-bold">★</span>
          <h1 className="text-3xl font-bold text-white">Tournois PokerStars</h1>
        </div>
        <p className="text-slate-400">
          Programme complet des tournois PokerStars France —{" "}
          <strong className="text-white">
            {todayTourneys.length} tournois aujourd'hui
          </strong>
          , dont {gtdCount} avec prize pool garanti.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          PokerStars propose les plus grandes garanties du poker en ligne,
          incluant le Sunday Million hebdomadaire. Données mises à jour chaque
          nuit.
        </p>
      </div>

      {/* Dashboard */}
      <TournamentsDashboard
        tournaments={tournaments}
        dates={dates}
        today={today}
      />

      {/* Affiliate CTA */}
      <div className="mt-10 rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
        <h2 className="font-bold text-red-400 text-lg">Rejoindre PokerStars</h2>
        <p className="mt-1 text-sm text-slate-300">
          Bonus de bienvenue jusqu'à{" "}
          <strong className="text-white">600€</strong> + accès à tous les
          tournois garantis.
        </p>
        <a
          href="https://www.pokerstars.fr/poker/bonus-bienvenue/"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mt-4 inline-block rounded-lg bg-red-600 px-6 py-2.5 font-bold text-white hover:bg-red-500 transition-colors"
        >
          Obtenir le bonus PokerStars →
        </a>
      </div>
    </div>
  );
}
