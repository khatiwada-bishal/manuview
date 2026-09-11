"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  RefreshCw,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
  FileCode,
  CheckCircle2,
  Tag,
} from "lucide-react";

const SAMPLE_DECISION_LETTER = `Dear Author,

Thank you for submitting your manuscript "DLL3 SCLC Nature Pre-Submission" to Nature Communications. The reviewers have evaluated your work and recommend Major Revisions before publication can be considered.

Reviewer #1 (Methods):
The authors claim that POU2F1 directly drives DLL3 transcription, but sgRNA library coverage depth was only sequenced across 8 organoid lines without rescue controls. The authors must confirm sgRNA plasmid library representation across all biological replicates.

Reviewer #2 (Statistics):
In Figure 3D, a two-tailed Student's t-test is applied to sample sizes of n=8 without reporting Shapiro-Wilk normality tests. Given the skewness, non-parametric Wilcoxon rank-sum or Mann-Whitney tests should be utilized.

Reviewer #3 (Field Novelty):
The authors should explicitly clarify their enhancer assay distinction from the published promoter analysis in Cell Reports 2024.`;

interface RebuttalItem {
  reviewer: string;
  itemNumber: number;
  category: string;
  rawComment: string;
  actionRequired: string;
  draftResponse: string;
}

export default function ResponseBuilderPage() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<RebuttalItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedRebuttalIdx, setCopiedRebuttalIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleSample = () => {
    setInputText(SAMPLE_DECISION_LETTER);
  };

  const handleBuild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setError("Please paste reviewer comments or a decision letter.");
      return;
    }

    setLoading(true);
    setError(null);
    setItems([]);

    try {
      const savedConfig = localStorage.getItem("manuview_provider_config");
      const res = await fetch("/api/tools/response-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decisionLetterText: inputText,
          providerConfig: savedConfig ? JSON.parse(savedConfig) : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate rebuttal matrix.");
      if (!Array.isArray(data.items) || data.items.length === 0) {
        throw new Error("Unable to parse structured reviewer critiques from input.");
      }
      setItems(data.items);
    } catch (err: any) {
      setError(err.message || "Failed to generate response matrix.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyItem = (item: RebuttalItem, idx: number) => {
    const text = `Point ${item.itemNumber} (${item.reviewer}):\nComment: ${item.rawComment}\nAction: ${item.actionRequired}\nResponse: ${item.draftResponse}`;
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleCopyResponseOnly = (response: string, idx: number) => {
    navigator.clipboard.writeText(response);
    setCopiedRebuttalIdx(idx);
    setTimeout(() => setCopiedRebuttalIdx(null), 2000);
  };

  const handleCopyAll = () => {
    const text = items
      .map(
        (item) =>
          `Point ${item.itemNumber} (${item.reviewer})\nCategory: ${item.category}\nComment: ${item.rawComment}\nAction Required: ${item.actionRequired}\nResponse: ${item.draftResponse}\n`
      )
      .join("\n---\n\n");
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleExportLatex = () => {
    let rows = "";
    items.forEach((item) => {
      const reviewer = (item.reviewer || "Reviewer").replace(/[#$%&_~^]/g, "\\$0");
      const comment = (item.rawComment || "").replace(/[#$%&_~^]/g, "\\$0");
      const response = (item.draftResponse || "").replace(/[#$%&_~^]/g, "\\$0");
      rows += `\\textbf{${reviewer} (Pt ${item.itemNumber})} & \\textit{${comment}} & ${response} \\\\ \\midrule\n`;
    });

    const doc = `% ==============================================================================
% ManuView Academic Point-by-Point Author Rebuttal Matrix
% Generated: ${new Date().toISOString()}
% ==============================================================================
\\documentclass[10pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=0.8in]{geometry}
\\usepackage{longtable}
\\usepackage{booktabs}
\\title{\\textbf{Point-by-Point Author Response \\& Revision Matrix}}
\\date{\\today}
\\begin{document}
\\maketitle
\\begin{longtable}{p{0.2\\textwidth} p{0.38\\textwidth} p{0.38\\textwidth}}
\\toprule
\\textbf{Reviewer / Item} & \\textbf{Referee Comment} & \\textbf{Author Response \\& Action} \\\\
\\midrule
\\endhead
${rows}
\\bottomrule
\\end{longtable}
\\end{document}`;

    const blob = new Blob([doc], { type: "application/x-latex;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ManuView_Response_Matrix_${Date.now()}.tex`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-white py-12 aura-bg-gradient aura-grid-pattern">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="mb-8 text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-xs">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Response to Reviewers Rebuttal Matrix</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Peer Review Response &amp; Rebuttal Builder
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
            Automatically ingest editorial decision letters and referee reports. Isolates discrete critique items, categorizes required changes, and drafts diplomatically calibrated author responses.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="aura-paper-sheet rounded-2xl p-6 sm:p-8 shadow-2xl text-[#111827]">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4B5563]">
              Reviewer Critiques &amp; Decision Letter
            </span>
            <button
              type="button"
              onClick={handleSample}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Decision Letter</span>
            </button>
          </div>

          <form onSubmit={handleBuild} className="space-y-4">
            <textarea
              rows={7}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste reviewer comments, referee feedback, or editor decision letters..."
              className="w-full p-3.5 rounded-xl bg-white border border-[#D1D5DB] text-xs sm:text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono resize-none leading-relaxed"
            />

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="w-full py-3.5 rounded-xl bg-black hover:bg-neutral-900 disabled:opacity-50 text-white font-semibold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Rebuttal Matrix...</span>
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  <span>Generate Response Matrix</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Rebuttal Matrix Items */}
        {items.length > 0 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-white">
                  Itemized Rebuttal Points
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {items.length} {items.length === 1 ? "point" : "points"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyAll}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition cursor-pointer"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? "Copied All" : "Copy All"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportLatex}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 transition cursor-pointer shadow-xs"
                >
                  <FileCode className="w-3.5 h-3.5 text-purple-400" />
                  <span>Export LaTeX Table (.tex)</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-[#0F1117] border border-white/10 space-y-4 shadow-xl hover:border-white/20 transition"
                >
                  {/* Item Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-neutral-800 text-blue-400 border border-neutral-700">
                        {item.reviewer} · Point {item.itemNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-white/5 text-neutral-300 border border-white/10 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-neutral-400" />
                        <span>{item.category}</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyItem(item, idx)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition cursor-pointer"
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied Point</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Point</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Referee Comment Quote */}
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs sm:text-sm text-neutral-300 italic leading-relaxed font-serif">
                    &ldquo;{item.rawComment}&rdquo;
                  </div>

                  {/* Action Required */}
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                    <div className="font-semibold text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <span>Action Required:</span>
                    </div>
                    <div className="text-amber-200/90 leading-relaxed font-sans">
                      {item.actionRequired}
                    </div>
                  </div>

                  {/* Calibrated Author Response */}
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-blue-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>Calibrated Author Response:</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyResponseOnly(item.draftResponse, idx)}
                        className="text-[11px] font-medium text-blue-300 hover:text-white flex items-center gap-1 cursor-pointer transition"
                      >
                        {copiedRebuttalIdx === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Response Only</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-blue-100/95 leading-relaxed font-serif text-xs sm:text-sm">
                      {item.draftResponse}
                    </p>
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
