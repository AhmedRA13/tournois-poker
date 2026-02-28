import fs from "fs";
import path from "path";

export type GuideCategory = "debutant" | "strategie" | "tournoi" | "format" | "online" | "mental";

export interface GuideEntry {
  slug: string;
  title: string;
  description: string;
  category: GuideCategory;
  readTime: number;       // minutes
  updatedAt: string;      // YYYY-MM-DD
  content: string;        // HTML
  faq?: { q: string; a: string }[];
}

export const CATEGORY_LABELS: Record<GuideCategory, string> = {
  debutant: "Pour débutants",
  strategie: "Stratégie",
  tournoi: "Tournois MTT",
  format: "Formats spéciaux",
  online: "Poker en ligne",
  mental: "Mental & outils",
};

export const CATEGORY_ORDER: GuideCategory[] = [
  "debutant", "strategie", "tournoi", "format", "online", "mental",
];

const GUIDES_DIR = path.join(process.cwd(), "data", "guides");

export function getAllGuides(): GuideEntry[] {
  if (!fs.existsSync(GUIDES_DIR)) return [];
  return fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        return JSON.parse(
          fs.readFileSync(path.join(GUIDES_DIR, f), "utf-8")
        ) as GuideEntry;
      } catch {
        return null;
      }
    })
    .filter((g): g is GuideEntry => g !== null);
}

export function getGuideBySlug(slug: string): GuideEntry | null {
  const filePath = path.join(GUIDES_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as GuideEntry;
  } catch {
    return null;
  }
}

/** All planned guide slugs (for generateStaticParams and sitemap even before generation) */
export const ALL_GUIDE_SLUGS: string[] = [
  // Débutant
  "bases-poker-texas-holdem",
  "regles-poker",
  "mains-poker-classement",
  "position-au-poker",
  "pot-odds-poker",
  "bankroll-management-poker",
  "poker-tight-agressif",
  "vocabulaire-poker",
  // Stratégie
  "bluff-au-poker",
  "continuation-bet",
  "3-bet-poker",
  "squeeze-play-poker",
  "open-raise-poker",
  "defense-big-blind",
  "range-poker",
  "gto-poker-introduction",
  "equity-poker",
  "expected-value-poker",
  // Tournois MTT
  "mtt-strategie-poker",
  "deep-stack-poker",
  "short-stack-poker",
  "icm-tournoi-poker",
  "final-table-poker",
  "strategie-satellite-poker",
  "steal-resteal-tournoi",
  "ante-strategie-poker",
  "bb-ante-poker",
  "bankroll-management-mtt",
  // Formats spéciaux
  "plo-omaha-introduction",
  "spin-and-go-strategie",
  "hyper-turbo-poker",
  "zoom-poker-strategie",
  // Poker en ligne
  "hud-poker-online",
  "multi-tabling-poker",
  "reads-sans-hud",
  "tells-poker-live",
  // Mental & outils
  "prise-de-notes-poker",
  "revue-session-poker",
  "mindset-poker",
];
