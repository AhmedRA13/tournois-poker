import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getUnifiedTournaments,
  getAvailableDates,
  getParisTodayDate,
  type UnifiedTournament,
} from "@/lib/tournaments";
import { TournamentsDashboard } from "@/components/TournamentsDashboard";
import { JsonLd, breadcrumbSchema, faqSchema, BASE_URL } from "@/lib/seo";

// ── Buy-in tier config ─────────────────────────────────────────────────────

type BuyinSlug =
  | "freeroll"
  | "moins-de-5-euros"
  | "5-15-euros"
  | "15-50-euros"
  | "50-100-euros"
  | "plus-de-100-euros";

interface TierConfig {
  slug: BuyinSlug;
  title: string;
  metaTitle: string;
  description: string;
  h1: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faqs: { q: string; a: string }[];
  relatedGuides: { href: string; label: string }[];
  filter: (t: UnifiedTournament) => boolean;
}

const TIERS: Record<BuyinSlug, TierConfig> = {
  freeroll: {
    slug: "freeroll",
    title: "Tournois Poker Freeroll – Jouer Gratuitement en Ligne",
    metaTitle: "Tournois Poker Freeroll – Jouer Gratuitement en Ligne",
    description:
      "Tous les freerolls poker en ligne gratuits aujourd'hui : Winamax, PokerStars, Unibet. Jouez sans buy-in et gagnez de l'argent réel. Programme mis à jour chaque nuit.",
    h1: "Freerolls Poker – Tournois Gratuits en Ligne",
    intro:
      "Les freerolls sont des tournois de poker sans buy-in : l'inscription est entièrement gratuite, mais les prize pools sont bien réels. C'est la meilleure façon de commencer le poker en ligne sans risque financier, ou de transformer des tickets bonus en argent réel.",
    sections: [
      {
        heading: "Pourquoi jouer les freerolls ?",
        body: "Les freerolls offrent une opportunité unique : acquérir de l'expérience en situation réelle, sans risquer son bankroll. Pour un débutant, ils permettent d'apprendre les mécaniques du tournoi MTT (blindes, late registration, bulle, places payées) dans un environnement sans pression financière. Pour un joueur confirmé, ils constituent un revenu complémentaire ou une façon de générer des tickets pour des tournois à buy-in plus élevé. Les freerolls dits « exclusifs » ou « fidélité » sont souvent plus rentables car le field est plus petit et les joueurs plus sérieux. Sur Winamax, les freerolls quotidiens peuvent offrir plusieurs centaines d'euros de prize pool. Sur PokerStars, certains freerolls sont réservés aux joueurs ayant accumulé des points de fidélité et proposent des garanties attrayantes.",
      },
      {
        heading: "Types de freerolls disponibles",
        body: "Il existe plusieurs catégories de freerolls selon les plateformes. Les freerolls ouverts à tous : accessibles dès l'inscription, idéaux pour les débutants. Les freerolls de bienvenue : offerts aux nouveaux joueurs lors de leur inscription, souvent avec un prize pool garanti. Les freerolls fidélité : récompensent les joueurs actifs avec accès restreint, champs de joueurs réduit et meilleures chances de gain. Les freerolls satellites : les prix sont des tickets pour des tournois payants plutôt que de l'argent cash. Identifiez le type de freeroll avant de vous inscrire : un freeroll avec 5 000 joueurs pour 100€ a une EV bien inférieure à un freeroll exclusif avec 200 joueurs pour le même prize pool.",
      },
      {
        heading: "Stratégie pour les freerolls",
        body: "Jouer les freerolls requiert une adaptation stratégique. En early game, le jeu est souvent chaotique : les joueurs sans enjeu jouent très largement et poussent avec n'importe quoi. Évitez les confrontations inutiles avec des mains marginales et attendez des spots à haute équité. En milieu de tournoi, la pression des antes s'installe et les stacks se différencient : adoptez une stratégie de survie orientée vers les places payées. En late game, une fois dans l'argent, jouez pour maximiser : les meilleurs prizes sont concentrés en haut du tableau. La gestion du bankroll ne s'applique pas ici, mais la discipline mentale reste cruciale : traitez chaque main comme si vous aviez payé un vrai buy-in.",
      },
      {
        heading: "Comment accéder aux freerolls sur Winamax et PokerStars",
        body: "Sur Winamax : ouvrez le lobby poker, sélectionnez l'onglet 'Tournois' et filtrez par buy-in '0€'. Les freerolls quotidiens apparaissent dans la section MTT. Certains freerolls nécessitent un code ou un minimum de points de fidélité — vérifiez les conditions dans la description du tournoi. Sur PokerStars : accédez au lobby, section 'Tournois', onglet 'Freerolls'. Les freerolls PokerStars sont souvent accessibles avec un certain niveau de points VIP ou via des promotions spécifiques. Sur Unibet : les freerolls sont réguliers et souvent moins bondés que sur les grandes plateformes, ce qui améliore mécaniquement votre ROI.",
      },
    ],
    faqs: [
      {
        q: "Un freeroll est-il vraiment gratuit ?",
        a: "Oui, un freeroll ne requiert aucun buy-in. Vous jouez gratuitement mais les gains (argent réel ou tickets de tournoi) sont bien réels. Certains freerolls nécessitent cependant d'avoir un compte vérifié ou un minimum d'activité récente.",
      },
      {
        q: "Combien peut-on gagner dans un freeroll ?",
        a: "Cela dépend du prize pool et du nombre de joueurs. Les freerolls ouverts offrent généralement entre 100€ et 500€ de prize pool pour des fields de 1 000 à 10 000 joueurs. Les freerolls exclusifs peuvent proposer des montants similaires avec des fields 10× plus petits, améliorant considérablement l'EV.",
      },
      {
        q: "Quelle stratégie adopter dans les freerolls ?",
        a: "En début de tournoi, jouez serré et évitez les confrontations avec des mains marginales — le jeu est chaotique. À mi-tournoi, adaptez-vous à la pression des blindes. Dans l'argent, jouez pour maximiser votre gain plutôt que de simplement survivre.",
      },
      {
        q: "Les freerolls valent-ils vraiment le temps investi ?",
        a: "Si votre EV horaire est faible (débutant ou bankroll limité), les freerolls représentent une excellente formation gratuite. Pour un joueur régulier à buy-in plus élevé, les freerolls exclusifs restent intéressants mais les freerolls ouverts ont une EV/heure très basse.",
      },
      {
        q: "Peut-on progresser au poker en jouant uniquement des freerolls ?",
        a: "Dans une certaine mesure, oui. Les freerolls enseignent les bases des MTT. Cependant, le style de jeu ultra-loose des champs freeroll ne reflète pas les tournois à enjeux réels. Il est recommandé de passer aux micro-stakes (0,50€–2€) rapidement pour apprendre dans des conditions plus représentatives.",
      },
    ],
    relatedGuides: [
      { href: "/guide/debutant/comment-commencer-poker-online/", label: "Comment commencer le poker en ligne" },
      { href: "/guide/debutant/quel-buy-in-choisir-pour-commencer/", label: "Quel buy-in choisir pour débuter" },
      { href: "/guide/debutant/gestion-bankroll-debutant/", label: "Gestion de bankroll débutant" },
      { href: "/tournois/winamax/", label: "Tous les tournois Winamax" },
    ],
    filter: (t) => t.buyin === 0,
  },

  "moins-de-5-euros": {
    slug: "moins-de-5-euros",
    title: "Tournois Poker Moins de 5€ – Micro-Stakes MTT en Ligne",
    metaTitle: "Tournois Poker Moins de 5€ – Micro-Stakes MTT en Ligne",
    description:
      "Programme des tournois MTT avec un buy-in inférieur à 5€ sur Winamax, PokerStars et Unibet. Idéal pour les débutants et les joueurs avec un petit bankroll.",
    h1: "Tournois Poker Moins de 5€ – Micro-Stakes MTT",
    intro:
      "Les tournois à moins de 5€ sont la porte d'entrée idéale pour les joueurs qui souhaitent jouer avec de vraies mises sans engager un capital important. Ces micro-stakes MTT permettent de développer ses compétences dans des conditions réalistes, avec un risque financier maîtrisé.",
    sections: [
      {
        heading: "Pourquoi commencer par les micro-stakes ?",
        body: "Les micro-stakes (0,50€ à 4,99€) constituent l'échelon naturel après les freerolls. Avec un bankroll de 50€ et des buy-ins à 1€–2€, vous disposez de 25 à 50 buy-ins — suffisant pour absorber la variance normale des MTT. À ce niveau, les champs de joueurs sont moins techniques : les erreurs de base (limp, call trop large, ignorance de la position) sont fréquentes et exploitables. Concentrez-vous sur les fondamentaux : sélection de mains par position, value-betting correct, éviter les bluffs coûteux. Sur Winamax, les daily MTT à 1€ et 2€ affichent des fields importants (500–2 000 joueurs) avec des prize pools proportionnellement attractifs. Sur PokerStars, les Sunday Storm à 11$ et les weekday MTT à 3,30$ offrent des structures profondes même à ces buy-ins.",
      },
      {
        heading: "Bankroll recommandée pour les moins de 5€",
        body: "La règle des 50 à 100 buy-ins s'applique : pour jouer des tournois à 2€, visez un bankroll de 100€ à 200€. La variance des MTT est élevée — même un joueur avec 20% d'edge peut connaître des downswings de 50+ buy-ins. Commencez avec les tournois à 0,50€–1€ si votre bankroll est inférieur à 100€. Passez aux 2€–4€ une fois que vous avez doublé votre capital de départ et constaté des résultats positifs sur un échantillon significatif (minimum 100 tournois). Évitez de jouer des tournois qui représentent plus de 2–3% de votre bankroll total.",
      },
      {
        heading: "Stratégie pour les micro-stakes MTT",
        body: "À moins de 5€, la stratégie optimale est souvent exploitante plutôt que GTO. Les joueurs à ce niveau ont des tendances très marquées : limp trop souvent en position, call trop large avec des mains marginales, bluff trop peu ou trop fréquemment. Exploitez ces tendances : ouvrez large depuis les positions avantageuses, value-betez thin contre les call-stations, réduisez le bluff contre les stations. En phases finales et à la bulle, l'ICM commence à jouer un rôle — même si beaucoup de joueurs à ce niveau l'ignorent, vous pouvez en tirer parti en ajustant votre agressivité selon les stacks adverses.",
      },
      {
        heading: "Progression vers des stakes supérieurs",
        body: "Avant de monter aux 5€–15€, assurez-vous d'avoir un ROI positif sur au moins 200 tournois au niveau inférieur. Utilisez un trackeur de résultats (Sharkscope pour les stats publiques, ou un simple tableau Excel). Les indicateurs de progression : ITM rate > 15%, ROI > 20% sur échantillon long, compréhension des spots ICM de base. Ne montez pas de stakes par frustration ou ennui — la décision doit être guidée par les données, pas par les émotions.",
      },
    ],
    faqs: [
      {
        q: "Quel est le buy-in minimum recommandé pour débuter les MTT ?",
        a: "Avec un bankroll de 50€, commencez par les freerolls et les tournois à 0,50€–1€. Avec 100€–200€, les tournois à 1€–2€ sont adaptés (50–100 buy-ins). Évitez de jouer à des stakes où vous ne pouvez pas tenir au moins 50 buy-ins.",
      },
      {
        q: "Les micro-stakes MTT sont-ils profitables ?",
        a: "Oui, les micro-stakes sont parmi les plus profitables en termes de ROI brut, car le niveau technique moyen est faible. Un joueur discipliné peut atteindre 30–50% de ROI sur des volumes importants. En revanche, les prize pools étant petits, le gain absolu par heure reste limité tant que les volumes ne sont pas élevés.",
      },
      {
        q: "Combien de tournois faut-il jouer avant de monter de stakes ?",
        a: "Un échantillon de 100 à 200 tournois est le minimum pour évaluer son ROI. La variance MTT est élevée et il est facile de mal évaluer ses résultats sur un petit échantillon. Privilegiez la constance et la progression technique sur la vitesse de montée en stakes.",
      },
      {
        q: "Quelle plateforme choisir pour les micro-stakes ?",
        a: "Winamax offre le plus grand volume de tournois à ces buy-ins en France, avec des fields compétitifs mais exploitables. PokerStars propose des structures plus profondes et des prize pools plus garantis. Testez les deux pour trouver la plateforme où vous vous sentez le plus à l'aise.",
      },
      {
        q: "Faut-il un HUD (Heads-Up Display) pour les micro-stakes ?",
        a: "Un HUD peut aider à identifier les tendances adverses, mais il n'est pas indispensable aux micro-stakes. Concentrez-vous d'abord sur vos propres leaks (erreurs systématiques) avant de vous appuyer sur les stats adverses. La revue de mains régulière est plus formatrice qu'un HUD à ce stade.",
      },
    ],
    relatedGuides: [
      { href: "/guide/debutant/gestion-bankroll-debutant/", label: "Gestion de bankroll débutant" },
      { href: "/guide/debutant/quel-buy-in-choisir-pour-commencer/", label: "Quel buy-in choisir pour commencer" },
      { href: "/guide/strategie/range-open-par-position/", label: "Range d'ouverture par position" },
      { href: "/tournois/freeroll/", label: "Freerolls gratuits" },
    ],
    filter: (t) => t.buyin > 0 && t.buyin < 5,
  },

  "5-15-euros": {
    slug: "5-15-euros",
    title: "Tournois Poker 5€ à 15€ – Buy-in Intermédiaire MTT",
    metaTitle: "Tournois Poker 5€ à 15€ – Buy-in Intermédiaire MTT",
    description:
      "Programme des tournois MTT avec un buy-in de 5€ à 15€ sur Winamax et PokerStars. Daily MTT, freerolls satellites, formats knockout — les stakes les plus joués en France.",
    h1: "Tournois Poker 5€ à 15€ – Le Cœur des MTT en France",
    intro:
      "La tranche 5€–15€ est la plus populaire parmi les joueurs réguliers de tournois MTT en France. Elle offre un équilibre parfait entre prize pools attractifs, niveaux de jeu accessibles et volume de tournois suffisant pour une gestion saine du bankroll.",
    sections: [
      {
        heading: "La plage de buy-in la plus active du poker français",
        body: "Sur Winamax, les tournois phares de cette tranche incluent le Daily 5K (5€, GTD 5 000€), le Daily 10K (10€, GTD 10 000€) et de nombreux KO à 5€ et 10€. Ces tournois se jouent chaque jour, avec des fields oscillant entre 200 et 1 500 joueurs selon l'heure. Sur PokerStars, les MTT à 5,50$, 8,80$ et 11$ constituent l'épine dorsale du programme hebdomadaire. Le Sunday Storm (11$) est particulièrement populaire avec ses garanties régulières à 200 000$. Le niveau de jeu dans cette tranche est nettement plus technique que les micro-stakes : les joueurs connaissent les bases de la sélection de mains et du jeu positionnel. Il faut commencer à développer une stratégie plus complète.",
      },
      {
        heading: "Bankroll et sélection de tournois",
        body: "Pour jouer régulièrement des tournois à 5€–15€, visez un bankroll de 500€ à 1 500€ (100 buy-ins minimum). Si votre bankroll est à 500€, concentrez-vous sur les 5€ avec quelques incursions ponctuelles à 10€. À 1 000€, les 10€ deviennent votre tranche principale. Sélectionnez les tournois selon leur structure (profond > turbo pour la qualité de jeu), leur garantie (les tournois GTD attirent plus de fish en période creuse) et leur heure de début (évitez les tournois tardifs qui empiètent sur vos heures de sommeil si vous jouez en semaine).",
      },
      {
        heading: "Stratégie adaptée aux 5€–15€",
        body: "À ce niveau, l'équilibre entre stratégie GTO et exploitante doit s'affiner. Les joueurs récréatifs sont toujours présents mais en moindre proportion. Maintenez une stratégie de base solide (ranges ouvertes par position, défense de la BB, c-bet calibré) et identifiez les déviations adverses pour les exploiter. La compréhension de l'ICM devient importante : les bulles de tournoi changent radicalement les spots profitables et beaucoup de joueurs à ce niveau font encore des erreurs ICM grossières (push trop large en bulle, over-call avec chip lead). Apprendre à lire les tells de sizing (bet sizing très petit = souvent draw ou main faible, overbet = souvent monster ou bluff) aide à prendre de meilleures décisions au showdown.",
      },
      {
        heading: "Les tournois emblématiques de cette tranche",
        body: "Sur Winamax, ne manquez pas le Monday Shark (5€, structure deep), les KO quotidiens à 7€ et 10€ et les Expresso à 5€ si vous aimez les formats courts. Sur PokerStars, le Night Fight PKO (5,50$ et 11$) est un incontournable pour ses primes bounty et son action pré-bulle intense. Le dimanche est le moment optimal dans cette tranche : plus de joueurs actifs, guarantees plus élevées et atmosphère de compétition maximale.",
      },
    ],
    faqs: [
      {
        q: "Quel bankroll pour jouer régulièrement les 5€–10€ MTT ?",
        a: "Minimum 500€ pour les tournois à 5€ (100 buy-ins), 1 000€ pour les tournois à 10€. En dessous, vous risquez de brûler votre bankroll lors d'un downswing normal. Les MTT ont une variance élevée et 50+ buy-ins de pertes consécutives sont statistiquement probables même pour un bon joueur.",
      },
      {
        q: "Quelle est la différence entre les tournois à 5€ et les micro-stakes ?",
        a: "Le niveau technique moyen est sensiblement plus élevé aux 5€–15€. Les joueurs connaissent les bases de la position et de la sélection de mains. Cependant, les erreurs ICM et les déviations exploitables restent très fréquentes. Il faut avoir un jeu de base solide pour être profitable à ce niveau.",
      },
      {
        q: "Vaut-il mieux se spécialiser sur une plateforme ?",
        a: "Se concentrer sur une plateforme permet de mieux connaître le logiciel, les tendances du field et les structures spécifiques. Winamax est recommandé pour son volume et ses fields français. PokerStars pour la richesse des formats et les grandes garanties hebdomadaires. Commencez par une plateforme, maîtrisez-la, puis expandez si nécessaire.",
      },
      {
        q: "Les tournois knockout (KO/PKO) sont-ils plus profitables que les MTT standards ?",
        a: "Pas systématiquement — ils ont simplement une structure de gains différente (primes immédiates vs prize pool standard). Les MTT PKO peuvent avoir un ROI légèrement plus élevé pour les joueurs agressifs, mais leur variance est aussi plus élevée. Choisissez selon votre style de jeu et votre tolérance à la variance.",
      },
      {
        q: "Comment améliorer son jeu aux 5€–15€ MTT ?",
        a: "Revue de mains systématique (au moins 2–3 mains complexes par session), utilisation d'un solveur GTO ou de ressources éducatives (formations, coaching), analyse de ses stats via un tracker et participation à des discussions de mains sur des forums spécialisés. La progression à ce niveau demande un investissement éducatif régulier.",
      },
    ],
    relatedGuides: [
      { href: "/guide/strategie/range-open-par-position/", label: "Range d'ouverture par position" },
      { href: "/guide/strategie/strategie-icm-bulle/", label: "Stratégie ICM à la bulle" },
      { href: "/guide/debutant/gestion-bankroll-debutant/", label: "Gestion de bankroll" },
      { href: "/tournois/winamax/", label: "Programme Winamax complet" },
    ],
    filter: (t) => t.buyin >= 5 && t.buyin <= 15,
  },

  "15-50-euros": {
    slug: "15-50-euros",
    title: "Tournois Poker 15€ à 50€ – Stakes Intermédiaires MTT",
    metaTitle: "Tournois Poker 15€ à 50€ – Stakes Intermédiaires MTT",
    description:
      "Programme des tournois MTT à buy-in de 15€ à 50€ : daily MTT Winamax, Sunday Warm-Up PokerStars, bounty séries. Pour joueurs expérimentés avec bankroll solide.",
    h1: "Tournois Poker 15€ à 50€ – Stakes Intermédiaires",
    intro:
      "La tranche 15€–50€ marque la transition vers un jeu plus sérieux. Les prize pools sont significatifs, les fields plus compétitifs et les erreurs se paient plus cher. C'est à ce niveau que les bases stratégiques solides et la gestion rigoureuse du bankroll font toute la différence.",
    sections: [
      {
        heading: "Un palier de compétitivité supérieure",
        body: "Entre 15€ et 50€ de buy-in, vous rencontrez des joueurs réguliers qui ont souvent étudié le jeu sérieusement. Les tendances exploitables diminuent, les stratégies GTO de base sont plus répandues et les erreurs ICM grossières se raréfient. Les tournois phares dans cette tranche incluent le Daily 20K (20€, GTD 20 000€) et le Sunday 50K (50€, GTD 50 000€) sur Winamax, ainsi que le Sunday Warm-Up (109$) et divers midweek majors sur PokerStars. Les prize pools commencent à être véritablement attractifs : une victoire dans un tournoi à 30€ avec 300 joueurs peut rapporter 1 500€–3 000€.",
      },
      {
        heading: "Bankroll et gestion du risque",
        body: "Règle fondamentale : 100 buy-ins minimum pour jouer ces stakes régulièrement. Pour les tournois à 20€, visez 2 000€ de bankroll. Pour les 50€, il faut 5 000€. Ces montants peuvent sembler élevés, mais la variance des MTT justifie cette prudence : un downswing de 50–80 buy-ins en quelques semaines est statistiquement plausible même avec un ROI positif. Limitez les shots (tentatives ponctuelles à des stakes supérieurs) à des tournois spéciaux, pas comme habitude régulière. Si votre bankroll descend en dessous de 50 buy-ins, descendez de stakes sans hésitation.",
      },
      {
        heading: "Compétences requises à ce niveau",
        body: "Pour être profitable aux 15€–50€, les éléments suivants sont indispensables : maîtrise des ranges préflop par position (open, 3-bet, défense BB), compréhension de l'ICM en bulle et en final table, capacité à construire des ranges équilibrées post-flop (c-bet, barrel, check-raise), lecture des tendances adverses (HUD utile mais pas suffisant) et gestion émotionnelle avancée (tilt control). Si vous êtes encore en train d'apprendre les bases de la position ou du sizing, il est préférable de consolider aux stakes inférieurs avant de monter.",
      },
      {
        heading: "Les séries phares dans cette tranche",
        body: "Les grandes séries Winamax (SISMIX, SMASK) proposent de nombreux events à 20€–50€ avec des garanties multipliées par 3 à 5 pendant les périodes de série. C'est l'occasion d'avoir un meilleur ratio garantie/buy-in que d'habitude. Sur PokerStars, le SCOOP et le WCOOP incluent des events Low à 11$–55$ qui remplissent facilement même pendant les semaines non-séries.",
      },
    ],
    faqs: [
      {
        q: "Quand est-on prêt à jouer les 15€–50€ MTT ?",
        a: "Quand vous avez un ROI positif sur 200+ tournois au niveau inférieur, un bankroll d'au moins 100 buy-ins et une compréhension solide de l'ICM. Ne montez pas par frustration ou ennui — les données doivent justifier la transition.",
      },
      {
        q: "Faut-il utiliser un solveur GTO pour être profitable aux 20€–50€ ?",
        a: "Un solveur n'est pas obligatoire mais devient très utile. Des outils comme GTO Wizard ou Solver permettent d'analyser vos erreurs systématiques et de comprendre les fréquences optimales. Sans solveur, la revue de mains avec des joueurs du même niveau ou supérieur est une alternative productive.",
      },
      {
        q: "Les tournois à ces buy-ins sont-ils réguliers sur Winamax ?",
        a: "Oui, Winamax propose des daily MTT à 15€, 20€ et 30€ chaque jour, avec des garanties de 10 000€ à 30 000€. Le dimanche propose des events jusqu'à 50€ avec des guarantees plus élevées. Le programme est stable et prévisible, ce qui facilite la planification de vos sessions.",
      },
      {
        q: "Comment gérer un downswing aux stakes 20€–50€ ?",
        a: "Un downswing de 30–50 buy-ins peut représenter une perte de 600€ à 2 500€ — psychologiquement difficile. La clé : continuer à jouer votre meilleur jeu, revoir vos mains pour détecter des leaks éventuels, et si nécessaire, descendre temporairement d'un niveau pour protéger votre bankroll et votre confiance.",
      },
      {
        q: "Quelle est l'EV horaire typique à ces stakes ?",
        a: "Avec un ROI de 20% et un ABI (average buy-in) de 25€, jouer 2 tournois/heure donne une EV de 10€/h. Un joueur avec 30% de ROI à 30€ ABI peut viser 18€/h. Ces chiffres supposent un volume régulier et un jeu optimal — la réalité est souvent plus variable.",
      },
    ],
    relatedGuides: [
      { href: "/guide/strategie/strategie-icm-bulle/", label: "Stratégie ICM à la bulle" },
      { href: "/guide/strategie/gto-vs-exploitant/", label: "GTO vs stratégie exploitante" },
      { href: "/guide/strategie/bankroll-management-avance/", label: "Bankroll management avancé" },
      { href: "/tournois/dimanche/", label: "Tournois du dimanche" },
    ],
    filter: (t) => t.buyin > 15 && t.buyin <= 50,
  },

  "50-100-euros": {
    slug: "50-100-euros",
    title: "Tournois Poker 50€ à 100€ – Mid-Stakes MTT en Ligne",
    metaTitle: "Tournois Poker 50€ à 100€ – Mid-Stakes MTT en Ligne",
    description:
      "Programme des tournois MTT à buy-in de 50€ à 100€ sur Winamax et PokerStars. Sunday majors, séries SISMIX, Bounty Builder — pour joueurs confirmés avec solide bankroll.",
    h1: "Tournois Poker 50€ à 100€ – Mid-Stakes MTT",
    intro:
      "Les tournois entre 50€ et 100€ de buy-in représentent le cœur des mid-stakes en ligne. Les prize pools peuvent dépasser 100 000€ lors des grandes séries, et les fields incluent une proportion significative de joueurs réguliers. C'est à ce niveau que le jeu devient véritablement exigeant.",
    sections: [
      {
        heading: "Les tournois phares des 50€–100€",
        body: "Dans cette tranche, les événements clés sont le Sunday High Roller Winamax (50€–100€, GTD variable), les events Medium des séries SISMIX et SMASK (50€–100€, GTD 50 000€–500 000€), le Sunday Warm-Up PokerStars (109$, GTD ~500 000$) et les Bounty Builder series à 55$ et 109$. Les fields sont généralement entre 100 et 800 joueurs, avec une densité élevée de réguliers. La compétition est sensiblement plus dure qu'aux stakes inférieurs, mais les gains potentiels sont à la mesure de l'investissement.",
      },
      {
        heading: "Profil du joueur rentable à ces stakes",
        body: "Un joueur profitable aux 50€–100€ MTT doit maîtriser : les stratégies GTO préflop et post-flop (pas seulement les concepts de base, mais les fréquences précises par spot), l'ICM avancé (bulle, final table deals, satellites), la lecture de ranges adverses via les actions et patterns, la gestion du tilt et des downswings sur des montants importants, et idéalement l'utilisation d'un solveur pour identifier et corriger ses leaks. Un ROI de 15–25% est réaliste pour un joueur sérieux à ce niveau — au-delà, c'est exceptionnel.",
      },
      {
        heading: "Bankroll et gestion financière",
        body: "Avec des buy-ins à 50€–100€, les downswings peuvent représenter des milliers d'euros. Le bankroll requis est de 5 000€ à 10 000€ pour jouer ces stakes régulièrement (100 buy-ins). Beaucoup de joueurs à ce niveau utilisent un mix de stakes (principalement 20€–50€ avec des incursions ponctuelles aux 50€–100€) pour optimiser le ratio risque/récompense. Le staking (backing) est courant à ces niveaux : les arrangements où un backer finance une partie du bankroll contre une part des profits permettent de jouer plus haut avec moins de capital propre.",
      },
    ],
    faqs: [
      {
        q: "Faut-il vraiment 5 000€–10 000€ pour jouer les 50€–100€ ?",
        a: "C'est la recommandation prudente. En pratique, beaucoup de joueurs prennent des shots (tentatives) avec moins de capital, notamment lors des grandes séries où la valeur attendue est supérieure. Mais jouer régulièrement ces stakes avec moins de 100 buy-ins expose à des risques élevés de ruin partielle.",
      },
      {
        q: "Les tournois à 100€ sur PokerStars ont-ils de grosses garanties ?",
        a: "Oui. Le Sunday Warm-Up à 109$ garantit régulièrement 500 000$. Les events Medium des SCOOP/WCOOP à 109$ dépassent souvent 1 000 000$ de prize pool. Ces garanties sont parmi les plus élevées du poker en ligne français.",
      },
      {
        q: "Comment savoir si on est prêt pour les mid-stakes ?",
        a: "ROI positif sur 300+ tournois aux stakes inférieurs, bankroll d'au moins 100 buy-ins, absence de leaks techniques majeurs confirmés par revue de mains et/ou coaching, et surtout une stabilité émotionnelle pour gérer des downswings potentiels de plusieurs milliers d'euros.",
      },
      {
        q: "Le staking est-il une bonne option à ces stakes ?",
        a: "Le staking peut permettre de jouer à des niveaux supérieurs sans le capital requis, moyennant une part des profits pour le backer. C'est une pratique courante et légitime. Assurez-vous de bien comprendre les termes (makeup, markup) et de travailler avec des backers sérieux.",
      },
      {
        q: "Y a-t-il des tournois journaliers à ces buy-ins ?",
        a: "Winamax propose des events quotidiens à 50€ avec de bonnes garanties. PokerStars a moins de volume quotidien à ce level mais compense avec de gros events hebdomadaires (Sunday Warm-Up) et des séries régulières.",
      },
    ],
    relatedGuides: [
      { href: "/guide/strategie/strategie-icm-table-finale/", label: "ICM en table finale" },
      { href: "/guide/strategie/bankroll-management-avance/", label: "Bankroll management avancé" },
      { href: "/guide/strategie/hand-reading-ranges/", label: "Hand reading avancé" },
      { href: "/tournois/dimanche/", label: "Tournois du dimanche" },
    ],
    filter: (t) => t.buyin > 50 && t.buyin <= 100,
  },

  "plus-de-100-euros": {
    slug: "plus-de-100-euros",
    title: "Tournois Poker Plus de 100€ – High-Stakes MTT en Ligne",
    metaTitle: "Tournois Poker Plus de 100€ – High-Stakes MTT en Ligne",
    description:
      "Programme des tournois MTT avec buy-in supérieur à 100€ : Sunday Million PokerStars, high-rollers Winamax, grandes séries SCOOP/WCOOP. Pour joueurs de haut niveau.",
    h1: "Tournois Poker Plus de 100€ – High-Stakes MTT",
    intro:
      "Les tournois à plus de 100€ de buy-in constituent l'élite du poker en ligne. Les prize pools peuvent atteindre plusieurs millions d'euros pour les grands events, et les champs incluent les meilleurs joueurs en ligne français et internationaux. Des opportunités exceptionnelles pour les joueurs qui ont les compétences et le bankroll requis.",
    sections: [
      {
        heading: "Les événements emblématiques du high-stakes MTT",
        body: "Le Sunday Million PokerStars (215$, GTD 1 000 000$ chaque dimanche) est l'événement phare de cette catégorie — le plus grand tournoi hebdomadaire régulier au monde depuis 2006. Les séries SCOOP et WCOOP proposent des events High à partir de 215$ avec des guarantees de 2 000 000$ à 10 000 000$. Sur Winamax, les grandes séries SISMIX et SMASK incluent des événements à 100€–500€ avec des garanties de 100 000€ à 1 000 000€. Les Bounty Builder High (215$+) de PokerStars combinent prize pool géant et primes bounty attractives.",
      },
      {
        heading: "Niveau de jeu et compétition",
        body: "Au-delà de 100€ de buy-in, les champs comportent une proportion élevée de joueurs professionnels ou semi-professionnels. La stratégie GTO avancée, la maîtrise complète de l'ICM et une capacité à adapter son jeu rapidement aux profils adverses sont essentielles. Les erreurs exploitables sont rares et coûteuses. Beaucoup de joueurs récréatifs qui jouent ces stakes le font lors d'événements spéciaux (Sunday Million anniversaire, séries SCOOP) — repérez ces opportunités où la valeur attendue est supérieure à la normale.",
      },
      {
        heading: "Accès via les satellites",
        body: "Une des meilleures stratégies pour les high-stakes MTT est d'y accéder via les satellites. Gagner un ticket pour le Sunday Million via un satellite à 22$ au lieu de payer 215$ en direct multiplie votre EV si vous êtes un joueur de qualité. Les satellites MTT pour les grandes séries offrent souvent un ratio valeur/coût excellent. Maîtriser la stratégie satellite (ICM satellite, survie vs aggression) est donc un investissement rentable.",
      },
      {
        heading: "Bankroll pour le high-stakes",
        body: "Pour jouer régulièrement les 100€–500€ MTT, un bankroll de 20 000€ à 100 000€ est requis (100 buy-ins). Ces stakes sont souvent joués en combinant capital propre et staking. Beaucoup de joueurs à ce niveau ont un ou plusieurs backers qui financent une partie de leur action. Les deals d'action entre joueurs (vente de parts) sont également courants lors des grandes séries pour réduire la variance.",
      },
    ],
    faqs: [
      {
        q: "Faut-il être professionnel pour jouer les tournois à 100€+ ?",
        a: "Pas nécessairement, mais il faut un niveau technique très solide et un bankroll adapté. Beaucoup de joueurs récréatifs prennent des shots occasionnels lors des grandes séries ou via des satellites. L'important est de gérer son bankroll correctement et de ne pas jouer ces stakes avec des fonds nécessaires à d'autres fins.",
      },
      {
        q: "Comment qualifier pour le Sunday Million sans payer 215$ ?",
        a: "Les satellites Sunday Million sont disponibles sur PokerStars de 2,20$ à 22$ en buy-in. Un satellite turbo à 22$ avec 10 tickets disponibles pour 120 joueurs offre un excellent ratio valeur/coût. La stratégie satellite (survie prioritaire vs aggression) est différente du MTT classique.",
      },
      {
        q: "Les tournois SCOOP/WCOOP High valent-ils la peine ?",
        a: "Les events High des séries mondiales PokerStars offrent des prize pools exceptionnels mais des fields très compétitifs. La valeur pour un joueur moyen est inférieure aux events Low/Medium de la même série. Recommandé surtout si vous avez gagné votre seat via satellite.",
      },
      {
        q: "Quels sont les tournois high-stakes réguliers sur Winamax ?",
        a: "Winamax propose des high-rollers lors des séries SISMIX (juin–juillet) et SMASK (novembre–décembre). En dehors des séries, les événements Sunday à 100€–200€ avec de bonnes guarantees sont les plus accessibles. Le programme précis est disponible dans le lobby Winamax sous 'Tournois featured'.",
      },
      {
        q: "Comment gérer mentalement les downswings en high-stakes ?",
        a: "Un downswing de 20 buy-ins représente 2 000€–10 000€ selon les stakes. Il est essentiel d'avoir un filet de sécurité financier (ne jouez qu'avec de l'argent que vous pouvez vous permettre de perdre), de maintenir une routine de revue de mains et de chercher un support extérieur (coach, communauté de joueurs) en cas de doutes persistants.",
      },
    ],
    relatedGuides: [
      { href: "/guide/strategie/strategie-icm-table-finale/", label: "ICM en table finale" },
      { href: "/guide/strategie/strategie-satellites-icm/", label: "Stratégie satellites" },
      { href: "/guide/strategie/bankroll-management-avance/", label: "Bankroll management avancé" },
      { href: "/tournois/dimanche/", label: "Tournois du dimanche (Sunday Million)" },
    ],
    filter: (t) => t.buyin > 100,
  },
};

const BUY_IN_SLUGS: BuyinSlug[] = [
  "freeroll",
  "moins-de-5-euros",
  "5-15-euros",
  "15-50-euros",
  "50-100-euros",
  "plus-de-100-euros",
];

// ── Static params ─────────────────────────────────────────────────────────

export function generateStaticParams() {
  return BUY_IN_SLUGS.map((slug) => ({ slug }));
}

// ── Metadata ─────────────────────────────────────────────────────────────

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tier = TIERS[slug as BuyinSlug];
  if (!tier) return {};

  return {
    title: tier.metaTitle,
    description: tier.description,
    alternates: { canonical: `${BASE_URL}/tournois/buy-in/${slug}/` },
    openGraph: {
      title: tier.metaTitle,
      description: tier.description,
      url: `${BASE_URL}/tournois/buy-in/${slug}/`,
      type: "website",
    },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────

export default async function BuyInPage({ params }: Props) {
  const { slug } = await params;
  const tier = TIERS[slug as BuyinSlug];
  if (!tier) notFound();

  const all = getUnifiedTournaments();
  const tournaments = all.filter(tier.filter);
  const dates = getAvailableDates(tournaments);
  const today = getParisTodayDate();

  const todayCount = tournaments.filter((t) => t.date === today).length;

  const breadcrumb = breadcrumbSchema([
    { name: "Accueil", url: BASE_URL + "/" },
    { name: "Tournois", url: BASE_URL + "/tournois/winamax/" },
    { name: tier.h1, url: `${BASE_URL}/tournois/buy-in/${slug}/` },
  ]);

  const faqJsonLd = faqSchema(tier.faqs);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={faqJsonLd} />

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-xs text-slate-500">
          <a href="/" className="hover:text-slate-300 transition-colors">Accueil</a>
          <span className="mx-1.5">›</span>
          <a href="/tournois/winamax/" className="hover:text-slate-300 transition-colors">Tournois</a>
          <span className="mx-1.5">›</span>
          <span className="text-slate-400">{tier.h1}</span>
        </nav>

        {/* H1 + stats */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{tier.h1}</h1>
          <p className="text-slate-400 max-w-3xl">{tier.intro}</p>
          {todayCount > 0 && (
            <p className="mt-2 text-sm text-slate-500">
              <strong className="text-white">{todayCount}</strong> tournois disponibles aujourd&apos;hui dans cette tranche.
            </p>
          )}
        </div>

        {/* Dashboard */}
        {tournaments.length > 0 ? (
          <TournamentsDashboard
            tournaments={tournaments}
            dates={dates}
            today={today}
          />
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900 py-14 text-center text-slate-500 mb-10">
            <p className="text-3xl mb-3">🃏</p>
            <p className="font-medium">Aucun tournoi dans cette tranche actuellement</p>
            <p className="text-sm mt-1">Les données sont mises à jour chaque nuit.</p>
          </div>
        )}

        {/* Long-form content */}
        <div className="mt-14 max-w-4xl space-y-10 text-slate-300 leading-relaxed">
          {tier.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-bold text-white mb-4">{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}

          {/* Related guides */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Guides associés</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {tier.relatedGuides.map((g) => (
                <a
                  key={g.href}
                  href={g.href}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-4 hover:bg-slate-800/70 hover:border-slate-700 transition-colors block group"
                >
                  <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                    {g.label}
                  </div>
                  <div className="text-xs text-amber-500 mt-1">Lire le guide →</div>
                </a>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-5">Questions fréquentes</h2>
            <div className="space-y-3">
              {tier.faqs.map((item, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-slate-800 bg-slate-900/60"
                >
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

        {/* Platform CTA */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <a
            href="https://www.winamax.fr/poker/bonus-bienvenue"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-center hover:bg-amber-500/15 transition-colors"
          >
            <div className="font-bold text-amber-400 text-lg mb-1">♠ Winamax</div>
            <p className="text-sm text-slate-400 mb-3">
              Leader français des tournois MTT — bonus jusqu&apos;à 500€
            </p>
            <span className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-bold text-black">
              Voir les tournois →
            </span>
          </a>
          <a
            href="https://www.pokerstars.fr/poker/bonus-bienvenue/"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center hover:bg-red-500/15 transition-colors"
          >
            <div className="font-bold text-red-400 text-lg mb-1">★ PokerStars</div>
            <p className="text-sm text-slate-400 mb-3">
              Sunday Million et séries mondiales — bonus jusqu&apos;à 600€
            </p>
            <span className="rounded-lg bg-red-600 px-5 py-2 text-sm font-bold text-white">
              Voir les tournois →
            </span>
          </a>
        </div>

        {/* Other buy-in tiers */}
        <div className="mt-8 border-t border-slate-800 pt-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4">
            Autres tranches de buy-in
          </h2>
          <div className="flex flex-wrap gap-3">
            {BUY_IN_SLUGS.filter((s) => s !== slug).map((s) => (
              <a
                key={s}
                href={`/tournois/buy-in/${s}/`}
                className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
              >
                {TIERS[s].h1.replace("Tournois Poker ", "").replace(" – ", " ")}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
