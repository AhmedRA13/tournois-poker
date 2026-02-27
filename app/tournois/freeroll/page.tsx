import type { Metadata } from "next";
import {
  getUnifiedTournaments,
  getAvailableDates,
  getParisTodayDate,
} from "@/lib/tournaments";
import { TournamentsDashboard } from "@/components/TournamentsDashboard";

export const metadata: Metadata = {
  title: "Freerolls Poker – Tournois gratuits Winamax et PokerStars",
  description:
    "Tous les freerolls poker gratuits du moment : Winamax et PokerStars. Jouez sans buy-in et remportez des vrais prix. Programme mis à jour chaque nuit.",
};

export default function FreerollPage() {
  const all = getUnifiedTournaments();
  const tournaments = all.filter((t) => t.format === "freeroll");
  const dates = getAvailableDates(tournaments);
  const today = getParisTodayDate();

  const todayFreerolls = tournaments.filter((t) => t.date === today);
  const wmxCount = todayFreerolls.filter((t) => t.platform === "winamax").length;
  const psCount = todayFreerolls.filter(
    (t) => t.platform === "pokerstars"
  ).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-green-400 text-3xl font-bold">🎁</span>
          <h1 className="text-3xl font-bold text-white">Freerolls Poker</h1>
        </div>
        <p className="text-slate-400">
          Tournois gratuits sans buy-in —{" "}
          <strong className="text-white">
            {todayFreerolls.length} freerolls aujourd'hui
          </strong>{" "}
          ({wmxCount} Winamax · {psCount} PokerStars).
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Les freerolls vous permettent de jouer gratuitement et de remporter
          des vrais prix : argent réel ou tickets de tournoi. Idéal pour
          débuter sans risque.
        </p>
      </div>

      {/* Info box */}
      <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/5 p-4 text-sm text-slate-300">
        <strong className="text-green-400">💡 Bon à savoir :</strong> Certains
        freerolls sont réservés aux nouveaux inscrits ou aux joueurs actifs.
        Consultez les conditions d'accès sur chaque site avant de vous inscrire.
      </div>

      {/* Dashboard */}
      <TournamentsDashboard
        tournaments={tournaments}
        dates={dates}
        today={today}
      />

      {/* Affiliate CTAs */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-center">
          <div className="text-xl font-bold text-amber-400 mb-2">♠ Winamax</div>
          <p className="text-sm text-slate-300 mb-4">
            Freerolls quotidiens + bonus 500€ pour les nouveaux joueurs.
          </p>
          <a
            href="https://www.winamax.fr/poker/bonus-bienvenue"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-block rounded-lg bg-amber-500 px-5 py-2 font-bold text-black hover:bg-amber-400 transition-colors text-sm"
          >
            Ouvrir un compte Winamax →
          </a>
        </div>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center">
          <div className="text-xl font-bold text-red-400 mb-2">★ PokerStars</div>
          <p className="text-sm text-slate-300 mb-4">
            Freerolls exclusifs nouveaux clients + tournois spéciaux.
          </p>
          <a
            href="https://www.pokerstars.fr/poker/bonus-bienvenue/"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-block rounded-lg bg-red-600 px-5 py-2 font-bold text-white hover:bg-red-500 transition-colors text-sm"
          >
            Ouvrir un compte PokerStars →
          </a>
        </div>
      </div>
    </div>
  );
}
