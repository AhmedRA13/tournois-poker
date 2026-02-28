/**
 * generate_pdf.mjs
 * Generates "Les 10 erreurs qui coûtent de l'argent en MTT" PDF
 * Output: public/guides/erreurs-mtt.pdf
 *
 * Usage: node scripts/generate_pdf.mjs
 */

import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "guides");
const OUT_FILE = path.join(OUT_DIR, "erreurs-mtt.pdf");

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Colors & fonts ────────────────────────────────────────────────────────

const COLORS = {
  bg: "#0f172a",
  surface: "#1e293b",
  border: "#334155",
  text: "#e2e8f0",
  muted: "#94a3b8",
  accent: "#f59e0b",
  accentDark: "#b45309",
  red: "#ef4444",
  green: "#22c55e",
  white: "#ffffff",
};

// ── Content ───────────────────────────────────────────────────────────────

const ERRORS = [
  {
    num: 1,
    title: "Jouer trop de mains depuis mauvaises positions",
    tldr: "72% des joueurs débutants jouent plus de 30% de leurs mains — le double du recommandé.",
    body: "La position est la variable la plus importante au poker. Jouer des mains marginales depuis les positions early (UTG, UTG+1, UTG+2) multiplie vos pertes : vous agirez en premier sur tous les streets post-flop, sans information sur vos adversaires.\n\nLa règle d'or : en position early, ne jouez que vos mains premium (AA, KK, QQ, JJ, AKs, AKo, AQs). En position late (BTN, CO), vous pouvez ouvrir plus large car vous aurez l'avantage d'information.\n\nCorrection immédiate : repérez votre position avant de regarder vos cartes. Avant d'agir, posez-vous : \"Suis-je en position sur mes adversaires ?\"",
    tip: "En UTG sur une table de 9 joueurs, ouvrez seulement 8-10% de vos mains. Au BTN, 35-40% est acceptable.",
  },
  {
    num: 2,
    title: "Appeler au lieu de relancer ou se coucher (le limp)",
    tldr: "Le \"limp\" (appel de la BB sans relancer) est la marque d'un débutant — et il perd de l'argent systématiquement.",
    body: "Quand vous entrez dans un pot en limping (simple appel de la big blind), vous signifiez une main médiocre et vous invitez tous les joueurs à votre gauche à entrer bon marché. Résultat : vous vous retrouvez face à 4-5 adversaires avec une main que vous ne pouvez défendre contre un seul.\n\nLe principe est simple : soit votre main est assez forte pour open-raise, soit elle n'est pas assez forte pour jouer. La zone grise du \"peut-être que ça va passer\" est le tombeau des stacks débutants.\n\nException : en live multi-way avec plusieurs limpeurs devant vous, limp derrière avec des spéculatives (paires petites, connecteurs assortis) peut être justifié. En ligne et en tournoi, évitez presque toujours.",
    tip: "Règle simple : fold ou raise. Le call pré-flop sans rien devant vous est presque toujours une erreur.",
  },
  {
    num: 3,
    title: "Mal calibrer ses mises (bet sizing)",
    tldr: "Miser 1/10 du pot ou 5x le pot — deux erreurs opposées également coûteuses.",
    body: "Le sizing de vos mises doit avoir un but : construire le pot avec vos mains fortes, protéger votre main contre les draws, ou créer de la fold equity avec vos bluffs. Miser trop peu invite les adversaires à appeler avec n'importe quel draw. Miser trop vous coûte cher quand vous êtes dominé.\n\nRègles de base pour les tournois :\n• Open-raise pré-flop : 2x-2,5x BB en position, 3x-3,5x depuis early\n• Continuation bet : 50-66% du pot sur les boards favorables à votre range\n• Mise de valeur : 66-80% du pot quand vous avez le nuts ou near-nuts\n\nLe sizing doit être cohérent avec votre range entière — pas seulement avec la main spécifique que vous jouez.",
    tip: "Adoptez un sizing \"standard\" et variez peu au début. La cohérence vaut plus que l'ingéniosité.",
  },
  {
    num: 4,
    title: "Ignorer la taille de son stack (M-ratio)",
    tldr: "Jouer comme si vous aviez 100 big blinds quand vous en avez 12 est une erreur stratégique fatale en tournoi.",
    body: "En MTT, la taille de votre stack exprimée en big blinds change radicalement votre stratégie. Avec moins de 15 BB, vous êtes en mode \"push-or-fold\" : aucune place pour les appels, les limps ou les floats. Vous shovcez ou vous foldez.\n\nLe M-ratio (inventé par Paul Magriel) compare votre stack aux blindes + antes totales d'un tour. Un M < 10 signifie \"danger immédiat\". Un M < 5 = \"poussez maintenant\".\n\nDe nombreux débutants jouent des mises \"normales\" (2,5x la BB) avec 10 BB, perdant de la fold equity et créant des situations inconfortables. Apprenez les push-fold charts : ils définissent exactement quelles mains shovcées depuis quelle position selon votre stack.",
    tip: "Installez l'application \"Push or Fold\" sur votre téléphone. Entraînez-vous 10 minutes par jour sur les situations de short stack.",
  },
  {
    num: 5,
    title: "Jouer ses émotions (le tilt)",
    tldr: "Un joueur en tilt perd en moyenne 3x son stack théorique par session. Le tilt est votre ennemi numéro un.",
    body: "Le tilt est l'état dans lequel vos émotions prennent le dessus sur votre raisonnement. Il survient après un bad beat (mauvais coup de chance), une erreur, ou une session perdante prolongée. En tilt, vous jouez trop de mains, vous sur-bluffez, vous appeler trop largement.\n\nFormes courantes de tilt :\n• Tilt de colère (\"Je vais les écraser\")\n• Tilt de peur (\"Je ne veux plus perdre\")\n• Tilt de déni (\"Cette main était correcte\")\n\nStrategies anti-tilt : fixez-vous une stop-loss (ex : stop si je perds 3 buy-ins), faites des pauses de 5 minutes après chaque bad beat significatif, tenez un journal de session pour identifier vos déclencheurs.",
    tip: "La règle des 3 BI : si vous perdez 3 buy-ins consécutifs, fermez le client et attendez demain. Sans exception.",
  },
  {
    num: 6,
    title: "Sur-estimer ses paires médianes (88, 99, TT)",
    tldr: "Pocket 9s ressemble à une main puissante — mais elle sera dominée 60% du temps face à un appel.",
    body: "Les paires médianes (7-7, 8-8, 9-9, T-T) sont parmi les mains les plus difficiles à jouer en MTT. Elles ont une bonne valeur pré-flop, mais se retrouvent dans des situations délicates post-flop : overcards fréquentes, difficile d'aller au showdown contre de la résistance.\n\nErreur classique : 3-bet jam préflop avec 99 contre une UTG open et un call de MP sur une table de 6 joueurs. Vous êtes souvent contre 2 overcards (flip) ou contre une paire meilleure.\n\nApproche recommandée : avec 20-40 BB, poussez vos paires médianes comme moves pré-flop. Avec plus de 50 BB, call/3-bet et jouez intelligemment le flop. Avec 100+ BB, flat call et set-miné.",
    tip: "TT et moins : votre objectif est de voir un flop, pas de construire un gros pot pré-flop à 100 BB deep.",
  },
  {
    num: 7,
    title: "Négliger la bulle et l'ICM",
    tldr: "L'ICM change tout à la bulle : une décision correcte en chip-EV peut être catastrophique en $-EV.",
    body: "L'ICM (Independent Chip Model) calcule la valeur réelle en argent de vos jetons en fonction de votre position dans la structure de paiement. À la bulle, les chips ont moins de valeur qu'en début de tournoi parce que chaque élimination vous rapproche d'une place payée.\n\nErreur typique : all-in avec AK suited à la bulle face à un short stack qui push. En terme de chips, c'est EV positif. En terme d'argent, si vous doublez un short stack et perdez la moitié de votre stack, vous pouvez passer sous la bulle et finir ITM 0 au lieu de min-cash garanti.\n\nPrincipe : à la bulle, jouez plus tight avec un stack moyen, exploitez les courts stacks qui veulent min-cash en les attaquant, et évitez les gros pots inutiles même avec de bonnes mains.",
    tip: "Apprenez ICM avec un simulateur gratuit (ICM Trainer, GTO+). 30 minutes suffisent pour comprendre les bases.",
  },
  {
    num: 8,
    title: "Bluffer trop et dans de mauvaises situations",
    tldr: "Le bluff est un outil stratégique, pas une façon de \"voler\" des pots au hasard.",
    body: "Les débutants bluffent trop souvent, pour les mauvaises raisons, face aux mauvais adversaires. Le bluff n'est rentable que si :\n1. Votre histoire (séquence de mises) est cohérente\n2. Votre adversaire est capable de folder\n3. Vous avez de la fold equity (le pot n'est pas trop grand)\n4. Le board favorise votre range perçue\n\nBluffer des calling stations (joueurs qui appellent tout) est du gâchis. Bluffer des boards avec 4 joueurs au tour est suicidaire. Bluffer sans blockers ni fold equity sur des turns/rivers est trop coûteux.\n\nCommencez par les semi-bluffs (bluff avec des draws) : vous avez une equity de secours si vous êtes appelé. C'est le bluff le plus sûr pour les débutants.",
    tip: "Posez-vous 2 questions avant de bluffer : \"Quelle main suis-je supposé représenter ?\" et \"Mon adversaire peut-il folder cette main ?\"",
  },
  {
    num: 9,
    title: "Ignorer les côtes du pot (pot odds)",
    tldr: "Appeler sans calculer les côtes est la principale source de fuites d'EV chez les débutants.",
    body: "Les pot odds vous indiquent le prix que vous payez pour rester dans le pot, comparé à l'equity que vous devez avoir pour que l'appel soit rentable. Si le pot est de 100€ et votre adversaire mise 50€, vous payez 50 pour gagner 150 = côte 3:1 = vous avez besoin de 25% d'equity minimum.\n\nCette formule simple s'applique à chaque appel de tout votre range de draws. Un flush draw a ~35% d'equity sur le flop — il peut appeler rentablement la plupart des mises. Un bottom pair avec backdoor draw a ~10-15% — il fold presque toujours.\n\nEntraînez-vous à calculer vite : pot de X, bet de Y, côte = Y/(X+Y). Comparez à votre equity estimée. C'est la base absolue de toute décision de call.",
    tip: "Mémorisez les equités de base : flush draw = 35%, straight draw = 32%, pair avec backdoor = ~20%, overcards = ~30%.",
  },
  {
    num: 10,
    title: "Négliger son volume et son suivi de résultats",
    tldr: "Sans tracker ses résultats, on répète ses erreurs sans le savoir. Le suivi est la base de la progression.",
    body: "La plus coûteuse erreur à long terme : jouer sans jamais analyser ses sessions. Sans données, vous ne savez pas :\n• Si vous êtes profitable dans vos formats favoris\n• Quelles positions/situations vous coûtent de l'argent\n• Si votre downswing actuel est normal ou révèle un problème\n\nOutils gratuits : PokerTracker 4 (essai gratuit), Hold'em Manager 3, ou une simple feuille Excel avec date/tournoi/buy-in/résultat/temps. Importez vos hand histories (disponibles sur Winamax et PokerStars) et analysez vos stats une heure par semaine.\n\nFocussez sur 3 métriques : VPIP (% de mains jouées, cible 16-22%), PFR (% de raises pré-flop, cible 14-18%), et votre ROI sur 500+ tournois pour avoir un sample significatif.",
    tip: "Commencez simplement : notez chaque session dans un tableur. Date, tournoi, buy-in, résultat. En 3 mois, vous aurez des données précieuses.",
  },
];

// ── PDF Generation ────────────────────────────────────────────────────────

const doc = new PDFDocument({
  size: "A4",
  margin: 0,
  bufferPages: true,
  info: {
    Title: "Les 10 erreurs qui coûtent de l'argent en MTT",
    Author: "tournois-poker.fr",
    Subject: "Stratégie poker MTT pour débutants",
    Keywords: "poker, MTT, erreurs, stratégie, débutant",
  },
});

const stream = fs.createWriteStream(OUT_FILE);
doc.pipe(stream);

const PAGE_W = doc.page.width;
const PAGE_H = doc.page.height;
const MARGIN = 50;
const CONTENT_W = PAGE_W - MARGIN * 2;

// Helper: fill page background
function fillBg(color = COLORS.bg) {
  doc.save().rect(0, 0, PAGE_W, PAGE_H).fill(color).restore();
}

// Helper: draw a line
function hLine(y, color = COLORS.border, width = CONTENT_W) {
  doc.save().moveTo(MARGIN, y).lineTo(MARGIN + width, y).strokeColor(color).lineWidth(0.5).stroke().restore();
}

// ── Cover page ────────────────────────────────────────────────────────────

fillBg(COLORS.bg);

// Accent bar top
doc.save().rect(0, 0, PAGE_W, 6).fill(COLORS.accent).restore();

// Logo / branding
doc
  .fontSize(11)
  .fillColor(COLORS.muted)
  .font("Helvetica")
  .text("tournois-poker.fr", MARGIN, 30, { align: "left" });

// Main title
doc
  .fontSize(36)
  .fillColor(COLORS.accent)
  .font("Helvetica-Bold")
  .text("Les 10 erreurs", MARGIN, 120, { width: CONTENT_W, align: "center" });

doc
  .fontSize(28)
  .fillColor(COLORS.white)
  .text("qui coûtent de l'argent en MTT", MARGIN, 165, { width: CONTENT_W, align: "center" });

// Subtitle
doc
  .fontSize(14)
  .fillColor(COLORS.muted)
  .font("Helvetica")
  .text("Guide pratique pour les joueurs de tournois", MARGIN, 220, { width: CONTENT_W, align: "center" });

// Decorative separator
doc
  .save()
  .rect(PAGE_W / 2 - 30, 250, 60, 3)
  .fill(COLORS.accent)
  .restore();

// Description box
doc
  .save()
  .roundedRect(MARGIN, 275, CONTENT_W, 80, 8)
  .fillColor(COLORS.surface)
  .fill()
  .restore();

doc
  .fontSize(12)
  .fillColor(COLORS.text)
  .font("Helvetica")
  .text(
    "Ce guide identifie les 10 erreurs les plus coûteuses que font les débutants en tournois MTT — et vous donne les corrections concrètes pour chacune.",
    MARGIN + 20,
    295,
    { width: CONTENT_W - 40, align: "center" }
  );

// What you'll learn
doc
  .fontSize(11)
  .fillColor(COLORS.accent)
  .font("Helvetica-Bold")
  .text("Ce que vous allez apprendre :", MARGIN, 390);

const points = [
  "Pourquoi 72% des débutants perdent et comment corriger ça",
  "Les erreurs de positionnement qui détruisent votre bankroll",
  "Comment maîtriser le tilt et les émotions à la table",
  "Les calculs de base pour ne plus appeler à tort",
  "La stratégie bulle et l'ICM expliqués simplement",
];

points.forEach((p, i) => {
  doc
    .fontSize(11)
    .fillColor(COLORS.text)
    .font("Helvetica")
    .text(`✓  ${p}`, MARGIN + 10, 415 + i * 22);
});

// Footer cover
doc
  .save()
  .rect(0, PAGE_H - 60, PAGE_W, 60)
  .fillColor(COLORS.surface)
  .fill()
  .restore();

doc
  .fontSize(10)
  .fillColor(COLORS.muted)
  .font("Helvetica")
  .text(
    `© ${new Date().getFullYear()} tournois-poker.fr — Guide gratuit`,
    MARGIN,
    PAGE_H - 40,
    { width: CONTENT_W, align: "center" }
  );

// ── Table of contents ─────────────────────────────────────────────────────

doc.addPage();
fillBg(COLORS.bg);
doc.save().rect(0, 0, PAGE_W, 6).fill(COLORS.accent).restore();

doc
  .fontSize(22)
  .fillColor(COLORS.white)
  .font("Helvetica-Bold")
  .text("Sommaire", MARGIN, 40);

hLine(75);

ERRORS.forEach((err, i) => {
  const y = 90 + i * 38;
  // Number circle
  doc
    .save()
    .circle(MARGIN + 16, y + 10, 14)
    .fill(i < 5 ? COLORS.accentDark : COLORS.red)
    .restore();
  doc
    .fontSize(12)
    .fillColor(COLORS.white)
    .font("Helvetica-Bold")
    .text(String(i + 1), MARGIN + 7, y + 4, { width: 20, align: "center" });

  doc
    .fontSize(12)
    .fillColor(COLORS.text)
    .font("Helvetica-Bold")
    .text(err.title, MARGIN + 38, y + 4, { width: CONTENT_W - 60 });

  doc
    .fontSize(9)
    .fillColor(COLORS.muted)
    .font("Helvetica")
    .text(err.tldr, MARGIN + 38, y + 19, { width: CONTENT_W - 60 });

  if (i < ERRORS.length - 1) {
    hLine(y + 33, "#1e293b");
  }
});

// ── Error pages ───────────────────────────────────────────────────────────

ERRORS.forEach((err) => {
  doc.addPage();
  fillBg(COLORS.bg);

  // Top accent bar
  doc.save().rect(0, 0, PAGE_W, 6).fill(err.num <= 5 ? COLORS.accent : COLORS.red).restore();

  // Number badge
  const badgeColor = err.num <= 5 ? COLORS.accentDark : "#991b1b";
  doc
    .save()
    .roundedRect(MARGIN, 25, 44, 44, 6)
    .fill(badgeColor)
    .restore();
  doc
    .fontSize(22)
    .fillColor(COLORS.white)
    .font("Helvetica-Bold")
    .text(`#${err.num}`, MARGIN, 35, { width: 44, align: "center" });

  // Title
  doc
    .fontSize(20)
    .fillColor(COLORS.white)
    .font("Helvetica-Bold")
    .text(err.title, MARGIN + 54, 25, { width: CONTENT_W - 54 });

  // TL;DR box
  const tldrY = 80;
  doc
    .save()
    .roundedRect(MARGIN, tldrY, CONTENT_W, 42, 6)
    .fill(err.num <= 5 ? "#451a03" : "#450a0a")
    .restore();
  doc
    .save()
    .roundedRect(MARGIN, tldrY, 4, 42, 2)
    .fill(err.num <= 5 ? COLORS.accent : COLORS.red)
    .restore();

  doc
    .fontSize(10)
    .fillColor(err.num <= 5 ? COLORS.accent : "#fca5a5")
    .font("Helvetica-Bold")
    .text("EN RÉSUMÉ", MARGIN + 12, tldrY + 7);
  doc
    .fontSize(10)
    .fillColor(COLORS.text)
    .font("Helvetica")
    .text(err.tldr, MARGIN + 12, tldrY + 21, { width: CONTENT_W - 20 });

  hLine(135);

  // Body text
  let curY = 145;
  const paragraphs = err.body.split("\n\n");
  paragraphs.forEach((para) => {
    if (para.startsWith("•") || para.includes("\n•")) {
      const lines = para.split("\n").filter(Boolean);
      lines.forEach((line) => {
        const isItem = line.startsWith("•");
        doc
          .fontSize(11)
          .fillColor(isItem ? COLORS.text : COLORS.muted)
          .font(isItem ? "Helvetica" : "Helvetica-Bold")
          .text(line, MARGIN + (isItem ? 12 : 0), curY, { width: CONTENT_W - (isItem ? 12 : 0) });
        curY += doc.heightOfString(line, { width: CONTENT_W - 12 }) + 4;
      });
    } else {
      doc
        .fontSize(11)
        .fillColor(COLORS.text)
        .font("Helvetica")
        .text(para, MARGIN, curY, { width: CONTENT_W });
      curY += doc.heightOfString(para, { width: CONTENT_W }) + 10;
    }
    curY += 4;
  });

  // Tip box
  const tipY = Math.max(curY + 10, PAGE_H - 150);
  doc
    .save()
    .roundedRect(MARGIN, tipY, CONTENT_W, 78, 6)
    .fill(COLORS.surface)
    .restore();
  doc
    .save()
    .roundedRect(MARGIN, tipY, 4, 78, 2)
    .fill(COLORS.green)
    .restore();

  doc
    .fontSize(10)
    .fillColor(COLORS.green)
    .font("Helvetica-Bold")
    .text("✓  CONSEIL PRATIQUE", MARGIN + 12, tipY + 10);
  doc
    .fontSize(10)
    .fillColor(COLORS.text)
    .font("Helvetica")
    .text(err.tip, MARGIN + 12, tipY + 26, { width: CONTENT_W - 24 });

  // Page footer
  doc
    .save()
    .rect(0, PAGE_H - 30, PAGE_W, 30)
    .fill(COLORS.surface)
    .restore();
  doc
    .fontSize(9)
    .fillColor(COLORS.muted)
    .font("Helvetica")
    .text(
      `tournois-poker.fr — Les 10 erreurs MTT  ·  Erreur ${err.num}/10`,
      MARGIN,
      PAGE_H - 20,
      { width: CONTENT_W, align: "center" }
    );
});

// ── Conclusion page ───────────────────────────────────────────────────────

doc.addPage();
fillBg(COLORS.bg);
doc.save().rect(0, 0, PAGE_W, 6).fill(COLORS.green).restore();

doc
  .fontSize(26)
  .fillColor(COLORS.white)
  .font("Helvetica-Bold")
  .text("Et maintenant ?", MARGIN, 40);

hLine(82);

doc
  .fontSize(13)
  .fillColor(COLORS.text)
  .font("Helvetica")
  .text(
    "Vous connaissez maintenant les 10 erreurs les plus coûteuses en MTT. Voici votre plan d'action pour les corriger :",
    MARGIN,
    95,
    { width: CONTENT_W }
  );

const steps = [
  {
    n: "1",
    title: "Cette semaine",
    steps: [
      "Identifiez vos 3 erreurs les plus fréquentes parmi les 10",
      "Installez un tracker (PokerTracker 4 ou HM3) — version d'essai gratuite",
      "Jouez 2-3 sessions en notant vos erreurs en temps réel",
    ],
  },
  {
    n: "2",
    title: "Ce mois",
    steps: [
      "Corrigez 1 erreur par semaine — pas toutes à la fois",
      "Analysez vos hand histories post-session (15 min/session)",
      "Apprenez les push-fold charts pour les stacks < 15 BB",
    ],
  },
  {
    n: "3",
    title: "Long terme",
    steps: [
      "Établissez des règles de bankroll strictes (50 BI minimum)",
      "Rejoignez une communauté de joueurs pour progresser",
      "Visez 500 tournois avant de tirer des conclusions sur vos résultats",
    ],
  },
];

let stepY = 155;
steps.forEach((block) => {
  doc
    .save()
    .roundedRect(MARGIN, stepY, CONTENT_W, 95, 6)
    .fill(COLORS.surface)
    .restore();

  doc
    .fontSize(13)
    .fillColor(COLORS.accent)
    .font("Helvetica-Bold")
    .text(`Étape ${block.n} — ${block.title}`, MARGIN + 15, stepY + 12);

  block.steps.forEach((s, i) => {
    doc
      .fontSize(11)
      .fillColor(COLORS.text)
      .font("Helvetica")
      .text(`→  ${s}`, MARGIN + 15, stepY + 34 + i * 18, { width: CONTENT_W - 30 });
  });

  stepY += 110;
});

// CTA
doc
  .save()
  .roundedRect(MARGIN, stepY + 10, CONTENT_W, 80, 8)
  .fill("#451a03")
  .restore();

doc
  .fontSize(14)
  .fillColor(COLORS.accent)
  .font("Helvetica-Bold")
  .text("Consultez le programme des tournois", MARGIN + 20, stepY + 24, { width: CONTENT_W - 40, align: "center" });
doc
  .fontSize(11)
  .fillColor(COLORS.text)
  .font("Helvetica")
  .text("tournois-poker.fr — Programme Winamax, PokerStars, Unibet mis à jour chaque nuit", MARGIN + 20, stepY + 46, { width: CONTENT_W - 40, align: "center" });

// Back cover footer
doc
  .save()
  .rect(0, PAGE_H - 50, PAGE_W, 50)
  .fill(COLORS.surface)
  .restore();
doc
  .fontSize(10)
  .fillColor(COLORS.muted)
  .font("Helvetica")
  .text(
    `© ${new Date().getFullYear()} tournois-poker.fr — Document gratuit, non-commercial. Le poker est réservé aux +18 ans. Jouez responsable.`,
    MARGIN,
    PAGE_H - 32,
    { width: CONTENT_W, align: "center" }
  );

// ── Finalize ──────────────────────────────────────────────────────────────

doc.end();
stream.on("finish", () => {
  const size = Math.round(fs.statSync(OUT_FILE).size / 1024);
  console.log(`✓ PDF generated: ${OUT_FILE} (${size} KB)`);
});
stream.on("error", (err) => {
  console.error("✗ PDF error:", err.message);
  process.exit(1);
});
