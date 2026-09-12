"use client";

import React from "react";
import { BriefJournalFitReport } from "@/lib/types";
import {
  ArrowLeft,
  Download,
  Printer,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Tag,
  FileText,
  SlidersHorizontal,
  Lightbulb,
  ShieldAlert,
  ArrowRight,
  Globe,
} from "lucide-react";
import { exportInteractiveHtmlReport, exportWordDocReport } from "@/lib/export-generator";

interface Props {
  report: BriefJournalFitReport;
  onBack: () => void;
  onDownloadPDF: () => void;
  activeProviderInfo: { name: string; model: string };
  onSwitchToFullUpload?: () => void;
}

export function BriefJournalFitView({
  report,
  onBack,
  onDownloadPDF,
  activeProviderInfo,
  onSwitchToFullUpload,
}: Props) {
  const getVerdictBadge = () => {
    if (report.verdictColor === "green") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EDF6EE] text-[#1E5A2A] border border-[#CBE7CE] shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{report.verdict}</span>
        </span>
      );
    }
    if (report.verdictColor === "amber") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FBF3DB] text-[#78510E] border border-[#F4E2B6] shadow-2xs">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{report.verdict}</span>
        </span>
      );
    }
    if (report.verdictColor === "grey") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1] shadow-2xs">
          <AlertCircle className="w-3.5 h-3.5 text-[#64748B]" />
          <span>{report.verdict}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FDF0EF] text-[#7C2D2B] border border-[#F7CECC] shadow-2xs">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>{report.verdict}</span>
      </span>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-[#1E5A2A]";
    if (score >= 50) return "text-[#78510E]";
    return "text-[#7C2D2B]";
  };

  const getScoreBg = (score: number) => {
    if (score >= 75) return "bg-[#1E5A2A]";
    if (score >= 50) return "bg-[#78510E]";
    return "bg-[#7C2D2B]";
  };

  return (
    <div className="space-y-6 animate-fadeIn print:hidden">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#EBEBEA]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-[#787774] hover:text-[#2F3437] hover:bg-[#F7F7F5] px-2.5 py-1.5 rounded-lg transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Edit Manuscript</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#787774]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Target:</span>
            <span className="font-semibold text-[#2F3437] bg-[#F7F7F5] px-2 py-0.5 rounded border border-[#EBEBEA]">
              {report.targetJournal}
            </span>
          </div>

          <button
            type="button"
            onClick={() => exportInteractiveHtmlReport(report)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-[#2F3437] hover:bg-[#F7F7F5] border border-[#D0D5DD] transition shadow-2xs cursor-pointer"
            title="Export self-contained Interactive Web Report (.html) for offline viewing and sharing"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Interactive HTML</span>
          </button>

          <button
            type="button"
            onClick={() => exportWordDocReport(report)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-[#2F3437] hover:bg-[#F7F7F5] border border-[#D0D5DD] transition shadow-2xs cursor-pointer"
            title="Export Scope Fit Report as Microsoft Word Document (.doc / .docx)"
          >
            <FileText className="w-3.5 h-3.5 text-[#18569C]" />
            <span className="hidden sm:inline">Word (.docx)</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="p-1.5 rounded-lg border border-[#EBEBEA] hover:bg-[#F7F7F5] text-[#787774] transition"
            title="Print Brief Report"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onDownloadPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#2F3437] text-white hover:bg-black transition shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF Report</span>
          </button>
        </div>
      </div>

      {/* Hero Editorial Scope Card */}
      <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-[#EBEBEA] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#787774]">
                Target Journal Scope Validation
              </span>
              {getVerdictBadge()}
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F3437] tracking-tight">
              {report.targetJournal}
            </h2>
          </div>

          {/* Fit Score Badge */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-[#EBEBEA] shadow-2xs self-start">
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-[#787774] font-semibold">
                Overall Scope Match
              </div>
              <div
                className={`text-2xl font-bold font-mono ${
                  report.fitScore !== undefined ? getScoreColor(report.fitScore) : "text-[#64748B]"
                }`}
              >
                {report.fitScore !== undefined ? `${report.fitScore}%` : "Not Assessed"}
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#F7F7F5] border border-[#EBEBEA] flex items-center justify-center font-bold text-xs">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-mono shadow-xs"
                style={{
                  backgroundColor:
                    report.fitScore === undefined
                      ? "#64748B"
                      : report.fitScore >= 75
                      ? "#1E5A2A"
                      : report.fitScore >= 50
                      ? "#78510E"
                      : "#7C2D2B",
                }}
              >
                {report.fitScore === undefined
                  ? "N/A"
                  : report.fitScore >= 75
                  ? "FIT"
                  : report.fitScore >= 50
                  ? "FAIR"
                  : "RISK"}
              </div>
            </div>
          </div>
        </div>

        {/* Executive Scope Summary */}
        <div className="p-4 rounded-xl bg-white border border-[#EBEBEA] text-xs text-[#2F3437] leading-relaxed">
          <div className="font-semibold text-[11px] text-[#787774] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#0A85EA]" />
            <span>Senior Editorial Triage Synthesis</span>
          </div>
          <p className="italic text-[#37352F] text-xs sm:text-sm">
            &ldquo;{report.summary}&rdquo;
          </p>
        </div>
      </div>

      {/* Manuscript Information Preview Box */}
      <div className="p-4 rounded-xl bg-[#F7F7F5] border border-[#EBEBEA] text-xs space-y-2.5">
        <div>
          <span className="text-[10px] font-semibold text-[#787774] uppercase tracking-wider block mb-0.5">
            Evaluated Manuscript Title
          </span>
          <span className="font-semibold text-xs sm:text-sm text-[#2F3437] block">
            {report.title}
          </span>
        </div>

        {report.keywords && report.keywords.length > 0 && (
          <div>
            <span className="text-[10px] font-semibold text-[#787774] uppercase tracking-wider block mb-1">
              Author Keywords
            </span>
            <div className="flex flex-wrap gap-1.5">
              {report.keywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-white border border-[#EBEBEA] text-[11px] text-[#2F3437] font-medium"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <span className="text-[10px] font-semibold text-[#787774] uppercase tracking-wider block mb-1">
            Abstract Synopsis
          </span>
          <p className="text-[11px] text-[#787774] line-clamp-3 leading-relaxed bg-white p-2.5 rounded-lg border border-[#EBEBEA]">
            {report.abstract}
          </p>
        </div>
      </div>

      {/* 4 Scope Dimensions Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-[#787774] uppercase tracking-wider">
          Editorial Scope Dimensions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Dimension 1: Domain Match */}
          <div className="p-4 rounded-xl bg-white border border-[#EBEBEA] shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#2F3437]">1. Subject Domain Alignment</span>
              <span className={`font-mono font-bold ${report.dimensions.domainMatch.score !== undefined ? getScoreColor(report.dimensions.domainMatch.score) : "text-[#787774]"}`}>
                {report.dimensions.domainMatch.score !== undefined ? `${report.dimensions.domainMatch.score}%` : "—"}
              </span>
            </div>
            <div className="w-full bg-[#F7F7F5] rounded-full h-1.5 overflow-hidden">
              {report.dimensions.domainMatch.score !== undefined ? (
                <div
                  className={`h-full ${getScoreBg(report.dimensions.domainMatch.score)}`}
                  style={{ width: `${report.dimensions.domainMatch.score}%` }}
                />
              ) : (
                <div className="h-full bg-transparent" />
              )}
            </div>
            <p className="text-[11px] text-[#787774] leading-relaxed pt-0.5">
              {report.dimensions.domainMatch.feedback}
            </p>
          </div>

          {/* Dimension 2: Novelty & Conceptual Depth */}
          <div className="p-4 rounded-xl bg-white border border-[#EBEBEA] shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#2F3437]">2. Conceptual Novelty &amp; Impact Tier</span>
              <span className={`font-mono font-bold ${report.dimensions.noveltySignificance.score !== undefined ? getScoreColor(report.dimensions.noveltySignificance.score) : "text-[#787774]"}`}>
                {report.dimensions.noveltySignificance.score !== undefined ? `${report.dimensions.noveltySignificance.score}%` : "—"}
              </span>
            </div>
            <div className="w-full bg-[#F7F7F5] rounded-full h-1.5 overflow-hidden">
              {report.dimensions.noveltySignificance.score !== undefined ? (
                <div
                  className={`h-full ${getScoreBg(report.dimensions.noveltySignificance.score)}`}
                  style={{ width: `${report.dimensions.noveltySignificance.score}%` }}
                />
              ) : (
                <div className="h-full bg-transparent" />
              )}
            </div>
            <p className="text-[11px] text-[#787774] leading-relaxed pt-0.5">
              {report.dimensions.noveltySignificance.feedback}
            </p>
          </div>

          {/* Dimension 3: Readership & Community Fit */}
          <div className="p-4 rounded-xl bg-white border border-[#EBEBEA] shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#2F3437]">3. Readership &amp; Community Relevance</span>
              <span className={`font-mono font-bold ${report.dimensions.readershipAlignment.score !== undefined ? getScoreColor(report.dimensions.readershipAlignment.score) : "text-[#787774]"}`}>
                {report.dimensions.readershipAlignment.score !== undefined ? `${report.dimensions.readershipAlignment.score}%` : "—"}
              </span>
            </div>
            <div className="w-full bg-[#F7F7F5] rounded-full h-1.5 overflow-hidden">
              {report.dimensions.readershipAlignment.score !== undefined ? (
                <div
                  className={`h-full ${getScoreBg(report.dimensions.readershipAlignment.score)}`}
                  style={{ width: `${report.dimensions.readershipAlignment.score}%` }}
                />
              ) : (
                <div className="h-full bg-transparent" />
              )}
            </div>
            <p className="text-[11px] text-[#787774] leading-relaxed pt-0.5">
              {report.dimensions.readershipAlignment.feedback}
            </p>
          </div>

          {/* Dimension 4: Keyword & Indexing Resonance */}
          <div className="p-4 rounded-xl bg-white border border-[#EBEBEA] shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#2F3437]">4. Keyword &amp; Search Indexing</span>
              <span className={`font-mono font-bold ${report.dimensions.keywordRelevance.score !== undefined ? getScoreColor(report.dimensions.keywordRelevance.score) : "text-[#787774]"}`}>
                {report.dimensions.keywordRelevance.score !== undefined ? `${report.dimensions.keywordRelevance.score}%` : "—"}
              </span>
            </div>
            <div className="w-full bg-[#F7F7F5] rounded-full h-1.5 overflow-hidden">
              {report.dimensions.keywordRelevance.score !== undefined ? (
                <div
                  className={`h-full ${getScoreBg(report.dimensions.keywordRelevance.score)}`}
                  style={{ width: `${report.dimensions.keywordRelevance.score}%` }}
                />
              ) : (
                <div className="h-full bg-transparent" />
              )}
            </div>
            <p className="text-[11px] text-[#787774] leading-relaxed pt-0.5">
              {report.dimensions.keywordRelevance.feedback}
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Section: Highlights vs Hazards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Key Highlights */}
        <div className="p-4 rounded-xl bg-[#EDF6EE]/60 border border-[#CBE7CE] space-y-2">
          <div className="font-semibold text-[#1E5A2A] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#1E5A2A]" />
            <span>Scope Strengths Supporting Submission</span>
          </div>
          <ul className="space-y-1.5 text-[#1E5A2A]/90 pl-1">
            {report.keyHighlights.map((hl, i) => (
              <li key={i} className="flex items-start gap-1.5 leading-snug">
                <span className="text-[#1E5A2A] font-bold mt-0.5">&bull;</span>
                <span>{hl}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Desk Reject Hazards */}
        <div className="p-4 rounded-xl bg-[#FDF0EF]/60 border border-[#F7CECC] space-y-2">
          <div className="font-semibold text-[#7C2D2B] flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-[#7C2D2B]" />
            <span>Desk-Reject Hazards for {report.targetJournal}</span>
          </div>
          <ul className="space-y-1.5 text-[#7C2D2B]/90 pl-1">
            {report.deskRejectHazards.map((hz, i) => (
              <li key={i} className="flex items-start gap-1.5 leading-snug">
                <span className="text-[#7C2D2B] font-bold mt-0.5">&bull;</span>
                <span>{hz}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Abstract & Title Framing Suggestions */}
      {report.framingSuggestions && report.framingSuggestions.length > 0 && (
        <div className="p-4 rounded-xl bg-white border border-[#EBEBEA] shadow-2xs space-y-2 text-xs">
          <div className="font-semibold text-[#2F3437] flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-[#0A85EA]" />
            <span>Recommendations to Optimize Title &amp; Abstract for {report.targetJournal}</span>
          </div>
          <div className="space-y-2 pl-1">
            {report.framingSuggestions.map((sug, i) => (
              <div key={i} className="flex items-start gap-2 text-[#787774] leading-relaxed">
                <span className="font-mono text-[10px] font-bold bg-[#F7F7F5] border border-[#EBEBEA] px-1.5 py-0.2 rounded text-[#2F3437] mt-0.5">
                  {i + 1}
                </span>
                <span>{sug}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alternative Journal Venues */}
      {report.alternativeJournals && report.alternativeJournals.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-[#787774] uppercase tracking-wider">
            Alternative &amp; Backup Journal Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {report.alternativeJournals.map((alt, idx) => {
              const tierBadge =
                alt.tier === "Reach"
                  ? "bg-[#F6EEFB] text-[#783CB3] border-[#E9D4F7]"
                  : alt.tier === "Realistic"
                  ? "bg-[#EDF6EE] text-[#1E5A2A] border-[#CBE7CE]"
                  : "bg-[#F7F7F5] text-[#787774] border-[#EBEBEA]";

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white border border-[#EBEBEA] shadow-2xs flex flex-col justify-between space-y-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tierBadge}`}>
                        {alt.tier}
                      </span>
                      {alt.impactFactor && (
                        <span className="text-[10px] font-mono text-[#787774]">
                          IF {alt.impactFactor}
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-xs text-[#2F3437]">
                      {alt.name}
                    </div>
                    {alt.publisher && (
                      <div className="text-[10px] text-[#9B9A97]">
                        {alt.publisher}
                      </div>
                    )}
                    <p className="text-[11px] text-[#787774] leading-snug pt-1">
                      {alt.matchReason}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Audit Upgrade CTA Callout */}
      <div className="p-5 rounded-2xl bg-[#0F1117] text-white border border-white/10 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-emerald-300">
            <Sparkles className="w-3 h-3" />
            <span>Ready for Deep Diagnostic?</span>
          </div>
          <h4 className="text-sm font-semibold text-white">
            Run the Full 6-Dimension Pre-Submission Manuscript Audit
          </h4>
          <p className="text-xs text-neutral-400 max-w-xl">
            Upload your complete manuscript (.pdf, .docx) to audit causal claims, experimental controls, methodology power, 5 simulated peer-reviewer personas, and Crossref citation integrity.
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black transition whitespace-nowrap self-start sm:self-auto cursor-pointer flex items-center gap-1.5 shadow-sm"
        >
          <span>Upload Full Document</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function BriefJournalFitPrintView({
  report,
  activeProviderInfo,
}: {
  report: BriefJournalFitReport;
  activeProviderInfo: { name: string; model: string };
}) {
  return (
    <div className="space-y-4 text-xs font-sans text-[#111111] leading-relaxed">
      {/* Header */}
      <div className="border-b-2 border-black pb-3 flex items-center justify-between">
        <div>
          <div className="text-lg font-serif font-bold text-black">
            ManuView Journal Fit &amp; Scope Evaluation Report
          </div>
          <div className="text-[10px] text-[#555555] uppercase tracking-wider">
            Target Journal Editorial Alignment &bull; Desk-Reject Hazard Screening
          </div>
        </div>
        <div className="text-right text-[10px] text-[#555555]">
          <div><strong>Report ID:</strong> {report.id}</div>
          <div><strong>Date:</strong> {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
        </div>
      </div>

      {/* Target & Match Bar */}
      <div className="p-3 rounded-lg border border-[#CCCCCC] bg-[#F9F9F9] flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase text-[#666666] font-semibold">Target Journal</div>
          <div className="text-base font-serif font-bold text-black">{report.targetJournal}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase text-[#666666] font-semibold">Verdict &bull; Scope Match</div>
          <div className="text-sm font-bold text-black">
            {report.verdict}{report.fitScore !== undefined ? ` (${report.fitScore}%)` : ""}
          </div>
        </div>
      </div>

      {/* Editorial Synthesis */}
      <div className="p-3 rounded-lg border border-[#DDDDDD] bg-white">
        <div className="text-[10px] uppercase font-bold text-[#444444] mb-1">
          Editorial Scope Assessment
        </div>
        <p className="italic text-[11px] text-[#222222]">
          &ldquo;{report.summary}&rdquo;
        </p>
      </div>

      {/* Manuscript Meta */}
      <div className="p-3 rounded-lg border border-[#E0E0E0] bg-[#FAFAFA] space-y-1">
        <div><strong>Title:</strong> {report.title}</div>
        {report.keywords && report.keywords.length > 0 && (
          <div><strong>Keywords:</strong> {report.keywords.join(", ")}</div>
        )}
      </div>

      {/* 4 Scope Dimensions Table */}
      <div>
        <div className="text-[10px] uppercase font-bold text-black border-b border-[#CCCCCC] pb-1 mb-2">
          Scope Dimensions Breakdown
        </div>
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-[#DDDDDD] text-left text-[10px] text-[#555555]">
              <th className="py-1">Dimension</th>
              <th className="py-1 text-center">Score</th>
              <th className="py-1">Editorial Feedback</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEEEEE]">
            <tr>
              <td className="py-1 font-semibold">Subject Domain Alignment</td>
              <td className="py-1 text-center font-mono font-bold">
                {report.dimensions.domainMatch.score !== undefined ? `${report.dimensions.domainMatch.score}%` : "—"}
              </td>
              <td className="py-1 text-[#444444]">{report.dimensions.domainMatch.feedback}</td>
            </tr>
            <tr>
              <td className="py-1 font-semibold">Conceptual Novelty &amp; Tier</td>
              <td className="py-1 text-center font-mono font-bold">
                {report.dimensions.noveltySignificance.score !== undefined ? `${report.dimensions.noveltySignificance.score}%` : "—"}
              </td>
              <td className="py-1 text-[#444444]">{report.dimensions.noveltySignificance.feedback}</td>
            </tr>
            <tr>
              <td className="py-1 font-semibold">Readership Relevance</td>
              <td className="py-1 text-center font-mono font-bold">
                {report.dimensions.readershipAlignment.score !== undefined ? `${report.dimensions.readershipAlignment.score}%` : "—"}
              </td>
              <td className="py-1 text-[#444444]">{report.dimensions.readershipAlignment.feedback}</td>
            </tr>
            <tr>
              <td className="py-1 font-semibold">Keyword Search Indexing</td>
              <td className="py-1 text-center font-mono font-bold">
                {report.dimensions.keywordRelevance.score !== undefined ? `${report.dimensions.keywordRelevance.score}%` : "—"}
              </td>
              <td className="py-1 text-[#444444]">{report.dimensions.keywordRelevance.feedback}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Hazards & Framing */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="p-3 border border-[#E0E0E0] rounded-lg">
          <div className="text-[10px] uppercase font-bold text-[#882222] mb-1">
            Desk-Reject Hazards for {report.targetJournal}
          </div>
          <ul className="list-disc pl-3 text-[10px] space-y-0.5 text-[#333333]">
            {report.deskRejectHazards.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
        <div className="p-3 border border-[#E0E0E0] rounded-lg">
          <div className="text-[10px] uppercase font-bold text-black mb-1">
            Framing Recommendations
          </div>
          <ul className="list-disc pl-3 text-[10px] space-y-0.5 text-[#333333]">
            {report.framingSuggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
