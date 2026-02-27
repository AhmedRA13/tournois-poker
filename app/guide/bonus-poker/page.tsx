import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meilleurs Bonus Poker 2026 – Winamax 500€, PokerStars 600€",
  description:
    "Comparatif des meilleurs bonus poker en ligne France 2026 : Winamax 500€, PokerStars 600€, Unibet 200€. Conditions détaillées, avis et conseils pour débutants.",
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quel est le meilleur bonus poker en ligne en France en 2026 ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le meilleur bonus poker en France en 2026 est proposé par Winamax avec jusqu'à 500€ offerts sur le premier dépôt. Winamax est le leader du marché français, avec une interface en français et de nombreux freerolls. PokerStars offre jusqu'à 600€ mais avec des conditions de déblocage plus complexes.",
      },
    },
    {
      "@type": "Question",
      name: "Comment fonctionne le déblocage d'un bonus poker ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le bonus poker est débloqué progressivement en jouant des parties réelles. Chaque tranche jouée libère une partie du bonus sur votre compte. Sur Winamax, le bonus se débloque par paliers selon votre activité sur 90 jours. Sur PokerStars, il se débloque via les Stellar Rewards Points gagnés en jouant.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on cumuler les bonus de plusieurs sites de poker ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, vous pouvez ouvrir un compte sur plusieurs sites légaux français (Winamax, PokerStars, Unibet) et bénéficier du bonus de bienvenue sur chacun. Les comptes sont indépendants. Cela vous permet de cumuler jusqu'à 1 300€ de bonus au total.",
      },
    },
    {
      "@type": "Question",
      name: "Quel site de poker choisir pour débuter ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pour débuter, Winamax est recommandé : c'est le leader français, l'interface est en français, les tables sont nombreuses à tous les niveaux, et les freerolls permettent de s'entraîner sans risque. Le dépôt minimum est de 50€ pour obtenir le bonus.",
      },
    },
    {
      "@type": "Question",
      name: "Les sites de poker en ligne sont-ils légaux en France ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, Winamax, PokerStars France et Unibet sont tous agréés par l'Autorité Nationale des Jeux (ANJ) et opèrent légalement en France. Le poker en ligne est autorisé pour les joueurs majeurs (+18 ans) sur ces plateformes réglementées.",
      },
    },
    {
      "@type": "Question",
      name: "Qu'est-ce qu'un freeroll poker ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un freeroll est un tournoi de poker gratuit (sans buy-in) qui offre de vrais prix : argent réel ou tickets de tournoi. Winamax et PokerStars proposent de nombreux freerolls quotidiens, dont certains réservés aux nouveaux inscrits.",
      },
    },
  ],
};

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
  details: string[];
  pros: string[];
  cons: string[];
  verdict: string;
  rating: number;
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
    details: [
      "100% du 1er dépôt jusqu'à 500€",
      "Déblocage progressif en jouant",
      "Freerolls exclusifs nouveaux joueurs",
      "Tournois quotidiens inclus",
      "Dépôt minimum : 50€",
      "Délai de déblocage : 90 jours",
    ],
    pros: [
      "Leader du marché français",
      "Interface en français",
      "Nombreux freerolls et tournois gratuits",
      "Séries majeures (SISMIX, SMASK…)",
      "Satellite vers WSOP et EPT",
    ],
    cons: [
      "Bonus débloqué progressivement (pas immédiat)",
      "Dépôt minimum 50€",
    ],
    verdict:
      "Winamax est le choix numéro 1 pour les joueurs français. Leader du marché, interface soignée, et une offre de tournois imbattable.",
    rating: 5,
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
    details: [
      "100% du 1er dépôt jusqu'à 600€",
      "Déblocage en Stellar Rewards Points",
      "Sunday Million 1M$ garanti",
      "Accès aux tournois live qualificatifs",
      "Dépôt minimum : 20€",
      "Délai de déblocage : 180 jours",
    ],
    pros: [
      "Plus grandes garanties (Sunday Million 1M$)",
      "Logiciel de référence mondiale",
      "Satellites vers live (EPT, WCOOP…)",
      "Large choix de variantes (PLO, Stud, Mixed)",
      "Dépôt minimum accessible (20€)",
    ],
    cons: [
      "Trafic joueurs français plus faible qu'avant 2011",
      "Rake légèrement plus élevé que Winamax",
      "Déblocage du bonus plus complexe",
    ],
    verdict:
      "PokerStars reste la référence mondiale avec les plus grandes garanties. Idéal pour les joueurs souhaitant accéder aux plus gros tournois.",
    rating: 4,
  },
  {
    platform: "Unibet",
    logo: "♣",
    color: "text-green-400",
    borderColor: "border-green-500/40",
    bgColor: "bg-green-500/5",
    buttonColor: "bg-green-600 text-white hover:bg-green-500",
    buttonText: "Obtenir le bonus Unibet →",
    affiliateUrl: "https://www.unibet.fr/poker/bonus",
    headline: "Idéal pour débuter",
    amount: "200€",
    amountColor: "text-green-400",
    details: [
      "Bonus de bienvenue jusqu'à 200€",
      "Tickets de tournoi offerts dès l'inscription",
      "Tables de faible buy-in disponibles",
      "Tournois Daily et Weekly",
      "Interface simple et accessible",
      "Dépôt minimum : 10€",
    ],
    pros: [
      "Très accessible pour les débutants",
      "Dépôt minimum faible (10€)",
      "Tables micro-stakes disponibles",
      "Tournois réguliers avec bonne valeur",
    ],
    cons: [
      "Bonus moins élevé que la concurrence",
      "Moins de tournois qu'Winamax ou PokerStars",
      "Trafic plus faible aux heures creuses",
    ],
    verdict:
      "Unibet est idéal pour les joueurs débutants grâce à son interface simple et ses tables de faible buy-in.",
    rating: 3,
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

export default function BonusPokerPage() {
  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
    />
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-slate-500">
        <a href="/" className="hover:text-white">
          Accueil
        </a>
        <span className="mx-2">/</span>
        <span className="text-slate-400">Guide Bonus Poker</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white md:text-4xl">
          Meilleurs Bonus Poker en Ligne 2026
        </h1>
        <p className="mt-3 text-slate-400 leading-relaxed">
          Comparatif complet des offres de bienvenue sur Winamax, PokerStars et
          Unibet. Conditions détaillées et conseils pour choisir la plateforme
          qui correspond à votre profil.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-900/40 px-3 py-1.5 text-xs text-green-400">
          <span>✓</span>
          <span>Mis à jour février 2026 · Sites légaux agréés ANJ</span>
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
              <th className="px-4 py-3 text-center">Note</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {OFFERS.map((o) => (
              <tr
                key={o.platform}
                className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <span className={`font-bold ${o.color}`}>
                    {o.logo} {o.platform}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`font-bold text-lg ${o.amountColor}`}>
                    {o.amount}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-slate-400">
                  {o.platform === "Winamax"
                    ? "50€"
                    : o.platform === "PokerStars"
                      ? "20€"
                      : "10€"}
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
                    Voir l'offre
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detailed cards */}
      <div className="space-y-8">
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
                      #1
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

            {/* Details */}
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

      {/* Responsible gaming */}
      <div className="mt-10 rounded-xl border border-slate-700 bg-slate-900 p-5 text-sm text-slate-400">
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

      {/* Back link */}
      <div className="mt-6 text-center">
        <a
          href="/"
          className="text-sm text-slate-500 hover:text-white transition-colors"
        >
          ← Voir le programme des tournois
        </a>
      </div>
    </div>
    </>
  );
}
