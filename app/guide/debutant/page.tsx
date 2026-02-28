import type { Metadata } from "next";
import {
  DEBUTANT_SLUGS,
  DEBUTANT_TITLES,
  DEBUTANT_DESCRIPTIONS,
  getAllDebutantGuides,
} from "@/lib/debutant";
import { JsonLd, breadcrumbSchema, BASE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Guide Poker Débutant – Tout Apprendre du Poker en Ligne",
  description:
    "15 guides poker pour débutants : comment commencer, choisir sa room, gérer sa bankroll, comprendre les MTT et éviter les erreurs classiques.",
  alternates: {
    canonical: `${BASE_URL}/guide/debutant/`,
  },
  openGraph: {
    title: "Guide Poker Débutant – Tout Apprendre du Poker en Ligne",
    description:
      "15 guides pour débuter le poker en ligne : règles, bankroll, choix de la room, MTT, variance et erreurs à éviter.",
    url: `${BASE_URL}/guide/debutant/`,
    type: "website",
  },
};

export default function DebutantIndexPage() {
  const generated = getAllDebutantGuides();
  const generatedBySlug = Object.fromEntries(generated.map((g) => [g.slug, g]));

  const breadcrumb = breadcrumbSchema([
    { name: "Accueil", url: BASE_URL + "/" },
    { name: "Guides", url: BASE_URL + "/guide/" },
    { name: "Pour débutants", url: BASE_URL + "/guide/debutant/" },
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
        <span className="text-slate-400">Pour débutants</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🃏</span>
          <h1 className="text-3xl font-bold text-white">
            Guides Poker pour Débutants
          </h1>
        </div>
        <p className="text-slate-400 max-w-2xl leading-relaxed">
          Vous débutez au poker en ligne ? Ces 15 guides couvrent tout ce que vous devez savoir pour commencer du bon pied : choisir votre room, gérer votre bankroll, comprendre les tournois MTT et éviter les erreurs qui coûtent de l&apos;argent.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/30 px-4 py-2 text-sm text-amber-400">
          <span>📥</span>
          <span>Téléchargez aussi notre guide PDF gratuit :</span>
          <a
            href="/guides/erreurs-mtt.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline hover:text-amber-300 transition-colors"
          >
            Les 10 erreurs en MTT →
          </a>
        </div>
      </div>

      {/* Guide grid */}
      <div className="grid gap-4">
        {DEBUTANT_SLUGS.map((slug, i) => {
          const guide = generatedBySlug[slug];
          const title = guide?.title ?? DEBUTANT_TITLES[slug];
          const desc = guide?.description ?? DEBUTANT_DESCRIPTIONS[slug];

          return (
            <a
              key={slug}
              href={`/guide/debutant/${slug}/`}
              className="group flex gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5 hover:bg-slate-800/70 hover:border-slate-700 transition-all"
            >
              <span className="text-2xl font-bold text-slate-700 shrink-0 w-8 text-right leading-none mt-0.5 group-hover:text-slate-600 transition-colors">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h2 className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors leading-snug">
                  {title}
                </h2>
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

      {/* CTA */}
      <div className="mt-12 rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
        <h2 className="font-bold text-amber-400 text-lg mb-2">
          Prêt à jouer vos premiers tournois ?
        </h2>
        <p className="text-slate-300 text-sm mb-5">
          Winamax et PokerStars offrent des bonus de bienvenue pour les nouveaux joueurs — jusqu&apos;à 500€ au total.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://www.winamax.fr/poker/bonus-bienvenue"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="rounded-lg bg-amber-500 px-6 py-2.5 font-bold text-black hover:bg-amber-400 transition-colors text-sm"
          >
            Bonus Winamax →
          </a>
          <a
            href="https://www.pokerstars.fr/poker/bonus-bienvenue/"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="rounded-lg bg-red-600 px-6 py-2.5 font-bold text-white hover:bg-red-500 transition-colors text-sm"
          >
            Bonus PokerStars →
          </a>
        </div>
      </div>

      {/* Other guide categories */}
      <div className="mt-10 border-t border-slate-800 pt-8">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4">
          Autres guides
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/guide/", label: "Tous les guides" },
            { href: "/guide/bonus-poker/", label: "Bonus de bienvenue" },
            { href: "/tournois/winamax/", label: "Programme Winamax" },
            { href: "/tournois/pokerstars/", label: "Programme PokerStars" },
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
