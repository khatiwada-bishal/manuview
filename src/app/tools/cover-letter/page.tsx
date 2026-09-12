"use client";

import React, { useState } from "react";
import {
  FileText,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Download,
  FileCode,
  BookOpen,
} from "lucide-react";
import JournalCombobox from "@/components/JournalCombobox";

export default function CoverLetterPage() {
  const [title, setTitle] = useState("");
  const [targetJournal, setTargetJournal] = useState("Nature Communications");
  const [abstract, setAbstract] = useState("");
  const [keywords, setKeywords] = useState("");
  const [mainFindings, setMainFindings] = useState("");
  const [broadSignificance, setBroadSignificance] = useState("");
  const [suggestedReviewers, setSuggestedReviewers] = useState("");
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSample = () => {
    setTitle("Single-cell transcriptional profiling of DLL3 activation in neuroendocrine lung carcinoma");
    setTargetJournal("Nature Communications");
    setAbstract(
      "Small cell lung cancer (SCLC) exhibits rapid recurrence and therapy resistance. Delta-like ligand 3 (DLL3) is an established cell-surface target for antibody-drug conjugates and T-cell engagers. However, the precise cis-regulatory mechanisms controlling DLL3 transcription remain uncharacterized. Here, we perform marker-based CRISPR-Cas9 screens and identify the transcription factor POU2F1 as a primary driver of DLL3 expression. We demonstrate that POU2F1 directly binds the DLL3 distal enhancer element to drive chemoresistance in clinical isolates. Knockdown of POU2F1 caused significant downregulation of DLL3 mRNA across 8 patient-derived organoid lines. Our findings provide a mechanistic framework for DLL3 regulation and suggest POU2F1 as a candidate predictive biomarker for clinical stratification."
    );
    setKeywords("small cell lung cancer, DLL3, POU2F1, CRISPR-Cas9 screen, transcriptional regulation, organoids, chemoresistance");
    setMainFindings("Nominated transcription factor POU2F1 as the primary upstream regulator of DLL3 through genome-wide CRISPR knockout screens across 8 patient-derived organoid lines.");
    setBroadSignificance("Identifies the missing transcriptional mechanism behind DLL3 expression in small cell lung cancer and offers a biomarker to stratify patient response to T-cell engager therapies.");
    setSuggestedReviewers("Dr. Jane Doe (Memorial Sloan Kettering, no conflicts), Dr. Alan Smith (Francis Crick Institute, no conflicts)");
    setError(null);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetJournal.trim()) {
      setError("Please specify a Target Journal.");
      return;
    }
    if (!title.trim()) {
      setError("Please provide the Manuscript Title.");
      return;
    }
    if (!abstract.trim()) {
      setError("Please provide the Manuscript Abstract.");
      return;
    }

    setLoading(true);
    setError(null);
    setLetter(null);

    try {
      const savedConfig = localStorage.getItem("manuview_provider_config");
      const res = await fetch("/api/tools/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          targetJournal,
          abstract,
          keywords,
          mainFindings,
          broadSignificance,
          suggestedReviewers,
          providerConfig: savedConfig ? JSON.parse(savedConfig) : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate cover letter.");
      setLetter(data.letter);
    } catch (err: any) {
      setError(err.message || "Failed to generate cover letter.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!letter) return;
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!letter) return;
    const blob = new Blob([letter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Cover_Letter_${targetJournal.replace(/[^a-zA-Z0-9_-]/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportLatex = () => {
    if (!letter) return;
    const escapedJournal = targetJournal.replace(/[#$%&_~^]/g, "\\$0");
    const escapedTitle = title.replace(/[#$%&_~^]/g, "\\$0");
    const formattedBody = letter
      .split("\n\n")
      .map((para) => para.trim())
      .filter(Boolean)
      .map((para) => para.replace(/[#$%&_~^]/g, "\\$0"))
      .join("\n\n\\vspace{0.8em}\n\n");

    const tex = `% ==============================================================================
% ManuView Academic Journal Submission Cover Letter
% Target Journal: ${escapedJournal}
% Manuscript: ${escapedTitle}
% Generated: ${new Date().toISOString()}
% ==============================================================================
\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=1in]{geometry}
\\usepackage{hyperref}
\\usepackage{parskip}

\\begin{document}
\\pagestyle{empty}

${formattedBody}

\\end{document}`;

    const blob = new Blob([tex], { type: "application/x-latex;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Cover_Letter_${targetJournal.replace(/[^a-zA-Z0-9_-]/g, "_")}.tex`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="min-h-screen text-neutral-900 dark:text-white py-12 aura-bg-gradient aura-grid-pattern">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="mb-8 text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 shadow-xs">
            <FileText className="w-3.5 h-3.5" />
            <span>Editor-Calibrated Formal Letter</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
            Journal Cover Letter Generator
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed">
            Generate formal, high-impact submission cover letters tailored to your target journal&apos;s editorial criteria, highlighting novel discoveries and mandatory compliance affirmations.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Manuscript Submission Details
            </span>
            <button
              type="button"
              onClick={handleSample}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Preprint</span>
            </button>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-30">
              <div className="relative z-30">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                  Target Journal <span className="text-rose-600 font-bold">*</span>
                </label>
                <JournalCombobox
                  value={targetJournal}
                  onChange={(val) => setTargetJournal(val)}
                  placeholder="Select or type target journal..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                  Manuscript Title <span className="text-rose-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Single-cell transcriptional profiling of..."
                  className="w-full px-3.5 py-2.5 rounded-xl liquid-glass-input text-xs sm:text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Manuscript Abstract <span className="text-rose-600 font-bold">*</span>
                </label>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {abstract.trim() ? `${abstract.trim().split(/\s+/).length} words` : "Mandatory"}
                </span>
              </div>
              <textarea
                rows={4}
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="Paste the complete abstract (core research question, methodology, primary findings, and conclusion)..."
                className="w-full p-3.5 rounded-xl liquid-glass-input text-xs sm:text-sm focus:outline-none leading-relaxed resize-none font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                Manuscript Keywords <span className="text-neutral-400 font-normal text-[11px]">(Optional)</span>
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Comma-separated keywords, e.g. CRISPR screen, organoids, chemoresistance, oncology"
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass-input text-xs sm:text-sm focus:outline-none"
              />
            </div>

            {/* Optional Section */}
            <div className="pt-3 border-t border-black/5 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Optional Context &amp; Editorial Highlights
                </span>
                <span className="text-[11px] text-neutral-400">
                  Synthesized automatically from Abstract if omitted
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Primary Findings &amp; Evidence <span className="text-neutral-400 font-normal text-[11px]">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={mainFindings}
                  onChange={(e) => setMainFindings(e.target.value)}
                  placeholder="Key breakthroughs or experimental data you specifically want highlighted in the cover letter..."
                  className="w-full p-3 rounded-xl liquid-glass-input text-xs focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Broader Impact / Fit with Journal Readership <span className="text-neutral-400 font-normal text-[11px]">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={broadSignificance}
                  onChange={(e) => setBroadSignificance(e.target.value)}
                  placeholder="Why the journal's specific readership should care about this discovery today..."
                  className="w-full p-3 rounded-xl liquid-glass-input text-xs focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Suggested / Opposed Reviewers <span className="text-neutral-400 font-normal text-[11px]">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={suggestedReviewers}
                  onChange={(e) => setSuggestedReviewers(e.target.value)}
                  placeholder="e.g. Dr. Jane Doe (MSKCC, no conflicts), Dr. Alan Smith (Francis Crick)"
                  className="w-full px-3.5 py-2.5 rounded-xl liquid-glass-input text-xs sm:text-sm focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !title.trim() || !targetJournal.trim() || !abstract.trim()}
              className="w-full py-3.5 rounded-xl liquid-glass-btn-primary disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Calibrating with Editorial Standards...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Generate Submission Cover Letter</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Section */}
        {letter && (
          <div className="rounded-3xl liquid-glass-card p-6 space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/5 dark:border-white/10 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-neutral-900 dark:text-white">Generated Submission Cover Letter</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
                    {letter.split(/\s+/).length} words
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Addressed to the Senior Editor-in-Chief of {targetJournal}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-glass-btn-secondary text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition cursor-pointer"
                  title="Download plain text file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportLatex}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-glass-btn-secondary text-xs font-semibold text-purple-700 dark:text-purple-300 transition cursor-pointer shadow-xs"
                  title="Export compile-ready LaTeX document"
                >
                  <FileCode className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Export LaTeX (.tex)</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl liquid-glass-btn-primary text-white text-xs font-semibold transition cursor-pointer shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Letter"}</span>
                </button>
              </div>
            </div>

            <div className="p-8 sm:p-10 rounded-2xl bg-white/80 dark:bg-black/20 border border-black/5 dark:border-white/10 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap font-serif leading-relaxed shadow-2xs">
              {letter}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

