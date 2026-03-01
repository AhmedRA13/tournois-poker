import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema, BASE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute:
      "Meilleurs Bonus Poker 2026 – Winamax 500€, PokerStars 600€, Unibet 200€",
  },
  description:
    "Comparatif complet des bonus poker en ligne France 2026 : Winamax 500€, PokerStars 600€, Unibet 200€. Conditions de déblocage détaillées, délais, conseils par profil de joueur et FAQ.",
  alternates: { canonical: `${BASE_URL}/guide/bonus-poker/` },
};

const FAQS = [
  {
    q: "Quel est le meilleur bonus poker en ligne en France en 2026 ?",
    a: "Le meilleur bonus poker en France en 2026 est proposé par Winamax avec jusqu'à 500€ offerts sur le premier dépôt. Winamax est le leader du marché français, avec une interface en français et un déblocage plus simple que la concurrence. PokerStars offre nominalement plus (600€) mais avec des conditions de déblocage plus complexes via un système de points.",
  },
  {
    q: "Comment fonctionne le déblocage d'un bonus poker ?",
    a: "Le bonus poker est débloqué progressivement en jouant des parties réelles. Sur Winamax, chaque partie jouée génère des points qui libèrent le bonus par paliers sur 90 jours maximum. Sur PokerStars, le bonus se débloque via des Stellar Rewards Points. Sur Unibet, le cashback est crédité automatiquement chaque mois selon votre rake.",
  },
  {
    q: "Peut-on cumuler les bonus de plusieurs sites de poker ?",
    a: "Oui, vous pouvez ouvrir un compte sur Winamax, PokerStars et Unibet et bénéficier du bonus de bienvenue sur chacun. Les comptes sont indépendants. Cela vous permet de cumuler jusqu'à 1 300€ de bonus total. Beaucoup de joueurs ouvrent les 3 comptes la même semaine pour maximiser leur bankroll de départ.",
  },
  {
    q: "Quel site de poker choisir pour débuter en 2026 ?",
    a: "Pour débuter, Winamax est recommandé : c'est le leader français, l'interface est en français, les tables sont nombreuses à tous les niveaux, et les freerolls permettent de s'entraîner sans risque. Le dépôt minimum est de 50€ pour obtenir le bonus. Unibet est une alternative pour ceux qui veulent des tables vraiment douces (fish factor maximal).",
  },
  {
    q: "Les sites de poker en ligne sont-ils légaux en France ?",
    a: "Oui, Winamax, PokerStars France et Unibet sont tous agréés par l'Autorité Nationale des Jeux (ANJ) et opèrent légalement en France. Le poker en ligne est autorisé pour les joueurs majeurs (+18 ans) sur ces plateformes réglementées. Leur licence ANJ garantit la sécurité des fonds déposés.",
  },
  {
    q: "Qu'est-ce qu'un freeroll poker ?",
    a: "Un freeroll est un tournoi de poker gratuit (sans buy-in) qui offre de vrais prix : argent réel ou tickets de tournoi. Winamax et PokerStars proposent de nombreux freerolls quotidiens, dont certains réservés aux nouveaux inscrits. C'est le meilleur moyen de commencer à jouer sans risque financier.",
  },
  {
    q: "Combien de temps ai-je pour débloquer mon bonus de bienvenue ?",
    a: "Le délai varie selon les plateformes : Winamax accorde 90 jours pour débloquer le bonus, PokerStars offre 180 jours (6 mois). Unibet fonctionne différemment avec un cashback mensuel sans délai fixe. Si vous ne jouez pas suffisamment dans le délai imparti, la partie non débloquée est perdue. Planifiez votre activité en conséquence.",
  },
  {
    q: "Peut-on retirer le bonus directement après l'avoir débloqué ?",
    a: "Oui, une fois le bonus débloqué (transféré sur votre compte réel), vous pouvez le retirer comme tout autre gain. Il n'y a pas de condition de mise supplémentaire sur les bonus poker légaux en France — contrairement aux bonus casino. Sur Winamax, le bonus débloqué est disponible immédiatement pour retrait ou jeu.",
  },
];

interface BonusOffer {
  platform: string;
  logo: string;
  color: string;
  borderColor: string;
  bgColor: string;
  buttonColor: string;
  buttonText: string;
  affiliateUrl: string;
  headline: string;
  amount: string;
  amountColor: string;
  depositMin: string;
  deadline: string;
  unlockMechanism: string;
  details: string[];
  pros: string[];
  cons: string[];
  verdict: string;
  rating: number;
  unlockSteps: string[];
  profileFit: { icon: string; label: string; fit: "ideal" | "good" | "ok" }[];
}

const OFFERS: BonusOffer[] = [
  {
    platform: "Winamax",
    logo: "♠",
    color: "text-amber-400",
    borderColor: "border-amber-500/40",
    bgColor: "bg-amber-500/5",
    buttonColor: "bg-amber-500 text-black hover:bg-amber-400",
    buttonText: "Obtenir le bonus Winamax →",
    affiliateUrl: "https://www.winamax.fr/poker/bonus-bienvenue",
    headline: "Meilleur bonus France 🏆",
    amount: "500€",
    amountColor: "text-amber-400",
    depositMin: "50€",
    deadline: "90 jours",
    unlockMechanism: "Points d'activité → paliers",
    details: [
      "100% du 1er dépôt jusqu'à 500€",
      "Déblocage par paliers progressifs",
      "Freerolls exclusifs nouveaux joueurs",
      "Tournois quotidiens inclus",
      "Dépôt minimum : 50€",
      "Délai de déblocage : 90 jours",
    ],
    pros: [
      "Leader du marché français — plus de tables disponibles",
      "Interface entièrement en français",
      "Cashout SEPA en 15 minutes",
      "Séries majeures (SISMIX, SMASK, MASUP)",
      "Freerolls nouveaux joueurs généreux",
      "Application mobile très bien notée",
    ],
    cons: [
      "Dépôt minimum 50€ (le plus élevé des 3)",
      "Bonus débloqué progressivement (pas de versement immédiat)",
      "90 jours seulement pour débloquer",
    ],
    verdict:
      "Winamax est le choix numéro 1 pour les joueurs français. Leader du marché, interface soignée, cashout ultra-rapide et une offre de tournois imbattable. Le dépôt minimum de 50€ est l'unique frein pour les tout petits bankrolls.",
    rating: 5,
    unlockSteps: [
      "Créez votre compte sur Winamax.fr (vérification identité requise)",
      "Effectuez votre premier dépôt (50€ minimum)",
      "Le bonus apparaît dans votre espace 'Mes bonus'",
      "Jouez des tournois ou des cash games — chaque rake génère des points",
      "Chaque palier atteint débloque une tranche de bonus sur votre compte réel",
      "Recommencez jusqu'à épuisement du bonus ou fin des 90 jours",
    ],
    profileFit: [
      { icon: "🎓", label: "Débutant", fit: "ideal" },
      { icon: "📈", label: "Grinder", fit: "ideal" },
      { icon: "💎", label: "High-roller", fit: "good" },
    ],
  },
  {
    platform: "PokerStars",
    logo: "★",
    color: "text-red-400",
    borderColor: "border-red-500/40",
    bgColor: "bg-red-500/5",
    buttonColor: "bg-red-600 text-white hover:bg-red-500",
    buttonText: "Obtenir le bonus PokerStars →",
    affiliateUrl: "https://www.pokerstars.fr/poker/bonus-bienvenue/",
    headline: "Plus grandes garanties",
    amount: "600€",
    amountColor: "text-red-400",
    depositMin: "20€",
    deadline: "180 jours",
    unlockMechanism: "Stellar Rewards Points (SRP)",
    details: [
      "100% du 1er dépôt jusqu'à 600€",
      "Déblocage via Stellar Rewards Points",
      "Sunday Million 200K€ garanti chaque semaine",
      "Accès aux tournois live qualificatifs (EPT, WSOP)",
      "Dépôt minimum : 20€",
      "Délai de déblocage : 180 jours",
    ],
    pros: [
      "Bonus nominal le plus élevé (600€)",
      "Dépôt minimum très accessible (20€)",
      "180 jours pour débloquer — le délai le plus long",
      "Grosses garanties : Sunday Million, SCOOP, WCOOP",
      "Variantes : PLO, Stud, Mixed Games, Zoom Poker",
      "Satellites vers les grands events live (EPT, WSOP)",
    ],
    cons: [
      "Système de déblocage complexe (SRP)",
      "Rake plus élevé sur les tournois PKO",
      "Interface moins moderne que Winamax",
      "Support en français moins réactif",
    ],
    verdict:
      "PokerStars reste la référence mondiale avec les plus grandes garanties. Le bonus de 600€ sur 180 jours est particulièrement adapté aux joueurs qui veulent du temps pour optimiser leur déblocage. Idéal pour les MTT players qui ciblent les grosses séries.",
    rating: 4,
    unlockSteps: [
      "Inscription sur PokerStars.fr avec code bonus si disponible",
      "Premier dépôt dès 20€ (plus vous déposez, plus le bonus est élevé)",
      "Le bonus est crédité dans votre compte bonus (pas immédiatement accessible)",
      "Jouez des parties réelles : chaque main génère des Stellar Rewards Points",
      "Tous les 20 SRP gagnés débloquent 1€ de bonus réel",
      "Le processus s'étale sur jusqu'à 180 jours",
    ],
    profileFit: [
      { icon: "🎓", label: "Débutant", fit: "good" },
      { icon: "📈", label: "Grinder", fit: "good" },
      { icon: "💎", label: "High-roller", fit: "ideal" },
    ],
  },
  {
    platform: "Unibet",
    logo: "♣",
    color: "text-green-400",
    borderColor: "border-green-500/40",
    bgColor: "bg-green-500/5",
    buttonColor: "bg-green-600 text-white hover:bg-green-500",
    buttonText: "Obtenir le bonus Unibet →",
    affiliateUrl: "https://www.unibet.fr/poker",
    headline: "Tables les plus faciles",
    amount: "200€",
    amountColor: "text-green-400",
    depositMin: "10€",
    deadline: "Mensuel (cashback)",
    unlockMechanism: "Cashback mensuel automatique",
    details: [
      "Bonus de bienvenue jusqu'à 200€",
      "Cashback mensuel automatique sur le rake",
      "Tables les plus faciles d'Europe (HUDs interdits)",
      "Tournois Daily et Weekly exclusifs",
      "Interface simple et accessible",
      "Dépôt minimum : 10€",
    ],
    pros: [
      "Dépôt minimum le plus faible (10€)",
      "Tables les plus douces — HUDs interdits par contrat",
      "Cashback mensuel récurrent (pas juste un one-shot)",
      "Environnement idéal pour les récréatifs et débutants",
      "Tournois exclusifs avec bonne valeur",
    ],
    cons: [
      "Bonus de bienvenue plus faible (200€)",
      "Trafic global limité — files d'attente aux heures creuses",
      "Moins de formats et variantes disponibles",
      "Garanties MTT inférieures à la concurrence",
    ],
    verdict:
      "Unibet est le meilleur choix pour les joueurs récréatifs et débutants qui veulent des tables douces. L'interdiction des HUDs crée un environnement équitable rarement trouvé ailleurs. Le cashback mensuel compense un bonus de bienvenue plus modeste.",
    rating: 3,
    unlockSteps: [
      "Créez votre compte sur Unibet.fr",
      "Effectuez votre premier dépôt (10€ minimum)",
      "Le bonus de bienvenue est partiellement crédité en tickets",
      "Jouez des tournois et cash games normalement",
      "En fin de mois, Unibet calcule votre cashback selon votre rake",
      "Le cashback est crédité automatiquement le mois suivant",
    ],
    profileFit: [
      { icon: "🎓", label: "Débutant", fit: "ideal" },
      { icon: "📈", label: "Grinder", fit: "ok" },
      { icon: "💎", label: "High-roller", fit: "ok" },
    ],
  },
];

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={i < rating ? "text-amber-400" : "text-slate-700"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function FitBadge({ fit }: { fit: "ideal" | "good" | "ok" }) {
  const map = {
    ideal: "bg-green-500/20 text-green-400 border-green-500/30",
    good: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    ok: "bg-slate-700 text-slate-400 border-slate-600",
  };
  const labels = { ideal: "Idéal", good: "Bien", ok: "Correct" };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full border font-medium ${map[fit]}`}
    >
      {labels[fit]}
    </span>
  );
}

export default function BonusPokerPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Accueil", url: BASE_URL },
    { name: "Guide", url: `${BASE_URL}/guide/` },
    { name: "Bonus Poker", url: `${BASE_URL}/guide/bonus-poker/` },
  ]);

  const faq = faqSchema(FAQS);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={faq} />

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-slate-500">
          <a href="/" className="hover:text-white">
            Accueil
          </a>
          <span className="mx-2">/</span>
          <a href="/guide/" className="hover:text-white">
            Guide
          </a>
          <span className="mx-2">/</span>
          <span className="text-slate-400">Bonus Poker 2026</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white md:text-4xl leading-tight">
            Meilleurs Bonus Poker en Ligne 2026
          </h1>
          <p className="mt-3 text-slate-400 leading-relaxed max-w-2xl">
            Comparatif complet et honnête des offres de bienvenue sur Winamax,
            PokerStars et Unibet. Conditions de déblocage décortiquées, délais
            réels, et notre verdict par profil de joueur.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-green-900/40 px-3 py-1.5 text-xs text-green-400">
              ✓ Sites légaux agréés ANJ
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1.5 text-xs text-slate-400">
              📅 Mis à jour mars 2026
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1.5 text-xs text-slate-400">
              🎁 Jusqu&apos;à 1 300€ cumulables
            </span>
          </div>
        </div>

        {/* Quick comparison table */}
        <div className="mb-10 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 text-left">Plateforme</th>
                <th className="px-4 py-3 text-center">Bonus max</th>
                <th className="px-4 py-3 text-center">Dépôt min.</th>
                <th className="px-4 py-3 text-center">Délai</th>
                <th className="px-4 py-3 text-center">Note</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {OFFERS.map((o, i) => (
                <tr
                  key={o.platform}
                  className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${o.color}`}>
                        {o.logo} {o.platform}
                      </span>
                      {i === 0 && (
                        <span className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-xs font-bold text-amber-400">
                          #1
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-bold text-lg ${o.amountColor}`}>
                      {o.amount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-400">
                    {o.depositMin}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-400 text-xs">
                    {o.deadline}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StarRating rating={o.rating} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <a
                      href={o.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className={`inline-block rounded-lg px-4 py-1.5 text-xs font-bold transition-colors ${o.buttonColor}`}
                    >
                      Voir l&apos;offre
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Intro section */}
        <section className="mb-10 rounded-xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-white mb-3">
            Comment fonctionnent les bonus poker en France ?
          </h2>
          <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
            <p>
              Contrairement aux bonus casino, les bonus poker en ligne ne
              nécessitent <strong className="text-white">aucune mise</strong>{" "}
              au sens classique. Le déblocage se fait en jouant normalement : le
              rake (commission prélevée par la salle) que vous générez en jouant
              des tournois ou du cash game est converti en points qui libèrent
              progressivement votre bonus.
            </p>
            <p>
              Concrètement :{" "}
              <strong className="text-white">
                plus vous jouez, plus vite vous débloquez
              </strong>
              . Un joueur qui joue 2h par jour débloquera son bonus en 3-4
              semaines. Un joueur occasionnel (quelques heures par semaine) peut
              prendre tout le délai imparti.
            </p>
            <p>
              La bonne nouvelle ? Une fois débloqué, l&apos;argent est{" "}
              <strong className="text-white">réel et librement retirable</strong>
              . Il n&apos;y a pas de wagering requirement additionnel sur le
              poker — c&apos;est fondamentalement différent des bonus casino.
            </p>
          </div>
        </section>

        {/* Detailed cards */}
        <div className="space-y-10 mb-10">
          {OFFERS.map((o, i) => (
            <div
              key={o.platform}
              className={`rounded-2xl border p-6 ${o.borderColor} ${o.bgColor}`}
            >
              {/* Card header */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-2xl font-bold ${o.color}`}>
                      {o.logo}
                    </span>
                    <h2 className="text-2xl font-bold text-white">
                      {o.platform}
                    </h2>
                    {i === 0 && (
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-400">
                        MEILLEUR CHOIX
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-slate-400">{o.headline}</div>
                  <StarRating rating={o.rating} />
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-4xl font-bold ${o.amountColor}`}>
                    {o.amount}
                  </div>
                  <div className="text-xs text-slate-500">bonus max</div>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid gap-4 sm:grid-cols-3 mb-5">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                    Conditions
                  </h3>
                  <ul className="space-y-1">
                    {o.details.map((d) => (
                      <li key={d} className="text-sm text-slate-300 flex gap-2">
                        <span className="text-slate-600 shrink-0">·</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-green-500/70 mb-2">
                    ✓ Points forts
                  </h3>
                  <ul className="space-y-1">
                    {o.pros.map((p) => (
                      <li key={p} className="text-sm text-slate-300 flex gap-2">
                        <span className="text-green-500 shrink-0">✓</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-red-500/70 mb-2">
                    ✗ Points faibles
                  </h3>
                  <ul className="space-y-1">
                    {o.cons.map((c) => (
                      <li key={c} className="text-sm text-slate-300 flex gap-2">
                        <span className="text-red-500 shrink-0">✗</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Unlock steps */}
              <div className="mb-5 rounded-lg bg-slate-950/50 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
                  🔓 Comment débloquer votre bonus {o.platform} — étape par étape
                </h3>
                <ol className="space-y-2">
                  {o.unlockSteps.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-slate-300">
                      <span
                        className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${o.color} bg-slate-800`}
                      >
                        {idx + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Profile fit */}
              <div className="mb-5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                  Adapté pour
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {o.profileFit.map((pf) => (
                    <div key={pf.label} className="flex items-center gap-1.5">
                      <span className="text-base">{pf.icon}</span>
                      <span className="text-sm text-slate-300">{pf.label}</span>
                      <FitBadge fit={pf.fit} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Verdict */}
              <div className="rounded-lg bg-slate-950/50 p-3 mb-4 text-sm text-slate-300">
                <strong className="text-white">Notre avis : </strong>
                {o.verdict}
              </div>

              {/* CTA */}
              <a
                href={o.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className={`inline-block rounded-lg px-6 py-2.5 font-bold transition-colors ${o.buttonColor}`}
              >
                {o.buttonText}
              </a>
            </div>
          ))}
        </div>

        {/* Strategy: Maximize bonus */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">
            Stratégie : Maximiser votre bankroll avec les bonus
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                icon: "🎓",
                profile: "Débutant absolu",
                strategy:
                  "Commencez par Winamax avec 50€. Jouez les freerolls nouveaux joueurs pendant la première semaine. Puis jouez uniquement des tournois à 0,50€-2€ pour débloquer le bonus lentement tout en apprenant. Évitez de bruler votre bankroll.",
                budget: "50-100€",
                site: "Winamax en priorité",
              },
              {
                icon: "📈",
                profile: "Joueur régulier",
                strategy:
                  "Ouvrez les 3 comptes en même temps : Winamax (50€+), PokerStars (20€+), Unibet (10€+). Répartissez votre temps : Winamax pour le volume quotidien, PokerStars pour les séries du dimanche, Unibet pour les sessions cash game du week-end.",
                budget: "200-500€",
                site: "Les 3 simultanément",
              },
              {
                icon: "💎",
                profile: "High-roller / semi-pro",
                strategy:
                  "Déposez le maximum sur PokerStars (600€ bonus) et Winamax (500€). Utilisez les 180 jours PokerStars pour débloquer via cash game NL50+. Winamax pour les séries MTT garanties. Unibet peut être ignoré à ce niveau (volume trop faible).",
                budget: "1000€+",
                site: "Winamax + PokerStars",
              },
            ].map((s) => (
              <div
                key={s.profile}
                className="rounded-xl border border-slate-700 bg-slate-900 p-4"
              >
                <div className="text-2xl mb-2">{s.icon}</div>
                <h3 className="font-bold text-white text-sm mb-1">
                  {s.profile}
                </h3>
                <div className="text-xs text-amber-400 mb-2">
                  Budget conseillé : {s.budget}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-2">
                  {s.strategy}
                </p>
                <div className="text-xs text-slate-500">
                  Site prioritaire :{" "}
                  <span className="text-slate-300">{s.site}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Conditions details */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">
            Conditions de déblocage : ce qu&apos;il faut savoir
          </h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <h3 className="font-semibold text-white mb-2">
                ⏱️ Les délais sont stricts
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Winamax vous donne <strong className="text-white">90 jours</strong> pour
                débloquer, PokerStars <strong className="text-white">180 jours</strong>.
                Passé ce délai, la partie non débloquée disparaît définitivement.
                Planifiez votre activité en conséquence : si vous savez que vous
                partez en vacances 3 semaines, préférez ouvrir votre compte à votre
                retour pour ne pas gaspiller votre bonus.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <h3 className="font-semibold text-white mb-2">
                📊 Le rake compte, pas les pertes
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Le bonus se débloque via le <strong className="text-white">rake généré</strong>,
                pas via vos pertes. Que vous gagniez ou perdiez, si vous jouez et
                générez du rake, votre bonus progresse. Cela signifie que les
                tournois à frais élevés débloquent plus vite — mais calculez
                toujours si le coût en rake vaut le bonus récupéré.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <h3 className="font-semibold text-white mb-2">
                🔄 Les bonus ne sont pas cumulables entre plateformes
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Vous pouvez avoir un compte sur les 3 plateformes simultanément —
                c&apos;est totalement légal. Mais sur chaque plateforme, le bonus
                de bienvenue n&apos;est accordé qu&apos;une seule fois (premier dépôt).
                Planifiez l&apos;ordre d&apos;ouverture selon votre budget disponible.
              </p>
            </div>
          </div>
        </section>

        {/* Cross-links */}
        <section className="mb-10 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
          <h2 className="font-bold text-white mb-3">
            Comparer les plateformes en détail
          </h2>
          <p className="text-sm text-slate-400 mb-4">
            Le bonus n&apos;est qu&apos;un critère parmi d&apos;autres. Consultez nos comparatifs
            détaillés pour faire le meilleur choix selon votre profil :
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <a
              href="/comparer-rooms/"
              className="rounded-lg border border-slate-700 bg-slate-900 p-3 hover:bg-slate-800 transition-colors block"
            >
              <p className="font-semibold text-white text-sm">
                🏆 Comparateur complet des 3 rooms
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                7 critères analysés, scoring détaillé
              </p>
            </a>
            <a
              href="/comparer/winamax-vs-pokerstars/"
              className="rounded-lg border border-slate-700 bg-slate-900 p-3 hover:bg-slate-800 transition-colors block"
            >
              <p className="font-semibold text-white text-sm">
                ⚔️ Winamax vs PokerStars
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Comparatif face à face complet
              </p>
            </a>
            <a
              href="/comparer/winamax-vs-unibet/"
              className="rounded-lg border border-slate-700 bg-slate-900 p-3 hover:bg-slate-800 transition-colors block"
            >
              <p className="font-semibold text-white text-sm">
                ⚔️ Winamax vs Unibet
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Quel site pour les débutants ?
              </p>
            </a>
            <a
              href="/comparer/pokerstars-vs-unibet/"
              className="rounded-lg border border-slate-700 bg-slate-900 p-3 hover:bg-slate-800 transition-colors block"
            >
              <p className="font-semibold text-white text-sm">
                ⚔️ PokerStars vs Unibet
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Tables faciles vs grosses garanties
              </p>
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">
            Questions fréquentes sur les bonus poker
          </h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div
                key={f.q}
                className="rounded-xl border border-slate-800 bg-slate-900 p-4"
              >
                <p className="font-semibold text-white text-sm mb-2">{f.q}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Triple CTA */}
        <div className="mb-10 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 sm:p-6 text-center">
          <h2 className="text-base sm:text-lg font-bold text-amber-400 mb-1">
            Cumulez jusqu&apos;à 1 300€ de bonus
          </h2>
          <p className="text-sm text-slate-300 mb-5">
            Ouvrez les 3 comptes et profitez de tous les bonus de bienvenue
            simultanément.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="https://www.winamax.fr/poker/bonus-bienvenue"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="w-full sm:w-auto rounded-lg bg-amber-500 px-5 py-2.5 font-bold text-black hover:bg-amber-400 transition-colors text-sm"
            >
              Winamax 500€ →
            </a>
            <a
              href="https://www.pokerstars.fr/poker/bonus-bienvenue/"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="w-full sm:w-auto rounded-lg bg-red-600 px-5 py-2.5 font-bold text-white hover:bg-red-500 transition-colors text-sm"
            >
              PokerStars 600€ →
            </a>
            <a
              href="https://www.unibet.fr/poker"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="w-full sm:w-auto rounded-lg bg-green-600 px-5 py-2.5 font-bold text-white hover:bg-green-500 transition-colors text-sm"
            >
              Unibet 200€ →
            </a>
          </div>
        </div>

        {/* Responsible gaming */}
        <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900 p-5 text-sm text-slate-400">
          <h2 className="font-bold text-white mb-2">⚠️ Jeu responsable</h2>
          <p className="leading-relaxed">
            Le poker en ligne est réservé aux personnes majeures (+18 ans). Ces
            bonus sont soumis à conditions. Jouez de manière responsable et dans
            les limites de vos moyens. En cas de problème de jeu, contactez{" "}
            <a
              href="https://www.joueurs-info-service.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline"
            >
              Joueurs Info Service
            </a>{" "}
            (0 974 75 13 13, appel non surtaxé).
          </p>
        </div>
      </div>
    </>
  );
}
