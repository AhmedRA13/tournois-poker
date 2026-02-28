import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  DEBUTANT_SLUGS,
  DEBUTANT_TITLES,
  DEBUTANT_DESCRIPTIONS,
  getDebutantGuide,
} from "@/lib/debutant";
import { JsonLd, breadcrumbSchema, faqSchema, BASE_URL } from "@/lib/seo";
import { EmailCaptureInline } from "@/components/EmailCaptureInline";

// ── Related guides logic ──────────────────────────────────────────────────

const RELATED_MAP: Record<string, string[]> = {
  "comment-commencer-poker-online": ["quelle-room-choisir-france", "combien-argent-pour-debuter-mtt"],
  "quelle-room-choisir-france": ["winamax-vs-pokerstars", "comment-commencer-poker-online"],
  "winamax-vs-pokerstars": ["quelle-room-choisir-france", "quel-buy-in-choisir-pour-commencer"],
  "combien-argent-pour-debuter-mtt": ["gestion-bankroll-debutant", "quel-buy-in-choisir-pour-commencer"],
  "difference-cash-game-mtt": ["comment-fonctionne-un-tournoi-mtt", "difference-mtt-sit-and-go"],
  "comment-fonctionne-un-tournoi-mtt": ["comprendre-les-blindes-et-antes", "difference-cash-game-mtt"],
  "comprendre-les-blindes-et-antes": ["comment-fonctionne-un-tournoi-mtt", "gestion-bankroll-debutant"],
  "comment-fonctionne-bounty-knockout": ["comment-fonctionne-un-tournoi-mtt", "quel-buy-in-choisir-pour-commencer"],
  "comprendre-la-variance-poker": ["gestion-bankroll-debutant", "les-erreurs-classiques-debutant"],
  "gestion-bankroll-debutant": ["combien-argent-pour-debuter-mtt", "comprendre-la-variance-poker"],
  "difference-mtt-sit-and-go": ["difference-cash-game-mtt", "quel-buy-in-choisir-pour-commencer"],
  "comment-lire-une-range-poker": ["les-erreurs-classiques-debutant", "comment-fonctionne-un-tournoi-mtt"],
  "lexique-poker-debutant": ["comment-commencer-poker-online", "comprendre-les-blindes-et-antes"],
  "les-erreurs-classiques-debutant": ["comprendre-la-variance-poker", "gestion-bankroll-debutant"],
  "quel-buy-in-choisir-pour-commencer": ["gestion-bankroll-debutant", "winamax-vs-pokerstars"],
};

// ── Static params ─────────────────────────────────────────────────────────

export function generateStaticParams() {
  return DEBUTANT_SLUGS.map((slug) => ({ slug }));
}

// ── Metadata ─────────────────────────────────────────────────────────────

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getDebutantGuide(slug);
  const title = guide?.title ?? DEBUTANT_TITLES[slug as string] ?? "Guide débutant";
  const description =
    guide?.description ?? DEBUTANT_DESCRIPTIONS[slug as string] ?? "";

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/guide/debutant/${slug}/` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/guide/debutant/${slug}/`,
      type: "article",
    },
  };
}

// ── Fallback content ──────────────────────────────────────────────────────

function FallbackContent({ slug }: { slug: string }) {
  const title = DEBUTANT_TITLES[slug] ?? "Guide débutant";
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

export default async function DebutantGuidePage({ params }: Props) {
  const { slug } = await params;

  if (!(DEBUTANT_SLUGS as readonly string[]).includes(slug)) notFound();

  const guide = getDebutantGuide(slug);
  const title = guide?.title ?? DEBUTANT_TITLES[slug] ?? "Guide débutant";
  const description = guide?.description ?? DEBUTANT_DESCRIPTIONS[slug] ?? "";

  const relatedSlugs = RELATED_MAP[slug] ?? [];

  const breadcrumb = breadcrumbSchema([
    { name: "Accueil", url: BASE_URL + "/" },
    { name: "Guides", url: BASE_URL + "/guide/" },
    { name: "Pour débutants", url: BASE_URL + "/guide/debutant/" },
    { name: title, url: `${BASE_URL}/guide/debutant/${slug}/` },
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
        <a href="/guide/debutant/" className="hover:text-slate-300 transition-colors">Débutant</a>
        <span className="mx-2">/</span>
        <span className="text-slate-400 line-clamp-1">{title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-blue-500/15 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
            Pour débutants
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

      {/* PDF CTA */}
      <div className="mb-8 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
        <span className="text-2xl shrink-0">📥</span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-amber-400">Guide PDF gratuit</p>
          <p className="text-xs text-slate-400">Les 10 erreurs qui coûtent de l&apos;argent en MTT</p>
        </div>
        <a
          href="/guides/erreurs-mtt.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-black hover:bg-amber-400 transition-colors"
        >
          Télécharger →
        </a>
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
            Guides débutant connexes
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedSlugs.map((s) => (
              <a
                key={s}
                href={`/guide/debutant/${s}/`}
                className="group rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:bg-slate-800/70 hover:border-slate-700 transition-all"
              >
                <p className="text-sm font-medium text-white group-hover:text-amber-400 transition-colors leading-snug">
                  {DEBUTANT_TITLES[s]}
                </p>
                <p className="mt-1 text-xs text-amber-500 group-hover:text-amber-400">
                  Lire →
                </p>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Platform links */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <a
          href="https://www.winamax.fr/poker/bonus-bienvenue"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center hover:bg-amber-500/15 transition-colors"
        >
          <div className="font-bold text-amber-400 mb-1">♠ Winamax</div>
          <p className="text-xs text-slate-400 mb-3">Programme MTT, freerolls et séries</p>
          <span className="rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-bold text-black">
            Voir les tournois →
          </span>
        </a>
        <a
          href="https://www.pokerstars.fr/poker/bonus-bienvenue/"
          target="_blank"
          rel="noopener noreferrer sponsored"
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
