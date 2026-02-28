import type { Metadata } from "next";
import {
  getUnifiedTournaments,
  getAvailableDates,
  getParisTodayDate,
} from "@/lib/tournaments";
import { TournamentsDashboard } from "@/components/TournamentsDashboard";
import { getAllArticles } from "@/lib/news";

export const metadata: Metadata = {
  title: {
    absolute:
      "Tournois Poker en Ligne – Programme Winamax, PokerStars, Unibet",
  },
  description:
    "Programme complet des tournois de poker en ligne en France. Winamax, PokerStars, Unibet — filtrez par buy-in, format et garantie. Freerolls gratuits inclus. Mis à jour chaque nuit.",
};

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function HomePage() {
  const tournaments = getUnifiedTournaments();
  const dates = getAvailableDates(tournaments);
  const today = getParisTodayDate();
  const latestNews = getAllArticles().slice(0, 5);

  const todayTourneys = tournaments.filter((t) => t.date === today);
  const totalToday = todayTourneys.length;
  const totalSpecials = todayTourneys.filter((t) => t.special).length;
  const totalFreerolls = todayTourneys.filter(
    (t) => t.format === "freeroll"
  ).length;

  // JSON-LD: EventList of upcoming specials
  const upcomingSpecials = tournaments
    .filter((t) => t.special && t.date >= today)
    .slice(0, 12);

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tournois Poker Spéciaux – Agenda",
    description:
      "Prochains tournois de poker spéciaux sur Winamax et PokerStars",
    itemListElement: upcomingSpecials.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Event",
        name: t.name,
        startDate: `${t.date}T${t.time}:00+01:00`,
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "VirtualLocation",
          url: t.url,
        },
        organizer: {
          "@type": "Organization",
          name:
            t.platform === "winamax"
              ? "Winamax"
              : t.platform === "pokerstars"
                ? "PokerStars"
                : "Unibet",
        },
        ...(t.buyin > 0
          ? {
              offers: {
                "@type": "Offer",
                price: t.buyin.toString(),
                priceCurrency: "EUR",
                availability: "https://schema.org/InStock",
              },
            }
          : {}),
      },
    })),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Tournois Poker",
    url: "https://tournois-poker.fr",
    description:
      "Programme complet des tournois de poker en ligne en France — Winamax, PokerStars, Unibet",
  };

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={eventSchema} />

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Hero */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white md:text-4xl leading-tight">
            Programme des Tournois Poker en Ligne
          </h1>
          <p className="mt-2 text-slate-400 text-sm md:text-base">
            {totalToday > 0
              ? `${totalToday.toLocaleString("fr-FR")} tournois aujourd'hui · ${totalSpecials} spéciaux · ${totalFreerolls} freerolls`
              : "Winamax · PokerStars · Unibet — mis à jour chaque nuit"}
          </p>
        </div>

        {/* Stats bar */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Tournois aujourd'hui",
              value: totalToday,
              color: "text-white",
            },
            {
              label: "Événements spéciaux",
              value: totalSpecials,
              color: "text-amber-400",
            },
            {
              label: "Freerolls gratuits",
              value: totalFreerolls,
              color: "text-green-400",
            },
            { label: "Plateformes", value: 3, color: "text-white" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-slate-800 bg-slate-900 p-3 sm:p-4 text-center"
            >
              <div className={`text-2xl sm:text-3xl font-bold ${s.color}`}>
                {s.value.toLocaleString("fr-FR")}
              </div>
              <div className="mt-1 text-xs text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Interactive dashboard */}
        <TournamentsDashboard
          tournaments={tournaments}
          dates={dates}
          today={today}
        />

        {/* News preview */}
        {latestNews.length > 0 && (
          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-white">
                📰 Actualités poker
              </h2>
              <a
                href="/news/"
                className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
              >
                Toutes les news →
              </a>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {latestNews.slice(0, 3).map((article) => (
                <a
                  key={article.slug}
                  href={`/news/${article.slug}/`}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-4 hover:bg-slate-800/70 transition-colors block"
                >
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                    {article.category} ·{" "}
                    {new Date(article.date + "T12:00:00Z").toLocaleDateString(
                      "fr-FR",
                      { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }
                    )}
                  </div>
                  <div className="font-semibold text-white text-sm leading-snug line-clamp-2">
                    {article.title}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400 line-clamp-2">
                    {article.summary}
                  </p>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Affiliate CTA */}
        <div className="mt-10 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 sm:p-6 text-center">
          <h2 className="text-base sm:text-lg font-bold text-amber-400">
            Nouveau sur le poker en ligne ?
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Jusqu'à <strong className="text-white">500€ offerts</strong> sur
            Winamax et PokerStars pour votre 1er dépôt.
          </p>
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="https://www.winamax.fr/poker/bonus-bienvenue"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="w-full sm:w-auto rounded-lg bg-amber-500 px-6 py-2.5 font-bold text-black hover:bg-amber-400 transition-colors text-sm"
            >
              Bonus Winamax →
            </a>
            <a
              href="https://www.pokerstars.fr/poker/bonus-bienvenue/"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="w-full sm:w-auto rounded-lg bg-red-600 px-6 py-2.5 font-bold text-white hover:bg-red-500 transition-colors text-sm"
            >
              Bonus PokerStars →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
