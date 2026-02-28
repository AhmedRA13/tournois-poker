import type { Metadata } from "next";
import {
  getUnifiedTournaments,
  getAvailableDates,
  getParisTodayDate,
} from "@/lib/tournaments";
import { TournamentsDashboard } from "@/components/TournamentsDashboard";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tournois Unibet Poker – Programme Daily, Weekly & Sunday Special",
  description:
    "Programme des tournois Unibet Poker en France : Daily 5K–30K, Bounty Builder, Sunday 75K et Sunday Special 100K. Freeroll quotidien inclus. Mis à jour chaque nuit.",
  alternates: {
    canonical: "https://tournois-poker.fr/tournois/unibet/",
  },
  openGraph: {
    title: "Tournois Unibet Poker – Programme Daily & Sunday",
    description:
      "Programme Unibet Poker France : Daily 5K–30K, Sunday 75K, Sunday Special 100K. Trafic doux, joueurs récréatifs.",
    url: "https://tournois-poker.fr/tournois/unibet/",
    type: "website",
  },
};

const FAQS = [
  {
    q: "Unibet Poker est-il légal en France ?",
    a: "Oui. Unibet est agréé par l'ANJ (Autorité nationale des Jeux) en France. La plateforme est 100 % légale pour les joueurs français, les fonds sont ségrégués et les transactions sont sécurisées.",
  },
  {
    q: "Qu'est-ce qui différencie Unibet des autres plateformes ?",
    a: "Unibet est reconnu pour attirer une majorité de joueurs récréatifs et occasionnels, ce qui se traduit par un trafic plus 'soft' (plus facile) que PokerStars ou Winamax. La plateforme mise sur l'accessibilité et l'expérience utilisateur pour les débutants.",
  },
  {
    q: "Comment fonctionne le Sunday Special Unibet ?",
    a: "Le Sunday Special Unibet est le tournoi phare du dimanche (buy-in 100 €, garantie 100 000 €). Il démarre à 18h00 heure de Paris et propose une structure deep-stack. C'est le tournoi le plus convoité de la semaine sur Unibet.",
  },
  {
    q: "Y a-t-il des freerolls sur Unibet ?",
    a: "Oui. Unibet propose un freeroll quotidien à 12h00 avec une garantie de 250 €. Des freerolls exclusifs sont également organisés ponctuellement pour les nouveaux inscrits et clients fidèles.",
  },
  {
    q: "Quel est le tournoi Unibet recommandé pour débuter ?",
    a: "Pour commencer sur Unibet, le Daily 5K (buy-in 5 €, garantie 5 000 €) à 18h30 est idéal. Son buy-in accessible et sa garantie correcte en font un excellent terrain d'apprentissage. Le freeroll quotidien est aussi une option sans risque.",
  },
  {
    q: "Peut-on jouer sur Unibet sans dépôt ?",
    a: "Unibet propose régulièrement des offres sans dépôt pour les nouveaux joueurs : freerolls accessibles dès l'inscription ou bonus cashback sur les premières parties. Consultez les promotions en cours sur unibet.fr pour les offres actuelles.",
  },
];

// Recurring schedule data (kept for the structured schedule table below)
const SCHEDULE = [
  {
    section: "Tournois Daily (tous les jours)",
    items: [
      { time: "12:00", name: "Unibet Freeroll Daily", buyin: "Gratuit", gtd: "250 €", fmt: "Freeroll" },
      { time: "18:30", name: "Unibet Daily 5K", buyin: "5 €", gtd: "5 000 €", fmt: "NLHE" },
      { time: "19:00", name: "Unibet Daily 10K", buyin: "10 €", gtd: "10 000 €", fmt: "NLHE" },
      { time: "20:00", name: "Unibet Daily 20K", buyin: "20 €", gtd: "20 000 €", fmt: "NLHE" },
      { time: "20:30", name: "Unibet Daily 30K Deep", buyin: "30 €", gtd: "30 000 €", fmt: "Deep Stack" },
      { time: "22:00", name: "Unibet Night Turbo", buyin: "5 €", gtd: "2 000 €", fmt: "Turbo" },
    ],
  },
  {
    section: "Hebdomadaires",
    items: [
      { time: "20:00 Mer.", name: "Unibet Weekly 50K", buyin: "50 €", gtd: "50 000 €", fmt: "NLHE" },
      { time: "20:00 Jeu.", name: "Unibet Bounty Builder", buyin: "20 €", gtd: "10 000 €", fmt: "Knockout" },
      { time: "21:00 Jeu.", name: "Unibet Turbo Thursday", buyin: "10 €", gtd: "5 000 €", fmt: "Turbo" },
      { time: "20:00 Ven.", name: "Unibet Deep Stack Friday", buyin: "30 €", gtd: "20 000 €", fmt: "Deep Stack" },
      { time: "19:00 Sam.", name: "Unibet Mini Series", buyin: "10 €", gtd: "7 500 €", fmt: "NLHE" },
    ],
  },
  {
    section: "Tournois du Dimanche",
    items: [
      { time: "17:00", name: "Unibet Sunday Mini", buyin: "11 €", gtd: "10 000 €", fmt: "NLHE" },
      { time: "17:00", name: "Unibet Sunday 75K ★", buyin: "55 €", gtd: "75 000 €", fmt: "NLHE" },
      { time: "18:00", name: "Unibet Sunday Special ★", buyin: "100 €", gtd: "100 000 €", fmt: "NLHE" },
      { time: "19:00", name: "Unibet Sunday Bounty", buyin: "30 €", gtd: "20 000 €", fmt: "Knockout" },
      { time: "22:00", name: "Unibet Late Sunday Turbo", buyin: "10 €", gtd: "5 000 €", fmt: "Turbo" },
    ],
  },
];

const FMT_COLORS: Record<string, string> = {
  Freeroll: "bg-green-900/60 text-green-300 ring-green-700",
  NLHE: "bg-slate-800 text-slate-300 ring-slate-600",
  Turbo: "bg-yellow-900/60 text-yellow-200 ring-yellow-700",
  Knockout: "bg-red-900/60 text-red-300 ring-red-700",
  "Deep Stack": "bg-purple-900/60 text-purple-300 ring-purple-700",
};

export default function UnibetPage() {
  const all = getUnifiedTournaments();
  const tournaments = all.filter((t) => t.platform === "unibet");
  const dates = getAvailableDates(tournaments);
  const today = getParisTodayDate();

  const updatedAt = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  });

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", url: "https://tournois-poker.fr" },
          {
            name: "Tournois Unibet",
            url: "https://tournois-poker.fr/tournois/unibet/",
          },
        ])}
      />
      <JsonLd data={faqSchema(FAQS)} />

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-xs text-slate-500">
          <a href="/" className="hover:text-slate-300 transition-colors">
            Accueil
          </a>
          <span className="mx-1.5">›</span>
          <span className="text-slate-400">Tournois Unibet</span>
        </nav>

        {/* H1 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl font-bold text-green-400">♣</span>
            <h1 className="text-3xl font-bold text-white">
              Tournois Unibet Poker
            </h1>
          </div>
          <p className="text-slate-400 max-w-3xl">
            Programme des tournois Unibet Poker pour les joueurs français —
            freeroll quotidien, Daily 5K–30K chaque soir,{" "}
            <strong className="text-white">Sunday 75K et Sunday Special 100K</strong>{" "}
            chaque dimanche.
          </p>
          <p className="mt-1.5 text-xs text-slate-600">
            Dernière mise à jour : {updatedAt} · Programme récurrent indicatif
            — vérifiez sur{" "}
            <a
              href="https://www.unibet.fr/poker/tournaments"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-400"
            >
              unibet.fr/poker
            </a>
          </p>
        </div>

        {/* Dashboard filtré Unibet */}
        <TournamentsDashboard
          tournaments={tournaments}
          dates={dates}
          today={today}
        />

        {/* ── Long-form content ──────────────────────────────────────── */}
        <div className="mt-14 max-w-4xl space-y-12 text-slate-300 leading-relaxed">
          {/* 1. Présentation */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Pourquoi jouer sur Unibet Poker ?
            </h2>
            <p>
              Unibet Poker, filiale du groupe Kindred, est une plateforme
              agréée ANJ reconnue pour son{" "}
              <strong className="text-white">
                trafic majoritairement récréatif
              </strong>
              . Contrairement aux grandes salles comme PokerStars ou Winamax
              qui attirent beaucoup de réguliers et semi-pros, Unibet a
              délibérément construit son écosystème pour accueillir les joueurs
              occasionnels — ce qui se traduit par des tables généralement plus
              accessibles.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: "🎯",
                  title: "Trafic doux",
                  desc: "Majorité de joueurs récréatifs. Idéal pour les profils en développement ou les joueurs cherchant un environnement moins compétitif.",
                },
                {
                  icon: "🇫🇷",
                  title: "100 % légal France",
                  desc: "Agréé ANJ. Fonds ségrégués, transactions sécurisées, gains déclarables selon la réglementation française.",
                },
                {
                  icon: "💸",
                  title: "Garanties solides",
                  desc: "Sunday Special à 100 000 € GTD, Sunday 75K, Daily 30K... Des garanties respectables pour un opérateur de taille moyenne.",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-4"
                >
                  <div className="text-2xl mb-2">{c.icon}</div>
                  <div className="font-semibold text-white text-sm mb-1">
                    {c.title}
                  </div>
                  <p className="text-xs text-slate-400">{c.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Programme récurrent */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Programme récurrent des tournois Unibet
            </h2>
            <p className="mb-5">
              Voici le calendrier hebdomadaire habituel d&apos;Unibet Poker. Les
              horaires sont en heure de Paris (CET/CEST) :
            </p>
            {SCHEDULE.map(({ section, items }) => (
              <div key={section} className="mb-6">
                <h3 className="text-base font-bold text-slate-300 mb-3">
                  {section}
                </h3>
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <th className="px-4 py-2.5 text-left">Heure</th>
                        <th className="px-4 py-2.5 text-left">Tournoi</th>
                        <th className="px-4 py-2.5 text-left hidden sm:table-cell">
                          Format
                        </th>
                        <th className="px-4 py-2.5 text-right">Buy-in</th>
                        <th className="px-4 py-2.5 text-right hidden sm:table-cell">
                          Garantie
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((t) => (
                        <tr
                          key={`${t.name}-${t.time}`}
                          className="border-b border-slate-800 last:border-0 hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="px-4 py-2.5 font-mono text-slate-300 whitespace-nowrap">
                            {t.time}
                          </td>
                          <td className="px-4 py-2.5 font-medium text-white">
                            {t.name}
                          </td>
                          <td className="hidden sm:table-cell px-4 py-2.5">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${FMT_COLORS[t.fmt] ?? "bg-slate-800 text-slate-300 ring-slate-600"}`}
                            >
                              {t.fmt}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right font-semibold">
                            {t.buyin === "Gratuit" ? (
                              <span className="text-green-400">GRATUIT</span>
                            ) : (
                              <span className="text-white">{t.buyin}</span>
                            )}
                          </td>
                          <td className="hidden sm:table-cell px-4 py-2.5 text-right font-mono text-slate-300">
                            {t.gtd}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </section>

          {/* 3. Dimanche Unibet */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Les événements du dimanche Unibet
            </h2>
            <p>
              Le dimanche est le temps fort de la semaine sur Unibet Poker.
              Avec{" "}
              <strong className="text-white">
                5 tournois distincts entre 17h et 22h
              </strong>
              , chaque niveau de joueur trouve son compte :
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex gap-3">
                <span className="text-green-400 font-bold shrink-0">▸</span>
                <span>
                  <strong className="text-white">Sunday Mini (11 €, 10K GTD)</strong>{" "}
                  — Idéal pour les joueurs avec un petit bankroll.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-400 font-bold shrink-0">▸</span>
                <span>
                  <strong className="text-white">Sunday 75K (55 €, 75K GTD)</strong>{" "}
                  — Le tournoi phare du dimanche, excellent ROI potentiel.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-400 font-bold shrink-0">★</span>
                <span>
                  <strong className="text-white">
                    Sunday Special (100 €, 100K GTD)
                  </strong>{" "}
                  — L&apos;événement premium d&apos;Unibet. Structure deep, field
                  compétitif mais abordable.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400 font-bold shrink-0">▸</span>
                <span>
                  <strong className="text-white">Sunday Bounty (30 €, 20K GTD)</strong>{" "}
                  — Format knockout pour les amateurs de jeu agressif.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-slate-400 font-bold shrink-0">▸</span>
                <span>
                  <strong className="text-white">Late Sunday Turbo (10 €, 5K GTD)</strong>{" "}
                  — Pour finir la soirée en beauté avec un format rapide.
                </span>
              </li>
            </ul>
          </section>

          {/* 4. Liens internes */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Ressources associées
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  href: "/tournois/dimanche/",
                  title: "Tournois du dimanche",
                  desc: "Programme complet des dimanches (toutes plateformes).",
                },
                {
                  href: "/tournois/bounty/",
                  title: "Tournois Bounty/KO",
                  desc: "Stratégie Bounty Builder et format knockout.",
                },
                {
                  href: "/tournois/freeroll/",
                  title: "Freerolls disponibles",
                  desc: "Tous les freerolls gratuits en ce moment.",
                },
                {
                  href: "/guide/bankroll-management-poker/",
                  title: "Guide bankroll",
                  desc: "Combien de buy-ins pour jouer sereinement.",
                },
                {
                  href: "/guide/short-stack-poker/",
                  title: "Stratégie short stack",
                  desc: "Push/fold et survie en fin de tournoi.",
                },
                {
                  href: "/guide/spin-and-go-strategie/",
                  title: "Spin & Go",
                  desc: "Format 3-max disponible sur Unibet.",
                },
              ].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-3 hover:bg-slate-800/70 hover:border-slate-700 transition-colors block group"
                >
                  <div className="text-sm font-semibold text-white group-hover:text-green-400 transition-colors">
                    {l.title}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{l.desc}</p>
                </a>
              ))}
            </div>
          </section>

          {/* 5. FAQ */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-5">
              Questions fréquentes – Unibet Poker
            </h2>
            <dl className="space-y-4">
              {FAQS.map(({ q, a }) => (
                <div
                  key={q}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-4"
                >
                  <dt className="font-semibold text-white text-sm mb-2">
                    {q}
                  </dt>
                  <dd className="text-sm text-slate-400">{a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
          <h2 className="font-bold text-green-400 text-lg">
            Rejoindre Unibet Poker
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Bonus cashback pour les nouveaux joueurs + freerolls exclusifs
            à l&apos;inscription.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://www.unibet.fr/poker/bonus"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="w-full sm:w-auto rounded-lg bg-green-500 px-6 py-2.5 font-bold text-black hover:bg-green-400 transition-colors"
            >
              Créer un compte Unibet →
            </a>
            <a
              href="/guide/bonus-poker/"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Comparer tous les bonus →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
