import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd, breadcrumbSchema, faqSchema, BASE_URL } from "@/lib/seo";

export const dynamic = "force-static";

interface ComparisonData {
  slug: string;
  title: string;
  metaTitle: string;
  metaDesc: string;
  platformA: PlatformInfo;
  platformB: PlatformInfo;
  verdict: string;
  faqs: { q: string; a: string }[];
}

interface PlatformInfo {
  name: string;
  color: string;
  badge: string;
  affiliate: string;
  affiliateLabel: string;
  pros: string[];
  cons: string[];
  score: number;
  bestFor: string;
}

const COMPARISONS: Record<string, ComparisonData> = {
  "winamax-vs-pokerstars": {
    slug: "winamax-vs-pokerstars",
    title: "Winamax vs PokerStars : Quel site choisir en 2025 ?",
    metaTitle: "Winamax vs PokerStars 2025 — Comparatif complet poker en ligne",
    metaDesc:
      "Winamax ou PokerStars ? Comparez les deux géants du poker en ligne : traffic, bonus, logiciel, formats, cashout. Verdict par profil de joueur.",
    platformA: {
      name: "Winamax",
      color: "amber",
      badge: "WMX",
      affiliate: "https://www.winamax.fr/poker/bonus-bienvenue",
      affiliateLabel: "Bonus Winamax 500€",
      pros: [
        "Trafic français #1 — files d'attentes rapides 24h/24",
        "Interface épurée, agréable et stable",
        "Expresso (spin & go) : le meilleur d'Europe",
        "Cashout instantané en 15 min (virement SEPA)",
        "Programme de fidélité transparent (tickets hebdo)",
        "Support réactif en français",
      ],
      cons: [
        "Garanties plus faibles que PokerStars sur les MTT high-stakes",
        "Pas de PLO high-stakes ni de mixed games développés",
        "Récurrence des gros events moins présente qu'avant",
        "Rake légèrement élevé sur les petites tables cash",
      ],
      score: 32,
      bestFor: "Joueurs français cherchant le meilleur volume et cashout rapide",
    },
    platformB: {
      name: "PokerStars",
      color: "red",
      badge: "PS",
      affiliate: "https://www.pokerstars.fr/poker/bonus-bienvenue/",
      affiliateLabel: "Bonus PokerStars 600€",
      pros: [
        "Garanties monstres (Sunday Million, SCOOP, WCOOP)",
        "Variantes: PLO, Omaha Hi/Lo, Stud, Mixed Games",
        "MicroMTT accessibles dès 0,01€",
        "Sunday Million 200K€ garanti chaque semaine",
        "Logiciel avancé avec HUD natif limité",
        "Présence mondiale = plus de fishs internationaux",
      ],
      cons: [
        "Interface vieillissante comparée à Winamax",
        "Cashout parfois 24-48h selon méthode",
        "Support moins réactif pour les joueurs FR",
        "Rake élevé sur les tournois PKO (frais +25%)",
      ],
      score: 28,
      bestFor: "Joueurs MTT visant les grosses garanties internationales",
    },
    verdict:
      "Pour un joueur français standard, **Winamax domine** sur le quotidien : trafic, cashout, confort. PokerStars reprend l'avantage pour les grosses garanties du dimanche et les variantes exotiques.",
    faqs: [
      {
        q: "Winamax ou PokerStars — lequel a le plus de joueurs en France ?",
        a: "Winamax est leader absolu en France avec environ 60-70% de part de marché sur les tournois MTT. PokerStars reste fort sur les horaires tardifs et le week-end avec des garanties élevées.",
      },
      {
        q: "Les bonus de bienvenue sont-ils équivalents ?",
        a: "Winamax offre jusqu'à 500€ rechargés en tickets, libérés dès les premières parties. PokerStars propose jusqu'à 600€ mais le bonus est libéré progressivement via les VPP, ce qui peut prendre plus longtemps pour les petits joueurs.",
      },
      {
        q: "Peut-on jouer sur les deux sites simultanément ?",
        a: "Oui, totalement légal en France. Beaucoup de joueurs pros utilisent les deux : Winamax pour les cash games et Expresso le matin, PokerStars pour les grosses séries MTT le dimanche.",
      },
      {
        q: "Quel site est préférable pour les freerolls ?",
        a: "PokerStars propose plus de freerolls récurrents avec des prize pools en argent réel. Winamax a des freerolls réguliers mais souvent sous forme de tickets. Pour commencer sans argent, PokerStars est légèrement avantageux.",
      },
      {
        q: "Quelle plateforme recommander pour un débutant absolu ?",
        a: "Winamax est plus adapté aux débutants francophones : interface en français parfaite, support local, mini-tables 0.01€/0.02€. PokerStars convient mieux dès que vous visez les gros MTT hebdomadaires.",
      },
    ],
  },

  "winamax-vs-unibet": {
    slug: "winamax-vs-unibet",
    title: "Winamax vs Unibet Poker : Comparatif 2025",
    metaTitle: "Winamax vs Unibet Poker 2025 — Quel site pour les débutants ?",
    metaDesc:
      "Winamax ou Unibet pour débuter au poker en ligne ? Comparez trafic, bonus, logiciel et cashout. Verdict honnête par profil de joueur.",
    platformA: {
      name: "Winamax",
      color: "amber",
      badge: "WMX",
      affiliate: "https://www.winamax.fr/poker/bonus-bienvenue",
      affiliateLabel: "Bonus Winamax 500€",
      pros: [
        "Leader français — tables remplies 24h/24",
        "Expresso (jackpots) les plus populaires de France",
        "Cashout instantané SEPA en 15 min",
        "Programme de fidélité clair avec tickets hebdo",
        "Variantes MTT: PKO, turbo, rebuy, deepstack",
        "Application mobile remarquable",
      ],
      cons: [
        "Volume élevé = joueurs réguliers plus nombreux (moins de récréatifs)",
        "Fish factor moindre aux heures creuses",
        "Moins adapté aux micro-stakes purs (<1€)",
      ],
      score: 32,
      bestFor: "Joueurs de tous niveaux voulant le meilleur volume FR",
    },
    platformB: {
      name: "Unibet",
      color: "green",
      badge: "UNI",
      affiliate: "https://www.unibet.fr/poker",
      affiliateLabel: "Bonus Unibet 200€",
      pros: [
        "Fish factor maximal : les plus gros récréatifs d'Europe",
        "Interdiction des logiciels HUD = terrain équitable",
        "Bonus mensuel cashback généreux",
        "Tournois exclusifs avec garanties décentes",
        "Environnement idéal pour débutants et joueurs loisirs",
        "Cashout fiable en 24-48h",
      ],
      cons: [
        "Trafic global faible : files d'attente en cash game",
        "Logiciel moins abouti, options limitées",
        "Pas de PLO ni variantes avancées",
        "Moins de MTT variés que Winamax",
      ],
      score: 20,
      bestFor: "Débutants et récréatifs qui veulent un environnement protégé",
    },
    verdict:
      "**Winamax écrase Unibet** sur le volume, la diversité et la technologie. **Unibet garde un avantage décisif** pour les récréatifs : ses tables sont les plus molles d'Europe grâce à l'interdiction des HUDs.",
    faqs: [
      {
        q: "Unibet est-il vraiment meilleur pour les débutants que Winamax ?",
        a: "Oui, pour une raison précise : Unibet interdit tous les logiciels d'assistance (HUD, trackers) et attire donc une clientèle de loisirs. Les tables sont statistiquement plus faciles. Winamax a un volume bien plus élevé mais des joueurs en moyenne plus compétitifs.",
      },
      {
        q: "Peut-on gagner de l'argent sur Unibet avec un niveau moyen ?",
        a: "Plus facilement que sur Winamax ou PokerStars à niveau égal, précisément grâce au fish factor. Les joueurs réguliers qui maîtrisent les bases du poker MTT peuvent dégager un ROI positif sur Unibet bien plus facilement.",
      },
      {
        q: "Le bonus Unibet vaut-il le bonus Winamax ?",
        a: "Le bonus Winamax (500€) est plus généreux nominalement. Unibet offre ~200€ avec un cashback mensuel récurrent. Pour un joueur qui joue régulièrement sur la durée, le cashback Unibet peut s'avérer plus avantageux.",
      },
      {
        q: "Winamax ou Unibet pour les tournois du dimanche ?",
        a: "Winamax sans hésiter : programme dominical beaucoup plus riche, garanties plus élevées, et le fameux Sunday de Winamax avec des prize pools conséquents. Unibet n'a pas les ressources pour rivaliser sur ce créneau.",
      },
      {
        q: "Est-ce qu'on peut jouer sur les deux en même temps ?",
        a: "Oui, tout à fait légal. Stratégie populaire : multi-tabling Unibet le week-end pour profiter des récréatifs, et Winamax en semaine pour le volume et les Expresso.",
      },
    ],
  },

  "pokerstars-vs-unibet": {
    slug: "pokerstars-vs-unibet",
    title: "PokerStars vs Unibet : Lequel choisir en 2025 ?",
    metaTitle: "PokerStars vs Unibet Poker 2025 — Comparatif détaillé",
    metaDesc:
      "PokerStars ou Unibet ? Comparez les deux plateformes sur le trafic, les bonus, le fish factor et les formats disponibles. Verdict complet.",
    platformA: {
      name: "PokerStars",
      color: "red",
      badge: "PS",
      affiliate: "https://www.pokerstars.fr/poker/bonus-bienvenue/",
      affiliateLabel: "Bonus PokerStars 600€",
      pros: [
        "Volume mondial #1 — tables disponibles à toute heure",
        "Grosses garanties : Sunday Million, séries SCOOP/WCOOP",
        "Variantes : PLO, Omaha, Stud, mixed games",
        "Micro-stakes MTT dès 0,01€",
        "Freerolls récurrents avec argent réel",
        "Satellites pour les WSOP et EPT",
      ],
      cons: [
        "Interface vieillissante",
        "Rake parmi les plus élevés du marché sur PKO",
        "Joueurs plus réguliers = tables plus difficiles",
        "Support moins disponible en français",
      ],
      score: 28,
      bestFor: "Joueurs MTT qui visent les grosses garanties et les séries mondiales",
    },
    platformB: {
      name: "Unibet",
      color: "green",
      badge: "UNI",
      affiliate: "https://www.unibet.fr/poker",
      affiliateLabel: "Bonus Unibet 200€",
      pros: [
        "Tables les plus faciles — HUDs interdits par politique",
        "Cashback mensuel récurrent",
        "Environnement débutant-friendly par design",
        "Moins de variance liée aux regs agressifs",
        "Tournois exclusifs accessibles",
        "Cashout stable et fiable",
      ],
      cons: [
        "Trafic faible : longues attentes cash game",
        "Garanties MTT limitées comparé à PokerStars",
        "Pas de séries internationales",
        "Logiciel moins complet",
      ],
      score: 20,
      bestFor: "Récréatifs et débutants qui cherchent des tables douces",
    },
    verdict:
      "**PokerStars domine largement** sur le volume, les variantes et les garanties. **Unibet est l'alternative idéale** pour les joueurs loisirs qui veulent des tables faciles sans avoir à affronter des regs munis de HUDs.",
    faqs: [
      {
        q: "PokerStars ou Unibet : quel site a le meilleur trafic ?",
        a: "PokerStars écrase Unibet sur le trafic global. En France, PokerStars génère environ 5 à 10 fois plus de parties simultanées qu'Unibet. Unibet compense par la qualité de ses joueurs (plus récréatifs en moyenne).",
      },
      {
        q: "Le rake est-il similaire sur les deux plateformes ?",
        a: "Non. PokerStars a un rake plus élevé sur les tournois PKO (jusqu'à 25% en frais) mais offre des structures compétitives en cash game. Unibet a un rake raisonnable et compense par son cashback mensuel.",
      },
      {
        q: "Unibet permet-il vraiment de gagner plus facilement ?",
        a: "Pour un joueur de niveau intermédiaire, oui. L'interdiction des HUDs et l'attraction d'une clientèle récréative signifie des EV plus élevées par main jouée. Mais le volume limité plafonne les gains absolus.",
      },
      {
        q: "Quel site recommander pour les tournois freeroll ?",
        a: "PokerStars dispose d'un programme freeroll plus structuré avec des prize pools en argent réel réguliers. Unibet propose quelques freerolls mais moins fréquents. Pour commencer gratuitement, PokerStars est supérieur.",
      },
      {
        q: "Peut-on utiliser un HUD sur PokerStars ?",
        a: "PokerStars tolère certains HUDs de base (stats temps réel). Unibet l'interdit totalement par contrat d'utilisation. Si vous dépendez d'un HUD pour votre jeu, PokerStars est votre seule option entre les deux.",
      },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(COMPARISONS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = COMPARISONS[slug];
  if (!data) return {};
  return {
    title: { absolute: data.metaTitle },
    description: data.metaDesc,
    alternates: { canonical: `${BASE_URL}/comparer/${slug}/` },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDesc,
      url: `${BASE_URL}/comparer/${slug}/`,
      siteName: "Tournois Poker",
      type: "article",
    },
  };
}

function colorClass(color: string, type: "text" | "border" | "bg") {
  const map: Record<string, Record<string, string>> = {
    amber: {
      text: "text-amber-400",
      border: "border-amber-500/40",
      bg: "bg-amber-500/10",
    },
    red: {
      text: "text-red-400",
      border: "border-red-500/40",
      bg: "bg-red-500/10",
    },
    green: {
      text: "text-green-400",
      border: "border-green-500/40",
      bg: "bg-green-500/10",
    },
  };
  return map[color]?.[type] ?? "";
}

function ScoreMeter({ score, max = 35 }: { score: number; max?: number }) {
  const pct = Math.round((score / max) * 100);
  return (
    <div className="mt-1">
      <div className="h-2 w-full rounded-full bg-slate-700">
        <div
          className="h-2 rounded-full bg-amber-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-0.5 text-xs text-slate-400">
        {score}/{max} pts
      </p>
    </div>
  );
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = COMPARISONS[slug];
  if (!data) notFound();

  const { platformA, platformB } = data;

  const breadcrumb = breadcrumbSchema([
    { name: "Accueil", url: BASE_URL },
    { name: "Comparateur", url: `${BASE_URL}/comparer-rooms/` },
    { name: data.title, url: `${BASE_URL}/comparer/${slug}/` },
  ]);

  const faq = faqSchema(data.faqs);

  const winnerName =
    platformA.score >= platformB.score ? platformA.name : platformB.name;
  const winnerColor =
    platformA.score >= platformB.score ? platformA.color : platformB.color;

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={faq} />

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-xs text-slate-500">
          <a href="/" className="hover:text-slate-300">
            Accueil
          </a>
          {" › "}
          <a href="/comparer-rooms/" className="hover:text-slate-300">
            Comparateur
          </a>
          {" › "}
          <span className="text-slate-400">{data.title}</span>
        </nav>

        {/* Hero */}
        <h1 className="text-2xl font-bold text-white md:text-3xl leading-tight mb-4">
          {data.title}
        </h1>
        <p className="text-slate-400 text-sm md:text-base mb-8 max-w-2xl">
          Comparatif objectif mis à jour en 2025. Nous analysons 7 critères clés
          pour vous aider à choisir la meilleure salle de poker en ligne selon
          votre profil.
        </p>

        {/* Winner badge */}
        <div
          className={`mb-8 rounded-xl border p-4 flex items-center gap-4 ${colorClass(winnerColor, "border")} ${colorClass(winnerColor, "bg")}`}
        >
          <div className="text-3xl">🏆</div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">
              Verdict global
            </p>
            <p className="text-base font-bold text-white">
              {winnerName} remporte cette comparaison
            </p>
            <p className="text-sm text-slate-300 mt-0.5">
              {data.verdict.replace(/\*\*/g, "")}
            </p>
          </div>
        </div>

        {/* Score cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[platformA, platformB].map((p) => (
            <div
              key={p.name}
              className={`rounded-xl border p-4 sm:p-5 ${colorClass(p.color, "border")} ${colorClass(p.color, "bg")}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${colorClass(p.color, "bg")} ${colorClass(p.color, "text")} border ${colorClass(p.color, "border")}`}
                >
                  {p.badge}
                </span>
                <span className="font-bold text-white">{p.name}</span>
                {p.score >= (p === platformA ? platformB.score : platformA.score) && (
                  <span className="ml-auto text-amber-400 text-xs font-bold">
                    WINNER
                  </span>
                )}
              </div>
              <ScoreMeter score={p.score} />
              <p className="mt-3 text-xs text-slate-400 italic">{p.bestFor}</p>
            </div>
          ))}
        </div>

        {/* Pros/Cons table */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">
            Avantages et inconvénients
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[platformA, platformB].map((p) => (
              <div
                key={p.name}
                className="rounded-xl border border-slate-700 bg-slate-900 p-5"
              >
                <h3
                  className={`font-bold text-base mb-3 ${colorClass(p.color, "text")}`}
                >
                  {p.name}
                </h3>
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-semibold text-green-400 uppercase tracking-wide">
                    ✅ Points forts
                  </p>
                  {p.pros.map((pro) => (
                    <p key={pro} className="text-sm text-slate-300 flex gap-2">
                      <span className="text-green-500 mt-0.5 flex-shrink-0">
                        +
                      </span>
                      {pro}
                    </p>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-red-400 uppercase tracking-wide">
                    ❌ Points faibles
                  </p>
                  {p.cons.map((con) => (
                    <p key={con} className="text-sm text-slate-300 flex gap-2">
                      <span className="text-red-500 mt-0.5 flex-shrink-0">
                        −
                      </span>
                      {con}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed comparison sections */}
        <section className="mb-10 space-y-8">
          <h2 className="text-xl font-bold text-white">
            Comparaison détaillée : {platformA.name} vs {platformB.name}
          </h2>

          {/* Traffic */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="font-bold text-white mb-3">
              🚦 Volume et trafic en 2025
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              Le trafic conditionne directement votre expérience de jeu : temps
              d&apos;attente avant d&apos;avoir une table, profondeur des
              tournois, et liquidité des cash games. Sur ce critère,{" "}
              <strong className="text-white">
                {platformA.score >= platformB.score
                  ? platformA.name
                  : platformB.name}
              </strong>{" "}
              prend l&apos;avantage.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              {slug === "winamax-vs-pokerstars" &&
                "Winamax domine le marché français avec plus de 60% de parts de marché sur les MTT. PokerStars reste puissant en soirée et le dimanche avec ses grosses garanties. Pour jouer à 14h en semaine, Winamax propose plus de tables actives."}
              {slug === "winamax-vs-unibet" &&
                "Winamax propose un volume 5 à 8 fois supérieur à Unibet en France. Unibet souffre de files d'attente en cash game aux heures creuses, ce qui limite la productivité des grinders multi-tables."}
              {slug === "pokerstars-vs-unibet" &&
                "PokerStars est dans une autre catégorie de volume : liquidité mondiale contre réseau français/européen limité. En cash game NL50+ et en MTT, les tables PokerStars sont pleines H24."}
            </p>
          </div>

          {/* Bonus */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="font-bold text-white mb-3">
              🎁 Bonus de bienvenue et fidélité
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="pb-2 text-slate-400 font-medium">
                      Critère
                    </th>
                    <th
                      className={`pb-2 font-medium ${colorClass(platformA.color, "text")}`}
                    >
                      {platformA.name}
                    </th>
                    <th
                      className={`pb-2 font-medium ${colorClass(platformB.color, "text")}`}
                    >
                      {platformB.name}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {[
                    {
                      label: "Bonus max",
                      a:
                        platformA.name === "Winamax"
                          ? "500€"
                          : platformA.name === "PokerStars"
                            ? "600€"
                            : "200€",
                      b:
                        platformB.name === "Winamax"
                          ? "500€"
                          : platformB.name === "PokerStars"
                            ? "600€"
                            : "200€",
                    },
                    {
                      label: "Dépôt min",
                      a: platformA.name === "Unibet" ? "10€" : "10€",
                      b: platformB.name === "Unibet" ? "10€" : "10€",
                    },
                    {
                      label: "Déblocage",
                      a:
                        platformA.name === "Winamax"
                          ? "Tickets immédiats"
                          : platformA.name === "PokerStars"
                            ? "VPP progressif"
                            : "Cashback mensuel",
                      b:
                        platformB.name === "Winamax"
                          ? "Tickets immédiats"
                          : platformB.name === "PokerStars"
                            ? "VPP progressif"
                            : "Cashback mensuel",
                    },
                    {
                      label: "Fidélité",
                      a:
                        platformA.name === "Winamax"
                          ? "Tickets hebdo"
                          : platformA.name === "PokerStars"
                            ? "Stars Rewards"
                            : "Cashback récurrent",
                      b:
                        platformB.name === "Winamax"
                          ? "Tickets hebdo"
                          : platformB.name === "PokerStars"
                            ? "Stars Rewards"
                            : "Cashback récurrent",
                    },
                  ].map((row) => (
                    <tr key={row.label}>
                      <td className="py-2 text-slate-400">{row.label}</td>
                      <td className="py-2 text-slate-200">{row.a}</td>
                      <td className="py-2 text-slate-200">{row.b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              * Conditions de bonus vérifiées en janvier 2025. Consultez{" "}
              <a
                href="/guide/bonus-poker/"
                className="text-amber-400 hover:text-amber-300"
              >
                notre guide bonus complet
              </a>{" "}
              pour les détails de déblocage.
            </p>
          </div>

          {/* Formats */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="font-bold text-white mb-3">
              🎯 Formats de tournois disponibles
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              La richesse des formats conditionne votre capacité à diversifier
              votre jeu et trouver les spots les plus profitables.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[platformA, platformB].map((p) => (
                <div key={p.name}>
                  <p
                    className={`text-sm font-semibold mb-2 ${colorClass(p.color, "text")}`}
                  >
                    {p.name}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(p.name === "Winamax"
                      ? [
                          "MTT",
                          "PKO",
                          "Expresso",
                          "Turbo",
                          "Hyper",
                          "Rebuy",
                          "Deepstack",
                          "Satellite",
                          "Freeroll",
                        ]
                      : p.name === "PokerStars"
                        ? [
                            "MTT",
                            "PKO",
                            "Spin&Go",
                            "PLO",
                            "Mixed",
                            "Turbo",
                            "Rebuy",
                            "ZOOM",
                            "Freeroll",
                          ]
                        : ["MTT", "PKO", "Turbo", "Freeroll", "Satellite"]
                    ).map((f) => (
                      <span
                        key={f}
                        className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cashout */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="font-bold text-white mb-3">
              💸 Cashout et méthodes de paiement
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {slug === "winamax-vs-pokerstars" &&
                "Winamax excelle sur le cashout : virement SEPA en 15 minutes, disponible 24h/24. PokerStars traite les virements en 24-48h selon le volume. Pour les joueurs qui ont besoin de liquidités rapides, Winamax est net winner."}
              {slug === "winamax-vs-unibet" &&
                "Les deux plateformes proposent le virement SEPA comme méthode principale. Winamax est plus rapide (15 min contre 24-48h pour Unibet). Unibet reste fiable et sans problème pour les montants standards."}
              {slug === "pokerstars-vs-unibet" &&
                "PokerStars et Unibet traitent les virements en 24-48h. PokerStars supporte plus de méthodes (Skrill, Neteller, crypto via certaines régions). Unibet est plus simple mais moins flexible sur les méthodes alternatives."}
            </p>
          </div>
        </section>

        {/* Verdict by profile */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">
            Verdict selon votre profil
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: "🎓",
                profile: "Débutant",
                winner:
                  slug === "winamax-vs-pokerstars"
                    ? "Winamax"
                    : slug === "winamax-vs-unibet"
                      ? "Unibet"
                      : "Unibet",
                reason:
                  slug === "winamax-vs-pokerstars"
                    ? "Interface française, support local, volume élevé pour apprendre"
                    : slug === "winamax-vs-unibet"
                      ? "Tables les plus faciles, environnement protégé sans HUD"
                      : "Tables douces, environnement bienveillant sans regs agressifs",
              },
              {
                icon: "📈",
                profile: "Grinder régulier",
                winner:
                  slug === "winamax-vs-pokerstars"
                    ? "Winamax"
                    : slug === "winamax-vs-unibet"
                      ? "Winamax"
                      : "PokerStars",
                reason:
                  slug === "winamax-vs-pokerstars"
                    ? "Volume en semaine, Expresso, cashout rapide pour le bankroll management"
                    : slug === "winamax-vs-unibet"
                      ? "Volume 5x supérieur, diversité des formats, programme fidélité"
                      : "Volume mondial, ZOOM cash, variantes PLO pour diversifier",
              },
              {
                icon: "💎",
                profile: "High-roller / MTT pro",
                winner:
                  slug === "winamax-vs-pokerstars"
                    ? "PokerStars"
                    : slug === "winamax-vs-unibet"
                      ? "Winamax"
                      : "PokerStars",
                reason:
                  slug === "winamax-vs-pokerstars"
                    ? "Grosses garanties Sunday Million, SCOOP, WCOOP, satellites live"
                    : slug === "winamax-vs-unibet"
                      ? "Meilleures garanties, plus grands fields, programme fidélité adapté"
                      : "Séries mondiales, satellites WSOP/EPT, liquidité H24 en high-stakes",
              },
            ].map((v) => (
              <div
                key={v.profile}
                className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-center"
              >
                <div className="text-2xl mb-2">{v.icon}</div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">
                  {v.profile}
                </p>
                <p className="font-bold text-white text-sm mb-2">
                  → {v.winner}
                </p>
                <p className="text-xs text-slate-400">{v.reason}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">
            Questions fréquentes
          </h2>
          <div className="space-y-4">
            {data.faqs.map((faqItem) => (
              <div
                key={faqItem.q}
                className="rounded-xl border border-slate-800 bg-slate-900 p-4"
              >
                <p className="font-semibold text-white text-sm mb-2">
                  {faqItem.q}
                </p>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {faqItem.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA double */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {[platformA, platformB].map((p) => (
            <div
              key={p.name}
              className={`rounded-xl border p-5 text-center ${colorClass(p.color, "border")} ${colorClass(p.color, "bg")}`}
            >
              <p className="font-bold text-white mb-1">{p.name}</p>
              <p className="text-xs text-slate-400 mb-3">{p.bestFor}</p>
              <a
                href={p.affiliate}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className={`block w-full rounded-lg px-4 py-2.5 font-bold text-sm transition-colors ${
                  p.color === "amber"
                    ? "bg-amber-500 text-black hover:bg-amber-400"
                    : p.color === "red"
                      ? "bg-red-600 text-white hover:bg-red-500"
                      : "bg-green-600 text-white hover:bg-green-500"
                }`}
              >
                {p.affiliateLabel} →
              </a>
            </div>
          ))}
        </div>

        {/* Cross-links */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm font-semibold text-white mb-3">
            Continuer votre recherche
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="/comparer-rooms/"
              className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
            >
              ← Comparateur complet des 3 rooms
            </a>
            {Object.keys(COMPARISONS)
              .filter((s) => s !== slug)
              .map((s) => (
                <a
                  key={s}
                  href={`/comparer/${s}/`}
                  className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
                >
                  · {COMPARISONS[s].title.split(" : ")[0]}
                </a>
              ))}
            <a
              href="/guide/bonus-poker/"
              className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
            >
              · Guide bonus de bienvenue
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
