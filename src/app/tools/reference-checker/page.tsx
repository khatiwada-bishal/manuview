"use client";

import React, { useState } from "react";
import { CheckCircle2, RefreshCw, AlertCircle, AlertTriangle, ExternalLink, ShieldCheck } from "lucide-react";
import { ReferenceVerification } from "@/lib/types";

const SAMPLE_BIBLIOGRAPHY = `1. Saunders D, et al. A DLL3-targeted antibody-drug conjugate for small cell lung cancer. Sci Transl Med. 2015. DOI: 10.1126/scitranslmed.aac9459
2. Wakefield AJ, et al. Ileal-lymphoid-nodular hyperplasia and pervasive developmental disorder in children. Lancet. 1998. DOI: 10.1016/S0140-6736(97)11096-0
3. NonExistent A, Hallucination B. Synthetic AI generated citation. J Bio. 2024. DOI: 10.1038/s41586-999-hallucinated01
4. Rudin CM, et al. Molecular subtypes of small cell lung cancer. Nat Rev Cancer. 2019. DOI: 10.1038/s41568-019-0133-9`;

export default function ReferenceCheckerPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    total: number;
    retractedCount: number;
    unresolvableCount: number;
    verified: ReferenceVerification[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSample = () => {
    setInput(SAMPLE_BIBLIOGRAPHY);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      setError("Please paste a bibliography or reference list.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/verify-references", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bibliography: input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Failed to verify bibliography.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20 mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Live Crossref &amp; Retraction Watch Audit
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            Reference &amp; Retraction Checker
          </h1>
          <p className="text-slate-400 text-xs">
            Checks each cited paper against official Crossref metadata and Retraction Watch. Catch unresolvable AI hallucinations before editors do.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 shadow-xl mb-10">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <span className="text-xs font-semibold text-slate-300">Paste Bibliography / DOIs</span>
            <button
              type="button"
              onClick={handleSample}
              className="text-xs text-blue-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Load Sample with Retracted &amp; Fake DOI
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              rows={6}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your references (BibTeX, plain text, or DOIs)..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
            />

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying with Crossref API...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify References</span>
                </>
              )}
            </button>
          </form>
        </div>

        {results && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-2xl font-bold font-serif text-white">{results.total}</div>
                <div className="text-xs text-slate-400">Total Parsed</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className={`text-2xl font-bold font-serif ${results.retractedCount > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                  {results.retractedCount}
                </div>
                <div className="text-xs text-slate-400">Retracted Literature</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className={`text-2xl font-bold font-serif ${results.unresolvableCount > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                  {results.unresolvableCount}
                </div>
                <div className="text-xs text-slate-400">Unresolvable / AI Risk</div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900/40 border border-slate-800 divide-y divide-slate-800">
              {results.verified.map((v, idx) => (
                <div key={idx} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1 max-w-xl">
                    <div className="text-slate-200 font-medium">{v.title || v.raw}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      {v.doi && <span>DOI: {v.doi}</span>}
                      {v.journal && <span>&bull; {v.journal}</span>}
                      {v.year && <span>&bull; {v.year}</span>}
                    </div>
                    {v.retractionDetails && (
                      <div className="text-rose-400 text-[11px] font-semibold">
                        {v.retractionDetails}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    {v.isRetracted ? (
                      <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 font-bold text-[10px] border border-rose-500/30">
                        RETRACTED
                      </span>
                    ) : v.status === "valid" ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[10px] border border-emerald-500/30">
                        Crossref Verified
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-semibold text-[10px] border border-amber-500/30">
                        Unresolvable (404)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
