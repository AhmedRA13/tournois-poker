import fs from "fs";
import path from "path";

export interface NewsArticle {
  slug: string;
  date: string;
  title: string;
  metaDescription: string;
  category: string;
  tags: string[];
  summary: string;
  content: string;
  generatedAt: string;
}

const NEWS_DIR = path.join(process.cwd(), "data", "news");

export function getAllArticles(): NewsArticle[] {
  if (!fs.existsSync(NEWS_DIR)) return [];
  return fs
    .readdirSync(NEWS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(NEWS_DIR, f), "utf-8")) as NewsArticle;
      } catch {
        return null;
      }
    })
    .filter((a): a is NewsArticle => a !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticleBySlug(slug: string): NewsArticle | null {
  const articles = getAllArticles();
  return articles.find((a) => a.slug === slug) ?? null;
}
