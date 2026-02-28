import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/news";
import { getAllGuides, ALL_GUIDE_SLUGS } from "@/lib/guides";
import { DEBUTANT_SLUGS } from "@/lib/debutant";

export const dynamic = "force-static";

const BASE_URL = "https://tournois-poker.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const generatedGuides = getAllGuides();
  const generatedSlugs = new Set(generatedGuides.map((g) => g.slug));
  // Include all planned guide slugs in sitemap
  const guideSlugs = ALL_GUIDE_SLUGS;

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
      url: `${BASE_URL}/tournois/bounty/`,
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
    {
      url: `${BASE_URL}/guide/`,
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

  const guideRoutes: MetadataRoute.Sitemap = guideSlugs.map((slug) => {
    const guide = generatedSlugs.has(slug)
      ? generatedGuides.find((g) => g.slug === slug)
      : null;
    return {
      url: `${BASE_URL}/guide/${slug}/`,
      lastModified: guide ? new Date(guide.updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    };
  });

  const debutantIndexRoute: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/guide/debutant/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const debutantRoutes: MetadataRoute.Sitemap = [...DEBUTANT_SLUGS].map((slug) => ({
    url: `${BASE_URL}/guide/debutant/${slug}/`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...newsRoutes, ...guideRoutes, ...debutantIndexRoute, ...debutantRoutes];
}
