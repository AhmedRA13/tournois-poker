import type { Metadata } from "next";
import "./globals.css";
import { JsonLd } from "@/lib/seo";
import { EmailCapturePopup } from "@/components/EmailCapturePopup";

export const metadata: Metadata = {
  title: {
    default: "Tournois Poker – Programme complet Winamax, PokerStars, Unibet",
    template: "%s | Tournois Poker",
  },
  description:
    "Programme complet des tournois de poker en ligne en France. Winamax, PokerStars, Unibet — filtrez par buy-in, garantie, format.",
  metadataBase: new URL("https://tournois-poker.fr"),
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    siteName: "Tournois Poker",
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 1024,
        alt: "Tournois Poker – Programme Winamax, PokerStars, Unibet",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tournois Poker",
    url: "https://tournois-poker.fr",
    description:
      "Programme complet des tournois de poker en ligne en France — Winamax, PokerStars, Unibet.",
    logo: "https://tournois-poker.fr/logo.png",
  };

  return (
    <html lang="fr">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <JsonLd data={orgSchema} />
        <header className="border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <a href="/" className="flex items-center gap-2 font-bold text-white shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" className="h-7 w-7 rounded-md object-cover" />
              <span className="text-base">tournois-poker.fr</span>
            </a>
            {/* Desktop nav */}
            <nav className="hidden gap-5 text-sm font-medium text-slate-300 md:flex">
              <a href="/tournois/winamax/" className="hover:text-white transition-colors">Winamax</a>
              <a href="/tournois/pokerstars/" className="hover:text-white transition-colors">PokerStars</a>
              <a href="/tournois/unibet/" className="hover:text-white transition-colors">Unibet</a>
              <a href="/tournois/freeroll/" className="hover:text-white transition-colors">Freerolls</a>
              <a href="/tournois/dimanche/" className="hover:text-white transition-colors">Dimanche</a>
              <a href="/tournois/bounty/" className="hover:text-white transition-colors">Bounty</a>
              <a href="/news/" className="hover:text-white transition-colors">News</a>
              <a href="/guide/" className="hover:text-white transition-colors">Guides</a>
              <a href="/guide/bonus-poker/" className="hover:text-white transition-colors">Bonus</a>
            </nav>
          </div>
          {/* Mobile nav — horizontal scroll */}
          <div className="md:hidden border-t border-slate-800/60 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex min-w-max">
              {[
                { href: "/", label: "Accueil" },
                { href: "/tournois/winamax/", label: "♠ Winamax" },
                { href: "/tournois/pokerstars/", label: "★ PokerStars" },
                { href: "/tournois/freeroll/", label: "🎁 Freerolls" },
                { href: "/tournois/dimanche/", label: "🏆 Dimanche" },
                { href: "/tournois/bounty/", label: "💥 Bounty" },
                { href: "/news/", label: "📰 News" },
                { href: "/guide/", label: "📚 Guides" },
                { href: "/guide/bonus-poker/", label: "💰 Bonus" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </header>
        <EmailCapturePopup />
        <main>{children}</main>
        <footer className="mt-16 border-t border-slate-800 bg-slate-900 py-8 text-center text-xs text-slate-500">
          <p>
            tournois-poker.fr — Programme non-officiel. Données extraites des sites des opérateurs.
          </p>
          <p className="mt-1">
            Le poker en ligne est réservé aux adultes (+18). Jouez responsable.{" "}
            <a href="https://www.joueurs-info-service.fr" className="underline hover:text-slate-300" target="_blank" rel="noopener noreferrer">
              joueurs-info-service.fr
            </a>
          </p>
          {/* AdSense placeholder */}
          {/* TODO: <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" /> */}
        </footer>
      </body>
    </html>
  );
}
