import type { Metadata } from "next";
import {
  getUnifiedTournaments,
  getAvailableDates,
  getParisTodayDate,
} from "@/lib/tournaments";
import { TournamentsDashboard } from "@/components/TournamentsDashboard";
import { JsonLd, breadcrumbSchema, faqSchema, BASE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tournois Bounty Poker – Knockout PKO, Bounty Builder & Programme Complet",
  description:
    "Programme complet des tournois bounty et knockout au poker en ligne. PKO, Bounty Builder PokerStars, Knockout Winamax — format expliqué, stratégie et meilleures tables.",
  alternates: {
    canonical: `${BASE_URL}/tournois/bounty/`,
  },
  openGraph: {
    title: "Tournois Bounty Poker – Knockout PKO, Bounty Builder & Programme Complet",
    description:
      "Programme des tournois bounty et knockout en France : PKO PokerStars, Knockout Winamax. Format expliqué, stratégie pour maximiser vos bounties.",
    url: `${BASE_URL}/tournois/bounty/`,
    type: "website",
  },
};

const FAQS = [
  {
    q: "Qu'est-ce qu'un tournoi bounty au poker ?",
    a: "Un tournoi bounty est un format où chaque joueur a un 'prix sur la tête'. Quand vous éliminez un adversaire, vous remportez immédiatement son bounty (prime) en cash. Dans un knockoff standard, tous les buy-ins sont partagés entre le prize pool classique et les primes. Dans un PKO (Progressive Knockout), la prime de chaque joueur augmente au fil des éliminations.",
  },
  {
    q: "Quelle est la différence entre PKO et bounty standard ?",
    a: "Dans un bounty standard, chaque joueur a une prime fixe dès le départ. Dans un PKO (Progressive Knockout), chaque fois que vous éliminez un joueur, vous recevez la moitié de sa prime — et l'autre moitié s'ajoute à la vôtre. Plus vous éliminez, plus votre tête vaut et plus vous attirez les adversaires. Le PKO crée une dynamique de jeu unique.",
  },
  {
    q: "Comment jouer différemment dans un tournoi PKO ?",
    a: "Dans un PKO, vous devez ajuster les cotes pour inclure la valeur du bounty. Appeler un all-in avec des cotes défavorables en chips peut être profitable si la prime de l'adversaire compense. En général, jouez plus loose preflop contre les stacks courts avec une grosse prime, et défendez votre propre bounty en évitant les all-ins inutiles en début de tournoi.",
  },
  {
    q: "Quels sont les principaux tournois bounty sur PokerStars ?",
    a: "PokerStars propose la gamme Bounty Builder avec des buy-ins de 5,50$ à 1 050$. Le Bounty Builder Series (BBS) est une série annuelle dédiée entièrement au format PKO. Le Sunday Warm-Up est parfois proposé en format PKO lors de promotions spéciales.",
  },
  {
    q: "Winamax propose-t-il des tournois knockout ?",
    a: "Oui, Winamax organise régulièrement des Knockout Tournaments, notamment lors des séries SISMIX et SMASK. Le format 'Expresso KO' applique aussi le concept au Spin & Go. Les événements spéciaux de Winamax incluent souvent une variante bounty de leurs Main Events.",
  },
  {
    q: "Les tournois bounty sont-ils meilleurs pour les débutants ?",
    a: "Les tournois bounty sont souvent plus accessibles car les gains en primes se répartissent différemment des prize pools classiques. Cependant, ils requièrent des ajustements stratégiques spécifiques. Un débutant peut y trouver de la valeur mais doit comprendre les mécanismes PKO avant de s'y investir sérieusement.",
  },
];

export default function BountyPage() {
  const all = getUnifiedTournaments();
  const today = getParisTodayDate();

  // Filter bounty/knockout tournaments
  const tournaments = all.filter(
    (t) =>
      t.format === "knockout" ||
      /\bknockou?t\b|\bpko\b|\bbounty\b|\bknock[\s-]?out\b/i.test(t.name)
  );

  const dates = getAvailableDates(tournaments);

  const updatedAt = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const breadcrumb = breadcrumbSchema([
    { name: "Accueil", url: BASE_URL + "/" },
    { name: "Tournois", url: BASE_URL + "/tournois/winamax/" },
    { name: "Tournois Bounty", url: BASE_URL + "/tournois/bounty/" },
  ]);
  const faqData = faqSchema(FAQS);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <JsonLd data={breadcrumb} />
      <JsonLd data={faqData} />

      {/* Breadcrumb */}
      <nav className="mb-6 text-xs text-slate-500" aria-label="Fil d'Ariane">
        <a href="/" className="hover:text-slate-300 transition-colors">Accueil</a>
        <span className="mx-2">/</span>
        <a href="/tournois/winamax/" className="hover:text-slate-300 transition-colors">Tournois</a>
        <span className="mx-2">/</span>
        <span className="text-slate-400">Bounty</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-orange-400 text-3xl">💥</span>
          <h1 className="text-3xl font-bold text-white">
            Tournois Bounty &amp; Knockout
          </h1>
        </div>
        <p className="text-slate-400 max-w-3xl">
          Mettez un prix sur la tête de vos adversaires. Les tournois bounty et PKO (Progressive Knockout) reversent une prime en cash à chaque élimination — une façon de gagner de l&apos;argent sans attendre le prize pool final.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Bounty Builder PokerStars, Knockout Winamax — programme complet mis à jour le {updatedAt}.
        </p>
      </div>

      {/* Format cards */}
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {[
          {
            name: "Bounty Standard",
            color: "border-orange-500/30 bg-orange-500/5",
            textColor: "text-orange-400",
            desc: "Prime fixe sur chaque tête. Vous éliminez = vous encaissez. Simple et direct.",
            badge: "KO",
          },
          {
            name: "PKO – Progressive KO",
            color: "border-red-500/30 bg-red-500/5",
            textColor: "text-red-400",
            desc: "Chaque élimination augmente votre prime. Plus vous gagnez de bounties, plus votre tête vaut cher.",
            badge: "PKO",
          },
          {
            name: "Mystery Bounty",
            color: "border-purple-500/30 bg-purple-500/5",
            textColor: "text-purple-400",
            desc: "Le montant des bounties est révélé aléatoirement à l'élimination. Peut valoir 1€ ou 10 000€.",
            badge: "MB",
          },
        ].map((e) => (
          <div key={e.name} className={`rounded-xl border p-4 ${e.color}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded bg-slate-800 ${e.textColor}`}>
                {e.badge}
              </span>
              <span className={`font-bold text-sm ${e.textColor}`}>{e.name}</span>
            </div>
            <div className="text-xs text-slate-400">{e.desc}</div>
          </div>
        ))}
      </div>

      {/* Dashboard */}
      {dates.length > 0 ? (
        <TournamentsDashboard
          tournaments={tournaments}
          dates={dates}
          today={today}
        />
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900 py-16 text-center text-slate-500">
          <p className="text-4xl mb-3">💥</p>
          <p>Aucun tournoi bounty détecté dans le programme actuel.</p>
          <p className="text-sm mt-2">
            Les données sont mises à jour chaque nuit à 2h00.
          </p>
          <p className="text-sm mt-1">
            Consultez le{" "}
            <a href="/tournois/winamax/" className="text-amber-400 hover:text-amber-300 underline">
              programme Winamax
            </a>{" "}
            ou{" "}
            <a href="/tournois/pokerstars/" className="text-red-400 hover:text-red-300 underline">
              PokerStars
            </a>{" "}
            pour voir tous les formats disponibles.
          </p>
        </div>
      )}

      {/* Affiliate CTAs */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center">
          <div className="text-xl font-bold text-red-400 mb-1">
            ★ Bounty Builder PokerStars
          </div>
          <p className="text-sm text-slate-300 mb-4">
            La gamme PKO complète : du 5,50$ au 1 050$, tous les jours.
          </p>
          <a
            href="https://www.pokerstars.fr/poker/bonus-bienvenue/"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-block rounded-lg bg-red-600 px-5 py-2 font-bold text-white hover:bg-red-500 transition-colors text-sm"
          >
            Jouer sur PokerStars →
          </a>
        </div>
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-center">
          <div className="text-xl font-bold text-amber-400 mb-1">
            ♠ Knockout Winamax
          </div>
          <p className="text-sm text-slate-300 mb-4">
            Tournois KO et séries bounty sur Winamax chaque semaine.
          </p>
          <a
            href="https://www.winamax.fr/poker/bonus-bienvenue"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-block rounded-lg bg-amber-500 px-5 py-2 font-bold text-black hover:bg-amber-400 transition-colors text-sm"
          >
            Jouer sur Winamax →
          </a>
        </div>
      </div>

      {/* ───────────────── Long-form content ───────────────── */}
      <div className="mt-16 space-y-14 text-slate-300 leading-relaxed">

        {/* Section 1 — Qu'est-ce qu'un tournoi bounty */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            Qu&apos;est-ce qu&apos;un tournoi bounty au poker ?
          </h2>
          <p>
            Un tournoi bounty est un format de poker où chaque joueur porte une &quot;prime sur la tête&quot; — un bounty. Lorsqu&apos;un joueur en élimine un autre, il reçoit immédiatement la prime de l&apos;adversaire, indépendamment de son classement final dans le tournoi.
          </p>
          <p className="mt-3">
            Ce mécanisme change fondamentalement la dynamique du jeu. Là où un MTT classique récompense uniquement les joueurs classés dans les premiers, les tournois bounty permettent de générer des profits à chaque élimination. Un joueur peut ainsi finir en dehors de la bulle tout en ayant encaissé plusieurs primes et récupéré une partie de son buy-in.
          </p>
          <p className="mt-3">
            Le format est aujourd&apos;hui l&apos;un des plus populaires en ligne, notamment grâce à <strong className="text-white">PokerStars avec la gamme Bounty Builder</strong> et <strong className="text-white">Winamax avec ses tournois Knockout</strong>. Les primes varient selon le buy-in total : en général, 50% du buy-in constitue le prize pool classique et 50% finance les bounties.
          </p>
        </section>

        {/* Section 2 — Les formats détaillés */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            Les différents formats de tournois bounty
          </h2>

          <h3 className="text-lg font-semibold text-orange-400 mt-4 mb-2">
            Bounty Standard (KO)
          </h3>
          <p>
            Dans le format classique, chaque joueur démarre avec une prime fixe. Si vous l&apos;éliminez, vous emportez 100% de sa prime immédiatement. Simple, transparent, idéal pour les débutants qui découvrent le format. La prime ne change jamais au cours du tournoi.
          </p>
          <p className="mt-2">
            Exemple : tournoi 20€, dont 10€ prize pool + 10€ bounty. Chaque élimination vous rapporte 10€ cash.
          </p>

          <h3 className="text-lg font-semibold text-red-400 mt-6 mb-2">
            PKO – Progressive Knockout
          </h3>
          <p>
            Le PKO est le format le plus populaire en 2024-2025. À chaque élimination :
          </p>
          <ul className="mt-2 space-y-1 ml-4">
            <li className="flex gap-2">
              <span className="text-slate-500 shrink-0">→</span>
              <span>Vous recevez <strong className="text-white">50% de la prime</strong> de votre adversaire en cash immédiat.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-slate-500 shrink-0">→</span>
              <span>Les <strong className="text-white">50% restants s&apos;ajoutent à votre propre prime</strong>, qui augmente.</span>
            </li>
          </ul>
          <p className="mt-2">
            Résultat : les joueurs qui éliminent beaucoup voient leur prime croître exponentiellement. Un joueur avec 5 éliminations peut avoir une prime de 50€ ou 100€, faisant de sa tête une cible lucrative. Ce mécanisme crée des situations uniques où appeler un all-in est correct même avec des cotes chips défavorables.
          </p>

          <h3 className="text-lg font-semibold text-purple-400 mt-6 mb-2">
            Mystery Bounty
          </h3>
          <p>
            Format relativement récent et extrêmement populaire : les primes ne sont pas connues à l&apos;avance. Quand vous éliminez un adversaire, une enveloppe aléatoire révèle votre récompense — elle peut valoir le minimum (souvent 1€) ou atteindre des montants extraordinaires (jackpot de 10 000€ ou plus dans les gros tournois).
          </p>
          <p className="mt-2">
            Le Mystery Bounty ajoute un élément de chance supplémentaire, ce qui attire un public plus récréatif. PokerStars a popularisé ce format avec sa série Mystery Bounty annuelle.
          </p>
        </section>

        {/* Section 3 — Winamax vs PokerStars */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            Bounty Winamax vs PokerStars : quel opérateur choisir ?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
              <h3 className="font-bold text-amber-400 mb-3">♠ Winamax</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-green-400 shrink-0">✓</span>
                  <span>Format KO intégré dans les séries SISMIX/SMASK</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400 shrink-0">✓</span>
                  <span>Buy-ins en euros, sans conversion devises</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400 shrink-0">✓</span>
                  <span>Champ français, niveau parfois plus accessible</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-slate-500 shrink-0">✗</span>
                  <span>Moins de tournois KO quotidiens qu&apos;en PKO PokerStars</span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
              <h3 className="font-bold text-red-400 mb-3">★ PokerStars</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-green-400 shrink-0">✓</span>
                  <span>Gamme Bounty Builder complète (5,50$ → 1 050$)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400 shrink-0">✓</span>
                  <span>PKO disponible toute la journée, toute l&apos;année</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400 shrink-0">✓</span>
                  <span>Séries BBS dédiées au format bounty</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-slate-500 shrink-0">✗</span>
                  <span>Champ international, niveau moyen souvent plus élevé</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-400">
            <strong className="text-slate-300">Notre recommandation :</strong> Pour débuter avec le format bounty, testez les tournois Winamax lors des séries. Pour une offre quotidienne et variée en PKO, PokerStars est incontournable.
          </p>
        </section>

        {/* Section 4 — Stratégie PKO */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            Stratégie PKO : comment maximiser vos bounties
          </h2>
          <p>
            Le PKO nécessite une approche stratégique différente du MTT classique. La valeur d&apos;un call ou d&apos;un shove dépend non seulement de vos cotes en chips, mais aussi de la valeur du bounty en jeu.
          </p>

          <h3 className="text-lg font-semibold text-white mt-5 mb-2">Intégrer la valeur du bounty dans vos décisions</h3>
          <p>
            La formule de base : si appeler un all-in vous coûte X chips mais que la prime de l&apos;adversaire vaut Y euros, calculez si la somme equity chips + bounty rend l&apos;appel profitable. En phase early avec des blinds faibles, une prime élevée peut justifier un call que vous refuseriez normalement.
          </p>

          <h3 className="text-lg font-semibold text-white mt-5 mb-2">Défendre votre propre bounty</h3>
          <p>
            À mesure que votre prime grossit, vous devenez une cible. Les adversaires auront des raisons de vous call avec des mains plus larges. Adaptez-vous : évitez les bluffs inutiles contre les joueurs courts, évitez d&apos;aller all-in avec des mains marginales si votre prime est élevée.
          </p>

          <h3 className="text-lg font-semibold text-white mt-5 mb-2">Exploiter les stacks courts avec grosse prime</h3>
          <p>
            Un joueur avec 5 BB et une prime de 50€ (dans un tournoi à 20€ buy-in) est une cible extrêmement rentable. Élargissez votre range d&apos;appel face à ses shoves — la valeur du bounty compense largement une légère défaveur en cotes.
          </p>

          <div className="mt-5 rounded-lg bg-slate-800/60 p-4 border border-slate-700/50">
            <p className="text-sm text-slate-300 font-medium mb-2">Pour approfondir votre stratégie :</p>
            <ul className="space-y-1">
              <li>
                <a href="/guide/bankroll-management-poker/" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                  → Bankroll management : gérer son capital pour les tournois bounty
                </a>
              </li>
              <li>
                <a href="/guide/push-fold-poker/" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                  → Push-fold : la stratégie des stacks courts en PKO
                </a>
              </li>
              <li>
                <a href="/guide/mtt-strategie-poker/" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                  → Stratégie MTT complète : du départ à la table finale
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 5 — Conseils débutants */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            5 conseils pour débuter avec les tournois bounty
          </h2>
          <div className="space-y-3">
            {[
              {
                n: "1",
                title: "Commencez par des tournois bounty standard (KO)",
                text: "Avant de jouer du PKO, familiarisez-vous avec le bounty standard. Les mécaniques sont plus simples : vous savez exactement combien vaut chaque prime.",
              },
              {
                n: "2",
                title: "Ne sur-evaluez pas la valeur des bounties",
                text: "Les bounties sont tentants mais ne vous incitent pas à appeler n'importe quoi. Calculez correctement si la valeur totale (equity + bounty) justifie vos décisions.",
              },
              {
                n: "3",
                title: "Jouez agressivement face aux stacks courts avec une grosse prime",
                text: "C'est là que se trouvent les profits en PKO. Un joueur court avec une prime élevée doit être ciblé — c'est le cœur du format.",
              },
              {
                n: "4",
                title: "N'oubliez pas le prize pool classique",
                text: "Les bounties sont une partie du gain potentiel, pas la totalité. Continuez à jouer pour la bulle et les prix finaux — surtout en phase avancée.",
              },
              {
                n: "5",
                title: "Gérez votre bankroll spécifiquement pour le format",
                text: "La variance en PKO est plus élevée qu'en MTT classique. Prévoyez au moins 40 buy-ins pour absorber les fluctuations liées aux bounties manqués.",
              },
            ].map((tip) => (
              <div key={tip.n} className="flex gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-2xl font-bold text-slate-700 shrink-0 leading-none mt-0.5">{tip.n}</span>
                <div>
                  <p className="font-semibold text-white text-sm">{tip.title}</p>
                  <p className="text-slate-400 text-sm mt-1">{tip.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6 — FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">
            Questions fréquentes sur les tournois bounty
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="group rounded-xl border border-slate-800 bg-slate-900/60"
              >
                <summary className="cursor-pointer px-5 py-4 font-semibold text-slate-200 hover:text-white transition-colors list-none flex items-center justify-between gap-3">
                  <span>{faq.q}</span>
                  <span className="text-slate-600 group-open:rotate-180 transition-transform shrink-0">▼</span>
                </summary>
                <div className="px-5 pb-4 text-slate-400 text-sm leading-relaxed border-t border-slate-800">
                  <p className="mt-3">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
