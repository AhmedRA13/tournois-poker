/**
 * generate_strategie_guides.mjs
 * Generates advanced strategy guide content using Claude Haiku and saves to data/strategie/
 *
 * Usage:
 *   node scripts/generate_strategie_guides.mjs            # generate missing
 *   node scripts/generate_strategie_guides.mjs --force    # regenerate all
 *   node scripts/generate_strategie_guides.mjs --slug=xxx # one guide
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data", "strategie");

const client = new Anthropic();

// ── Slug metadata ──────────────────────────────────────────────────────────

const GUIDES = [
  {
    slug: "range-open-par-position",
    title: "Range d'ouverture par position au poker MTT",
    angle: "Construire ses ranges d'ouverture position par position (UTG, UTG+1, MP, HJ, CO, BTN, SB, BB). Fréquences recommandées en GTO : ~15% UTG, ~30% CO, ~45% BTN. Impact des antes. Tableaux de hands à open/fold. Ajustements exploitants selon le field (micro-stakes vs réguliers). Notion de range advantage selon la position.",
    links: ["/guide/strategie/defendre-big-blind/", "/guide/strategie/strategie-3bet-preflop/", "/tournois/winamax/", "/tournois/pokerstars/"],
  },
  {
    slug: "defendre-big-blind",
    title: "Défendre la big blind : stratégie complète en MTT",
    angle: "La BB défense : pourquoi call plus large depuis la BB (déjà 1 BB investi, IP vs OOP irrelevant pour le call). Fréquences de défense vs différentes positions. Quand 3-bet squeeze vs caller. Construction de range équilibrée (value + bluffs). Post-flop OOP : comment jouer check-raise, donk bet. Spots de float.",
    links: ["/guide/strategie/range-open-par-position/", "/guide/strategie/squeeze-play/", "/tournois/winamax/", "/guide/strategie/c-bet-turn-river/"],
  },
  {
    slug: "strategie-3bet-preflop",
    title: "Stratégie 3-bet preflop en tournoi MTT",
    angle: "Construire une range de 3-bet solide : mains value (AA/KK/QQ/AK) + mains bluff semi-connected (A5s, A4s, K9s, JTs). Fréquences par position. Sizing optimal (2.5-3x IP, 3-4x OOP). Comment réagir face à un 4-bet. 3-bet light : conditions, avantages, risques. 3-bet depuis la BB vs SB steal.",
    links: ["/guide/strategie/range-open-par-position/", "/guide/strategie/strategie-4bet-5bet/", "/tournois/winamax/", "/tournois/pokerstars/"],
  },
  {
    slug: "strategie-4bet-5bet",
    title: "4-bet et 5-bet preflop : quand et comment relancer",
    angle: "La guerre preflop : quand 4-bet pour value vs bluff, construction de range 4-bet (QQ+/AK value, mains bluff A5s/A4s). Sizing 4-bet (2.2-2.5x le 3-bet). Face au 4-bet : call vs 5-bet shove. Calculs de pot odds pour les appels. Impact des stacks (20BB vs 100BB différent). Spots spécifiques : BTN vs BB, SB vs BTN.",
    links: ["/guide/strategie/strategie-3bet-preflop/", "/guide/strategie/equity-expected-value/", "/tournois/pokerstars/", "/guide/strategie/pot-odds-implied-odds/"],
  },
  {
    slug: "c-bet-turn-river",
    title: "C-bet turn et river : stratégie de continuation bet",
    angle: "Quand c-bet vs check au flop : board texture, range advantage, SPR. C-bet turn : boards dry vs wet, fréquences de 2-barrel. C-bet river : value vs bluff, board runouts. Notion de range equity au fil des rues. Boards où se défaut pas c-better. Cross-streets : comment planifier ses bluffs sur 3 rues. Sizing adapté selon la rue.",
    links: ["/guide/strategie/range-open-par-position/", "/guide/strategie/pot-odds-implied-odds/", "/tournois/winamax/", "/guide/strategie/hand-reading-ranges/"],
  },
  {
    slug: "squeeze-play",
    title: "Squeeze play : comment et quand squeezer en MTT",
    angle: "Le squeeze : definition (3-bet avec caller(s) entre vous et l'opener). Pourquoi ça marche (fold equity maximale). Range de squeeze optimale : value tight + semi-bluffs suited connectors. Sizing : 3-4x le 3-bet normal (plus large avec plusieurs callers). Conditions favorables : stacks effectifs, position, profil du caller. Pièges et erreurs communes.",
    links: ["/guide/strategie/strategie-3bet-preflop/", "/guide/strategie/defendre-big-blind/", "/tournois/winamax/", "/tournois/pokerstars/"],
  },
  {
    slug: "strategie-icm-bulle",
    title: "Stratégie ICM à la bulle d'un tournoi MTT",
    angle: "L'ICM (Independent Chip Model) à la bulle : pourquoi les chips ne valent pas leur valeur nominale. Calcul simplifié de la pression ICM. Passer en mode survie vs exploiter : quand faire quoi. Les spots clés : big stack vs short stack, spots de fold profitables en chip EV négatif mais ICM positif. Final table bubble différent de la money bubble.",
    links: ["/guide/strategie/strategie-icm-table-finale/", "/guide/strategie/jouer-short-stack-mtt/", "/tournois/pokerstars/", "/tournois/dimanche/"],
  },
  {
    slug: "strategie-icm-table-finale",
    title: "ICM en finale de tournoi : maximiser son gain",
    angle: "ICM à la final table : analyse par étapes (9→8→7 joueurs). Stack-to-blind ratio et Nash equilibrium adapté. Quand push/fold vs jouer post-flop. Appels larges ou serrés selon les piles adverses. Deal equity : comment calculer un chop équitable. Erreurs ICM classiques (over-fold avec le chip lead, under-fold en danger). Spots heads-up final.",
    links: ["/guide/strategie/strategie-icm-bulle/", "/guide/strategie/strategie-heads-up/", "/tournois/pokerstars/", "/tournois/dimanche/"],
  },
  {
    slug: "jouer-short-stack-mtt",
    title: "Jouer short stack en MTT : push/fold et survie",
    angle: "Stratégie push/fold optimale avec 10-20 BB : ranges d'open-shove par position (Nash charts simplifiés). Quand jouer open-raise vs shove. Call ranges face aux pushes (selon la position et les stacks). Resteal shove vs un limp. Comment éviter de mourir sans reason : spots de vol de blindes. Doubler vs survivre : priorités selon l'ICM.",
    links: ["/guide/strategie/strategie-icm-bulle/", "/guide/strategie/range-open-par-position/", "/tournois/winamax/", "/guide/strategie/equity-expected-value/"],
  },
  {
    slug: "jouer-chipleader-table",
    title: "Stratégie chipleader en MTT : comment dominer la table",
    angle: "Utiliser son chip lead efficacement : voler les blindes des stacks moyens (ICM pressure), isoler les short stacks, éviter les confrontations avec d'autres big stacks. Quand ne pas abuser de son stack (bulle ICM). Construire son lead via l'aggression sélective. Erreurs du chipleader (over-call, risquer son stack inutilement). Différence early game vs final table avec chip lead.",
    links: ["/guide/strategie/jouer-short-stack-mtt/", "/guide/strategie/strategie-icm-bulle/", "/tournois/pokerstars/", "/tournois/dimanche/"],
  },
  {
    slug: "strategie-heads-up",
    title: "Stratégie heads-up en tournoi : comment gagner le duel final",
    angle: "Ajustements majeurs au heads-up : range massive (toute main devient potentiellement jouable), aggression maximale, positionnement clé (BTN = SB). Construire des ranges HU preflop et post-flop. Lecture d'adversaire rapide : tendances de fold, call-station, aggro. Adaptation vs différents profils. ICM HU final : quand deal vs jouer.",
    links: ["/guide/strategie/strategie-icm-table-finale/", "/guide/strategie/gto-vs-exploitant/", "/tournois/pokerstars/", "/tournois/winamax/"],
  },
  {
    slug: "gto-vs-exploitant",
    title: "GTO vs exploitant : quelle approche choisir au poker ?",
    angle: "GTO (Game Theory Optimal) : définition, pourquoi c'est non-exploitable, limites (ignores les tendances adverses). Stratégie exploitante : trouver et cibler les leaks adverses (over-fold au flop, limp-call trop large, etc.). Quand jouer GTO (réguliers, hauts stakes) vs exploitant (micro-stakes, récréatifs). Comment basculer d'une approche à l'autre mid-session. Concept de frequency vs tendance.",
    links: ["/guide/strategie/hand-reading-ranges/", "/guide/strategie/equity-expected-value/", "/tournois/pokerstars/", "/tournois/winamax/"],
  },
  {
    slug: "pot-odds-implied-odds",
    title: "Pot odds et implied odds : calculer pour décider",
    angle: "Pot odds : calcul exact en %, comparaison avec l'equity requise pour un call profitable. Implied odds : valeur future attendue si vous touchez votre main. Reverse implied odds : danger quand vous touchez second best. Formule simple pour tournoi (compter les outs × 2 pour une rue, × 4 pour deux rues). Exemples pratiques de calculs de call sur draw flush, straight, pair.",
    links: ["/guide/strategie/equity-expected-value/", "/guide/strategie/c-bet-turn-river/", "/tournois/winamax/", "/guide/debutant/comprendre-la-variance-poker/"],
  },
  {
    slug: "equity-expected-value",
    title: "Equity et expected value (EV) au poker MTT",
    angle: "L'equity : votre part du pot en %. L'EV (expected value) : gain moyen sur le long terme. Calcul d'EV d'un call, d'un fold, d'un raise. Différence entre EV chips et EV $ en tournoi (ICM). Notion de +EV vs -EV. Comment raisonner en EV pour chaque décision. Erreurs classiques : jouer les résultats (résultat-oriented thinking) au lieu de raisonner en process EV.",
    links: ["/guide/strategie/pot-odds-implied-odds/", "/guide/strategie/gto-vs-exploitant/", "/tournois/pokerstars/", "/guide/debutant/comprendre-la-variance-poker/"],
  },
  {
    slug: "hand-reading-ranges",
    title: "Hand reading : lire la range de vos adversaires",
    angle: "Méthode en 4 étapes : 1) Range préflop selon la position 2) Filtrer selon les actions au flop 3) Filtrer au turn 4) Converger vers une range étroite à la river. Indices clés : sizing des mises, timing (live), position, image de table. Exercice pratique avec une main complète. Comment adapter ses décisions à la range estimée plutôt qu'à une seule main.",
    links: ["/guide/strategie/gto-vs-exploitant/", "/guide/strategie/squeeze-play/", "/tournois/winamax/", "/guide/debutant/comment-lire-une-range-poker/"],
  },
  {
    slug: "strategie-pko-bounty",
    title: "Stratégie MTT PKO / bounty : optimiser ses primes",
    angle: "PKO (Progressive Knockout) : la prime de chaque joueur vaut 50% de sa prime accumulée. Comment calculer la valeur d'un call avec bounty en jeu. Formule : equity × (pot + bounty) ≥ montant à investir. Ajustements clés : appeler plus large pour les grosses primes, cibler les short stacks avec prime élevée. Erreurs : sur-évaluer les bounties, négliger l'ICM sur les spots proches de la bulle.",
    links: ["/guide/strategie/strategie-icm-bulle/", "/guide/strategie/jouer-short-stack-mtt/", "/tournois/bounty/", "/tournois/pokerstars/"],
  },
  {
    slug: "strategie-expresso-jackpot",
    title: "Stratégie Expresso et Jackpot SNG : jouer les spins",
    angle: "Expresso (Winamax) et Jackpot SNG (PokerStars) : format hyper-turbo 3 joueurs avec multiplicateurs aléatoires (x2 à x1000). Stratégie push/fold dès 10-15BB. Range d'ouverture très large, ranges de call ajustées selon les stacks. Quand deal vs jouer avec les multiplicateurs élevés. Gestion de bankroll spécifique (variance extrême). Différences vs MTT classique.",
    links: ["/guide/strategie/jouer-short-stack-mtt/", "/guide/strategie/strategie-heads-up/", "/tournois/winamax/", "/tournois/pokerstars/"],
  },
  {
    slug: "strategie-satellites-icm",
    title: "Stratégie satellites : ICM, bubble et qualification",
    angle: "La logique satellite : les N premiers gagnent le même ticket (EV identique pour 1er et Nème). ICM satellite radical : fold equity = infinie une fois qualifié. Passer en mode survie dès la bulle satellite. Quand pousser vs fold même avec de l'equity si la qualification est assurée. Satellites layered (step 1→2→3). Calcul de valeur : quand payer un satellite vs acheter directement.",
    links: ["/guide/strategie/strategie-icm-bulle/", "/guide/strategie/strategie-icm-table-finale/", "/tournois/pokerstars/", "/tournois/winamax/"],
  },
  {
    slug: "strategie-plo-bases",
    title: "Bases de la stratégie PLO (Pot-Limit Omaha) en tournoi",
    angle: "PLO vs NLHE : vous avez 4 cartes, devez en utiliser 2 exactement. Erreurs de débutants PLO : surestimer ses paires, jouer les main NLHE en PLO. Sélection de mains de départ : rundowns connectés (9876ds), mains doubles pairées, AAxx double-suited. Post-flop : tirages dominants (wrap+flush), pot control avec mains one-pair. Sizing PLO : pot-bet standard. Différences MTT vs cash PLO.",
    links: ["/guide/strategie/pot-odds-implied-odds/", "/guide/strategie/equity-expected-value/", "/tournois/pokerstars/", "/guide/debutant/difference-cash-game-mtt/"],
  },
  {
    slug: "bankroll-management-avance",
    title: "Bankroll management avancé pour joueurs réguliers MTT",
    angle: "Au-delà des 50 BI : règles pour grinders MTT (100-200 BI selon la variance du format). Simulations Monte Carlo : fréquence de downswings selon le ROI. Quand monter de stakes en MTT (différent du cash game). Staking et backing : comment structurer un deal équitable. Rakeback et impact sur le BRM. Gestion des écarts de ROI selon les formats (hyper vs deep). Suivi de résultats avec notion de EV adjusted.",
    links: ["/guide/strategie/gto-vs-exploitant/", "/guide/strategie/strategie-icm-bulle/", "/guide/debutant/gestion-bankroll-debutant/", "/guide/bonus-poker/"],
  },
];

// ── Text delimiter parser ──────────────────────────────────────────────────

function extractSection(text, startTag, endTag) {
  const start = text.indexOf(startTag);
  if (start === -1) return "";
  const end = endTag ? text.indexOf(endTag, start) : text.length;
  return text.slice(start + startTag.length, end === -1 ? undefined : end).trim();
}

function parseGuideOutput(raw) {
  const description = extractSection(raw, "===DESCRIPTION===", "===CONTENT===");
  const content = extractSection(raw, "===CONTENT===", "===FAQ_Q1===");
  const faqs = [];
  for (let i = 1; i <= 6; i++) {
    const q = extractSection(raw, `===FAQ_Q${i}===`, `===FAQ_A${i}===`);
    const aEnd = i < 6 ? `===FAQ_Q${i + 1}===` : "===END===";
    const a = extractSection(raw, `===FAQ_A${i}===`, aEnd);
    if (q && a) faqs.push({ q, a });
  }
  return { description, content, faq: faqs };
}

// ── Generator ─────────────────────────────────────────────────────────────

async function generateGuide(guide) {
  const prompt = `Tu es un coach de poker professionnel en France, expert des tournois MTT en ligne. Génère un article de stratégie avancée en français pour le guide suivant.

Titre: ${guide.title}
Angle et contenu: ${guide.angle}
Liens internes à inclure naturellement dans le contenu: ${guide.links.join(", ")}

RÈGLES IMPORTANTES:
- 800 à 1200 mots de contenu dense et actionnable
- Niveau joueur intermédiaire à avancé — pas de vulgarisation excessive
- Vocabulaire poker anglais conservé (flop, turn, river, check, raise, c-bet, shove, range, equity, EV, ICM, SPR, etc.)
- Concepts inspirés du GTO moderne mais reformulés entièrement en français
- 3 à 5 sections H2, sous-sections H3 si nécessaire
- HTML sémantique (h2, h3, p, ul, li, strong, a href="...")
- Les liens internes doivent apparaître naturellement dans le texte (2 à 4 liens)
- Exemples concrets avec mains et situations réelles (ex: "Vous ouvrez KQo depuis le CO à 2.5BB...")
- Ton professionnel, direct, expert — comme un coach qui explique à un joueur sérieux
- 5 questions-réponses FAQ précises et utiles

FORMAT DE SORTIE OBLIGATOIRE (utiliser exactement ces délimiteurs):
===DESCRIPTION===
[meta description 150-160 caractères, accrocheur, avec mot-clé principal]
===CONTENT===
[contenu HTML complet, h2/h3/p/ul/li/strong/a, 800-1200 mots]
===FAQ_Q1===
[question 1]
===FAQ_A1===
[réponse 1, 2-4 phrases]
===FAQ_Q2===
[question 2]
===FAQ_A2===
[réponse 2]
===FAQ_Q3===
[question 3]
===FAQ_A3===
[réponse 3]
===FAQ_Q4===
[question 4]
===FAQ_A4===
[réponse 4]
===FAQ_Q5===
[question 5]
===FAQ_A5===
[réponse 5]
===END===`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 6000,
    messages: [{ role: "user", content: prompt }],
  });

  return response.content[0].text;
}

// ── Main ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const forceAll = args.includes("--force");
const singleSlug = args.find((a) => a.startsWith("--slug="))?.split("=")[1];

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const toGenerate = singleSlug
  ? GUIDES.filter((g) => g.slug === singleSlug)
  : GUIDES;

let generated = 0;
let skipped = 0;
let failed = 0;

for (const guide of toGenerate) {
  const outPath = path.join(DATA_DIR, `${guide.slug}.json`);

  if (!forceAll && !singleSlug && fs.existsSync(outPath)) {
    console.log(`⏭  Skip: ${guide.slug}`);
    skipped++;
    continue;
  }

  console.log(`⚙  Generating: ${guide.slug}`);
  try {
    const raw = await generateGuide(guide);
    const parsed = parseGuideOutput(raw);

    if (!parsed.content || parsed.content.length < 200) {
      console.error(`✗  Content too short for ${guide.slug}`);
      failed++;
      continue;
    }

    const output = {
      slug: guide.slug,
      title: guide.title,
      description: parsed.description || guide.title,
      content: parsed.content,
      faq: parsed.faq,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");
    console.log(`✓  Saved: ${guide.slug} (${parsed.faq.length} FAQs, ${parsed.content.length} chars)`);
    generated++;

    if (generated < toGenerate.length) await new Promise((r) => setTimeout(r, 800));
  } catch (err) {
    console.error(`✗  Error for ${guide.slug}:`, err.message);
    failed++;
  }
}

console.log(`\nDone: ${generated} generated, ${skipped} skipped, ${failed} failed.`);
