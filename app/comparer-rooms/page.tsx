import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema, BASE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Comparer les Rooms de Poker – Winamax vs PokerStars vs Unibet 2026",
  description:
    "Comparatif complet des salles de poker en ligne en France 2026 : Winamax, PokerStars et Unibet. Trafic, logiciel, bonus, formats, cashout — tout pour choisir la meilleure room.",
  alternates: { canonical: `${BASE_URL}/comparer-rooms/` },
  openGraph: {
    title: "Comparer les Rooms de Poker – Winamax vs PokerStars vs Unibet 2026",
    description:
      "Tableau comparatif complet des 3 salles de poker légales en France. Trafic, logiciel, bonus, fish factor, cashout.",
    url: `${BASE_URL}/comparer-rooms/`,
    type: "website",
  },
};

const FAQS = [
  {
    q: "Quelle est la meilleure salle de poker en ligne en France en 2026 ?",
    a: "Winamax est le leader incontesté du marché français en termes de volume et de trafic MTT. PokerStars offre les plus grandes garanties mondiales. Pour les débutants cherchant un field facile, Unibet est la valeur sûre. La meilleure room dépend de votre profil.",
  },
  {
    q: "Peut-on jouer sur plusieurs rooms simultanément ?",
    a: "Oui. Winamax, PokerStars France et Unibet sont des plateformes indépendantes régulées par l'ANJ. Vous pouvez ouvrir un compte sur chacune et profiter du bonus de bienvenue sur chaque plateforme, soit jusqu'à 1 300€ de bonus cumulés.",
  },
  {
    q: "Winamax ou PokerStars pour les tournois MTT ?",
    a: "Winamax est supérieur pour les MTT français quotidiens (volume, fish factor, programme varié). PokerStars s'impose pour les grands events hebdomadaires et les séries mondiales (Sunday Million 1M$, SCOOP, WCOOP). L'idéal est d'avoir les deux.",
  },
  {
    q: "Quel logiciel de poker est le meilleur entre Winamax, PokerStars et Unibet ?",
    a: "PokerStars a historiquement le logiciel le plus complet (HUD compatible, lobby riche, mobile excellent). Winamax offre une interface intuitive très appréciée des joueurs français. Unibet a simplifié son lobby pour les débutants — moins de fonctionnalités avancées.",
  },
  {
    q: "Comment fonctionne le cashout sur ces plateformes ?",
    a: "Les 3 plateformes proposent des retraits rapides (1 à 5 jours ouvrés). Winamax et PokerStars offrent plusieurs méthodes (virement, Skrill, PayPal selon disponibilité). La vérification d'identité (KYC) est obligatoire sur toutes les plateformes agréées ANJ avant le premier retrait.",
  },
  {
    q: "Quelle room offre le meilleur rakeback en France ?",
    a: "Winamax offre un cashback de 20 à 35% selon l'activité mensuelle. PokerStars propose un système de fidélité Stars Rewards moins transparent. Unibet a un programme de points plus simple. Pour un grinder MTT, Winamax est généralement le plus rentable.",
  },
  {
    q: "Les sites de poker sont-ils sécurisés et légaux en France ?",
    a: "Oui. Winamax, PokerStars France et Unibet sont agréés par l'Autorité Nationale des Jeux (ANJ). Les fonds des joueurs sont séparés des fonds de l'opérateur et protégés. Ces plateformes sont soumises à des audits réguliers.",
  },
  {
    q: "Unibet vaut-il la peine par rapport à Winamax et PokerStars ?",
    a: "Unibet a un volume plus faible mais un fish factor excellent — le niveau moyen des joueurs est plus faible, ce qui génère un ROI potentiellement supérieur pour les réguliers. C'est aussi la plateforme la plus accessible pour un débutant avec un dépôt minimum de 10€.",
  },
];

const SCORES = [
  {
    critere: "Volume de trafic MTT",
    winamax: 5,
    pokerstars: 4,
    unibet: 2,
    detail: "Winamax domine le marché français. PokerStars reste puissant sur les créneaux hebdo. Unibet a un volume limité.",
  },
  {
    critere: "Qualité du logiciel",
    winamax: 4,
    pokerstars: 5,
    unibet: 3,
    detail: "PokerStars a le lobby le plus complet. Winamax est excellent en ergonomie. Unibet est simplifié mais fonctionnel.",
  },
  {
    critere: "Bonus de bienvenue",
    winamax: 5,
    pokerstars: 4,
    unibet: 3,
    detail: "Winamax 500€ avec conditions raisonnables. PokerStars 600€ mais déblocage complexe. Unibet 200€ simple à obtenir.",
  },
  {
    critere: "Variété des formats",
    winamax: 4,
    pokerstars: 5,
    unibet: 3,
    detail: "PokerStars propose PLO, Stud, Mixed Games, Zoom. Winamax couvre tous les formats MTT/SNG. Unibet se concentre sur le NLHE.",
  },
  {
    critere: "Fish factor (level moyen)",
    winamax: 4,
    pokerstars: 3,
    unibet: 5,
    detail: "Plus le score est haut, plus le field est accessible. Unibet attire les joueurs récréatifs. PokerStars le plus compétitif.",
  },
  {
    critere: "Cashout & Fiabilité",
    winamax: 5,
    pokerstars: 4,
    unibet: 4,
    detail: "Winamax 1er retrait ultra-rapide. PokerStars fiable mais délais variables. Unibet correct.",
  },
  {
    critere: "Rakeback / Fidélité",
    winamax: 5,
    pokerstars: 3,
    unibet: 3,
    detail: "Winamax cashback 20-35% transparent. PokerStars Stars Rewards moins avantageux pour MTT. Unibet correct.",
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex justify-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= n ? "text-amber-400" : "text-slate-700"}>★</span>
      ))}
    </div>
  );
}

export default function ComparerRoomsPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Accueil", url: BASE_URL + "/" },
    { name: "Comparer les rooms", url: BASE_URL + "/comparer-rooms/" },
  ]);
  const faqJsonLd = faqSchema(FAQS);

  const totals = {
    winamax: SCORES.reduce((s, r) => s + r.winamax, 0),
    pokerstars: SCORES.reduce((s, r) => s + r.pokerstars, 0),
    unibet: SCORES.reduce((s, r) => s + r.unibet, 0),
  };

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={faqJsonLd} />

      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 text-xs text-slate-500">
          <a href="/" className="hover:text-slate-300 transition-colors">Accueil</a>
          <span className="mx-2">/</span>
          <span className="text-slate-400">Comparatif rooms</span>
        </nav>

        {/* Header */}
        <div className="mb-10 max-w-3xl">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs text-amber-400 font-medium">
            Mis à jour mars 2026 · Sites légaux ANJ
          </div>
          <h1 className="text-3xl font-bold text-white md:text-4xl leading-tight">
            Comparer les Rooms de Poker en France
          </h1>
          <p className="mt-4 text-slate-400 leading-relaxed text-lg">
            Winamax, PokerStars ou Unibet ? Ce comparatif analyse les 3 salles de poker légales en France sur 7 critères clés pour vous aider à choisir — ou à combiner les plateformes.
          </p>
        </div>

        {/* Comparison table */}
        <div className="mb-12 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 w-48">Critère</th>
                <th className="px-4 py-4 text-center">
                  <div className="font-bold text-amber-400 text-base">♠ Winamax</div>
                </th>
                <th className="px-4 py-4 text-center">
                  <div className="font-bold text-red-400 text-base">★ PokerStars</div>
                </th>
                <th className="px-4 py-4 text-center">
                  <div className="font-bold text-green-400 text-base">♣ Unibet</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {SCORES.map((row) => (
                <tr key={row.critere} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-200 text-sm">{row.critere}</div>
                    <div className="text-xs text-slate-500 mt-0.5 hidden sm:block">{row.detail}</div>
                  </td>
                  <td className="px-4 py-3"><Stars n={row.winamax} /></td>
                  <td className="px-4 py-3"><Stars n={row.pokerstars} /></td>
                  <td className="px-4 py-3"><Stars n={row.unibet} /></td>
                </tr>
              ))}
              <tr className="border-t-2 border-slate-700 bg-slate-800/50">
                <td className="px-4 py-3 font-bold text-white">Score total / 35</td>
                <td className="px-4 py-3 text-center font-bold text-amber-400 text-xl">{totals.winamax}</td>
                <td className="px-4 py-3 text-center font-bold text-red-400 text-xl">{totals.pokerstars}</td>
                <td className="px-4 py-3 text-center font-bold text-green-400 text-xl">{totals.unibet}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Verdicts rapides */}
        <div className="grid gap-5 sm:grid-cols-3 mb-12">
          {[
            {
              platform: "♠ Winamax",
              color: "border-amber-500/40 bg-amber-500/5",
              badge: "bg-amber-500/20 text-amber-400",
              badgeText: "#1 France",
              title: "Le choix numéro 1",
              body: "Leader du marché français en volume MTT. Interface soignée, freerolls quotidiens, séries SISMIX/SMASK, rakeback transparent. Le meilleur rapport qualité/volume pour un joueur régulier en France.",
              cta: "Ouvrir un compte Winamax",
              url: "https://www.winamax.fr/poker/bonus-bienvenue",
              btnColor: "bg-amber-500 text-black hover:bg-amber-400",
              profile: "Pour : Tous niveaux, grinders français",
            },
            {
              platform: "★ PokerStars",
              color: "border-red-500/40 bg-red-500/5",
              badge: "bg-red-500/20 text-red-400",
              badgeText: "Grosses garanties",
              title: "Le plus grands événements",
              body: "Sunday Million 1M$ hebdomadaire, séries mondiales SCOOP/WCOOP/TCOOP, qualifications live EPT. Le logiciel de référence internationale. Incontournable pour accéder aux plus grands tournois.",
              cta: "Ouvrir un compte PokerStars",
              url: "https://www.pokerstars.fr/poker/bonus-bienvenue/",
              btnColor: "bg-red-600 text-white hover:bg-red-500",
              profile: "Pour : Joueurs ambitieux, grands events",
            },
            {
              platform: "♣ Unibet",
              color: "border-green-500/40 bg-green-500/5",
              badge: "bg-green-500/20 text-green-400",
              badgeText: "Fish factor max",
              title: "Le plus accessible",
              body: "Field ultra-soft, dépôt minimum 10€, interface simplifiée. Moins de volume mais ROI potentiellement supérieur pour un joueur discipliné. Idéal pour débuter ou exploiter un field récréatif.",
              cta: "Ouvrir un compte Unibet",
              url: "https://www.unibet.fr/poker/bonus",
              btnColor: "bg-green-600 text-white hover:bg-green-500",
              profile: "Pour : Débutants, joueurs récréatifs",
            },
          ].map((v) => (
            <div key={v.platform} className={`rounded-2xl border p-5 ${v.color}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-white">{v.platform}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${v.badge}`}>{v.badgeText}</span>
              </div>
              <h2 className="font-bold text-white text-lg mb-2">{v.title}</h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">{v.body}</p>
              <p className="text-xs text-slate-500 mb-4 italic">{v.profile}</p>
              <a
                href={v.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className={`block w-full text-center rounded-lg px-4 py-2.5 text-sm font-bold transition-colors ${v.btnColor}`}
              >
                {v.cta} →
              </a>
            </div>
          ))}
        </div>

        {/* Long-form content */}
        <div className="max-w-4xl space-y-12 text-slate-300 leading-relaxed">

          {/* 1. Trafic */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Volume de trafic : Winamax domine en France</h2>
            <p>
              Le <strong className="text-white">trafic de joueurs</strong> est probablement le critère le plus important pour un joueur de tournois MTT. Sans suffisamment de joueurs, les tournois ne se lancent pas, les garanties ne sont pas atteintes, et les sessions deviennent impossibles aux heures creuses.
            </p>
            <p className="mt-3">
              <strong className="text-white">Winamax</strong> s&apos;impose comme le leader incontesté du marché français depuis plusieurs années. La plateforme propose plus de 1 000 tournois par semaine avec des fields de taille conséquente. Les daily MTT à 5€–20€ se lancent facilement de midi jusqu&apos;à minuit, y compris en semaine. C&apos;est la <a href="/tournois/winamax/" className="text-amber-400 hover:text-amber-300 transition-colors">plateforme de référence pour les tournois MTT français</a>.
            </p>
            <p className="mt-3">
              <strong className="text-white">PokerStars France</strong>, bien qu&apos;ayant perdu du terrain depuis la réouverture des marchés nationaux en 2011, conserve un trafic significatif notamment grâce au <strong className="text-white">Sunday Million</strong> (1 000 000$ garanti chaque dimanche) et aux grandes séries SCOOP/WCOOP. Hors séries, le volume est acceptable mais nettement inférieur à Winamax sur les créneaux daily.
            </p>
            <p className="mt-3">
              <strong className="text-white">Unibet</strong> a un volume sensiblement plus faible. Les tournois daily se lancent régulièrement mais avec des fields de taille modeste (50 à 300 joueurs). En contrepartie, ce faible volume se traduit par un <strong className="text-white">fish factor exceptionnel</strong> — les joueurs récréatifs représentent une proportion très élevée du trafic, ce qui améliore le ROI des joueurs techniques.
            </p>
          </section>

          {/* 2. Logiciel */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Qualité du logiciel : PokerStars en tête technique</h2>
            <p>
              Le logiciel de poker est votre interface quotidienne. Un bon lobby facilite la navigation, un bon client de jeu réduit les erreurs et améliore l&apos;expérience.
            </p>
            <div className="mt-4 space-y-3">
              {[
                {
                  name: "PokerStars",
                  color: "text-red-400",
                  desc: "Le client de référence mondiale depuis plus de 20 ans. Lobby extrêmement riche, HUD compatible, tables personnalisables, application mobile mature. Fonctionnalités avancées : Zoom (fast-fold), multi-tables jusqu'à 24, filtres de lobby très fins. Idéal pour le grind sérieux.",
                },
                {
                  name: "Winamax",
                  color: "text-amber-400",
                  desc: "Excellent logiciel avec une interface soignée orientée UX française. Le lobby est intuitif, les filtres MTT efficaces. L'application mobile Winamax est l'une des meilleures du marché pour jouer sur tablette. Compatibilité HUD correcte. Légèrement moins puissant que PS en fonctionnalités avancées mais supérieur en ergonomie.",
                },
                {
                  name: "Unibet",
                  color: "text-green-400",
                  desc: "Logiciel volontairement simplifié — Unibet cible les joueurs récréatifs et a intentionnellement limité les outils avancés (moins de multi-tables, HUD impossible par design). L'expérience reste correcte pour jouer occasionnellement.",
                },
              ].map((item) => (
                <div key={item.name} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                  <div className={`font-semibold ${item.color} mb-1`}>{item.name}</div>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Formats */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Variété des formats : PokerStars et Winamax en tête</h2>
            <p>
              Les deux plateformes principales couvrent l&apos;ensemble des formats MTT modernes. <strong className="text-white">PokerStars</strong> va plus loin en proposant des variantes de poker peu communes (PLO Hi/Lo, Stud, Mixed Games, HORSE) et des innovations de format (Spin & Go, Progressive KO Progressive). Si vous voulez explorer au-delà du NLHE, PokerStars est la plateforme.
            </p>
            <p className="mt-3">
              <strong className="text-white">Winamax</strong> couvre parfaitement les formats les plus joués : NLHE standard, turbo, hyper-turbo, KO, satellite, Expresso (l&apos;équivalent des Spin & Go). Pour un joueur MTT standard, le catalogue Winamax est suffisant et très diversifié.
            </p>
            <p className="mt-3">
              <strong className="text-white">Unibet</strong> se concentre sur le NLHE avec des formats limités. Peu de variantes, peu d&apos;innovations. Acceptables pour débuter, insuffisants pour un joueur cherchant la diversité.
            </p>
            <p className="mt-3">
              Consultez nos comparatifs spécifiques : <a href="/comparer/winamax-vs-pokerstars/" className="text-amber-400 hover:text-amber-300 transition-colors">Winamax vs PokerStars</a>, <a href="/comparer/winamax-vs-unibet/" className="text-amber-400 hover:text-amber-300 transition-colors">Winamax vs Unibet</a> et <a href="/comparer/pokerstars-vs-unibet/" className="text-amber-400 hover:text-amber-300 transition-colors">PokerStars vs Unibet</a>.
            </p>
          </section>

          {/* 4. Bonus */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Bonus de bienvenue : jusqu&apos;à 1 300€ en cumulant</h2>
            <p>
              Les 3 plateformes offrent des bonus de premier dépôt attractifs. La stratégie optimale pour un nouveau joueur est d&apos;en profiter sur les 3 :
            </p>
            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900">
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-500">Plateforme</th>
                    <th className="px-4 py-3 text-center text-xs uppercase tracking-wide text-slate-500">Bonus max</th>
                    <th className="px-4 py-3 text-center text-xs uppercase tracking-wide text-slate-500">Dépôt min.</th>
                    <th className="px-4 py-3 text-center text-xs uppercase tracking-wide text-slate-500">Délai déblocage</th>
                  </tr>
                </thead>
                <tbody className="bg-slate-900/50">
                  {[
                    { p: "♠ Winamax", color: "text-amber-400", amount: "500€", min: "50€", delay: "90 jours", url: "https://www.winamax.fr/poker/bonus-bienvenue" },
                    { p: "★ PokerStars", color: "text-red-400", amount: "600€", min: "20€", delay: "180 jours", url: "https://www.pokerstars.fr/poker/bonus-bienvenue/" },
                    { p: "♣ Unibet", color: "text-green-400", amount: "200€", min: "10€", delay: "60 jours", url: "https://www.unibet.fr/poker/bonus" },
                  ].map((row) => (
                    <tr key={row.p} className="border-b border-slate-800/60">
                      <td className={`px-4 py-3 font-semibold ${row.color}`}>{row.p}</td>
                      <td className="px-4 py-3 text-center font-bold text-white">{row.amount}</td>
                      <td className="px-4 py-3 text-center text-slate-400">{row.min}</td>
                      <td className="px-4 py-3 text-center text-slate-400">{row.delay}</td>
                    </tr>
                  ))}
                  <tr className="bg-amber-500/5 border-t-2 border-amber-500/20">
                    <td className="px-4 py-3 font-bold text-amber-400">TOTAL cumulé</td>
                    <td className="px-4 py-3 text-center font-bold text-amber-400 text-lg">1 300€</td>
                    <td className="px-4 py-3 text-center text-slate-500">80€</td>
                    <td className="px-4 py-3 text-center text-slate-500">Variable</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Consultez notre <a href="/guide/bonus-poker/" className="text-amber-400 hover:text-amber-300 transition-colors">guide complet des bonus poker</a> pour les conditions détaillées de chaque offre.
            </p>
          </section>

          {/* 5. Fish factor */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Fish factor : où le ROI est-il le meilleur ?</h2>
            <p>
              Le « fish factor » désigne la proportion de joueurs récréatifs dans le field — plus il est élevé, meilleur est votre edge moyen et donc votre ROI potentiel. C&apos;est un critère souvent sous-estimé par les débutants et cruellement important pour les réguliers.
            </p>
            <p className="mt-3">
              <strong className="text-white">Unibet</strong> remporte la palme du fish factor. La plateforme a délibérément conçu son logiciel pour attirer les joueurs récréatifs (pas de HUD, lobby simplifié, promotion orientée fun). Le ROI des joueurs techniques y est souvent supérieur à celui des autres plateformes à buy-in équivalent.
            </p>
            <p className="mt-3">
              <strong className="text-white">Winamax</strong> a un bon fish factor aux micro et low-stakes grâce au volume français. En montant en buy-ins (20€+), la proportion de réguliers augmente. Les séries SISMIX/SMASK attirent un mélange de récréatifs et de professionnels.
            </p>
            <p className="mt-3">
              <strong className="text-white">PokerStars</strong> a le field le plus compétitif des trois — notamment aux buy-ins élevés. Le Sunday Million à 215$ attire des milliers de joueurs internationaux dont une proportion non négligeable de professionnels. Les micro-stakes restent accessibles.
            </p>
          </section>

          {/* 6. Cashout */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Cashout et fiabilité : toutes sécurisées, Winamax en tête</h2>
            <p>
              Les 3 plateformes étant régulées ANJ, la fiabilité des cashouts est garantie par la loi. Les fonds des joueurs sont séparés des fonds propres de l&apos;opérateur.
            </p>
            <p className="mt-3">
              <strong className="text-white">Winamax</strong> est réputé pour ses retraits rapides — souvent sous 24 à 48h par virement bancaire. L&apos;interface de cashout est claire et sans friction. C&apos;est la plateforme la plus appréciée sur ce point par la communauté française.
            </p>
            <p className="mt-3">
              <strong className="text-white">PokerStars</strong> propose plusieurs méthodes (virement, Skrill, Neteller selon disponibilité). Les délais sont corrects (2 à 5 jours ouvrés) mais peuvent varier selon la méthode et le montant. La vérification KYC peut nécessiter des documents supplémentaires pour les premiers retraits.
            </p>
            <p className="mt-3">
              <strong className="text-white">Unibet</strong> offre des cashouts fiables avec des délais similaires à PokerStars. Le dépôt minimum de 10€ est le plus bas des trois, ce qui facilite les petits retraits.
            </p>
          </section>

          {/* 7. Conclusion par profil */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Quelle room choisir selon votre profil ?</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  profil: "🎓 Débutant",
                  recommande: "Winamax + Unibet",
                  raison: "Winamax pour le volume et les freerolls, Unibet pour le fish factor doux aux micro-stakes. Commencez par les freerolls Winamax puis passez aux 0,50€–2€ sur les deux plateformes.",
                  lien: "/guide/debutant/quelle-room-choisir-france/",
                  labelLien: "Guide choix de room pour débutants",
                },
                {
                  profil: "📈 Grinder régulier",
                  recommande: "Winamax (principal) + PokerStars",
                  raison: "Winamax pour le volume quotidien et le rakeback avantageux. PokerStars pour les gros events du week-end (Sunday Million) et les séries mondiales. Les deux comptes sont indispensables.",
                  lien: "/guide/strategie/bankroll-management-avance/",
                  labelLien: "Guide bankroll management avancé",
                },
                {
                  profil: "🏆 High-roller",
                  recommande: "PokerStars (principal)",
                  raison: "Les plus grandes guarantees mondiales, accès aux live qualificatifs (EPT, PSPC), séries high-roller SCOOP/WCOOP. Winamax en complément pour les events français.",
                  lien: "/tournois/buy-in/plus-de-100-euros/",
                  labelLien: "Tournois 100€+",
                },
              ].map((p) => (
                <div key={p.profil} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                  <div className="font-bold text-white text-lg mb-1">{p.profil}</div>
                  <div className="text-amber-400 font-semibold text-sm mb-3">→ {p.recommande}</div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">{p.raison}</p>
                  <a href={p.lien} className="text-xs text-amber-500 hover:text-amber-400 transition-colors">{p.labelLien} →</a>
                </div>
              ))}
            </div>
          </section>

          {/* 8. Comparatifs spécifiques */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Comparatifs détaillés</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { href: "/comparer/winamax-vs-pokerstars/", title: "Winamax vs PokerStars", desc: "Le duel entre le leader français et le numéro 1 mondial." },
                { href: "/comparer/winamax-vs-unibet/", title: "Winamax vs Unibet", desc: "Volume vs fish factor : quel est le meilleur choix ?" },
                { href: "/comparer/pokerstars-vs-unibet/", title: "PokerStars vs Unibet", desc: "Garanties mondiales vs accessibilité débutant." },
              ].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-4 hover:bg-slate-800/70 hover:border-slate-700 transition-all group block"
                >
                  <div className="font-semibold text-white group-hover:text-amber-400 transition-colors text-sm">{l.title}</div>
                  <p className="text-xs text-slate-400 mt-1">{l.desc}</p>
                  <div className="text-xs text-amber-500 mt-2">Lire →</div>
                </a>
              ))}
            </div>
          </section>

          {/* 9. FAQ */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-5">Questions fréquentes</h2>
            <div className="space-y-3">
              {FAQS.map((item, i) => (
                <details key={i} className="group rounded-xl border border-slate-800 bg-slate-900/60">
                  <summary className="cursor-pointer px-5 py-4 font-semibold text-slate-200 hover:text-white transition-colors list-none flex items-center justify-between gap-3">
                    <span>{item.q}</span>
                    <span className="text-slate-600 group-open:rotate-180 transition-transform shrink-0">▼</span>
                  </summary>
                  <div className="px-5 pb-4 text-slate-400 text-sm leading-relaxed border-t border-slate-800">
                    <p className="mt-3">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        </div>

        {/* Triple CTA */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { name: "♠ Winamax", color: "border-amber-500/40 bg-amber-500/5", btn: "bg-amber-500 text-black hover:bg-amber-400", url: "https://www.winamax.fr/poker/bonus-bienvenue", cta: "Bonus 500€ →" },
            { name: "★ PokerStars", color: "border-red-500/40 bg-red-500/5", btn: "bg-red-600 text-white hover:bg-red-500", url: "https://www.pokerstars.fr/poker/bonus-bienvenue/", cta: "Bonus 600€ →" },
            { name: "♣ Unibet", color: "border-green-500/40 bg-green-500/5", btn: "bg-green-600 text-white hover:bg-green-500", url: "https://www.unibet.fr/poker/bonus", cta: "Bonus 200€ →" },
          ].map((c) => (
            <div key={c.name} className={`rounded-xl border p-4 text-center ${c.color}`}>
              <div className="font-bold text-white mb-3">{c.name}</div>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className={`block rounded-lg px-4 py-2.5 text-sm font-bold transition-colors ${c.btn}`}
              >
                {c.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Responsible gaming */}
        <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900/50 p-4 text-xs text-slate-500">
          Le poker en ligne est réservé aux personnes majeures (+18 ans). Ces offres sont soumises à conditions. Jouez de manière responsable.{" "}
          <a href="https://www.joueurs-info-service.fr" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-400">
            joueurs-info-service.fr
          </a>
        </div>
      </div>
    </>
  );
}
