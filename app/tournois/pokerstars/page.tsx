import type { Metadata } from "next";
import {
  getUnifiedTournaments,
  getAvailableDates,
  getParisTodayDate,
} from "@/lib/tournaments";
import { TournamentsDashboard } from "@/components/TournamentsDashboard";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title:
    "Tournois PokerStars France – Sunday Million, SCOOP & Programme Complet",
  description:
    "Programme des tournois PokerStars France : Sunday Million 1 M$ garanti, Sunday Warm-Up 500 K$, SCOOP, satellites EPT. Filtrez par garantie et buy-in. Mis à jour chaque nuit.",
  alternates: {
    canonical: "https://tournois-poker.fr/tournois/pokerstars/",
  },
  openGraph: {
    title: "Tournois PokerStars France – Sunday Million & SCOOP",
    description:
      "Programme complet PokerStars France : Sunday Million 1 M$, Warm-Up, SCOOP. Les plus grandes garanties du poker en ligne.",
    url: "https://tournois-poker.fr/tournois/pokerstars/",
    type: "website",
  },
};

const FAQS = [
  {
    q: "Le Sunday Million est-il disponible pour les joueurs français ?",
    a: "Oui. PokerStars France (domaine .fr) est agréé par l'ANJ et propose bien le Sunday Million aux joueurs français. Le buy-in est de 215 $ (environ 200 €) avec une garantie de 1 000 000 $ chaque dimanche. La registration ouvre plusieurs jours avant le tournoi.",
  },
  {
    q: "Quelle est la différence entre Sunday Million et Sunday Warm-Up ?",
    a: "Le Sunday Million est le plus grand tournoi hebdomadaire au monde (215 $, 1 M$ GTD). Le Sunday Warm-Up est une alternative plus accessible (109 $, ~500 K$ GTD) avec un format légèrement plus rapide. Les deux démarrent le dimanche en soirée (heure française).",
  },
  {
    q: "Qu'est-ce que le SCOOP PokerStars ?",
    a: "Le SCOOP (Spring Championship of Online Poker) est la grande série printanière de PokerStars. Elle propose des centaines de tournois répartis en trois catégories de buy-in (Low/Medium/High), avec des garanties totales souvent supérieures à 100 M$. Il existe aussi le WCOOP (été) et le TCOOP (hiver).",
  },
  {
    q: "Comment fonctionnent les Progressive KO (PKO) sur PokerStars ?",
    a: "Dans un tournoi Progressive KO, chaque joueur porte une prime sur sa tête. Quand vous éliminez un joueur, vous recevez la moitié de sa prime — l'autre moitié s'ajoute à votre propre bounty. Plus vous éliminez de joueurs, plus votre tête vaut cher. La stratégie optimale implique d'appeler plus large contre des joueurs à haute prime.",
  },
  {
    q: "PokerStars est-il légal en France ?",
    a: "Oui. PokerStars opère en France sous la licence ANJ (ex-ARJEL) via le domaine pokerstars.fr. La plateforme est strictement réglementée, les fonds des joueurs sont ségrégués et les gains sont imposables selon la législation française.",
  },
  {
    q: "Quel buy-in minimum sur PokerStars France ?",
    a: "Les micro-stakes débutent à 0,55 € (50 cents + 5 cents de rake). Les freerolls sont disponibles pour les nouveaux clients et clients actifs. Pour accéder à la majorité des tournois daily, comptez 5 €–11 €.",
  },
];

export default function PokerStarsPage() {
  const all = getUnifiedTournaments();
  const tournaments = all.filter((t) => t.platform === "pokerstars");
  const dates = getAvailableDates(tournaments);
  const today = getParisTodayDate();

  const todayTourneys = tournaments.filter((t) => t.date === today);
  const gtdCount = todayTourneys.filter(
    (t) => t.guarantee && t.guarantee > 0
  ).length;
  const pkoCount = todayTourneys.filter(
    (t) => t.format === "knockout"
  ).length;

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
            name: "Tournois PokerStars",
            url: "https://tournois-poker.fr/tournois/pokerstars/",
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
          <span className="text-slate-400">Tournois PokerStars</span>
        </nav>

        {/* H1 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-red-400 text-3xl font-bold">★</span>
            <h1 className="text-3xl font-bold text-white">
              Tournois PokerStars France
            </h1>
          </div>
          <p className="text-slate-400 max-w-3xl">
            Programme complet des tournois PokerStars France —{" "}
            <strong className="text-white">
              {todayTourneys.length} tournois aujourd&apos;hui
            </strong>
            , dont {gtdCount} avec prize pool garanti
            {pkoCount > 0 && ` et ${pkoCount} Progressive KO`}.
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Dernière mise à jour : {updatedAt}
          </p>
        </div>

        {/* Dashboard */}
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
              PokerStars : les plus grandes garanties du poker en ligne
            </h2>
            <p>
              PokerStars est{" "}
              <strong className="text-white">
                la plus grande salle de poker en ligne au monde
              </strong>{" "}
              en termes de trafic de tournois. La version française
              (pokerstars.fr), agréée ANJ, propose chaque semaine plusieurs
              milliers de tournois incluant les plus grandes garanties du marché
              : le{" "}
              <strong className="text-white">Sunday Million</strong> (1 M$ GTD
              chaque dimanche), le{" "}
              <strong className="text-white">Sunday Warm-Up</strong> (≈ 500 K$
              GTD) et les grandes séries mondiales SCOOP, WCOOP et TCOOP.
            </p>
            <p className="mt-3">
              La plateforme est particulièrement reconnue pour la{" "}
              <strong className="text-white">qualité de ses structures</strong>{" "}
              (blindes lentes, starting stacks profonds) et la richesse de ses
              formats, des micro-stakes aux high-rollers. Les Progressive
              Knockout (PKO) sont un format signature de PokerStars, rendu
              populaire dans le monde entier.
            </p>
          </section>

          {/* 2. Grands tournois */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Les grands tournois hebdomadaires PokerStars
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  name: "Sunday Million",
                  bi: "215 $",
                  gtd: "1 000 000 $",
                  desc: "Le plus grand tournoi hebdomadaire au monde. Chaque dimanche depuis 2006, sans interruption.",
                  color: "border-red-500/40 bg-red-500/5",
                },
                {
                  name: "Sunday Warm-Up",
                  bi: "109 $",
                  gtd: "~500 000 $",
                  desc: "Le tournoi du dimanche accessible. Structure profonde, garantie élevée, field plus petit que le Million.",
                  color: "border-red-500/20 bg-red-500/5",
                },
                {
                  name: "Sunday Storm",
                  bi: "11 $",
                  gtd: "~200 000 $",
                  desc: "La version accessible du dimanche. Perfect pour les joueurs avec un petit bankroll qui veulent les grosses ambiances.",
                  color: "border-orange-500/30 bg-orange-500/5",
                },
                {
                  name: "Night Fight (PKO)",
                  bi: "22 $",
                  gtd: "Variable",
                  desc: "Progressive Knockout quotidien. L'un des tournois les plus populaires de la semaine pour son format bounty dynamique.",
                  color: "border-purple-500/30 bg-purple-500/5",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className={`rounded-xl border p-4 ${t.color}`}
                >
                  <div className="font-bold text-white mb-1">{t.name}</div>
                  <div className="text-xs text-slate-500 mb-2">
                    Buy-in : {t.bi} · GTD : {t.gtd}
                  </div>
                  <p className="text-sm text-slate-400">{t.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Séries */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              SCOOP, WCOOP, TCOOP : les séries mondiales PokerStars
            </h2>
            <p>
              PokerStars organise trois grandes séries annuelles qui dominent le
              calendrier du poker en ligne :
            </p>
            <dl className="mt-4 space-y-3">
              {[
                {
                  f: "SCOOP (Spring Championship of Online Poker)",
                  d: "La série printanière (mars–mai). Des centaines de tournois Low / Medium / High avec des garanties totales dépassant souvent 100 M$. C'est la plus attendue de l'année.",
                },
                {
                  f: "WCOOP (World Championship of Online Poker)",
                  d: "La série d'été (août–septembre). Souvent considérée comme les « World Series » du poker en ligne. Buy-ins plus élevés, prize pools record.",
                },
                {
                  f: "TCOOP (Turbo Championship of Online Poker)",
                  d: "La série turbo hivernale (novembre–décembre). Formats accélérés pour des sessions courtes avec des garanties significatives.",
                },
              ].map(({ f, d }) => (
                <div
                  key={f}
                  className="rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3"
                >
                  <dt className="font-semibold text-red-400 text-sm">{f}</dt>
                  <dd className="text-sm text-slate-400 mt-1">{d}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* 4. Formats */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Formats disponibles sur PokerStars France
            </h2>
            <p>
              PokerStars propose une gamme de formats particulièrement large,
              dont certains sont des exclusivités ou des innovations de la
              plateforme :
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                {
                  f: "Standard NLHE",
                  d: "Texas Hold'em No-Limit classique. Des structures lentes aux hyper-turbos.",
                },
                {
                  f: "Progressive KO (PKO)",
                  d: "Le format signature de PokerStars. Les primes s'accumulent sur les têtes des joueurs actifs.",
                },
                {
                  f: "Zoom Poker",
                  d: "Fast-fold : on passe à une nouvelle table dès que l'on fold. Volume 4× supérieur au format classique.",
                },
                {
                  f: "Satellite / Steps",
                  d: "Gagnez votre ticket pour des tournois live (EPT, PSPC) ou online à prix réduit.",
                },
                {
                  f: "PLO / Omaha",
                  d: "Pot-Limit Omaha, de plus en plus populaire. Des garanties significatives le dimanche.",
                },
              ].map(({ f, d }) => (
                <li key={f} className="flex gap-3">
                  <span className="text-red-400 font-bold shrink-0">▸</span>
                  <span>
                    <strong className="text-white">{f}</strong> — {d}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* 5. Stratégie */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Stratégie pour les tournois PokerStars
            </h2>
            <div className="space-y-3">
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                <div className="font-semibold text-red-400 text-sm mb-1">
                  🏆 ICM aux final tables
                </div>
                <p className="text-sm">
                  Les tournois PokerStars ont souvent des prize pools très
                  concentrés en haut du tableau. Maîtriser l&apos;ICM (Independent
                  Chip Model) est essentiel pour prendre les bonnes décisions
                  en bulle et aux dernières places payées.
                </p>
                <a
                  href="/guide/icm-tournoi-poker/"
                  className="text-xs text-red-400 hover:text-red-300 mt-2 inline-block transition-colors"
                >
                  → Guide ICM en tournoi
                </a>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                <div className="font-semibold text-red-400 text-sm mb-1">
                  💥 Stratégie PKO (Progressive KO)
                </div>
                <p className="text-sm">
                  Dans les PKO, la valeur d&apos;une élimination dépend du bounty
                  de la cible. Vous devez parfois appeler des shoves avec des
                  mains marginales si la prime adverse est suffisamment haute.
                  Ne jamais ignorer la valeur de bounty dans vos calculs.
                </p>
                <a
                  href="/guide/final-table-poker/"
                  className="text-xs text-red-400 hover:text-red-300 mt-2 inline-block transition-colors"
                >
                  → Guide stratégie final table
                </a>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                <div className="font-semibold text-red-400 text-sm mb-1">
                  📊 Volume et multi-tabling
                </div>
                <p className="text-sm">
                  PokerStars est la plateforme idéale pour le multi-tabling
                  grâce à son interface ergonomique. Commencez par 2–4 tables
                  et augmentez progressivement une fois votre stratégie
                  automatisée.
                </p>
                <a
                  href="/guide/mtt-strategie-poker/"
                  className="text-xs text-red-400 hover:text-red-300 mt-2 inline-block transition-colors"
                >
                  → Stratégie MTT complète
                </a>
              </div>
            </div>
          </section>

          {/* 6. Liens internes */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Ressources et pages associées
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  href: "/tournois/dimanche/",
                  title: "Tournois du dimanche",
                  desc: "Sunday Million, Warm-Up et les gros events hebdo.",
                },
                {
                  href: "/tournois/bounty/",
                  title: "Tournois Bounty/PKO",
                  desc: "Stratégie et programme des tournois knockout.",
                },
                {
                  href: "/tournois/winamax/",
                  title: "Tournois Winamax",
                  desc: "L'alternative française n°1 à PokerStars.",
                },
                {
                  href: "/guide/icm-tournoi-poker/",
                  title: "Guide ICM",
                  desc: "Maîtriser l'ICM aux bulles et final tables.",
                },
                {
                  href: "/guide/final-table-poker/",
                  title: "Stratégie final table",
                  desc: "Comment jouer les dernières places payées.",
                },
                {
                  href: "/guide/mtt-strategie-poker/",
                  title: "Stratégie MTT",
                  desc: "Guide complet pour les tournois multi-tables.",
                },
                {
                  href: "/guide/strategie/",
                  title: "Guides stratégie avancée",
                  desc: "ICM, GTO, hand reading, PKO — 20 guides pour monter de niveau.",
                },
                {
                  href: "/tournois/buy-in/plus-de-100-euros/",
                  title: "Tournois 100€+",
                  desc: "Sunday Million, SCOOP High et high-rollers.",
                },
              ].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-3 hover:bg-slate-800/70 hover:border-slate-700 transition-colors block group"
                >
                  <div className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors">
                    {l.title}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{l.desc}</p>
                </a>
              ))}
            </div>
          </section>

          {/* 7. FAQ */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-5">
              Questions fréquentes – PokerStars France
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
        <div className="mt-10 rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <h2 className="font-bold text-red-400 text-lg">
            Rejoindre PokerStars France
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Bonus de bienvenue jusqu&apos;à{" "}
            <strong className="text-white">600 €</strong> + accès au Sunday
            Million et à toutes les séries mondiales.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://www.pokerstars.fr/poker/bonus-bienvenue/"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="w-full sm:w-auto rounded-lg bg-red-600 px-6 py-2.5 font-bold text-white hover:bg-red-500 transition-colors"
            >
              Obtenir le bonus PokerStars 600 € →
            </a>
            <a
              href="/guide/bonus-poker/"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Comparer tous les bonus →
            </a>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 justify-center text-sm">
          <a href="/comparer-rooms/" className="text-amber-400 hover:text-amber-300 transition-colors">
            🏆 Comparateur PokerStars vs Winamax vs Unibet →
          </a>
          <a href="/comparer/winamax-vs-pokerstars/" className="text-slate-400 hover:text-slate-300 transition-colors">
            ⚔️ PokerStars vs Winamax
          </a>
        </div>
      </div>
    </>
  );
}
