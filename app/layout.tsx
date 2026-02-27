import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Tournois Poker – Programme complet Winamax, PokerStars, Unibet",
    template: "%s | Tournois Poker",
  },
  description:
    "Programme complet des tournois de poker en ligne en France. Winamax, PokerStars, Unibet — filtrez par buy-in, garantie, format.",
  metadataBase: new URL("https://tournois-poker.fr"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <header className="border-b border-slate-800 bg-slate-900">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <a href="/" className="flex items-center gap-2 font-bold text-white">
              <span className="text-2xl">♠</span>
              <span className="text-lg">tournois-poker.fr</span>
            </a>
            <nav className="hidden gap-6 text-sm font-medium text-slate-300 md:flex">
              <a href="/tournois/winamax/" className="hover:text-white">Winamax</a>
              <a href="/tournois/pokerstars/" className="hover:text-white">PokerStars</a>
              <a href="/tournois/unibet/" className="hover:text-white">Unibet</a>
              <a href="/tournois/freeroll/" className="hover:text-white">Freerolls</a>
              <a href="/news/" className="hover:text-white">News</a>
              <a href="/guide/bonus-poker/" className="hover:text-white">Bonus</a>
            </nav>
          </div>
        </header>
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
