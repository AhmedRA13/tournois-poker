import { getWinmaxData, getTodayTournaments } from "@/lib/winamax";
import { getPSData, getTodayPSTournaments } from "@/lib/pokerstars";
import type { Tournament, TournamentFormat } from "@/lib/winamax";
import type { PSTournament, PSFormat } from "@/lib/pokerstars";

export const revalidate = 3600;

// ── Shared types ──────────────────────────────────────────────────────────

type AnyFormat = TournamentFormat | PSFormat;

const FORMAT_LABELS: Record<AnyFormat, string> = {
  freeroll: "Freeroll",
  knockout: "Knockout",
  satellite: "Satellite",
  turbo: "Turbo",
  hyper: "Hyper-Turbo",
  standard: "Standard",
};

const FORMAT_COLORS: Record<AnyFormat, string> = {
  freeroll: "bg-green-900/60 text-green-300 ring-green-700",
  knockout: "bg-red-900/60 text-red-300 ring-red-700",
  satellite: "bg-blue-900/60 text-blue-300 ring-blue-700",
  turbo: "bg-yellow-900/60 text-yellow-300 ring-yellow-700",
  hyper: "bg-orange-900/60 text-orange-300 ring-orange-700",
  standard: "bg-slate-800 text-slate-300 ring-slate-600",
};

// ── Winamax section ───────────────────────────────────────────────────────

function WinmaxRow({ t }: { t: Tournament }) {
  return (
    <tr className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
      <td className="px-4 py-2.5 font-mono text-sm text-slate-300">{t.time}</td>
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-2">
          {t.special && (
            <span className="shrink-0 inline-flex items-center rounded-full bg-amber-500/20 px-1.5 py-0.5 text-xs font-semibold text-amber-400 ring-1 ring-inset ring-amber-500/40">
              ★
            </span>
          )}
          <a href={t.url} target="_blank" rel="noopener noreferrer" className="font-medium text-white hover:text-amber-400 transition-colors">
            {t.name}
          </a>
        </div>
      </td>
      <td className="px-4 py-2.5">
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${FORMAT_COLORS[t.format]}`}>
          {FORMAT_LABELS[t.format]}
        </span>
      </td>
      <td className="px-4 py-2.5 text-right font-semibold text-white">
        {t.buyin === 0 ? <span className="text-green-400">GRATUIT</span> : t.buyinRaw}
      </td>
      <td className="px-4 py-2.5 text-right text-slate-400">—</td>
    </tr>
  );
}

// ── PokerStars section ────────────────────────────────────────────────────

function PSRow({ t }: { t: PSTournament }) {
  const gtd =
    t.guarantee && t.guarantee > 0
      ? t.guarantee >= 1_000_000
        ? `${(t.guarantee / 1_000_000).toFixed(1)}M€`
        : t.guarantee >= 1000
          ? `${Math.round(t.guarantee / 1000)}K€`
          : `${t.guarantee}€`
      : null;

  return (
    <tr className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
      <td className="px-4 py-2.5 font-mono text-sm text-slate-300">{t.time}</td>
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-2">
          {t.special && (
            <span className="shrink-0 inline-flex items-center rounded-full bg-red-500/20 px-1.5 py-0.5 text-xs font-semibold text-red-400 ring-1 ring-inset ring-red-500/40">
              ★
            </span>
          )}
          <a href={t.url} target="_blank" rel="noopener noreferrer sponsored" className="font-medium text-white hover:text-red-400 transition-colors">
            {t.name}
          </a>
        </div>
      </td>
      <td className="px-4 py-2.5">
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${FORMAT_COLORS[t.format]}`}>
          {FORMAT_LABELS[t.format]}
        </span>
      </td>
      <td className="px-4 py-2.5 text-right font-semibold text-white">
        {t.buyin === 0 ? <span className="text-green-400">GRATUIT</span> : t.buyinRaw}
      </td>
      <td className="px-4 py-2.5 text-right text-slate-400 font-mono text-sm">
        {gtd ?? "—"}
      </td>
    </tr>
  );
}

// ── Platform section wrapper ──────────────────────────────────────────────

function PlatformSection({
  name,
  color,
  logo,
  count,
  updatedAt,
  affiliateUrl,
  affiliateLabel,
  children,
}: {
  name: string;
  color: string;
  logo: string;
  count: number;
  updatedAt: string | null;
  affiliateUrl: string;
  affiliateLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className={`text-2xl font-bold ${color}`}>{logo}</span>
          <h2 className="text-xl font-bold text-white">{name}</h2>
          <span className="text-sm text-slate-400">{count} tournois aujourd'hui</span>
          {updatedAt && (
            <span className="text-xs text-slate-600">· MàJ {updatedAt}</span>
          )}
        </div>
        <a
          href={affiliateUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="shrink-0 rounded-md bg-slate-700 px-4 py-1.5 text-sm font-semibold text-white hover:bg-slate-600 transition-colors"
        >
          {affiliateLabel} →
        </a>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 text-left">Heure</th>
              <th className="px-4 py-3 text-left">Tournoi</th>
              <th className="px-4 py-3 text-left">Format</th>
              <th className="px-4 py-3 text-right">Buy-in</th>
              <th className="px-4 py-3 text-right">Garantie</th>
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </section>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────

function StatCard({ label, value, accent }: { label: string; value: number; accent?: "amber" | "green" | "red" }) {
  const colorClass = accent === "amber" ? "text-amber-400" : accent === "green" ? "text-green-400" : accent === "red" ? "text-red-400" : "text-white";
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-center">
      <div className={`text-3xl font-bold ${colorClass}`}>{value.toLocaleString("fr-FR")}</div>
      <div className="mt-1 text-xs text-slate-400">{label}</div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function HomePage() {
  const wmxData = getWinmaxData();
  const psData = getPSData();

  const today = new Date().toLocaleDateString("fr-FR", {
    timeZone: "Europe/Paris",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const wmxToday = wmxData ? getTodayTournaments(wmxData) : [];
  const psToday = psData ? getTodayPSTournaments(psData) : [];

  const totalToday = wmxToday.length + psToday.length;
  const totalSpecials = wmxToday.filter((t) => t.special).length + psToday.filter((t) => t.special).length;
  const totalFreerolls = wmxToday.filter((t) => t.format === "freeroll").length + psToday.filter((t) => t.format === "freeroll").length;

  const wmxUpdatedAt = wmxData?.updatedAt
    ? new Date(wmxData.updatedAt).toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit" })
    : null;
  const psUpdatedAt = psData?.updatedAt
    ? new Date(psData.updatedAt).toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Hero */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white md:text-4xl">
          Programme des Tournois Poker du Jour
        </h1>
        <p className="mt-2 text-slate-400 capitalize">{today}</p>
      </div>

      {/* Stats bar */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Tournois aujourd'hui" value={totalToday} />
        <StatCard label="Événements spéciaux" value={totalSpecials} accent="amber" />
        <StatCard label="Freerolls gratuits" value={totalFreerolls} accent="green" />
        <StatCard label="Plateformes" value={2} />
      </div>

      {/* Winamax section */}
      {wmxData ? (
        <PlatformSection
          name="Winamax"
          color="text-amber-400"
          logo="♠"
          count={wmxToday.length}
          updatedAt={wmxUpdatedAt}
          affiliateUrl="https://www.winamax.fr/poker/bonus-bienvenue"
          affiliateLabel="Bonus Winamax"
        >
          {wmxToday.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                Données non disponibles.
              </td>
            </tr>
          ) : (
            wmxToday.map((t) => <WinmaxRow key={t.id} t={t} />)
          )}
        </PlatformSection>
      ) : (
        <div className="mb-10 rounded-xl border border-slate-800 bg-slate-900 py-12 text-center text-slate-500">
          Données Winamax non disponibles. Prochaine mise à jour bientôt.
        </div>
      )}

      {/* PokerStars section */}
      {psData ? (
        <PlatformSection
          name="PokerStars"
          color="text-red-400"
          logo="★"
          count={psToday.length}
          updatedAt={psUpdatedAt}
          affiliateUrl="https://www.pokerstars.fr/poker/bonus-bienvenue/"
          affiliateLabel="Bonus PokerStars"
        >
          {psToday.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                Données non disponibles.
              </td>
            </tr>
          ) : (
            psToday.map((t, i) => <PSRow key={`${t.name}-${i}`} t={t} />)
          )}
        </PlatformSection>
      ) : (
        <div className="mb-10 rounded-xl border border-slate-800 bg-slate-900 py-12 text-center text-slate-500">
          Données PokerStars non disponibles. Prochaine mise à jour bientôt.
        </div>
      )}

      {/* Unibet placeholder */}
      <section className="mb-10">
        <div className="mb-3 flex items-center gap-3">
          <span className="text-2xl font-bold text-green-400">♣</span>
          <h2 className="text-xl font-bold text-white">Unibet</h2>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
            Bientôt disponible
          </span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 py-8 text-center text-slate-500 text-sm">
          Données Unibet en cours d'intégration.{" "}
          <a href="https://www.unibet.fr/poker/tournaments" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
            Voir les tournois sur Unibet.fr →
          </a>
        </div>
      </section>

      {/* Footer CTA */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
        <h2 className="text-lg font-bold text-amber-400">Nouveau sur le poker en ligne ?</h2>
        <p className="mt-1 text-sm text-slate-300">
          Profitez des meilleures offres de bienvenue — jusqu'à <strong className="text-white">500€ offerts</strong> sur Winamax et PokerStars.
        </p>
        <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="https://www.winamax.fr/poker/bonus-bienvenue" target="_blank" rel="noopener noreferrer sponsored" className="rounded-lg bg-amber-500 px-6 py-2.5 font-bold text-black hover:bg-amber-400 transition-colors">
            Bonus Winamax →
          </a>
          <a href="https://www.pokerstars.fr/poker/bonus-bienvenue/" target="_blank" rel="noopener noreferrer sponsored" className="rounded-lg bg-red-600 px-6 py-2.5 font-bold text-white hover:bg-red-500 transition-colors">
            Bonus PokerStars →
          </a>
        </div>
      </div>
    </div>
  );
}
