"use client";

import React, { useState } from "react";
import { Sparkles, RefreshCw, AlertCircle, CheckCircle2, AlertTriangle, ArrowRight, ExternalLink } from "lucide-react";

export default function CitationClaimPage() {
  const [sentence, setSentence] = useState("");
  const [doi, setDoi] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    paperTitle?: string;
    publicationYear?: number;
    verdict: 'supported' | 'partially_supported' | 'not_supported' | 'unable_to_verify';
    explanation?: string;
    suggestedRewrite?: string;
    details?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSample = () => {
    setSentence("Targeting POU2F1 has been demonstrated in clinical trials to completely cure drug-resistant small cell lung cancer.");
    setDoi("10.1126/scitranslmed.aac9459");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sentence || !doi) {
      setError("Please provide both the manuscript sentence and the cited DOI.");
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
      setError(err.message || "Failed to verify citation claim.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Citation Claim Alignment
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            Citation Claim Validator
          </h1>
          <p className="text-slate-400 text-xs">
            Does the paper you cited actually support your assertion? We fetch the paper&apos;s abstract via OpenAlex and audit the claim against the real evidence.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 shadow-xl mb-10">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <span className="text-xs font-semibold text-slate-300">Test Claim vs. Citation</span>
            <button
              type="button"
              onClick={handleSample}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Load Overclaim Sample
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Manuscript Sentence
              </label>
              <textarea
                rows={3}
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                placeholder="e.g. Factor X has been proven to trigger phenotype Y in patients..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 font-serif"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Cited DOI
              </label>
              <input
                type="text"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                placeholder="e.g. 10.1126/scitranslmed.aac9459"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Auditing Abstract &amp; Claim...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Check Citation Support</span>
                </>
              )}
            </button>
          </form>
        </div>

        {result && (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-slate-400">Cited Paper:</span>
                <h4 className="text-sm font-semibold text-white">{result.paperTitle || doi}</h4>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                result.verdict === 'supported' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                result.verdict === 'partially_supported' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {result.verdict === 'supported' ? 'Fully Supported' :
                 result.verdict === 'partially_supported' ? 'Partially Supported' :
                 'Overclaim / Not Supported'}
              </span>
            </div>

            {result.explanation && (
              <p className="text-xs text-slate-300 leading-relaxed">
                {result.explanation}
              </p>
            )}

            {result.suggestedRewrite && (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-900/60">
                <span className="text-[11px] font-semibold text-emerald-400 block mb-1">
                  Evidence-Calibrated Rewrite Suggestion:
                </span>
                <p className="text-xs text-emerald-200 font-serif italic">
                  &quot;{result.suggestedRewrite}&quot;
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
