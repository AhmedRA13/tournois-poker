"use client";

import { useState, useEffect, useId, useCallback } from "react";

export function EmailCapturePopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const honeypotId = useId();

  // Show popup after 15s OR 60% scroll — only once per session
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if already dismissed this session
    try {
      if (sessionStorage.getItem("popup_dismissed")) return;
    } catch {
      // sessionStorage unavailable (private mode, etc.) — allow
    }

    let triggered = false;

    function trigger() {
      if (triggered) return;
      triggered = true;
      setVisible(true);
    }

    // 15-second timer
    const timer = setTimeout(trigger, 15_000);

    // 60% scroll depth
    function onScroll() {
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && scrolled / docHeight >= 0.6) {
        trigger();
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    setDismissed(true);
    try {
      sessionStorage.setItem("popup_dismissed", "1");
    } catch {
      // ignore
    }
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!visible) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, dismiss]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading" || status === "success") return;

    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget as HTMLFormElement;
    const honeypotValue = (form.elements.namedItem("website") as HTMLInputElement)?.value;

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), website: honeypotValue }),
      });
      const data = await res.json();

      if (data.ok) {
        setStatus("success");
        // Auto-close after 3s on success
        setTimeout(dismiss, 3000);
      } else {
        setStatus("error");
        setErrorMsg(data.message ?? "Erreur. Réessayez.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Connexion impossible.");
    }
  }

  if (!visible || dismissed) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="relative w-full max-w-md rounded-2xl border border-amber-500/30 bg-slate-900 shadow-2xl shadow-black/50 p-6">
          {/* Close button */}
          <button
            onClick={dismiss}
            aria-label="Fermer"
            className="absolute top-3 right-3 rounded-lg p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>

          {status === "success" ? (
            <div className="text-center py-4">
              <p className="text-4xl mb-3">✅</p>
              <p className="font-bold text-green-400 text-lg">Guide envoyé !</p>
              <p className="text-sm text-slate-400 mt-2">
                Vérifiez votre boîte mail.
              </p>
              <a
                href="/guides/erreurs-mtt.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm text-amber-400 hover:text-amber-300 underline transition-colors"
              >
                Téléchargement direct →
              </a>
            </div>
          ) : (
            <>
              {/* Icon + title */}
              <div className="text-center mb-5">
                <span className="text-4xl">📥</span>
                <h2 id="popup-title" className="mt-3 text-xl font-bold text-white">
                  Guide PDF gratuit
                </h2>
                <p className="mt-1.5 text-sm text-amber-400 font-semibold">
                  Les 10 erreurs qui coûtent de l&apos;argent en MTT
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  12 pages de conseils actionnables pour arrêter de perdre de l&apos;argent inutilement.
                </p>
              </div>

              {/* Features */}
              <ul className="mb-5 space-y-1.5">
                {[
                  "Les erreurs de positionnement les plus coûteuses",
                  "Comment gérer le tilt et la variance",
                  "Stratégie bulle et ICM expliqués simplement",
                  "Plan d'action en 3 étapes pour progresser",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* Honeypot */}
                <input
                  id={honeypotId}
                  type="text"
                  name="website"
                  aria-hidden="true"
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute opacity-0 pointer-events-none w-0 h-0"
                  defaultValue=""
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.fr"
                  required
                  autoComplete="email"
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 mb-3"
                />

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full rounded-lg bg-amber-500 py-3 text-sm font-bold text-black hover:bg-amber-400 disabled:opacity-60 transition-colors"
                >
                  {status === "loading" ? "Envoi…" : "Recevoir le guide gratuit →"}
                </button>

                {status === "error" && errorMsg && (
                  <p className="mt-2 text-xs text-red-400 text-center">{errorMsg}</p>
                )}
              </form>

              <p className="mt-3 text-[10px] text-slate-500 text-center">
                Pas de spam. Désabonnement en 1 clic. Données stockées de manière sécurisée.
              </p>

              <button
                onClick={dismiss}
                className="mt-2 w-full text-xs text-slate-600 hover:text-slate-400 transition-colors"
              >
                Non merci, je préfère perdre de l&apos;argent
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
