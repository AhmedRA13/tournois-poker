import type { Metadata } from "next";
import {
  getAllGuides,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  ALL_GUIDE_SLUGS,
  type GuideCategory,
} from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides Stratégie Poker – Apprendre à Jouer et Progresser",
  description:
    "38 guides stratégie poker rédigés par des experts : bases, GTO, MTT, bankroll, bluff, ICM, mental. Apprenez à jouer au poker et progressez rapidement.",
};

/** Slug → title for guides not yet generated */
const SLUG_TITLES: Record<string, string> = {
  "bases-poker-texas-holdem": "Les bases du Texas Hold'em",
  "regles-poker": "Règles complètes du poker",
  "mains-poker-classement": "Classement des mains au poker",
  "position-au-poker": "L'importance de la position",
  "pot-odds-poker": "Les pot odds expliqués",
  "bankroll-management-poker": "Gestion de la bankroll",
  "poker-tight-agressif": "Jouer tight-agressif (TAG)",
  "vocabulaire-poker": "Vocabulaire et glossaire",
  "bluff-au-poker": "Le bluff au poker",
  "continuation-bet": "Le continuation bet (C-bet)",
  "3-bet-poker": "Le 3-bet : guide complet",
  "squeeze-play-poker": "Le squeeze play",
  "open-raise-poker": "Open raise et sizing",
  "defense-big-blind": "Défense du big blind",
  "range-poker": "Comprendre les ranges",
  "gto-poker-introduction": "Introduction au GTO poker",
  "equity-poker": "L'equity au poker",
  "expected-value-poker": "L'expected value (EV)",
  "mtt-strategie-poker": "Stratégie MTT : guide complet",
  "deep-stack-poker": "Jouer en deep stack",
  "short-stack-poker": "Stratégie short stack",
  "icm-tournoi-poker": "L'ICM en tournoi",
  "final-table-poker": "Stratégie final table",
  "strategie-satellite-poker": "Gagner les satellites",
  "steal-resteal-tournoi": "Steal et resteal en tournoi",
  "ante-strategie-poker": "Impact des antes en tournoi",
  "bb-ante-poker": "Le big blind ante",
  "bankroll-management-mtt": "Bankroll management MTT",
  "plo-omaha-introduction": "Introduction au PLO / Omaha",
  "spin-and-go-strategie": "Stratégie Spin & Go",
  "hyper-turbo-poker": "Jouer les hyper-turbos",
  "zoom-poker-strategie": "Stratégie Zoom Poker",
  "hud-poker-online": "Utiliser un HUD au poker",
  "multi-tabling-poker": "Le multi-tabling efficace",
  "reads-sans-hud": "Prendre des reads sans HUD",
  "tells-poker-live": "Les tells au poker live",
  "prise-de-notes-poker": "Prise de notes sur les adversaires",
  "revue-session-poker": "Analyser ses sessions",
  "mindset-poker": "Le mental au poker",
};

const SLUG_CATEGORIES: Record<string, GuideCategory> = {
  "bases-poker-texas-holdem": "debutant",
  "regles-poker": "debutant",
  "mains-poker-classement": "debutant",
  "position-au-poker": "debutant",
  "pot-odds-poker": "debutant",
  "bankroll-management-poker": "debutant",
  "poker-tight-agressif": "debutant",
  "vocabulaire-poker": "debutant",
  "bluff-au-poker": "strategie",
  "continuation-bet": "strategie",
  "3-bet-poker": "strategie",
  "squeeze-play-poker": "strategie",
  "open-raise-poker": "strategie",
  "defense-big-blind": "strategie",
  "range-poker": "strategie",
  "gto-poker-introduction": "strategie",
  "equity-poker": "strategie",
  "expected-value-poker": "strategie",
  "mtt-strategie-poker": "tournoi",
  "deep-stack-poker": "tournoi",
  "short-stack-poker": "tournoi",
  "icm-tournoi-poker": "tournoi",
  "final-table-poker": "tournoi",
  "strategie-satellite-poker": "tournoi",
  "steal-resteal-tournoi": "tournoi",
  "ante-strategie-poker": "tournoi",
  "bb-ante-poker": "tournoi",
  "bankroll-management-mtt": "tournoi",
  "plo-omaha-introduction": "format",
  "spin-and-go-strategie": "format",
  "hyper-turbo-poker": "format",
  "zoom-poker-strategie": "format",
  "hud-poker-online": "online",
  "multi-tabling-poker": "online",
  "reads-sans-hud": "online",
  "tells-poker-live": "online",
  "prise-de-notes-poker": "mental",
  "revue-session-poker": "mental",
  "mindset-poker": "mental",
};

export default function GuidePage() {
  const generatedGuides = getAllGuides();
  const generatedSlugs = new Set(generatedGuides.map((g) => g.slug));

  // Build guide list: use generated data if available, fallback to static metadata
  const allGuides = ALL_GUIDE_SLUGS.map((slug) => {
    if (generatedSlugs.has(slug)) {
      return generatedGuides.find((g) => g.slug === slug)!;
    }
    return {
      slug,
      title: SLUG_TITLES[slug] ?? slug,
      category: SLUG_CATEGORIES[slug] ?? ("strategie" as GuideCategory),
      description: "",
      readTime: 0,
      updatedAt: "",
      content: "",
    };
  });

  const byCategory = CATEGORY_ORDER.map((cat) => ({
    cat,
    label: CATEGORY_LABELS[cat],
    guides: allGuides.filter((g) => g.category === cat),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Guides Stratégie Poker
        </h1>
        <p className="text-slate-400">
          {ALL_GUIDE_SLUGS.length} guides pour apprendre et progresser — des
          bases jusqu'aux concepts avancés.
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-10">
        {byCategory.map(({ cat, label, guides }) => (
          <section key={cat}>
            <h2 className="mb-4 text-lg font-bold text-amber-400">{label}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {guides.map((guide) => (
                <a
                  key={guide.slug}
                  href={`/guide/${guide.slug}/`}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-4 hover:bg-slate-800/70 hover:border-slate-700 transition-colors block group"
                >
                  <div className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors leading-snug">
                    {guide.title}
                  </div>
                  {guide.description && (
                    <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                      {guide.description}
                    </p>
                  )}
                  {guide.readTime > 0 && (
                    <div className="mt-2 text-[10px] text-slate-600">
                      {guide.readTime} min de lecture
                    </div>
                  )}
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
        <h2 className="font-bold text-amber-400 text-lg mb-2">
          Prêt à jouer ?
        </h2>
        <p className="text-sm text-slate-300 mb-4">
          Appliquez vos nouvelles connaissances avec un bonus de bienvenue.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://www.winamax.fr/poker/bonus-bienvenue"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="rounded-lg bg-amber-500 px-6 py-2.5 font-bold text-black hover:bg-amber-400 transition-colors text-sm"
          >
            Bonus Winamax 500€ →
          </a>
          <a
            href="https://www.pokerstars.fr/poker/bonus-bienvenue/"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="rounded-lg bg-red-600 px-6 py-2.5 font-bold text-white hover:bg-red-500 transition-colors text-sm"
          >
            Bonus PokerStars 600€ →
          </a>
        </div>
      </div>
    </div>
  );
}
