"use client";

import React, { useState } from "react";
import { FileText, Copy, Check, Sparkles, RefreshCw, AlertCircle } from "lucide-react";

export default function CoverLetterPage() {
  const [title, setTitle] = useState("");
  const [targetJournal, setTargetJournal] = useState("Nature Communications");
  const [mainFindings, setMainFindings] = useState("");
  const [broadSignificance, setBroadSignificance] = useState("");
  const [suggestedReviewers, setSuggestedReviewers] = useState("");
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSample = () => {
    setTitle("Single-cell transcriptional profiling of DLL3 activation in neuroendocrine lung carcinoma");
    setTargetJournal("Nature Communications");
    setMainFindings("Nominated transcription factor POU2F1 as the primary upstream regulator of DLL3 through genome-wide CRISPR knockout screens across 8 patient-derived organoid lines.");
    setBroadSignificance("Identifies the missing transcriptional mechanism behind DLL3 expression in small cell lung cancer and offers a biomarker to stratify patient response to T-cell engager therapies.");
    setSuggestedReviewers("Dr. Jane Doe (Memorial Sloan Kettering, no conflicts), Dr. Alan Smith (Francis Crick Institute, no conflicts)");
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetJournal) {
      setError("Please provide at least the manuscript title and target journal.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const savedConfig = localStorage.getItem("manuview_provider_config");
      const res = await fetch("/api/tools/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          targetJournal,
          mainFindings,
          broadSignificance,
          suggestedReviewers,
          providerConfig: savedConfig ? JSON.parse(savedConfig) : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLetter(data.letter);
    } catch (err: any) {
      setError(err.message || "Failed to generate cover letter.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-white py-12 aura-bg-gradient aura-grid-pattern">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.06] text-neutral-300 border border-white/10 shadow-sm mb-3">
            <FileText className="w-3.5 h-3.5" />
            Editor-Calibrated Submissions
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            Journal Cover Letter Generator
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
            Generate an editor-ready formal submission letter highlighting why your paper matters to the journal&apos;s specific readership.
          </p>
        </div>

        <div className="aura-paper-sheet rounded-2xl p-6 sm:p-8 shadow-2xl mb-10 text-[#111827]">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3 mb-4">
            <span className="text-xs font-semibold text-[#111827]">Letter Specifications</span>
            <button
              type="button"
              onClick={handleSample}
              className="text-xs text-teal-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Load Sample Details
            </button>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1">
                  Manuscript Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Single-cell transcriptional..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D1D5DB] text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1">
                  Target Journal
                </label>
                <input
                  type="text"
                  value={targetJournal}
                  onChange={(e) => setTargetJournal(e.target.value)}
                  placeholder="e.g. Nature Communications, Cell"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D1D5DB] text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1">
                Primary Findings &amp; Evidence
              </label>
              <textarea
                rows={2}
                value={mainFindings}
                onChange={(e) => setMainFindings(e.target.value)}
                placeholder="What was discovered? What experimental proof was provided?"
                className="w-full p-3 rounded-xl bg-white border border-[#D1D5DB] text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1">
                Broader Impact / Fit with Journal Readership
              </label>
              <textarea
                rows={2}
                value={broadSignificance}
                onChange={(e) => setBroadSignificance(e.target.value)}
                placeholder="Why should the journal's audience care about this today?"
                className="w-full p-3 rounded-xl bg-white border border-[#D1D5DB] text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-teal-500"
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
              className="w-full py-3 rounded-xl bg-black hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Drafting Editor-Grade Letter...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Submission Cover Letter</span>
                </>
              )}
            </button>
          </form>
        </div>

        {letter && (
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <span className="text-xs font-semibold text-white">Generated Cover Letter Draft</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Letter"}</span>
              </button>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#D1D5DB] text-xs text-slate-300 whitespace-pre-wrap font-serif leading-relaxed">
              {letter}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
