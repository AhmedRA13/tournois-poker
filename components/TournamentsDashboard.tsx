"use client";

import { useState, useMemo, useEffect } from "react";
import type { UnifiedTournament, TPlatform, TFormat } from "@/lib/tournaments";

// ── Types ──────────────────────────────────────────────────────────────────

type BuyinRange = "all" | "freeroll" | "1-5" | "5-15" | "15-50" | "50+";

// ── Constants ──────────────────────────────────────────────────────────────

const FORMAT_LABELS: Record<TFormat, string> = {
  freeroll: "Freeroll",
  knockout: "Knockout",
  satellite: "Satellite",
  turbo: "Turbo",
  hyper: "Hyper",
  standard: "Standard",
};

const FORMAT_COLORS: Record<TFormat, string> = {
  freeroll: "bg-green-900/60 text-green-300 ring-green-700/50",
  knockout: "bg-red-900/60 text-red-300 ring-red-700/50",
  satellite: "bg-blue-900/60 text-blue-300 ring-blue-700/50",
  turbo: "bg-yellow-900/60 text-yellow-300 ring-yellow-700/50",
  hyper: "bg-orange-900/60 text-orange-300 ring-orange-700/50",
  standard: "bg-slate-800 text-slate-300 ring-slate-600/50",
};

const PLATFORM_COLORS: Record<TPlatform, string> = {
  winamax: "text-amber-400",
  pokerstars: "text-red-400",
  unibet: "text-green-400",
};

const PLATFORM_LOGOS: Record<TPlatform, string> = {
  winamax: "W",
  pokerstars: "★",
  unibet: "U",
};

const PLATFORM_LABELS: Record<TPlatform, string> = {
  winamax: "Winamax",
  pokerstars: "PokerStars",
  unibet: "Unibet",
};

// ── Helpers ────────────────────────────────────────────────────────────────

function formatGuarantee(g: number | null): string {
  if (!g || g === 0) return "—";
  if (g >= 1_000_000) return `${(g / 1_000_000).toFixed(1)}M€`;
  if (g >= 1000) return `${Math.round(g / 1000)}K€`;
  return `${g}€`;
}

function formatDateLabel(date: string, today: string): { short: string; long: string } {
  if (date === today) return { short: "Auj.", long: "Aujourd'hui" };
  const d = new Date(date + "T12:00:00Z");
  const short = d.toLocaleDateString("fr-FR", { weekday: "short", timeZone: "UTC" });
  const num = d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" });
  return { short: short.replace(".", ""), long: num };
}

function inBuyinRange(buyin: number, range: BuyinRange): boolean {
  if (range === "all") return true;
  if (range === "freeroll") return buyin === 0;
  if (range === "1-5") return buyin > 0 && buyin <= 5;
  if (range === "5-15") return buyin > 5 && buyin <= 15;
  if (range === "15-50") return buyin > 15 && buyin <= 50;
  if (range === "50+") return buyin > 50;
  return true;
}

// ── Sub-components ─────────────────────────────────────────────────────────

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
        active
          ? "bg-amber-500 text-black"
          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
      }`}
    >
      {label}
    </button>
  );
}

function TournamentRow({
  t,
  isPast,
}: {
  t: UnifiedTournament;
  isPast: boolean;
}) {
  return (
    <tr
      className={`border-b border-slate-800 transition-colors ${
        isPast ? "opacity-35" : "hover:bg-slate-800/50"
      }`}
    >
      <td className="px-3 py-2.5 font-mono text-sm text-slate-300 whitespace-nowrap">
        {t.time}
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`shrink-0 text-xs font-bold ${PLATFORM_COLORS[t.platform]}`}
            title={PLATFORM_LABELS[t.platform]}
          >
            {PLATFORM_LOGOS[t.platform]}
          </span>
          {t.special && (
            <span className="shrink-0 inline-flex items-center rounded-full bg-amber-500/20 px-1.5 py-0.5 text-xs font-semibold text-amber-400 ring-1 ring-inset ring-amber-500/40">
              ★
            </span>
          )}
          <a
            href={t.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-white hover:text-amber-400 transition-colors truncate"
          >
            {t.name}
          </a>
        </div>
      </td>
      <td className="hidden sm:table-cell px-3 py-2.5">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${FORMAT_COLORS[t.format]}`}
        >
          {FORMAT_LABELS[t.format]}
        </span>
      </td>
      <td className="hidden md:table-cell px-3 py-2.5 text-center text-xs text-slate-500">
        {t.gameVariant === "plo"
          ? "PLO"
          : t.gameVariant === "other"
            ? "Autre"
            : "NLHE"}
      </td>
      <td className="px-3 py-2.5 text-right font-semibold text-white whitespace-nowrap">
        {t.buyin === 0 ? (
          <span className="text-green-400">Gratuit</span>
        ) : (
          t.buyinRaw
        )}
      </td>
      <td className="hidden sm:table-cell px-3 py-2.5 text-right text-slate-400 font-mono text-xs whitespace-nowrap">
        {formatGuarantee(t.guarantee)}
      </td>
    </tr>
  );
}

function AluneCard({ t }: { t: UnifiedTournament }) {
  return (
    <a
      href={t.url}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 hover:bg-amber-500/10 transition-colors block"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <span className={`text-xl font-bold ${PLATFORM_COLORS[t.platform]}`}>
            {PLATFORM_LOGOS[t.platform]}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-amber-400 text-sm leading-snug line-clamp-2">
            {t.name}
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400 flex-wrap">
            <span className="font-mono font-bold text-white">{t.time}</span>
            <span>·</span>
            <span>{PLATFORM_LABELS[t.platform]}</span>
            {t.guarantee && t.guarantee > 0 && (
              <>
                <span>·</span>
                <span className="text-green-400 font-semibold">
                  {formatGuarantee(t.guarantee)} GTD
                </span>
              </>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${FORMAT_COLORS[t.format]}`}
            >
              {FORMAT_LABELS[t.format]}
            </span>
            <span className="text-xs font-bold text-white">
              {t.buyin === 0 ? "Gratuit" : t.buyinRaw}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function TournamentsDashboard({
  tournaments,
  dates,
  today,
}: {
  tournaments: UnifiedTournament[];
  dates: string[];
  today: string;
}) {
  const [selectedDate, setSelectedDate] = useState(today);
  const [specialOnly, setSpecialOnly] = useState(false);
  const [buyinFilter, setBuyinFilter] = useState<BuyinRange>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [formatFilter, setFormatFilter] = useState<string>("all");
  const [variantFilter, setVariantFilter] = useState<string>("all");
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const getParisTime = () =>
      new Date().toLocaleTimeString("fr-FR", {
        timeZone: "Europe/Paris",
        hour: "2-digit",
        minute: "2-digit",
      });
    setCurrentTime(getParisTime());
    const interval = setInterval(() => setCurrentTime(getParisTime()), 30_000);
    return () => clearInterval(interval);
  }, []);

  // Platforms present in the dataset (for dynamic filter)
  const availablePlatforms = useMemo<TPlatform[]>(() => {
    const s = new Set(tournaments.map((t) => t.platform));
    return (["winamax", "pokerstars", "unibet"] as TPlatform[]).filter((p) =>
      s.has(p)
    );
  }, [tournaments]);

  // À la une: upcoming specials in next 48h
  const alune = useMemo(() => {
    const now = new Date();
    const in48h = new Date(now.getTime() + 48 * 3600 * 1000);
    return tournaments
      .filter((t) => t.special)
      .filter((t) => {
        // Use UTC+1 as rough Paris offset (good enough for next 48h window)
        const dt = new Date(`${t.date}T${t.time}:00+01:00`);
        return dt >= now && dt <= in48h;
      })
      .slice(0, 6);
  }, [tournaments]);

  // Filtered list for selected date
  const filtered = useMemo(() => {
    return tournaments.filter((t) => {
      if (t.date !== selectedDate) return false;
      if (specialOnly && !t.special) return false;
      if (platformFilter !== "all" && t.platform !== platformFilter) return false;
      if (formatFilter !== "all" && t.format !== formatFilter) return false;
      if (variantFilter !== "all" && t.gameVariant !== variantFilter) return false;
      if (!inBuyinRange(t.buyin, buyinFilter)) return false;
      return true;
    });
  }, [
    tournaments,
    selectedDate,
    specialOnly,
    buyinFilter,
    platformFilter,
    formatFilter,
    variantFilter,
  ]);

  // Stats for selected date (before filters)
  const dayTourneys = useMemo(
    () => tournaments.filter((t) => t.date === selectedDate),
    [tournaments, selectedDate]
  );

  return (
    <div>
      {/* Date tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 pb-1 min-w-max">
          {dates.map((date) => {
            const lbl = formatDateLabel(date, today);
            const isSelected = date === selectedDate;
            const count = tournaments.filter((t) => t.date === date).length;
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center rounded-xl px-4 py-2.5 text-center transition-colors min-w-[72px] ${
                  isSelected
                    ? "bg-amber-500 text-black font-bold"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-wide">
                  {lbl.short}
                </span>
                <span className={`text-sm mt-0.5 ${isSelected ? "" : "text-slate-400"}`}>
                  {lbl.long}
                </span>
                <span className={`text-xs mt-1 font-normal ${isSelected ? "text-black/70" : "text-slate-500"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* À la une */}
      {alune.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-base font-bold text-amber-400 flex items-center gap-2">
            ⭐ Tournois à la une
            <span className="text-xs font-normal text-slate-500">— prochains événements spéciaux</span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {alune.map((t) => (
              <AluneCard key={t.id} t={t} />
            ))}
          </div>
        </section>
      )}

      {/* Stats strip */}
      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400">
        <span>
          <strong className="text-white">{dayTourneys.length}</strong> tournois
        </span>
        <span className="text-slate-700">·</span>
        <span>
          <strong className="text-amber-400">
            {dayTourneys.filter((t) => t.special).length}
          </strong>{" "}
          spéciaux
        </span>
        <span className="text-slate-700">·</span>
        <span>
          <strong className="text-green-400">
            {dayTourneys.filter((t) => t.format === "freeroll").length}
          </strong>{" "}
          freerolls
        </span>
        {filtered.length !== dayTourneys.length && (
          <>
            <span className="text-slate-700">·</span>
            <span>
              <strong className="text-white">{filtered.length}</strong> affichés
            </span>
          </>
        )}
        {currentTime && (
          <span className="ml-auto text-slate-600 text-xs">Paris {currentTime}</span>
        )}
      </div>

      {/* Filters */}
      <div className="mb-5 space-y-2.5">
        {/* Special toggle */}
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="Tous les tournois"
            active={!specialOnly}
            onClick={() => setSpecialOnly(false)}
          />
          <FilterChip
            label="★ Spéciaux uniquement"
            active={specialOnly}
            onClick={() => setSpecialOnly(true)}
          />
        </div>

        {/* Buy-in */}
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "Tous buy-ins"],
              ["freeroll", "Freeroll"],
              ["1-5", "1€–5€"],
              ["5-15", "5€–15€"],
              ["15-50", "15€–50€"],
              ["50+", "50€+"],
            ] as [BuyinRange, string][]
          ).map(([r, label]) => (
            <FilterChip
              key={r}
              label={label}
              active={buyinFilter === r}
              onClick={() => setBuyinFilter(r)}
            />
          ))}
        </div>

        {/* Platform — only show if multiple platforms */}
        {availablePlatforms.length > 1 && (
          <div className="flex flex-wrap gap-2">
            <FilterChip
              label="Toutes plateformes"
              active={platformFilter === "all"}
              onClick={() => setPlatformFilter("all")}
            />
            {availablePlatforms.map((p) => (
              <FilterChip
                key={p}
                label={PLATFORM_LABELS[p]}
                active={platformFilter === p}
                onClick={() => setPlatformFilter(p)}
              />
            ))}
          </div>
        )}

        {/* Format */}
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="Tous formats"
            active={formatFilter === "all"}
            onClick={() => setFormatFilter("all")}
          />
          {(
            [
              "standard",
              "knockout",
              "satellite",
              "turbo",
              "hyper",
              "freeroll",
            ] as TFormat[]
          ).map((f) => (
            <FilterChip
              key={f}
              label={FORMAT_LABELS[f]}
              active={formatFilter === f}
              onClick={() => setFormatFilter(f)}
            />
          ))}
        </div>

        {/* Game variant */}
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="Toutes variantes"
            active={variantFilter === "all"}
            onClick={() => setVariantFilter("all")}
          />
          <FilterChip
            label="NLHE"
            active={variantFilter === "nlhe"}
            onClick={() => setVariantFilter("nlhe")}
          />
          <FilterChip
            label="PLO / Omaha"
            active={variantFilter === "plo"}
            onClick={() => setVariantFilter("plo")}
          />
          <FilterChip
            label="Autres"
            active={variantFilter === "other"}
            onClick={() => setVariantFilter("other")}
          />
        </div>
      </div>

      {/* Tournament table */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 py-16 text-center text-slate-500">
          <p className="text-4xl mb-3">🃏</p>
          <p>Aucun tournoi pour ces critères.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-3 py-3 text-left">Heure</th>
                <th className="px-3 py-3 text-left">Tournoi</th>
                <th className="hidden sm:table-cell px-3 py-3 text-left">Format</th>
                <th className="hidden md:table-cell px-3 py-3 text-center">Variante</th>
                <th className="px-3 py-3 text-right">Buy-in</th>
                <th className="hidden sm:table-cell px-3 py-3 text-right">Garantie</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const isPast =
                  selectedDate === today &&
                  currentTime !== "" &&
                  t.time < currentTime;
                return <TournamentRow key={t.id} t={t} isPast={isPast} />;
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
