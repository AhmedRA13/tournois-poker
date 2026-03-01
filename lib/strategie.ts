import fs from "fs";
import path from "path";

export interface StrategieGuide {
  slug: string;
  title: string;
  description: string;
  content: string; // HTML
  faq: { q: string; a: string }[];
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data", "strategie");

export const STRATEGIE_SLUGS = [
  "range-open-par-position",
  "defendre-big-blind",
  "strategie-3bet-preflop",
  "strategie-4bet-5bet",
  "c-bet-turn-river",
  "squeeze-play",
  "strategie-icm-bulle",
  "strategie-icm-table-finale",
  "jouer-short-stack-mtt",
  "jouer-chipleader-table",
  "strategie-heads-up",
  "gto-vs-exploitant",
  "pot-odds-implied-odds",
  "equity-expected-value",
  "hand-reading-ranges",
  "strategie-pko-bounty",
  "strategie-expresso-jackpot",
  "strategie-satellites-icm",
  "strategie-plo-bases",
  "bankroll-management-avance",
] as const;

export type StrategieSlug = (typeof STRATEGIE_SLUGS)[number];

export const STRATEGIE_TITLES: Record<string, string> = {
  "range-open-par-position": "Range d'ouverture par position au poker MTT",
  "defendre-big-blind": "Défendre la big blind : stratégie complète en MTT",
  "strategie-3bet-preflop": "Stratégie 3-bet preflop en tournoi MTT",
  "strategie-4bet-5bet": "4-bet et 5-bet preflop : quand et comment relancer",
  "c-bet-turn-river": "C-bet turn et river : stratégie de continuation bet",
  "squeeze-play": "Squeeze play : comment et quand squeezer en MTT",
  "strategie-icm-bulle": "Stratégie ICM à la bulle d'un tournoi MTT",
  "strategie-icm-table-finale": "ICM en finale de tournoi : maximiser son gain",
  "jouer-short-stack-mtt": "Jouer short stack en MTT : push/fold et survie",
  "jouer-chipleader-table": "Stratégie chipleader en MTT : comment dominer la table",
  "strategie-heads-up": "Stratégie heads-up en tournoi : comment gagner le duel final",
  "gto-vs-exploitant": "GTO vs exploitant : quelle approche choisir au poker ?",
  "pot-odds-implied-odds": "Pot odds et implied odds : calculer pour décider",
  "equity-expected-value": "Equity et expected value (EV) au poker MTT",
  "hand-reading-ranges": "Hand reading : lire la range de vos adversaires",
  "strategie-pko-bounty": "Stratégie MTT PKO / bounty : optimiser ses primes",
  "strategie-expresso-jackpot": "Stratégie Expresso et Jackpot SNG : jouer les spins",
  "strategie-satellites-icm": "Stratégie satellites : ICM, bubble et qualification",
  "strategie-plo-bases": "Bases de la stratégie PLO (Pot-Limit Omaha) en tournoi",
  "bankroll-management-avance": "Bankroll management avancé pour joueurs réguliers MTT",
};

export const STRATEGIE_DESCRIPTIONS: Record<string, string> = {
  "range-open-par-position": "Apprenez à construire vos ranges d'ouverture selon votre position à la table : UTG, MP, CO, BTN, SB. Fréquences GTO et ajustements exploitants selon le field.",
  "defendre-big-blind": "Comment défendre efficacement votre big blind face aux opens et aux 3-bets. Fréquences de call, 3-bet et fold selon la position de l'agresseur et la SPR.",
  "strategie-3bet-preflop": "Construire une stratégie de 3-bet preflop solide : mains value, mains bluff, fréquences optimales selon la position et le profil adverse.",
  "strategie-4bet-5bet": "Maîtriser les guerres preflop : quand 4-bet pour value, quand bluffer, et comment réagir face à un 4-bet adverse. Calculs de pot odds inclus.",
  "c-bet-turn-river": "La continuation bet au turn et au river : quelles boards c-bet, quelles fréquences, comment construire des ranges équilibrées pour éviter l'exploitation.",
  "squeeze-play": "Le squeeze : technique avancée pour exploiter les callers entre vous et un opener. Conditions optimales, sizing et range de squeeze à retenir.",
  "strategie-icm-bulle": "L'ICM (Independent Chip Model) à la bulle : comment vos décisions changent quand chaque stack éliminé rapporte de l'argent. Spots clés et erreurs à éviter.",
  "strategie-icm-table-finale": "ICM en finale de tournoi : analyse des push/fold, appels larges ou serrés selon les piles, et comment négocier un deal équitable.",
  "jouer-short-stack-mtt": "Stratégie push/fold pour jouer efficacement avec 10 à 20 big blinds en MTT : ranges d'open-shove et call selon la position, la stack et les antes.",
  "jouer-chipleader-table": "Être chipleader ne suffit pas : apprenez à utiliser votre stack pour mettre la pression, voler les blindes et maximiser votre edge sur les stacks moyens.",
  "strategie-heads-up": "Adapter sa stratégie pour le heads-up final d'un tournoi : aggression, c-bet, adaptation au profil adverse, et gestion de l'ICM en duel.",
  "gto-vs-exploitant": "GTO (Game Theory Optimal) vs stratégie exploitante : comprendre la différence, quand jouer GTO et quand exploiter les failles adverses pour maximiser vos gains.",
  "pot-odds-implied-odds": "Calcul des pot odds et des implied odds pour décider correctement vos appels en tournoi : formules simples, exemples concrets et pièges à éviter.",
  "equity-expected-value": "L'equity et l'expected value (EV) : les deux concepts fondamentaux qui justifient chaque décision au poker. Apprendre à calculer et raisonner en EV.",
  "hand-reading-ranges": "Le hand reading : déduire la range adverse à partir des actions, du board et des patterns de jeu. Méthode en 4 étapes avec exemples de mains.",
  "strategie-pko-bounty": "PKO et bounty en MTT : comment valoriser correctement les primes, ajuster vos appels de push, et exploiter les joueurs focalisés sur les bounties.",
  "strategie-expresso-jackpot": "Stratégie Expresso (Winamax) et Jackpot SNG (PokerStars) : variantes hyper-turbo à 3 joueurs avec multiplicateurs. Range push/fold et adaptation rapide.",
  "strategie-satellites-icm": "Jouer les satellites intelligemment : comprendre l'ICM satellite, quand passer en mode survie, et comment maximiser vos chances de qualification à moindre coût.",
  "strategie-plo-bases": "Introduction à la stratégie PLO (Pot-Limit Omaha) : différences avec le NLHE, sélection de mains de départ, jeu post-flop et pièges classiques à éviter.",
  "bankroll-management-avance": "Gestion de bankroll pour joueurs réguliers : règles des 100-200 BI en MTT, gestion des downswings longs, staking, Monte Carlo simulations et mise en jeu optimale.",
};

export function getStrategieGuide(slug: string): StrategieGuide | null {
  const filePath = path.join(DATA_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as StrategieGuide;
  } catch {
    return null;
  }
}

export function getAllStrategieGuides(): StrategieGuide[] {
  if (!fs.existsSync(DATA_DIR)) return [];
  return fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        return JSON.parse(
          fs.readFileSync(path.join(DATA_DIR, f), "utf-8")
        ) as StrategieGuide;
      } catch {
        return null;
      }
    })
    .filter((g): g is StrategieGuide => g !== null);
}
