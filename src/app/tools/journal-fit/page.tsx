"use client";

import React, { useState } from "react";
import {
  Compass,
  Sparkles,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Shield,
  Clock,
  Award,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
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
    setAbstract(
      "Small cell lung cancer (SCLC) exhibits rapid recurrence and therapy resistance. Delta-like ligand 3 (DLL3) is an established cell-surface target for antibody-drug conjugates. Here we perform marker-based CRISPR-Cas9 screens and identify transcription factor POU2F1 as a primary driver of DLL3 expression. We demonstrate that POU2F1 directly binds the DLL3 distal enhancer element to drive chemoresistance across 8 patient-derived organoid lines."
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !abstract.trim()) {
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
    <div className="min-h-screen text-neutral-900 dark:text-white py-12 aura-bg-gradient aura-grid-pattern">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="mb-8 text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 shadow-xs">
            <Compass className="w-3.5 h-3.5" />
            <span>1,300+ Journal Catalog Matcher</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
            Journal Fit Predictor &amp; Submission Strategy
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed">
            Evaluate your manuscript abstract against indexed academic journals to discover Reach, Realistic, and Fallback publication targets with calculated acceptance likelihood.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Manuscript Details
            </span>
            <button
              type="button"
              onClick={handleSample}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Preprint</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                Manuscript Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Single-cell transcriptional profiling of DLL3 activation..."
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass-input text-xs sm:text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                Manuscript Abstract
              </label>
              <textarea
                rows={4}
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="Paste the manuscript abstract or key summary..."
                className="w-full p-3.5 rounded-xl liquid-glass-input text-xs sm:text-sm focus:outline-none resize-none"
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
                disabled={loading || (!title.trim() && !abstract.trim())}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl liquid-glass-btn-primary disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Matching against 1,300+ journals...</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-4 h-4" />
                    <span>Predict Journal Fit</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Prediction Results */}
        {results && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-serif font-bold text-neutral-900 dark:text-white mb-1">
                Strategic Submission Tiers
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Calibrated across Impact Factor, Acceptance Probability, and Scope Overlap.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Reach Target */}
              <div className="p-5 rounded-3xl liquid-glass-card border border-amber-500/30 space-y-3.5 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40">
                      <TrendingUp className="w-3 h-3" />
                      REACH TARGET
                    </span>
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                      IF {results.reach.impactFactor}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-neutral-900 dark:text-white">{results.reach.name}</h3>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{results.reach.publisher}</div>
                  </div>
                  {results.reach.aimsAndScope && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-light line-clamp-3">
                      {results.reach.aimsAndScope}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 pt-3 border-t border-black/5 dark:border-white/10 text-xs text-neutral-500 dark:text-neutral-400">
                  <div className="flex justify-between">
                    <span>Acceptance Rate:</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-200">{results.reach.acceptanceRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Turnaround:</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-200">{results.reach.reviewSpeed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Access Model:</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-200">{results.reach.openAccess}</span>
                  </div>
                </div>
              </div>

              {/* Realistic / Optimal Fit Target */}
              <div className="p-5 rounded-3xl liquid-glass-card border-2 border-emerald-500/50 space-y-3.5 shadow-xl flex flex-col justify-between ring-1 ring-emerald-500/20">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40">
                      <CheckCircle2 className="w-3 h-3" />
                      OPTIMAL FIT (RECOMMENDED)
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                      IF {results.realistic.impactFactor}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-neutral-900 dark:text-white">{results.realistic.name}</h3>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{results.realistic.publisher}</div>
                  </div>
                  {results.realistic.aimsAndScope && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-light line-clamp-3">
                      {results.realistic.aimsAndScope}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 pt-3 border-t border-black/5 dark:border-white/10 text-xs text-neutral-500 dark:text-neutral-400">
                  <div className="flex justify-between">
                    <span>Acceptance Rate:</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-200">{results.realistic.acceptanceRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Turnaround:</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-200">{results.realistic.reviewSpeed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Access Model:</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-200">{results.realistic.openAccess}</span>
                  </div>
                </div>
              </div>

              {/* Fallback Target */}
              <div className="p-5 rounded-3xl liquid-glass-card border border-blue-500/30 space-y-3.5 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/40">
                      <Shield className="w-3 h-3" />
                      FALLBACK / SAFETY
                    </span>
                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                      IF {results.fallback.impactFactor}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-neutral-900 dark:text-white">{results.fallback.name}</h3>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{results.fallback.publisher}</div>
                  </div>
                  {results.fallback.aimsAndScope && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-light line-clamp-3">
                      {results.fallback.aimsAndScope}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 pt-3 border-t border-black/5 dark:border-white/10 text-xs text-neutral-500 dark:text-neutral-400">
                  <div className="flex justify-between">
                    <span>Acceptance Rate:</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-200">{results.fallback.acceptanceRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Turnaround:</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-200">{results.fallback.reviewSpeed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Access Model:</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-200">{results.fallback.openAccess}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* All Qualified Catalog Matches Table */}
            {results.allMatches && results.allMatches.length > 0 && (
              <div className="space-y-3 pt-4">
                <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  All Qualified Catalog Matches ({results.allMatches.length})
                </h3>
                <div className="rounded-2xl liquid-glass-card overflow-hidden shadow-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-black/[0.03] dark:bg-white/[0.04] border-b border-black/5 dark:border-white/10 text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-4 py-3">Journal &amp; Publisher</th>
                        <th className="px-4 py-3">Fit Score</th>
                        <th className="px-4 py-3">Impact Factor</th>
                        <th className="px-4 py-3">Acceptance</th>
                        <th className="px-4 py-3">Turnaround</th>
                        <th className="px-4 py-3 text-right">Venue Search</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/10">
                      {results.allMatches.slice(0, 15).map((match, idx) => (
                        <tr key={idx} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-neutral-900 dark:text-neutral-100">{match.journal.name}</div>
                            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">{match.journal.publisher}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-block px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 text-[11px]">
                              {match.matchScore}%
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-neutral-200">
                            {match.journal.impactFactor}
                          </td>
                          <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                            {match.journal.acceptanceRate}
                          </td>
                          <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                            {match.journal.reviewSpeed}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <a
                              href={`https://www.google.com/search?q=${encodeURIComponent(match.journal.name + " journal")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-medium"
                            >
                              <span>Scope</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
