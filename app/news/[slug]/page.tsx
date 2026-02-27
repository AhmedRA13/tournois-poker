import type { Metadata } from "next";
import { getAllArticles, getArticleBySlug } from "@/lib/news";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article introuvable" };
  return {
    title: article.title,
    description: article.metaDescription,
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      type: "article",
      publishedTime: article.date,
    },
  };
}

/** Very minimal Markdown → HTML: headers, bold, italic, links, paragraphs */
function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .split(/\n{2,}/)
    .map((block) => {
      if (block.startsWith("<h") || block.startsWith("<ul") || block.startsWith("<ol")) return block;
      return `<p>${block.replace(/\n/g, " ")}</p>`;
    })
    .join("\n");
}

const CATEGORY_LABELS: Record<string, string> = {
  resultats: "Résultats",
  tournoi: "Tournoi",
  serie: "Série",
  strategie: "Stratégie",
  actualite: "Actualité",
};

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const dateStr = new Date(article.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const html = renderMarkdown(article.content);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-slate-500">
        <a href="/" className="hover:text-white">Accueil</a>
        <span className="mx-2">/</span>
        <a href="/news/" className="hover:text-white">News</a>
        <span className="mx-2">/</span>
        <span className="text-slate-400">{article.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex rounded-full bg-amber-500/20 px-3 py-1 text-sm font-semibold text-amber-400">
            {CATEGORY_LABELS[article.category] ?? article.category}
          </span>
          <time className="text-sm text-slate-500 capitalize">{dateStr}</time>
        </div>
        <h1 className="text-3xl font-bold text-white leading-tight">{article.title}</h1>
        {article.tags?.length > 0 && (
          <div className="mt-4 flex gap-2 flex-wrap">
            {article.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Article content */}
      <div
        className="prose prose-invert prose-slate max-w-none
          prose-h2:text-xl prose-h2:font-bold prose-h2:text-white prose-h2:mt-8 prose-h2:mb-4
          prose-h3:text-lg prose-h3:font-semibold prose-h3:text-slate-200 prose-h3:mt-6 prose-h3:mb-3
          prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-4
          prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Footer CTA */}
      <div className="mt-12 rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
        <p className="font-semibold text-amber-400">Prêt à jouer ?</p>
        <p className="mt-1 text-sm text-slate-300">Retrouvez tous les tournois du jour sur la page d'accueil.</p>
        <a href="/" className="mt-4 inline-block rounded-lg bg-amber-500 px-6 py-2.5 font-bold text-black hover:bg-amber-400 transition-colors">
          Voir les tournois →
        </a>
      </div>

      {/* Back link */}
      <div className="mt-6 text-center">
        <a href="/news/" className="text-sm text-slate-500 hover:text-white transition-colors">
          ← Toutes les actualités poker
        </a>
      </div>
    </div>
  );
}
