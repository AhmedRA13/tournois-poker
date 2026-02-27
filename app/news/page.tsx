import type { Metadata } from "next";
import { getAllArticles } from "@/lib/news";

export const metadata: Metadata = {
  title: "Actualités Poker – News quotidiennes Winamax, PokerStars, Unibet",
  description:
    "Toute l'actualité du poker en ligne français : résultats de tournois, nouvelles séries, stratégies et analyses. Mis à jour chaque jour.",
};

const CATEGORY_LABELS: Record<string, string> = {
  resultats: "Résultats",
  tournoi: "Tournoi",
  serie: "Série",
  strategie: "Stratégie",
  actualite: "Actualité",
};

const CATEGORY_COLORS: Record<string, string> = {
  resultats: "bg-green-900/60 text-green-300",
  tournoi: "bg-blue-900/60 text-blue-300",
  serie: "bg-amber-900/60 text-amber-300",
  strategie: "bg-purple-900/60 text-purple-300",
  actualite: "bg-slate-800 text-slate-300",
};

export default function NewsIndexPage() {
  const articles = getAllArticles();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Actualités Poker</h1>
        <p className="mt-2 text-slate-400">
          News quotidiennes du poker en ligne français — générées par IA et vérifiées.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 py-16 text-center text-slate-500">
          <p className="text-4xl mb-4">📰</p>
          <p className="text-lg font-medium text-slate-400">Articles à venir</p>
          <p className="text-sm mt-2">La génération automatique d'articles commence demain à 02h00.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {articles.map((article) => {
            const dateStr = new Date(article.date).toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            });
            return (
              <article
                key={article.slug}
                className="rounded-xl border border-slate-800 bg-slate-900 p-6 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      CATEGORY_COLORS[article.category] ?? CATEGORY_COLORS.actualite
                    }`}
                  >
                    {CATEGORY_LABELS[article.category] ?? article.category}
                  </span>
                  <time className="text-xs text-slate-500 capitalize">{dateStr}</time>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  <a href={`/news/${article.slug}/`} className="hover:text-amber-400 transition-colors">
                    {article.title}
                  </a>
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">{article.summary}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2 flex-wrap">
                    {article.tags?.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={`/news/${article.slug}/`}
                    className="text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Lire l'article →
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
