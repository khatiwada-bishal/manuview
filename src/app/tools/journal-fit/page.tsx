"use client";

import React, { useState } from "react";
import { BookOpen, Sparkles, RefreshCw, AlertCircle, ArrowRight, ExternalLink } from "lucide-react";
import { JournalEntry } from "@/lib/journals";

export default function JournalFitPage() {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    reach: JournalEntry;
    realistic: JournalEntry;
    fallback: JournalEntry;
    allMatches: { journal: JournalEntry; matchScore: number }[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSample = () => {
    setTitle("Single-cell transcriptional profiling of DLL3 activation in neuroendocrine lung carcinoma");
    setAbstract("Small cell lung cancer (SCLC) exhibits rapid recurrence and therapy resistance. Delta-like ligand 3 (DLL3) is an established cell-surface target for antibody-drug conjugates. Here we perform marker-based CRISPR-Cas9 screens and identify transcription factor POU2F1 as a primary driver of DLL3 expression.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title && !abstract) {
      setError("Please provide either title or abstract.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools/journal-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, abstract }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.data);
    } catch (err: any) {
      setError(err.message || "Failed to predict journal fit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            Journal Fit Predictor
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            Target Journal &amp; Backup Strategy
          </h1>
          <p className="text-slate-400 text-xs">
            Match your title and abstract against high-impact journals with editorial fit reasoning and desk-rejection hazards.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 shadow-xl mb-10">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <span className="text-xs font-semibold text-slate-300">Manuscript Details</span>
            <button
              type="button"
              onClick={handleSample}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Load Sample
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Manuscript Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Single-cell transcriptional profiling of..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Abstract
              </label>
              <textarea
                rows={4}
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="Paste abstract here..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
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
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Matching Venues...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Find Best-Fit Journals</span>
                </>
              )}
            </button>
          </form>
        </div>

        {results && (
          <div className="space-y-6">
            <h3 className="text-base font-serif font-bold text-white">Recommended Venue Tiers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Reach */}
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 uppercase">
                    Reach Tier
                  </span>
                  <h4 className="text-lg font-serif font-bold text-white mt-2 mb-1">{results.reach.name}</h4>
                  <div className="text-xs text-slate-400 mb-3">Impact Factor: {results.reach.impactFactor} &bull; {results.reach.publisher}</div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{results.reach.aimsAndScope}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 text-[11px] text-rose-300/90 border border-slate-800">
                  <span className="font-semibold block mb-0.5 text-rose-400">Desk-Reject Hazard:</span>
                  {results.reach.deskRejectHazards[0]}
                </div>
              </div>

              {/* Realistic */}
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-emerald-500/30 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase">
                    Realistic Match
                  </span>
                  <h4 className="text-lg font-serif font-bold text-white mt-2 mb-1">{results.realistic.name}</h4>
                  <div className="text-xs text-slate-400 mb-3">Impact Factor: {results.realistic.impactFactor} &bull; {results.realistic.publisher}</div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{results.realistic.aimsAndScope}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 text-[11px] text-amber-300/90 border border-slate-800">
                  <span className="font-semibold block mb-0.5 text-amber-400">Reviewer Expectation:</span>
                  {results.realistic.keyExpectations[0]}
                </div>
              </div>

              {/* Fallback */}
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 uppercase">
                    Safe Harbor / Fallback
                  </span>
                  <h4 className="text-lg font-serif font-bold text-white mt-2 mb-1">{results.fallback.name}</h4>
                  <div className="text-xs text-slate-400 mb-3">Impact Factor: {results.fallback.impactFactor} &bull; {results.fallback.publisher}</div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{results.fallback.aimsAndScope}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 text-[11px] text-slate-300 border border-slate-800">
                  <span className="font-semibold block mb-0.5 text-emerald-400">Acceptance Rate:</span>
                  {results.fallback.acceptanceRate}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
