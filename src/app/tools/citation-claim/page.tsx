"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  BookOpen,
  ArrowRight,
  Info,
} from "lucide-react";

export default function CitationClaimPage() {
  const [sentence, setSentence] = useState("");
  const [doi, setDoi] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    verdict: "supported" | "partially_supported" | "not_supported" | "unable_to_verify";
    paperTitle: string;
    explanation: string;
    suggestedRewrite?: string;
    details?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSample = () => {
    setSentence(
      "POU2F1 is the master regulator that definitively proves DLL3 expression drives universal chemoresistance across all clinical SCLC isolates."
    );
    setDoi("10.1126/scitranslmed.aac9459");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sentence.trim() || !doi.trim()) {
      setError("Both the manuscript assertion and cited DOI are required.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const savedConfig = localStorage.getItem("manuview_provider_config");
      const res = await fetch("/api/tools/citation-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sentence,
          doi,
          providerConfig: savedConfig ? JSON.parse(savedConfig) : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to validate citation claim.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-neutral-900 dark:text-white py-12 aura-bg-gradient aura-grid-pattern">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="mb-8 text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Claim-to-Evidence Alignment</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
            Citation Claim &amp; Overclaim Validator
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed">
            Audit whether a stated sentence or factual claim in your manuscript is authentically substantiated by the cited publication, preventing causal overclaims during peer review.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Claim &amp; Citation Input
            </span>
            <button
              type="button"
              onClick={handleSample}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Claim</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                Manuscript Assertion / Claim Sentence
              </label>
              <textarea
                rows={3}
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                placeholder="e.g. Prior studies have established that POU2F1 proves DLL3 expression without rescue..."
                className="w-full p-3.5 rounded-xl liquid-glass-input text-xs sm:text-sm focus:outline-none font-serif resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                Cited Paper DOI
              </label>
              <input
                type="text"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                placeholder="e.g. 10.1126/scitranslmed.aac9459"
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass-input text-xs sm:text-sm focus:outline-none font-mono"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 text-red-700 dark:text-rose-300 border border-red-500/20 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={loading || !sentence.trim() || !doi.trim()}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl liquid-glass-btn-primary disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Evaluating Cited Evidence...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Validate Citation Claim</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Validation Results */}
        {result && (
          <div className="space-y-4 p-6 sm:p-7 rounded-3xl liquid-glass-card shadow-xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10">
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Audit Verdict
              </span>
              {result.verdict === "supported" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  SUBSTANTIATED BY EVIDENCE
                </span>
              ) : result.verdict === "partially_supported" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  PARTIAL SUPPORT (OVERCLAIM RISK)
                </span>
              ) : result.verdict === "not_supported" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/40">
                  <AlertCircle className="w-3.5 h-3.5" />
                  UNSUBSTANTIATED / MISATTRIBUTED
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-200 dark:bg-slate-800 text-neutral-700 dark:text-slate-300 border border-neutral-300 dark:border-slate-700">
                  <Info className="w-3.5 h-3.5" />
                  UNABLE TO VERIFY
                </span>
              )}
            </div>

            <div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Cited Target Publication:</div>
              <div className="text-base font-bold text-neutral-900 dark:text-white mt-0.5">{result.paperTitle || doi}</div>
            </div>

            {result.details && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <span>{result.details}</span>
              </div>
            )}

            {result.explanation && (
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/5 dark:border-white/10 space-y-1.5">
                <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Scientific Rationale:</div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">{result.explanation}</p>
              </div>
            )}

            {result.suggestedRewrite && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Calibrated Academic Rephrasing:</span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-200 font-medium leading-relaxed italic font-serif">
                  &ldquo;{result.suggestedRewrite}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
