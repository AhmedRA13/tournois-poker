import { getWinmaxData, getTodayTournaments } from "@/lib/winamax";
import type { Tournament, TournamentFormat } from "@/lib/winamax";

export const revalidate = 3600; // rebuilt hourly by cron anyway

const FORMAT_LABELS: Record<TournamentFormat, string> = {
  freeroll: "Freeroll",
  knockout: "Knockout",
  satellite: "Satellite",
  turbo: "Turbo",
  hyper: "Hyper-Turbo",
  standard: "Standard",
};

const FORMAT_COLORS: Record<TournamentFormat, string> = {
  freeroll: "bg-green-900/60 text-green-300 ring-green-700",
  knockout: "bg-red-900/60 text-red-300 ring-red-700",
  satellite: "bg-blue-900/60 text-blue-300 ring-blue-700",
  turbo: "bg-yellow-900/60 text-yellow-300 ring-yellow-700",
  hyper: "bg-orange-900/60 text-orange-300 ring-orange-700",
  standard: "bg-slate-800 text-slate-300 ring-slate-600",
};

function TournamentRow({ t }: { t: Tournament }) {
  return (
    <tr className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
      <td className="px-4 py-3 font-mono text-sm text-slate-300">{t.time}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {t.special && (
            <span className="inline-flex items-center rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-400 ring-1 ring-inset ring-amber-500/40">
              ★ SPÉCIAL
            </span>
          )}
          <a
            href={t.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-white hover:text-amber-400 transition-colors"
          >
            {t.name}
          </a>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${FORMAT_COLORS[t.format]}`}
        >
          {FORMAT_LABELS[t.format]}
        </span>
      </td>
      <td className="px-4 py-3 text-right font-semibold text-white">
        {t.buyin === 0 ? (
          <span className="text-green-400">GRATUIT</span>
        ) : (
          t.buyinRaw
        )}
      </td>
      <td className="px-4 py-3 text-right">
        <a
          href={t.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="rounded-md bg-amber-500 px-3 py-1 text-xs font-bold text-black hover:bg-amber-400 transition-colors"
        >
          Jouer →
        </a>
      </td>
    </tr>
  );
}

export default function HomePage() {
  const data = getWinmaxData();
  const today = new Date().toLocaleDateString("fr-FR", {
    timeZone: "Europe/Paris",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (!data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-slate-400">
        <p>Données non disponibles. Prochaine mise à jour bientôt.</p>
      </div>
    );
  }

  const todayTournaments = getTodayTournaments(data);
  const specials = todayTournaments.filter((t) => t.special);
  const freerolls = todayTournaments.filter((t) => t.format === "freeroll");
  const updatedAt = new Date(data.updatedAt).toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Hero */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white md:text-4xl">
          Programme des Tournois Poker du Jour
        </h1>
        <p className="mt-2 text-slate-400 capitalize">{today}</p>
        <p className="mt-1 text-xs text-slate-500">
          Dernière mise à jour : {updatedAt}
        </p>
      </div>

      {/* Stats bar */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Tournois aujourd'hui" value={todayTournaments.length} />
        <StatCard label="Événements spéciaux" value={specials.length} accent="amber" />
        <StatCard label="Freerolls" value={freerolls.length} accent="green" />
        <StatCard label="Cette semaine" value={data.stats.total} />
      </div>

      {/* Affiliate CTA */}
      <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-6">
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-amber-400">
              Bonus de bienvenue Winamax
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Jusqu'à <strong className="text-white">500€ offerts</strong> + accès aux tournois exclusifs.
              Offre réservée aux nouveaux joueurs.
            </p>
          </div>
          <a
            href="https://www.winamax.fr/poker/bonus-bienvenue"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="shrink-0 rounded-lg bg-amber-500 px-6 py-3 font-bold text-black hover:bg-amber-400 transition-colors"
          >
            Ouvrir un compte →
          </a>
        </div>
      </div>

      {/* Special events spotlight */}
      {specials.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-white">
            ★ Événements spéciaux du jour
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {specials.filter((t) => t.buyin >= 10).slice(0, 9).map((t) => (
              <a
                key={t.id}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border border-amber-500/30 bg-slate-900 p-4 hover:border-amber-500/60 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-amber-400">{t.name}</span>
                  <span className="text-sm font-semibold text-white">{t.buyinRaw}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                  <span>{t.time}</span>
                  <span>·</span>
                  <span>{FORMAT_LABELS[t.format]}</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Full table */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            Tous les tournois Winamax aujourd'hui
          </h2>
          <span className="text-sm text-slate-400">
            {todayTournaments.length} tournois
          </span>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 text-left">Heure</th>
                <th className="px-4 py-3 text-left">Tournoi</th>
                <th className="px-4 py-3 text-left">Format</th>
                <th className="px-4 py-3 text-right">Buy-in</th>
                <th className="px-4 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {todayTournaments.map((t) => (
                <TournamentRow key={t.id} t={t} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "amber" | "green";
}) {
  const colorClass =
    accent === "amber"
      ? "text-amber-400"
      : accent === "green"
        ? "text-green-400"
        : "text-white";
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-center">
      <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
      <div className="mt-1 text-xs text-slate-400">{label}</div>
    </div>
  );
}
