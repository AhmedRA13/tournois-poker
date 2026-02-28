"use client";

import { useState, useId } from "react";

export function EmailCaptureInline() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const honeypotId = useId();

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
      } else {
        setStatus("error");
        setErrorMsg(data.message ?? "Une erreur est survenue. Réessayez.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Connexion impossible. Vérifiez votre réseau.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-5 text-center">
        <p className="text-2xl mb-2">✅</p>
        <p className="font-semibold text-green-400">Guide envoyé !</p>
        <p className="text-sm text-slate-400 mt-1">
          Vérifiez votre boîte mail pour recevoir votre guide.
        </p>
        <a
          href="/guides/erreurs-mtt.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm text-amber-400 hover:text-amber-300 underline transition-colors"
        >
          Ou téléchargez-le directement →
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">📥</span>
        <div>
          <p className="font-bold text-amber-400 text-sm">Guide PDF gratuit</p>
          <p className="text-xs text-slate-400">
            Les 10 erreurs qui coûtent de l&apos;argent en MTT — 12 pages de conseils actionnables
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        {/* Honeypot — hidden from humans, filled by bots */}
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
          className="flex-1 min-w-0 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-black hover:bg-amber-400 disabled:opacity-60 transition-colors"
        >
          {status === "loading" ? "…" : "Recevoir →"}
        </button>
      </form>

      {status === "error" && errorMsg && (
        <p className="mt-2 text-xs text-red-400">{errorMsg}</p>
      )}
      <p className="mt-2 text-[10px] text-slate-500">
        Pas de spam. Désabonnement en 1 clic.
      </p>
    </div>
  );
}
