import type { Metadata } from "next";
import {
  getUnifiedTournaments,
  getAvailableDates,
  getParisTodayDate,
} from "@/lib/tournaments";
import { TournamentsDashboard } from "@/components/TournamentsDashboard";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tournois Winamax Poker – Programme Complet, Freerolls & Séries",
  description:
    "Programme complet des tournois Winamax en France : freerolls gratuits, bounty KO, SISMIX, SMASK. Plus de 1 000 tournois par semaine. Filtrez par buy-in et format. Mis à jour chaque nuit.",
  alternates: {
    canonical: "https://tournois-poker.fr/tournois/winamax/",
  },
  openGraph: {
    title: "Tournois Winamax Poker – Programme Complet & Séries",
    description:
      "Tous les tournois Winamax en France : freerolls, KO, SISMIX, SMASK. Mis à jour chaque nuit.",
    url: "https://tournois-poker.fr/tournois/winamax/",
    type: "website",
  },
};

const FAQS = [
  {
    q: "Winamax est-il légal en France ?",
    a: "Oui. Winamax est agréé par l'ANJ (Autorité nationale des Jeux), l'autorité de régulation française. La plateforme est 100 % légale pour les joueurs résidant en France et les fonds des joueurs sont séparés des fonds propres de l'opérateur.",
  },
  {
    q: "Comment s'inscrire à un tournoi Winamax ?",
    a: "Ouvrez le lobby Winamax Poker, trouvez le tournoi dans le calendrier, cliquez sur 'S'inscrire' et validez le buy-in depuis votre solde. La late registration est disponible sur la plupart des tournois (jusqu'à fin du niveau 6 ou 9 selon la structure).",
  },
  {
    q: "Quelle est la différence entre un freeroll et un tournoi payant ?",
    a: "Un freeroll est entièrement gratuit — aucun buy-in requis — mais les gains (argent réel ou tickets de tournoi) sont bien réels. Les tournois payants demandent un buy-in (de 0,50 € à plusieurs centaines d'euros) et offrent des prize pools proportionnellement plus élevés.",
  },
  {
    q: "Quand ont lieu les séries Winamax (SISMIX, SMASK) ?",
    a: "Les séries SISMIX se tiennent généralement en été (juin–juillet) et les SMASK en automne–hiver (novembre–décembre). Chaque série dure plusieurs semaines et propose des centaines de tournois avec des garanties totales dépassant souvent plusieurs millions d'euros. Les dates exactes sont annoncées sur winamax.fr.",
  },
  {
    q: "Quel buy-in minimum pour commencer sur Winamax ?",
    a: "Vous pouvez démarrer avec les freerolls (buy-in 0 €) ou les micro-stakes à partir de 0,50 €. Les tournois daily réguliers commencent à 5 €. Il est recommandé de disposer de 50 à 100 buy-ins pour jouer à un niveau donné confortablement.",
  },
  {
    q: "Comment fonctionne le programme de fidélité Winamax ?",
    a: "Winamax propose un système de cashback basé sur les points générés à chaque partie (rake). Ces points sont échangeables contre des tickets de tournoi ou de l'argent réel. Le taux de retour effectif varie entre 20 % et 35 % selon votre volume de jeu mensuel.",
  },
];

export default function WinmaxPage() {
  const all = getUnifiedTournaments();
  const tournaments = all.filter((t) => t.platform === "winamax");
  const dates = getAvailableDates(tournaments);
  const today = getParisTodayDate();

  const todayTourneys = tournaments.filter((t) => t.date === today);
  const freerollsToday = todayTourneys.filter(
    (t) => t.format === "freeroll"
  ).length;
  const koToday = todayTourneys.filter(
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
            name: "Tournois Winamax",
            url: "https://tournois-poker.fr/tournois/winamax/",
          },
        ])}
      />
      <JsonLd data={faqSchema(FAQS)} />

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumb visible */}
        <nav className="mb-4 text-xs text-slate-500">
          <a href="/" className="hover:text-slate-300 transition-colors">
            Accueil
          </a>
          <span className="mx-1.5">›</span>
          <span className="text-slate-400">Tournois Winamax</span>
        </nav>

        {/* H1 + stats */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-amber-400 text-3xl font-bold">♠</span>
            <h1 className="text-3xl font-bold text-white">
              Tournois Winamax Poker
            </h1>
          </div>
          <p className="text-slate-400 max-w-3xl">
            Programme complet des tournois Winamax en France —{" "}
            <strong className="text-white">
              {todayTourneys.length} tournois disponibles aujourd&apos;hui
            </strong>
            , dont {freerollsToday} freerolls gratuits
            {koToday > 0 && ` et ${koToday} bounty KO`}.
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Dernière mise à jour : {updatedAt}
          </p>
        </div>

        {/* Programme interactif */}
        <TournamentsDashboard
          tournaments={tournaments}
          dates={dates}
          today={today}
        />

        {/* ── Long-form SEO content ─────────────────────────────────── */}
        <div className="mt-14 max-w-4xl space-y-12 text-slate-300 leading-relaxed">
          {/* 1. Présentation */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Winamax Poker : le leader du poker en ligne en France
            </h2>
            <p>
              Fondée en 2010 et agréée par l&apos;ANJ, Winamax s&apos;est imposée comme{" "}
              <strong className="text-white">
                la première plateforme de poker en ligne en France
              </strong>{" "}
              en termes de trafic et de volume de tournois. Chaque semaine, plus
              de 1 000 tournois sont organisés, couvrant tous les niveaux de
              jeu, tous les budgets (de 0 € à plusieurs centaines d&apos;euros) et
              tous les formats modernes (standard, bounty, turbo, hyper-turbo,
              satellite).
            </p>
            <p className="mt-3">
              La plateforme se distingue par un{" "}
              <strong className="text-white">trafic de qualité</strong> — un
              équilibre entre joueurs récréatifs et réguliers — ainsi que par
              ses séries phares{" "}
              <strong className="text-white">SISMIX et SMASK</strong>, qui
              génèrent des prize pools de plusieurs millions d&apos;euros à chaque
              édition. L&apos;interface intuitive du lobby facilite la recherche et
              l&apos;inscription aux tournois, avec des filtres par buy-in, format et
              horaire.
            </p>
          </section>

          {/* 2. Tournois phares */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Les tournois phares de Winamax
            </h2>
            <p>
              Winamax articule son programme autour de plusieurs piliers
              incontournables :
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                {
                  name: "Daily 5K – 50K",
                  desc: "Tournois quotidiens récurrents à partir de 5 €. Garanties de 5 000 € à 50 000 €. L'épine dorsale du programme Winamax, disponibles 7 jours/7.",
                  color: "border-amber-500/30 bg-amber-500/5",
                },
                {
                  name: "Séries SISMIX & SMASK",
                  desc: "Les grandes séries saisonnières de Winamax. Des centaines de tournois sur plusieurs semaines, avec des garanties totales dépassant régulièrement 5 M€.",
                  color: "border-red-500/30 bg-red-500/5",
                },
                {
                  name: "Bounty Knockout (KO)",
                  desc: "Format knockout : chaque élimination d'un adversaire génère une prime immédiate. Disponible du micro-stakes au high-roller.",
                  color: "border-purple-500/30 bg-purple-500/5",
                },
                {
                  name: "Freerolls quotidiens",
                  desc: "Tournois 100 % gratuits avec prize pools réels. Idéal pour débuter sans mise de fonds ou transformer des tickets promotionnels en argent.",
                  color: "border-green-500/30 bg-green-500/5",
                },
              ].map((e) => (
                <div
                  key={e.name}
                  className={`rounded-xl border p-4 ${e.color}`}
                >
                  <div className="font-semibold text-white mb-1.5">
                    {e.name}
                  </div>
                  <p className="text-sm text-slate-400">{e.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Formats */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Formats de tournois disponibles sur Winamax
            </h2>
            <p>
              Winamax propose l&apos;ensemble des formats MTT modernes, permettant
              à chaque joueur de trouver le style qui lui correspond :
            </p>
            <dl className="mt-4 space-y-3">
              {[
                {
                  f: "Standard NLHE",
                  d: "Texas Hold'em No-Limit avec structure classique (blindes slow). Le format de référence, adapté à tous les niveaux. Idéal pour travailler sa technique de base.",
                },
                {
                  f: "Knockout / Bounty (KO)",
                  d: "Chaque élimination rapporte une prime immédiate (généralement 50 % du buy-in). La stratégie diffère significativement du MTT classique — les appels plus larges sont souvent justifiés.",
                },
                {
                  f: "Turbo & Hyper-Turbo",
                  d: "Structures accélérées : blindes montant 2 × plus vite. Sessions plus courtes, variance plus élevée. Adapt à ceux qui veulent jouer en peu de temps.",
                },
                {
                  f: "Satellite",
                  d: "Gagnez votre seat pour des tournois live ou online coûteux à prix réduit. La gestion ICM y est cruciale : il faut souvent jouer serré en fin de satellite.",
                },
                {
                  f: "Freeroll",
                  d: "Accès 100 % gratuit, prize pool réel (argent ou tickets). Certains freerolls sont ouverts à tous, d'autres sont réservés aux nouveaux inscrits ou clients actifs.",
                },
              ].map(({ f, d }) => (
                <div
                  key={f}
                  className="rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3"
                >
                  <dt className="font-semibold text-amber-400 text-sm">
                    {f}
                  </dt>
                  <dd className="text-sm text-slate-400 mt-1">{d}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* 4. Quand jouer */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Quand jouer sur Winamax pour maximiser ses chances ?
            </h2>
            <p>
              Les créneaux les plus actifs sur Winamax sont{" "}
              <strong className="text-white">le soir entre 19 h et 23 h</strong>
              , avec un pic de trafic le{" "}
              <strong className="text-white">weekend</strong>. Le dimanche
              reste le jour phare : c&apos;est là que les plus grosses garanties sont
              proposées et que le nombre de joueurs est le plus élevé.
            </p>
            <p className="mt-3">
              Pour progresser efficacement, voici l&apos;ordre de progression
              recommandé selon votre niveau :
            </p>
            <ol className="mt-3 space-y-2 list-decimal list-inside text-sm">
              <li>
                <strong className="text-white">Débutant</strong> — commencer
                par les freerolls quotidiens et les tournois à 1 €–2 € pour
                apprendre sans pression financière.
              </li>
              <li>
                <strong className="text-white">Intermédiaire</strong> —
                cibler les Daily 5K et 10K (buy-in 5 €–10 €) avec un bankroll
                d&apos;au moins 50 buy-ins.
              </li>
              <li>
                <strong className="text-white">Régulier</strong> — s&apos;attaquer
                aux Daily 20K–50K (20 €–50 €) et profiter des séries SISMIX /
                SMASK pour les volumes élevés.
              </li>
            </ol>
          </section>

          {/* 5. Stratégie rapide */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Stratégie : nos conseils pour les tournois Winamax
            </h2>
            <p>
              Le trafic Winamax est un mix de joueurs récréatifs et de
              réguliers. Voici les trois principes clés pour optimiser vos
              résultats :
            </p>
            <div className="mt-4 space-y-3">
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                <div className="font-semibold text-amber-400 text-sm mb-1">
                  💰 Bankroll management
                </div>
                <p className="text-sm">
                  Ne dépassez jamais 5 % de votre bankroll sur un seul
                  tournoi. Avec 200 € de bankroll, jouez des tournois ≤ 10 €.
                  La variance des MTT est élevée : les downswings de 100+ BI
                  sont normaux même pour les bons joueurs.
                </p>
                <a
                  href="/guide/bankroll-management-poker/"
                  className="text-xs text-amber-400 hover:text-amber-300 mt-2 inline-block transition-colors"
                >
                  → Guide complet : gestion de bankroll
                </a>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                <div className="font-semibold text-amber-400 text-sm mb-1">
                  🎯 Stratégie MTT adaptée
                </div>
                <p className="text-sm">
                  Jouez une stratégie deep-stack en early game (SPR élevé,
                  valeur post-flop importante), adaptez-vous au short-stack en
                  late game (push/fold, ICM). La majeure partie de vos gains
                  viendra des places payées et des final tables.
                </p>
                <a
                  href="/guide/mtt-strategie-poker/"
                  className="text-xs text-amber-400 hover:text-amber-300 mt-2 inline-block transition-colors"
                >
                  → Guide stratégie MTT complète
                </a>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                <div className="font-semibold text-amber-400 text-sm mb-1">
                  🃏 Bluff calibré
                </div>
                <p className="text-sm">
                  Sur Winamax, les joueurs récréatifs ont tendance à over-call
                  (appels trop larges). En basse limite, réduisez votre
                  fréquence de bluff et valorisez davantage vos mains fortes.
                  Le value-betting thin est plus rentable que le bluff pur.
                </p>
                <a
                  href="/guide/bluff-au-poker/"
                  className="text-xs text-amber-400 hover:text-amber-300 mt-2 inline-block transition-colors"
                >
                  → Guide du bluff au poker
                </a>
              </div>
            </div>
          </section>

          {/* 6. Liens internes */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Aller plus loin
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  href: "/tournois/freeroll/",
                  title: "Freerolls aujourd'hui",
                  desc: "Tous les freerolls gratuits disponibles maintenant.",
                },
                {
                  href: "/tournois/dimanche/",
                  title: "Tournois du dimanche",
                  desc: "Sunday Million, Warm-Up et les événements hebdo.",
                },
                {
                  href: "/tournois/bounty/",
                  title: "Tournois Bounty / KO",
                  desc: "Comprendre et jouer les formats knockout.",
                },
                {
                  href: "/tournois/pokerstars/",
                  title: "Tournois PokerStars",
                  desc: "Sunday Million 1 M$, SCOOP et séries mondiales.",
                },
                {
                  href: "/guide/bankroll-management-poker/",
                  title: "Guide bankroll",
                  desc: "Gérer son argent et survivre aux downswings.",
                },
                {
                  href: "/guide/mtt-strategie-poker/",
                  title: "Stratégie MTT",
                  desc: "Early, mid et late game des tournois online.",
                },
              ].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-3 hover:bg-slate-800/70 hover:border-slate-700 transition-colors block group"
                >
                  <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
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
              Questions fréquentes – Winamax Poker
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

        {/* CTA affiliation */}
        <div className="mt-10 rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
          <h2 className="font-bold text-amber-400 text-lg">
            Créer un compte Winamax
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Jusqu&apos;à{" "}
            <strong className="text-white">500 € offerts</strong> pour votre
            premier dépôt + accès immédiat à tous les tournois et freerolls.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://www.winamax.fr/poker/bonus-bienvenue"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="w-full sm:w-auto rounded-lg bg-amber-500 px-6 py-2.5 font-bold text-black hover:bg-amber-400 transition-colors"
            >
              Obtenir le bonus Winamax 500 € →
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
