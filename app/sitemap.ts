import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/news";

export const dynamic = "force-static";

const BASE_URL = "https://tournois-poker.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tournois/winamax/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tournois/pokerstars/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tournois/unibet/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/tournois/freeroll/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tournois/dimanche/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/news/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/guide/bonus-poker/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const newsRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE_URL}/news/${a.slug}/`,
    lastModified: new Date(a.date),
    changeFrequency: "never" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...newsRoutes];
}
