import type { Metadata } from "next";
import {
  getUnifiedTournaments,
  getAvailableDates,
  getParisTodayDate,
} from "@/lib/tournaments";
import { TournamentsDashboard } from "@/components/TournamentsDashboard";
import { JsonLd, breadcrumbSchema, faqSchema, BASE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tournois Poker Dimanche – Sunday Million 1M$, Sunday Warm-Up & Séries",
  description:
    "Programme complet des tournois poker du dimanche : Sunday Million 1M$, Sunday Warm-Up 500K$, Sunday Storm, Séries Winamax. Les plus grosses garanties de la semaine en France.",
  alternates: {
    canonical: `${BASE_URL}/tournois/dimanche/`,
  },
  openGraph: {
    title: "Tournois Poker Dimanche – Sunday Million 1M$, Sunday Warm-Up & Séries",
    description:
      "Programme complet des tournois poker du dimanche : Sunday Million 1M$, Sunday Warm-Up 500K$, Sunday Storm, séries Winamax. Les plus grosses garanties hebdomadaires.",
    url: `${BASE_URL}/tournois/dimanche/`,
    type: "website",
  },
};

/** Returns the next Sunday date (YYYY-MM-DD) at or after a given date */
function getNextSunday(from: string): string {
  const d = new Date(from + "T12:00:00Z");
  const day = d.getUTCDay(); // 0 = Sunday
  const daysUntilSunday = day === 0 ? 0 : 7 - day;
  d.setUTCDate(d.getUTCDate() + daysUntilSunday);
  return d.toISOString().slice(0, 10);
}

/** Returns all Sunday dates from a list */
function getSundayDates(dates: string[]): string[] {
  return dates.filter((d) => new Date(d + "T12:00:00Z").getUTCDay() === 0);
}

const SUNDAY_KEYWORDS =
  /\bsunday\b|dimanche|warm.?up|million|storm|supersonic|special|big game/i;

const FAQS = [
  {
    q: "Quel est le tournoi poker du dimanche avec la plus grosse garantie ?",
    a: "Le Sunday Million de PokerStars est le plus grand tournoi hebdomadaire avec 1 million de dollars garantis chaque dimanche. Le buy-in est de 215$ et il attire plusieurs milliers de participants chaque semaine.",
  },
  {
    q: "À quelle heure commence le Sunday Million ?",
    a: "Le Sunday Million de PokerStars démarre chaque dimanche à 15h00 heure française (14h00 UTC). Le Sunday Warm-Up commence à 14h30 et le Sunday Storm à 14h00.",
  },
  {
    q: "Quels sont les tournois du dimanche sur Winamax ?",
    a: "Winamax propose chaque dimanche la Sunday Freeze (deep stack, late reg réduit), la Sunday Superstack (starting stack élevé), et lors des séries SISMIX/SMASK, des Main Events avec des garanties importantes. Les formats varient selon les semaines.",
  },
  {
    q: "Peut-on se qualifier pour le Sunday Million sans payer 215$ ?",
    a: "Oui, PokerStars propose des satellites quotidiens dès 0,11$ pour se qualifier au Sunday Million. Des Hyper-Turbo et Step Satellites permettent de gagner un billet pour une fraction du buy-in direct.",
  },
  {
    q: "Quelle stratégie adopter pour les gros tournois du dimanche ?",
    a: "Les tournois du dimanche attirent beaucoup de joueurs récréatifs. En début de tournoi, jouez tight et laissez les autres s'éliminer. En phase finale, maîtrisez l'ICM pour optimiser vos décisions aux spots critiques. La gestion de la fatigue sur ces sessions longues est également clé.",
  },
  {
    q: "Combien dure une session de dimanche poker en ligne ?",
    a: "Prévoyez 8 à 12 heures pour les gros tournois du type Sunday Million. Avec les rebuy/add-on, les pause breaks et les niveaux lents, une session complète peut dépasser minuit si vous atteignez les tables finales.",
  },
];

export default function DimanchePage() {
  const all = getUnifiedTournaments();
  const today = getParisTodayDate();
  const allDates = getAvailableDates(all);

  // Tournaments on Sundays OR with "Sunday" in the name
  const tournaments = all.filter(
    (t) =>
      new Date(t.date + "T12:00:00Z").getUTCDay() === 0 ||
      SUNDAY_KEYWORDS.test(t.name)
  );

  const dates = getAvailableDates(tournaments);
  const sundayDates = getSundayDates(allDates);
  const nextSunday = getNextSunday(today);

  const sundayTourneys = tournaments.filter((t) => t.date === nextSunday);
  const totalGtd = sundayTourneys.reduce(
    (sum, t) => sum + (t.guarantee ?? 0),
    0
  );

  function formatGtd(v: number): string {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M€`;
    if (v >= 1000) return `${Math.round(v / 1000)}K€`;
    return `${v}€`;
  }

  const updatedAt = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const breadcrumb = breadcrumbSchema([
    { name: "Accueil", url: BASE_URL + "/" },
    { name: "Tournois", url: BASE_URL + "/tournois/winamax/" },
    { name: "Tournois du Dimanche", url: BASE_URL + "/tournois/dimanche/" },
  ]);
  const faq = faqSchema(FAQS);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <JsonLd data={breadcrumb} />
      <JsonLd data={faq} />

      {/* Breadcrumb */}
      <nav className="mb-6 text-xs text-slate-500" aria-label="Fil d'Ariane">
        <a href="/" className="hover:text-slate-300 transition-colors">Accueil</a>
        <span className="mx-2">/</span>
        <a href="/tournois/winamax/" className="hover:text-slate-300 transition-colors">Tournois</a>
        <span className="mx-2">/</span>
        <span className="text-slate-400">Dimanche</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-purple-400 text-3xl">🏆</span>
          <h1 className="text-3xl font-bold text-white">
            Tournois du Dimanche
          </h1>
        </div>
        <p className="text-slate-400">
          Le dimanche est le jour des grandes garanties au poker en ligne.{" "}
          {sundayDates.length > 0 && sundayTourneys.length > 0 && (
            <>
              <strong className="text-white">
                {sundayTourneys.length} tournois
              </strong>{" "}
              dimanche prochain
              {totalGtd > 0 && (
                <>
                  {" "}
                  — plus de{" "}
                  <strong className="text-green-400">
                    {formatGtd(totalGtd)}
                  </strong>{" "}
                  garantis au total.
                </>
              )}
            </>
          )}
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Sunday Million, Sunday Warm-Up, Sunday Storm et les grandes séries
          Winamax — tous les dimanches. Mis à jour le {updatedAt}.
        </p>
      </div>

      {/* Featured Sunday events info */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          {
            name: "Sunday Million",
            platform: "PokerStars",
            color: "border-red-500/30 bg-red-500/5",
            textColor: "text-red-400",
            desc: "Le plus grand tournoi hebdomadaire — 1M$ garanti chaque dimanche.",
          },
          {
            name: "Sunday Warm-Up",
            platform: "PokerStars",
            color: "border-red-500/20 bg-red-500/5",
            textColor: "text-red-400",
            desc: "Le classique du dimanche — 500K$ GTD avec un format accessible.",
          },
          {
            name: "Séries Winamax",
            platform: "Winamax",
            color: "border-amber-500/30 bg-amber-500/5",
            textColor: "text-amber-400",
            desc: "SISMIX, SMASK, Sunday Freeze : les événements phares de Winamax.",
          },
        ].map((e) => (
          <div
            key={e.name}
            className={`rounded-xl border p-4 ${e.color}`}
          >
            <div className={`font-bold text-sm ${e.textColor}`}>{e.name}</div>
            <div className="text-xs text-slate-500 mb-1">{e.platform}</div>
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
          <p className="text-4xl mb-3">📅</p>
          <p>Aucun tournoi dimanche dans les données disponibles.</p>
          <p className="text-sm mt-2">
            Les données sont mises à jour chaque nuit à 2h00.
          </p>
        </div>
      )}

      {/* Affiliate CTAs */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center">
          <div className="text-xl font-bold text-red-400 mb-1">
            ★ Sunday Million
          </div>
          <p className="text-sm text-slate-300 mb-4">
            1M$ garanti tous les dimanches sur PokerStars.
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
            ♠ Winamax Dimanche
          </div>
          <p className="text-sm text-slate-300 mb-4">
            Séries et tournois spéciaux chaque dimanche sur Winamax.
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

        {/* Section 1 — Pourquoi le dimanche */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            Pourquoi le dimanche est le jour idéal au poker en ligne
          </h2>
          <p>
            Le dimanche s&apos;est imposé comme le rendez-vous incontournable des joueurs de poker en ligne du monde entier. Cette concentration de gros tournois n&apos;est pas un hasard : les opérateurs ont constaté très tôt que le dimanche, jour sans contraintes professionnelles, attire le plus grand nombre de participants disponibles pour des sessions longues.
          </p>
          <p className="mt-3">
            Le résultat est une compétition unique : les prize pools explosent, les overlays (garanties non couvertes) se font rares et les champs de joueurs atteignent des milliers de participants. Pour un joueur français, la &quot;Sunday session&quot; représente l&apos;opportunité de remporter plusieurs fois son buy-in en une seule journée — à condition de tenir la distance et d&apos;adapter sa stratégie.
          </p>
          <p className="mt-3">
            Sur les plateformes françaises, trois grands rendez-vous structurent ce dimanche poker : <strong className="text-white">PokerStars avec son écosystème Sunday</strong>, <strong className="text-white">Winamax avec ses séries hebdomadaires</strong>, et <strong className="text-white">Unibet avec ses Sunday Specials</strong>. Chaque opérateur propose une identité distincte, des buy-ins variés et des formats adaptés à tous les niveaux.
          </p>
        </section>

        {/* Section 2 — Tournois incontournables */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            Les tournois incontournables du dimanche
          </h2>
          <p>
            Chaque dimanche, un programme chargé attend les joueurs français. Voici les événements à ne pas manquer, classés par opérateur.
          </p>

          <h3 className="text-lg font-semibold text-red-400 mt-6 mb-2">
            PokerStars : l&apos;écosystème Sunday complet
          </h3>
          <p>
            PokerStars domine le calendrier du dimanche avec une gamme complète de tournois qui couvre toutes les bankrolls :
          </p>
          <ul className="mt-3 space-y-2 ml-4">
            <li className="flex gap-2">
              <span className="text-red-400 font-bold shrink-0">Sunday Million (215$)</span>
              <span>— Le phare du poker en ligne. 1M$ garanti, départ 15h00, des milliers de joueurs chaque semaine.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-400 font-bold shrink-0">Sunday Warm-Up (215$)</span>
              <span>— 500K$ GTD, structure profonde, idéal pour les joueurs cherchant une alternative au Million.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-400 font-bold shrink-0">Sunday Storm (11$)</span>
              <span>— Le format accessible par excellence. Champ massif, garantie solide, parfait pour débuter les Sunday sessions.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-400 font-bold shrink-0">Sunday Supersonic (215$)</span>
              <span>— Format hyper-turbo pour ceux qui veulent du punch en fin de soirée.</span>
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-amber-400 mt-6 mb-2">
            Winamax : des séries hebdomadaires dynamiques
          </h3>
          <p>
            Winamax se distingue par ses formats de tournois originaux, souvent avec des buy-ins plus accessibles. Chaque dimanche propose :
          </p>
          <ul className="mt-3 space-y-2 ml-4">
            <li className="flex gap-2">
              <span className="text-amber-400 font-bold shrink-0">Sunday Freeze</span>
              <span>— No-rebuy, starting stack profond, late registration réduite. Format qui favorise les bons joueurs.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400 font-bold shrink-0">Sunday Superstack</span>
              <span>— Starting stack élevé, structure lente. Le deep-stack du dimanche Winamax.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400 font-bold shrink-0">Séries SISMIX & SMASK</span>
              <span>— Lors des grandes périodes de séries Winamax, le dimanche inclut des Main Events avec des garanties importantes dépassant souvent 500K€.</span>
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-blue-400 mt-6 mb-2">
            Unibet : le Sunday Special
          </h3>
          <p>
            Unibet propose chaque dimanche un Sunday Special en soirée (20h00) avec des garanties modestes mais adaptées à sa communauté. Idéal pour les joueurs récréatifs cherchant une atmosphère conviviale.
          </p>
        </section>

        {/* Section 3 — Programme par buy-in */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            Programme dimanche par tranche de buy-in
          </h2>
          <p>
            Quel que soit votre budget, le dimanche offre des options adaptées. Voici comment se répartissent les opportunités selon votre bankroll :
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              {
                range: "0€ – 5€",
                color: "border-green-500/30 bg-green-500/5",
                titleColor: "text-green-400",
                events: ["Freerolls dimanche (Winamax, PokerStars)", "Sunday Storm 11$ (PokerStars)", "Satellites qualify pour gros tournois"],
              },
              {
                range: "5€ – 50€",
                color: "border-blue-500/30 bg-blue-500/5",
                titleColor: "text-blue-400",
                events: ["Qualifications Sunday Million", "Sunday Warm-Up via satellites", "Tournois Sunday Winamax mid-stakes"],
              },
              {
                range: "50€ – 215€+",
                color: "border-purple-500/30 bg-purple-500/5",
                titleColor: "text-purple-400",
                events: ["Sunday Million 215$ (1M$ GTD)", "Sunday Warm-Up 215$ (500K$ GTD)", "Sunday Supersonic 215$"],
              },
            ].map((tier) => (
              <div key={tier.range} className={`rounded-xl border p-4 ${tier.color}`}>
                <div className={`font-bold text-sm mb-3 ${tier.titleColor}`}>{tier.range}</div>
                <ul className="space-y-1">
                  {tier.events.map((e) => (
                    <li key={e} className="text-xs text-slate-400 flex gap-1.5">
                      <span className="text-slate-600 shrink-0">—</span>
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 — Stratégie */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            Stratégie pour les tournois du dimanche
          </h2>
          <p>
            Jouer un gros tournoi du dimanche n&apos;est pas comparable à un MTT classique en semaine. Le champ est plus large, les joueurs plus variés et la durée de la session peut dépasser 10 heures. Voici les piliers stratégiques à maîtriser.
          </p>

          <h3 className="text-lg font-semibold text-white mt-5 mb-2">1. Phases early : patience et exploitation</h3>
          <p>
            Les premières heures attirent de nombreux joueurs récréatifs du dimanche qui jouent largement ou trop agressivement. Évitez les grands pots avec des mains marginales, attendez les spots favorables et laissez les erreurs adverses alimenter votre stack.
          </p>

          <h3 className="text-lg font-semibold text-white mt-5 mb-2">2. Mid-game : adapter son jeu à la bulle</h3>
          <p>
            Avec des champs de 5000+ joueurs, la bulle est lointaine mais l&apos;approche de l&apos;argent comprime les décisions. Le <strong className="text-white">push-fold chart</strong> devient essentiel pour les stacks courts, tandis que les big stacks doivent exploiter les joueurs courts agressivement.
          </p>

          <h3 className="text-lg font-semibold text-white mt-5 mb-2">3. Phase finale et ICM</h3>
          <p>
            Atteindre la table finale d&apos;un Sunday Million change radicalement les dynamiques. L&apos;ICM (Independent Chip Model) prend le dessus sur la simple EV chip. Pour approfondir ces concepts :
          </p>
          <div className="mt-3 rounded-lg bg-slate-800/60 p-4 border border-slate-700/50">
            <p className="text-sm text-slate-300 font-medium mb-2">Guides recommandés :</p>
            <ul className="space-y-1">
              <li>
                <a href="/guide/mtt-strategie-poker/" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                  → Stratégie MTT : guide complet pour les tournois multi-tables
                </a>
              </li>
              <li>
                <a href="/guide/icm-tournoi-poker/" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                  → ICM au poker : comprendre et appliquer l&apos;Independent Chip Model
                </a>
              </li>
              <li>
                <a href="/guide/final-table-poker/" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                  → Table finale : stratégie et deals
                </a>
              </li>
            </ul>
          </div>

          <h3 className="text-lg font-semibold text-white mt-5 mb-2">4. Gestion de la fatigue</h3>
          <p>
            Une session Sunday complète peut durer jusqu&apos;à minuit ou plus. Préparez-vous mentalement : pauses régulières, hydratation, repas léger en cours de session. La fatigue en fin de tournoi est un des facteurs les plus sous-estimés par les joueurs amateurs.
          </p>
        </section>

        {/* Section 5 — Satellites */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            Se qualifier via les satellites : jouer le Sunday Million pour 10€
          </h2>
          <p>
            L&apos;une des grandes forces de PokerStars est son système de satellites, qui permet à n&apos;importe quel joueur d&apos;accéder au Sunday Million (215$) pour une fraction du prix. Voici comment le système fonctionne :
          </p>
          <ul className="mt-3 space-y-2 ml-4">
            <li className="flex gap-2">
              <span className="text-slate-500 shrink-0">→</span>
              <span>Les <strong className="text-white">Step Satellites</strong> permettent de monter progressivement : Step 1 (1,10$) → Step 2 (11$) → Step 3 (55$) → billet 215$.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-slate-500 shrink-0">→</span>
              <span>Des <strong className="text-white">Direct Satellites</strong> à 11$, 22$ et 55$ distribuent des billets directs chaque jour.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-slate-500 shrink-0">→</span>
              <span>Les <strong className="text-white">Hyper-Turbo Satellites</strong> du dimanche matin offrent une dernière chance pour intégrer le tournoi.</span>
            </li>
          </ul>
          <p className="mt-3">
            Sur Winamax, des satellites similaires existent pour les séries SISMIX et SMASK, souvent avec des buy-ins dès 1€ pour les qualifications les plus précoces.
          </p>
        </section>

        {/* Section 6 — FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">
            Questions fréquentes sur les tournois du dimanche
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
