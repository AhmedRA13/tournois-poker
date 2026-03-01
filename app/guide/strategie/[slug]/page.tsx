import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  STRATEGIE_SLUGS,
  STRATEGIE_TITLES,
  STRATEGIE_DESCRIPTIONS,
  getStrategieGuide,
} from "@/lib/strategie";
import { JsonLd, breadcrumbSchema, faqSchema, BASE_URL } from "@/lib/seo";
import { EmailCaptureInline } from "@/components/EmailCaptureInline";

// ── Related guides logic ──────────────────────────────────────────────────

const RELATED_MAP: Record<string, string[]> = {
  "range-open-par-position": ["defendre-big-blind", "c-bet-turn-river"],
  "defendre-big-blind": ["range-open-par-position", "strategie-3bet-preflop"],
  "strategie-3bet-preflop": ["strategie-4bet-5bet", "defendre-big-blind"],
  "strategie-4bet-5bet": ["strategie-3bet-preflop", "equity-expected-value"],
  "c-bet-turn-river": ["range-open-par-position", "pot-odds-implied-odds"],
  "squeeze-play": ["strategie-3bet-preflop", "hand-reading-ranges"],
  "strategie-icm-bulle": ["strategie-icm-table-finale", "jouer-short-stack-mtt"],
  "strategie-icm-table-finale": ["strategie-icm-bulle", "strategie-heads-up"],
  "jouer-short-stack-mtt": ["strategie-icm-bulle", "range-open-par-position"],
  "jouer-chipleader-table": ["strategie-icm-bulle", "jouer-short-stack-mtt"],
  "strategie-heads-up": ["strategie-icm-table-finale", "gto-vs-exploitant"],
  "gto-vs-exploitant": ["hand-reading-ranges", "equity-expected-value"],
  "pot-odds-implied-odds": ["equity-expected-value", "c-bet-turn-river"],
  "equity-expected-value": ["pot-odds-implied-odds", "gto-vs-exploitant"],
  "hand-reading-ranges": ["gto-vs-exploitant", "squeeze-play"],
  "strategie-pko-bounty": ["strategie-icm-bulle", "jouer-short-stack-mtt"],
  "strategie-expresso-jackpot": ["strategie-heads-up", "jouer-short-stack-mtt"],
  "strategie-satellites-icm": ["strategie-icm-bulle", "strategie-icm-table-finale"],
  "strategie-plo-bases": ["pot-odds-implied-odds", "equity-expected-value"],
  "bankroll-management-avance": ["gto-vs-exploitant", "strategie-icm-bulle"],
};

// ── Static params ─────────────────────────────────────────────────────────

export function generateStaticParams() {
  return STRATEGIE_SLUGS.map((slug) => ({ slug }));
}

// ── Metadata ─────────────────────────────────────────────────────────────

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getStrategieGuide(slug);
  const title = guide?.title ?? STRATEGIE_TITLES[slug as string] ?? "Guide stratégie";
  const description =
    guide?.description ?? STRATEGIE_DESCRIPTIONS[slug as string] ?? "";

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/guide/strategie/${slug}/` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/guide/strategie/${slug}/`,
      type: "article",
    },
  };
}

// ── Fallback content ──────────────────────────────────────────────────────

function FallbackContent({ slug }: { slug: string }) {
  const title = STRATEGIE_TITLES[slug] ?? "Guide stratégie";
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center">
      <p className="text-3xl mb-4">⏳</p>
      <h2 className="font-semibold text-white text-lg mb-2">{title}</h2>
      <p className="text-slate-400 text-sm">
        Ce guide est en cours de génération. Revenez dans quelques heures.
      </p>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────

export default async function StrategieGuidePage({ params }: Props) {
  const { slug } = await params;

  if (!(STRATEGIE_SLUGS as readonly string[]).includes(slug)) notFound();

  const guide = getStrategieGuide(slug);
  const title = guide?.title ?? STRATEGIE_TITLES[slug] ?? "Guide stratégie";
  const description = guide?.description ?? STRATEGIE_DESCRIPTIONS[slug] ?? "";

  const relatedSlugs = RELATED_MAP[slug] ?? [];

  const breadcrumb = breadcrumbSchema([
    { name: "Accueil", url: BASE_URL + "/" },
    { name: "Guides", url: BASE_URL + "/guide/" },
    { name: "Stratégie avancée", url: BASE_URL + "/guide/strategie/" },
    { name: title, url: `${BASE_URL}/guide/strategie/${slug}/` },
  ]);

  const faqData =
    guide?.faq && guide.faq.length > 0 ? faqSchema(guide.faq) : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={breadcrumb} />
      {faqData && <JsonLd data={faqData} />}

      {/* Breadcrumb */}
      <nav className="mb-6 text-xs text-slate-500" aria-label="Fil d'Ariane">
        <a href="/" className="hover:text-slate-300 transition-colors">Accueil</a>
        <span className="mx-2">/</span>
        <a href="/guide/" className="hover:text-slate-300 transition-colors">Guides</a>
        <span className="mx-2">/</span>
        <a href="/guide/strategie/" className="hover:text-slate-300 transition-colors">Stratégie</a>
        <span className="mx-2">/</span>
        <span className="text-slate-400 line-clamp-1">{title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-purple-500/15 px-2.5 py-0.5 text-xs font-semibold text-purple-400">
            Stratégie avancée
          </span>
          {guide?.updatedAt && (
            <span className="text-xs text-slate-500">
              Mis à jour le{" "}
              {new Date(guide.updatedAt + "T12:00:00Z").toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-white leading-tight">{title}</h1>
        {description && (
          <p className="mt-3 text-slate-400 leading-relaxed">{description}</p>
        )}
      </div>

      {/* Content */}
      <div className="mb-10">
        {guide ? (
          <article
            className="prose prose-invert prose-slate max-w-none prose-headings:text-white prose-a:text-amber-400 prose-a:no-underline hover:prose-a:text-amber-300 prose-strong:text-white prose-li:text-slate-300"
            dangerouslySetInnerHTML={{ __html: guide.content }}
          />
        ) : (
          <FallbackContent slug={slug} />
        )}
      </div>

      {/* Email capture inline */}
      <EmailCaptureInline />

      {/* FAQ */}
      {guide?.faq && guide.faq.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-5 text-xl font-bold text-white">Questions fréquentes</h2>
          <div className="space-y-3">
            {guide.faq.map((item, i) => (
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
        </div>
      )}

      {/* Related guides */}
      {relatedSlugs.length > 0 && (
        <div className="mt-10 border-t border-slate-800 pt-8">
          <h2 className="mb-4 text-sm font-bold text-slate-400 uppercase tracking-wide">
            Guides stratégie connexes
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedSlugs.map((s) => (
              <a
                key={s}
                href={`/guide/strategie/${s}/`}
                className="group rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:bg-slate-800/70 hover:border-slate-700 transition-all"
              >
                <p className="text-sm font-medium text-white group-hover:text-amber-400 transition-colors leading-snug">
                  {STRATEGIE_TITLES[s]}
                </p>
                <p className="mt-1 text-xs text-amber-500 group-hover:text-amber-400">
                  Lire →
                </p>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Back to index + debutant link */}
      <div className="mt-8 border-t border-slate-800 pt-6 flex flex-wrap gap-3">
        <a
          href="/guide/strategie/"
          className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
        >
          ← Tous les guides stratégie
        </a>
        <a
          href="/guide/debutant/"
          className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
        >
          Guides débutant
        </a>
      </div>

      {/* Platform links */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a
          href="/tournois/winamax/"
          className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center hover:bg-amber-500/15 transition-colors"
        >
          <div className="font-bold text-amber-400 mb-1">♠ Winamax</div>
          <p className="text-xs text-slate-400 mb-3">Programme MTT, freerolls et séries</p>
          <span className="rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-bold text-black">
            Voir les tournois →
          </span>
        </a>
        <a
          href="/tournois/pokerstars/"
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center hover:bg-red-500/15 transition-colors"
        >
          <div className="font-bold text-red-400 mb-1">★ PokerStars</div>
          <p className="text-xs text-slate-400 mb-3">Sunday Million et Bounty Builder</p>
          <span className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white">
            Voir les tournois →
          </span>
        </a>
      </div>
    </div>
  );
}
