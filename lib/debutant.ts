import fs from "fs";
import path from "path";

export interface DebutantGuide {
  slug: string;
  title: string;
  description: string;
  content: string; // HTML
  faq: { q: string; a: string }[];
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data", "debutant");

export const DEBUTANT_SLUGS = [
  "comment-commencer-poker-online",
  "quelle-room-choisir-france",
  "winamax-vs-pokerstars",
  "combien-argent-pour-debuter-mtt",
  "difference-cash-game-mtt",
  "comment-fonctionne-un-tournoi-mtt",
  "comprendre-les-blindes-et-antes",
  "comment-fonctionne-bounty-knockout",
  "comprendre-la-variance-poker",
  "gestion-bankroll-debutant",
  "difference-mtt-sit-and-go",
  "comment-lire-une-range-poker",
  "lexique-poker-debutant",
  "les-erreurs-classiques-debutant",
  "quel-buy-in-choisir-pour-commencer",
] as const;

export type DebutantSlug = (typeof DEBUTANT_SLUGS)[number];

export const DEBUTANT_TITLES: Record<string, string> = {
  "comment-commencer-poker-online": "Comment commencer le poker en ligne en France",
  "quelle-room-choisir-france": "Quelle room de poker choisir en France en 2025",
  "winamax-vs-pokerstars": "Winamax vs PokerStars : comparatif complet pour les tournois",
  "combien-argent-pour-debuter-mtt": "Combien d'argent faut-il pour débuter les MTT ?",
  "difference-cash-game-mtt": "Cash game vs tournoi MTT : quelle différence ?",
  "comment-fonctionne-un-tournoi-mtt": "Comment fonctionne un tournoi de poker MTT ?",
  "comprendre-les-blindes-et-antes": "Comprendre les blindes et les antes au poker",
  "comment-fonctionne-bounty-knockout": "Comment fonctionnent les tournois bounty et knockout ?",
  "comprendre-la-variance-poker": "Comprendre la variance au poker : guide débutant",
  "gestion-bankroll-debutant": "Gestion de bankroll pour débutants au poker",
  "difference-mtt-sit-and-go": "MTT vs Sit & Go : quelle différence choisir ?",
  "comment-lire-une-range-poker": "Comment lire une range au poker (débutant)",
  "lexique-poker-debutant": "Lexique du poker : 80 termes essentiels pour débutants",
  "les-erreurs-classiques-debutant": "Les 10 erreurs classiques des débutants au poker",
  "quel-buy-in-choisir-pour-commencer": "Quel buy-in choisir pour commencer les tournois MTT ?",
};

export const DEBUTANT_DESCRIPTIONS: Record<string, string> = {
  "comment-commencer-poker-online": "Guide complet pour démarrer le poker en ligne en France : choisir sa room, créer son compte, comprendre les règles et éviter les erreurs des débutants.",
  "quelle-room-choisir-france": "Comparatif des salles de poker en ligne disponibles en France : Winamax, PokerStars, Unibet — critères de choix, bonus, logiciels.",
  "winamax-vs-pokerstars": "Comparatif détaillé Winamax vs PokerStars pour les joueurs de tournois MTT : programme, garanties, logiciel, bonus et niveau de jeu.",
  "combien-argent-pour-debuter-mtt": "Découvrez le capital minimal recommandé pour commencer les tournois MTT sans brûler sa bankroll et progresser sereinement.",
  "difference-cash-game-mtt": "Comprendre les différences fondamentales entre cash game et tournoi MTT : structures, stratégies et quel format choisir selon son profil.",
  "comment-fonctionne-un-tournoi-mtt": "Explications claires sur le fonctionnement d'un tournoi MTT : blindes, niveaux, prize pool, bulle et stratégie par phases.",
  "comprendre-les-blindes-et-antes": "Tout comprendre sur les blindes (SB/BB) et les antes au poker : rôle, impact stratégique et ajustements selon les niveaux.",
  "comment-fonctionne-bounty-knockout": "Guide complet des tournois bounty et PKO : comment les primes fonctionnent, différences KO/PKO/Mystery Bounty et stratégie de base.",
  "comprendre-la-variance-poker": "La variance au poker expliquée simplement : pourquoi vous perdez même avec de bonnes décisions et comment la gérer psychologiquement.",
  "gestion-bankroll-debutant": "Règles pratiques de gestion de bankroll pour les débutants : combien de buy-ins garder, quand monter de stakes, règles des 50-100 BI.",
  "difference-mtt-sit-and-go": "Comprendre les différences entre tournois MTT et Sit & Go : durée, stratégie, ICM, avantages et inconvénients de chaque format.",
  "comment-lire-une-range-poker": "Introduction à la notion de range au poker : ce qu'est une range, comment la construire et lire celle de vos adversaires.",
  "lexique-poker-debutant": "Dictionnaire du poker avec 80 termes essentiels expliqués simplement : des bases (fold, call, raise) aux notions avancées.",
  "les-erreurs-classiques-debutant": "Les 10 erreurs les plus courantes et coûteuses que font les débutants au poker — et comment les corriger rapidement.",
  "quel-buy-in-choisir-pour-commencer": "Comment choisir le bon buy-in pour débuter les tournois MTT : recommandations selon votre bankroll, niveau et objectifs.",
};

export function getDebutantGuide(slug: string): DebutantGuide | null {
  const filePath = path.join(DATA_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as DebutantGuide;
  } catch {
    return null;
  }
}

export function getAllDebutantGuides(): DebutantGuide[] {
  if (!fs.existsSync(DATA_DIR)) return [];
  return fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        return JSON.parse(
          fs.readFileSync(path.join(DATA_DIR, f), "utf-8")
        ) as DebutantGuide;
      } catch {
        return null;
      }
    })
    .filter((g): g is DebutantGuide => g !== null);
}
