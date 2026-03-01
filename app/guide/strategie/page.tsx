import type { Metadata } from "next";
import {
  STRATEGIE_SLUGS,
  STRATEGIE_TITLES,
  STRATEGIE_DESCRIPTIONS,
  getAllStrategieGuides,
} from "@/lib/strategie";
import { JsonLd, breadcrumbSchema, BASE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Guides Stratégie Poker Avancée – GTO, ICM, Ranges MTT",
  description:
    "20 guides de stratégie poker avancée : ranges par position, ICM, GTO vs exploitant, c-bet, 3-bet, short stack, PKO et plus. Pour joueurs réguliers MTT.",
  alternates: {
    canonical: `${BASE_URL}/guide/strategie/`,
  },
  openGraph: {
    title: "Guides Stratégie Poker Avancée – GTO, ICM, Ranges MTT",
    description:
      "20 guides pour progresser en MTT : ICM, GTO, hand reading, bankroll management avancé, stratégie PKO, satellites et plus.",
    url: `${BASE_URL}/guide/strategie/`,
    type: "website",
  },
};

const CATEGORIES = [
  {
    label: "Préflop & Ranges",
    icon: "🃏",
    slugs: [
      "range-open-par-position",
      "defendre-big-blind",
      "strategie-3bet-preflop",
      "strategie-4bet-5bet",
      "squeeze-play",
    ],
  },
  {
    label: "Jeu post-flop",
    icon: "🎯",
    slugs: [
      "c-bet-turn-river",
      "pot-odds-implied-odds",
      "equity-expected-value",
      "hand-reading-ranges",
      "gto-vs-exploitant",
    ],
  },
  {
    label: "ICM & Situations MTT",
    icon: "🏆",
    slugs: [
      "strategie-icm-bulle",
      "strategie-icm-table-finale",
      "jouer-short-stack-mtt",
      "jouer-chipleader-table",
      "strategie-heads-up",
    ],
  },
  {
    label: "Formats spéciaux & Gestion",
    icon: "⚡",
    slugs: [
      "strategie-pko-bounty",
      "strategie-expresso-jackpot",
      "strategie-satellites-icm",
      "strategie-plo-bases",
      "bankroll-management-avance",
    ],
  },
];

export default function StrategieIndexPage() {
  const generated = getAllStrategieGuides();
  const generatedBySlug = Object.fromEntries(generated.map((g) => [g.slug, g]));

  const breadcrumb = breadcrumbSchema([
    { name: "Accueil", url: BASE_URL + "/" },
    { name: "Guides", url: BASE_URL + "/guide/" },
    { name: "Stratégie avancée", url: BASE_URL + "/guide/strategie/" },
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={breadcrumb} />

      {/* Breadcrumb */}
      <nav className="mb-6 text-xs text-slate-500" aria-label="Fil d'Ariane">
        <a href="/" className="hover:text-slate-300 transition-colors">Accueil</a>
        <span className="mx-2">/</span>
        <a href="/guide/" className="hover:text-slate-300 transition-colors">Guides</a>
        <span className="mx-2">/</span>
        <span className="text-slate-400">Stratégie avancée</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">♟️</span>
          <h1 className="text-3xl font-bold text-white">
            Stratégie Poker Avancée
          </h1>
        </div>
        <p className="text-slate-400 max-w-2xl leading-relaxed">
          20 guides techniques pour passer au niveau supérieur en MTT. Ranges préflop, ICM, GTO, hand reading, short stack, PKO — les concepts qui font la différence entre les joueurs récréatifs et les réguliers profitables.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="/guide/debutant/"
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 px-4 py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Guides débutant
          </a>
          <a
            href="/guides/erreurs-mtt.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-4 py-2 text-sm text-amber-400 hover:text-amber-300 transition-colors"
          >
            📥 Guide PDF gratuit : 10 erreurs MTT
          </a>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-10">
        {CATEGORIES.map((cat) => (
          <div key={cat.label}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">{cat.icon}</span>
              <h2 className="text-lg font-bold text-white">{cat.label}</h2>
            </div>
            <div className="grid gap-3">
              {cat.slugs.map((slug) => {
                const guide = generatedBySlug[slug];
                const title = guide?.title ?? STRATEGIE_TITLES[slug];
                const desc = guide?.description ?? STRATEGIE_DESCRIPTIONS[slug];
                const num = STRATEGIE_SLUGS.indexOf(slug as never) + 1;

                return (
                  <a
                    key={slug}
                    href={`/guide/strategie/${slug}/`}
                    className="group flex gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5 hover:bg-slate-800/70 hover:border-slate-700 transition-all"
                  >
                    <span className="text-2xl font-bold text-slate-700 shrink-0 w-8 text-right leading-none mt-0.5 group-hover:text-slate-600 transition-colors">
                      {String(num).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors leading-snug">
                        {title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {desc}
                      </p>
                      <span className="mt-2 inline-block text-xs text-amber-500 font-medium group-hover:text-amber-400">
                        Lire le guide →
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
        <h2 className="font-bold text-amber-400 text-lg mb-2">
          Mettre en pratique vos nouvelles connaissances ?
        </h2>
        <p className="text-slate-300 text-sm mb-5">
          Retrouvez les tournois MTT du moment sur Winamax et PokerStars — des micro-stakes aux high-rollers.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/tournois/winamax/"
            className="rounded-lg bg-amber-500 px-6 py-2.5 font-bold text-black hover:bg-amber-400 transition-colors text-sm"
          >
            Programme Winamax →
          </a>
          <a
            href="/tournois/pokerstars/"
            className="rounded-lg bg-red-600 px-6 py-2.5 font-bold text-white hover:bg-red-500 transition-colors text-sm"
          >
            Programme PokerStars →
          </a>
        </div>
      </div>

      {/* Other guide categories */}
      <div className="mt-10 border-t border-slate-800 pt-8">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4">
          Autres ressources
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/guide/", label: "Tous les guides" },
            { href: "/guide/debutant/", label: "Guides débutant" },
            { href: "/guide/bonus-poker/", label: "Bonus de bienvenue" },
            { href: "/tournois/bounty/", label: "Tournois bounty" },
            { href: "/tournois/dimanche/", label: "Tournois du dimanche" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
