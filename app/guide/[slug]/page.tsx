import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getGuideBySlug,
  getAllGuides,
  CATEGORY_LABELS,
  ALL_GUIDE_SLUGS,
} from "@/lib/guides";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Generate pages for all slugs that have been generated
  const guides = getAllGuides();
  const generated = guides.map((g) => ({ slug: g.slug }));
  // Also include all planned slugs so Next.js doesn't error at build time
  const planned = ALL_GUIDE_SLUGS.map((slug) => ({ slug }));
  const all = [...generated, ...planned];
  const seen = new Set<string>();
  return all.filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) {
    return { title: "Guide Poker" };
  }
  return {
    title: guide.title,
    description: guide.description,
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      publishedTime: guide.updatedAt,
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    // Guide planned but not yet generated
    notFound();
  }

  const faqSchema = guide.faq && guide.faq.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: guide.faq.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      }
    : null;

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-slate-500">
          <a href="/" className="hover:text-slate-300 transition-colors">
            Accueil
          </a>
          <span className="mx-2">›</span>
          <a href="/guide/" className="hover:text-slate-300 transition-colors">
            Guides
          </a>
          <span className="mx-2">›</span>
          <span className="text-slate-400">{CATEGORY_LABELS[guide.category]}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-400">
            {CATEGORY_LABELS[guide.category]}
            {guide.readTime > 0 && (
              <span className="ml-3 text-slate-500 normal-case font-normal">
                · {guide.readTime} min de lecture
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight">
            {guide.title}
          </h1>
          {guide.description && (
            <p className="mt-3 text-slate-400 text-lg leading-relaxed">
              {guide.description}
            </p>
          )}
        </header>

        {/* Content */}
        <article
          className="prose prose-invert prose-slate max-w-none
            prose-headings:font-bold prose-headings:text-white
            prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
            prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
            prose-p:text-slate-300 prose-p:leading-relaxed
            prose-li:text-slate-300
            prose-strong:text-white
            prose-a:text-amber-400 prose-a:no-underline hover:prose-a:text-amber-300
            prose-table:text-sm
            prose-th:text-slate-300 prose-th:font-semibold
            prose-td:text-slate-400"
          dangerouslySetInnerHTML={{ __html: guide.content }}
        />

        {/* FAQ */}
        {guide.faq && guide.faq.length > 0 && (
          <section className="mt-10 border-t border-slate-800 pt-8">
            <h2 className="text-xl font-bold text-white mb-5">
              Questions fréquentes
            </h2>
            <div className="space-y-4">
              {guide.faq.map(({ q, a }, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-4"
                >
                  <div className="font-semibold text-white text-sm mb-2">{q}</div>
                  <p className="text-sm text-slate-400">{a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-10 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-center">
          <div className="font-bold text-amber-400 mb-1">
            Mettez en pratique
          </div>
          <p className="text-sm text-slate-300 mb-4">
            Appliquez ces concepts avec un bonus de bienvenue exclusif.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://www.winamax.fr/poker/bonus-bienvenue"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="rounded-lg bg-amber-500 px-5 py-2 font-bold text-black hover:bg-amber-400 transition-colors text-sm"
            >
              Bonus Winamax 500€ →
            </a>
            <a
              href="https://www.pokerstars.fr/poker/bonus-bienvenue/"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="rounded-lg bg-red-600 px-5 py-2 font-bold text-white hover:bg-red-500 transition-colors text-sm"
            >
              Bonus PokerStars 600€ →
            </a>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <a
            href="/guide/"
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Tous les guides stratégie
          </a>
        </div>
      </div>
    </>
  );
}
