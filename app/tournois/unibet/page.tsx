import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tournois Unibet Poker – Programme Daily, Weekly et Sunday",
  description:
    "Programme des tournois Unibet Poker en France : Daily 5K, 10K, 20K, Sunday Special et tournois hebdomadaires. Niveaux, garanties et liens directs.",
};

// ── Unibet recurring tournament schedule ──────────────────────────────────
// Source: programme récurrent type (données vérifiées manuellement)

interface UnibetTournament {
  name: string;
  time: string;         // "HH:mm" Paris time
  buyin: string;        // "5€", "Gratuit", etc.
  guarantee: string;    // "5 000€", "—"
  frequency: "daily" | "weekly" | "sunday" | "special";
  day?: string;         // e.g. "Dimanche", "Mardi"
  format: string;
  note?: string;
}

const TOURNAMENTS: UnibetTournament[] = [
  // ── Daily ────────────────────────────────────────────────────────────────
  { name: "Unibet Daily 5K",       time: "18:30", buyin: "5€",    guarantee: "5 000€",  frequency: "daily",  format: "NLHE" },
  { name: "Unibet Daily 10K",      time: "19:00", buyin: "10€",   guarantee: "10 000€", frequency: "daily",  format: "NLHE" },
  { name: "Unibet Daily 20K",      time: "20:00", buyin: "20€",   guarantee: "20 000€", frequency: "daily",  format: "NLHE" },
  { name: "Unibet Daily 30K",      time: "20:30", buyin: "30€",   guarantee: "30 000€", frequency: "daily",  format: "NLHE", note: "Deep Stack" },
  { name: "Unibet Night Turbo",    time: "22:00", buyin: "5€",    guarantee: "2 000€",  frequency: "daily",  format: "Turbo" },
  { name: "Unibet Freeroll Daily", time: "12:00", buyin: "Gratuit", guarantee: "250€",  frequency: "daily",  format: "Freeroll" },
  // ── Weekly ───────────────────────────────────────────────────────────────
  { name: "Unibet Weekly 50K",     time: "20:00", buyin: "50€",   guarantee: "50 000€", frequency: "weekly", format: "NLHE",   day: "Mercredi" },
  { name: "Unibet Bounty Builder", time: "20:00", buyin: "20€",   guarantee: "10 000€", frequency: "weekly", format: "Knockout", day: "Jeudi" },
  { name: "Unibet Turbo Thursday", time: "21:00", buyin: "10€",   guarantee: "5 000€",  frequency: "weekly", format: "Turbo",   day: "Jeudi" },
  { name: "Unibet Deep Stack",     time: "20:00", buyin: "30€",   guarantee: "20 000€", frequency: "weekly", format: "Deep Stack", day: "Vendredi" },
  { name: "Unibet Mini Series",    time: "19:00", buyin: "10€",   guarantee: "7 500€",  frequency: "weekly", format: "NLHE",   day: "Samedi" },
  // ── Sunday ───────────────────────────────────────────────────────────────
  { name: "Unibet Sunday 75K",     time: "17:00", buyin: "55€",   guarantee: "75 000€", frequency: "sunday", format: "NLHE",   day: "Dimanche", note: "Tournoi phare du dimanche" },
  { name: "Unibet Sunday Special", time: "18:00", buyin: "100€",  guarantee: "100 000€", frequency: "sunday", format: "NLHE",  day: "Dimanche", note: "Event premium ★" },
  { name: "Unibet Sunday Mini",    time: "17:00", buyin: "11€",   guarantee: "10 000€", frequency: "sunday", format: "NLHE",   day: "Dimanche" },
  { name: "Unibet Sunday Bounty",  time: "19:00", buyin: "30€",   guarantee: "20 000€", frequency: "sunday", format: "Knockout", day: "Dimanche" },
  { name: "Unibet Late Sunday",    time: "22:00", buyin: "10€",   guarantee: "5 000€",  frequency: "sunday", format: "Turbo",   day: "Dimanche" },
];

const FREQ_LABELS = {
  daily: "Tous les jours",
  weekly: "Hebdomadaire",
  sunday: "Dimanche",
  special: "Spécial",
};

const FREQ_COLORS = {
  daily: "bg-slate-700 text-slate-300",
  weekly: "bg-blue-900/60 text-blue-300",
  sunday: "bg-amber-900/60 text-amber-300",
  special: "bg-red-900/60 text-red-300",
};

const FORMAT_COLORS: Record<string, string> = {
  NLHE: "bg-slate-800 text-slate-300 ring-slate-600",
  Turbo: "bg-yellow-900/60 text-yellow-300 ring-yellow-700",
  Knockout: "bg-red-900/60 text-red-300 ring-red-700",
  Freeroll: "bg-green-900/60 text-green-300 ring-green-700",
  "Deep Stack": "bg-purple-900/60 text-purple-300 ring-purple-700",
};

export default function UnibetPage() {
  const daily = TOURNAMENTS.filter((t) => t.frequency === "daily");
  const weekly = TOURNAMENTS.filter((t) => t.frequency === "weekly");
  const sunday = TOURNAMENTS.filter((t) => t.frequency === "sunday");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl font-bold text-green-400">♣</span>
          <h1 className="text-3xl font-bold text-white">Tournois Unibet Poker</h1>
        </div>
        <p className="text-slate-400 max-w-2xl">
          Programme des tournois Unibet Poker disponibles pour les joueurs français.
          Daily, hebdomadaires, et grands événements du dimanche.
        </p>
        <div className="mt-3 rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2 inline-flex items-center gap-2">
          <span className="text-amber-400 text-sm">⚠</span>
          <span className="text-xs text-slate-400">
            Programme récurrent indicatif — horaires et garanties peuvent varier. Vérifiez sur{" "}
            <a href="https://www.unibet.fr/poker/tournaments" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
              unibet.fr/poker
            </a>
            .
          </span>
        </div>
      </div>

      {/* Affiliate CTA */}
      <div className="mb-8 rounded-xl border border-green-500/30 bg-green-500/10 p-5">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-bold text-green-400">Bonus de bienvenue Unibet</h2>
            <p className="mt-1 text-sm text-slate-300">
              Obtenez un <strong className="text-white">bonus cashback</strong> sur vos premières parties + accès aux freerolls exclusifs nouveaux joueurs.
            </p>
          </div>
          <a
            href="https://www.unibet.fr/poker/bonus"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="shrink-0 rounded-lg bg-green-500 px-6 py-2.5 font-bold text-black hover:bg-green-400 transition-colors"
          >
            Ouvrir un compte →
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-center">
          <div className="text-2xl font-bold text-white">{daily.length}</div>
          <div className="text-xs text-slate-400 mt-1">Tournois daily</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{weekly.length}</div>
          <div className="text-xs text-slate-400 mt-1">Events hebdo</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-center">
          <div className="text-2xl font-bold text-amber-400">{sunday.length}</div>
          <div className="text-xs text-slate-400 mt-1">Tournois du dimanche</div>
        </div>
      </div>

      {/* Tournament sections */}
      {[
        { label: "Tournois Daily", icon: "📅", items: daily },
        { label: "Tournois Hebdomadaires", icon: "📆", items: weekly },
        { label: "Tournois du Dimanche", icon: "🏆", items: sunday },
      ].map(({ label, icon, items }) => (
        <section key={label} className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
            <span>{icon}</span>
            {label}
          </h2>
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 text-left">Heure</th>
                  <th className="px-4 py-3 text-left">Tournoi</th>
                  <th className="px-4 py-3 text-left">Format</th>
                  <th className="px-4 py-3 text-left">Fréquence</th>
                  <th className="px-4 py-3 text-right">Buy-in</th>
                  <th className="px-4 py-3 text-right">Garantie</th>
                  <th className="px-4 py-3 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((t) => (
                  <tr
                    key={`${t.name}-${t.time}`}
                    className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors last:border-0"
                  >
                    <td className="px-4 py-3 font-mono text-sm text-slate-300">{t.time}</td>
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-medium text-white">{t.name}</span>
                        {t.note && (
                          <span className="ml-2 text-xs text-amber-400">{t.note}</span>
                        )}
                      </div>
                      {t.day && (
                        <div className="text-xs text-slate-500 mt-0.5">{t.day}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                          FORMAT_COLORS[t.format] ?? "bg-slate-800 text-slate-300 ring-slate-600"
                        }`}
                      >
                        {t.format}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${FREQ_COLORS[t.frequency]}`}>
                        {t.day ?? FREQ_LABELS[t.frequency]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-white">
                      {t.buyin === "Gratuit" ? (
                        <span className="text-green-400">GRATUIT</span>
                      ) : (
                        t.buyin
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-slate-300">
                      {t.guarantee}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <a
                        href="https://www.unibet.fr/poker/tournaments"
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="rounded-md bg-green-600 px-3 py-1 text-xs font-bold text-white hover:bg-green-500 transition-colors"
                      >
                        Jouer →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      {/* Guide section */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-bold text-white mb-3">Pourquoi jouer sur Unibet Poker ?</h2>
        <div className="grid gap-4 sm:grid-cols-3 text-sm text-slate-300">
          <div>
            <div className="font-semibold text-white mb-1">🎯 Trafic doux</div>
            <p>Unibet est réputé pour attirer des joueurs récréatifs — idéal pour les débutants et réguliers.</p>
          </div>
          <div>
            <div className="font-semibold text-white mb-1">🇫🇷 100% légal France</div>
            <p>Unibet est agréé ARJEL/ANJ en France. Vos fonds sont protégés et les gains déclarables.</p>
          </div>
          <div>
            <div className="font-semibold text-white mb-1">💰 Bonus bienvenue</div>
            <p>Cashback sur les premières mises + freerolls exclusifs pour les nouveaux comptes.</p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <a
            href="https://www.unibet.fr/poker/bonus"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-block rounded-lg bg-green-500 px-8 py-2.5 font-bold text-black hover:bg-green-400 transition-colors"
          >
            Créer un compte Unibet et obtenir le bonus →
          </a>
        </div>
      </div>
    </div>
  );
}
