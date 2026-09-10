"use client";

import React from "react";
import {
  Tag,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Zap,
  ExternalLink,
  ChevronRight,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { DesktopActiveView } from "./DesktopSidebar";

export interface DesktopDashboardData {
  paperTitle: string;
  headlineTitle: string;
  targetJournal: string;
  aiEngine: string;
  latencyMs: number;
  score: number;
  statusText: string;
  vulnerabilities: Array<{
    type: "overclaim" | "sample_size" | "control" | "generic";
    title: string;
    description: string;
    severity: "critical" | "warning";
  }>;
  reviewers: Array<{
    name: string;
    role: string;
    tag: "Major" | "Minor" | "Critical";
    quote: string;
    detail?: string;
  }>;
  citationAudit: {
    verifiedCount: number;
    totalCount: number;
    retractedCount: number;
    notes?: string;
  };
}

interface DesktopDashboardProps {
  data: DesktopDashboardData;
  activeView: DesktopActiveView;
  isConnected?: boolean;
  isLoading?: boolean;
  activeModelName?: string | null;
  latencyMs?: number | null;
  onSelectView: (view: DesktopActiveView) => void;
  onNewScan: () => void;
  onOpenSettings?: () => void;
}

export function DesktopDashboard({
  data,
  activeView,
  isConnected = false,
  isLoading = false,
  activeModelName,
  latencyMs,
  onSelectView,
  onNewScan,
  onOpenSettings,
}: DesktopDashboardProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-white p-6 sm:p-10 text-[#111827]">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Icon and Headline Title */}
        <div className="space-y-3">
          <div className="text-4xl select-none" role="img" aria-label="genomics">
            🧬
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#111827]">
            {data.headlineTitle}
          </h1>
        </div>

        {/* Summary Metadata Card */}
        <div className="rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] p-5 sm:p-6 space-y-3 shadow-2xs">
          {/* Target Journal */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm">
            <span className="w-36 flex items-center gap-2 font-semibold text-[#6B7280]">
              <Tag className="w-4 h-4 text-[#9CA3AF]" />
              Target Journal
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-md bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] font-medium text-xs">
              {data.targetJournal}
            </span>
          </div>

          {/* AI Engine */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm">
            <span className="w-36 flex items-center gap-2 font-semibold text-[#6B7280]">
              <Cpu className="w-4 h-4 text-[#9CA3AF]" />
              AI Engine
            </span>
            {isLoading ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-500 text-xs font-semibold">
                <RefreshCw className="w-3 h-3 animate-spin text-neutral-400" />
                Connecting...
              </span>
            ) : !isConnected ? (
              <button
                type="button"
                onClick={onOpenSettings}
                title="Click to configure API connection"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FEF2F2] border border-[#FECACA] hover:bg-[#FEE2E2] text-[#991B1B] text-xs font-semibold transition cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                Not Connected
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenSettings}
                title="Click to configure AI Engine & Models"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#ECFDF5] border border-[#A7F3D0] hover:bg-[#D1FAE5] text-[#065F46] font-semibold text-xs tracking-wide transition cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                {activeModelName || data.aiEngine}
                {latencyMs !== undefined && latencyMs !== null && (
                  <span className="text-emerald-700/80 font-mono text-[11px] flex items-center">
                    ( <Zap className="w-3 h-3 text-amber-500 fill-amber-500 inline mr-0.5" />
                    {latencyMs}ms )
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Triage Readiness */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm">
            <span className="w-36 flex items-center gap-2 font-semibold text-[#6B7280]">
              <ShieldCheck className="w-4 h-4 text-[#9CA3AF]" />
              Triage Readiness
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#111827] text-sm sm:text-base">
                {data.score} / 100
              </span>
              <span className="text-neutral-400">•</span>
              <span className="font-semibold text-[#B45309] text-xs sm:text-sm">
                {data.statusText}
              </span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs or Navigation when inside subviews */}
        {activeView !== "overview" && (
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => onSelectView("overview")}
                className="text-blue-600 hover:underline font-medium"
              >
                Dashboard Overview
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              <span className="font-semibold text-neutral-800 capitalize">
                {activeView}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelectView("overview")}
              className="px-3 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-xs font-medium text-neutral-700 transition"
            >
              Back to Overview
            </button>
          </div>
        )}

        {/* THREE-COLUMN DIAGNOSTIC GRID (Reference Design) */}
        {activeView === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* COLUMN 1: Triage Vulnerabilities */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#111827]">
                  Triage Vulnerabilities
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-[#F3F4F6] border border-[#E5E7EB] text-[#4B5563] text-xs font-semibold">
                  {data.vulnerabilities.length}
                </span>
              </div>

              <div className="space-y-3">
                {data.vulnerabilities.map((vuln, idx) => {
                  const isRed = vuln.severity === "critical";
                  return (
                    <div
                      key={idx}
                      className={`rounded-xl p-4 border transition ${
                        isRed
                          ? "bg-[#FEF2F2] border-[#FECACA]"
                          : "bg-[#FFFBEB] border-[#FDE68A]"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-1.5 text-xs font-bold ${
                          isRed ? "text-[#991B1B]" : "text-[#92400E]"
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{vuln.title}</span>
                      </div>
                      <p
                        className={`text-xs mt-1.5 leading-relaxed ${
                          isRed ? "text-[#7F1D1D]" : "text-[#78350F]"
                        }`}
                      >
                        {vuln.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 2: 4-Persona Reviews */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onSelectView("personas")}
                  className="text-sm font-bold text-[#111827] hover:text-blue-600 transition flex items-center gap-1 text-left"
                >
                  <span>4-Persona Reviews</span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                </button>
                <span className="px-2 py-0.5 rounded-md bg-[#F3F4F6] border border-[#E5E7EB] text-[#4B5563] text-xs font-semibold">
                  4
                </span>
              </div>

              <div className="space-y-3">
                {data.reviewers.slice(0, 2).map((rev, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl p-4 border border-[#E5E7EB] bg-[#F9FAFB] hover:bg-white hover:border-[#D1D5DB] transition"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#111827]">
                        {rev.name} ({rev.role})
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#FEF9C3] border border-[#FEF08A] text-[#854D0E] text-[10px] font-bold shrink-0">
                        {rev.tag}
                      </span>
                    </div>
                    <p className="text-xs mt-2 text-[#4B5563] italic leading-relaxed">
                      &ldquo;{rev.quote}&rdquo;
                    </p>
                  </div>
                ))}

                {data.reviewers.length > 2 && (
                  <button
                    type="button"
                    onClick={() => onSelectView("personas")}
                    className="w-full py-2 text-center text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50/50 rounded-lg transition"
                  >
                    View all 4 reviewer breakdowns &rarr;
                  </button>
                )}
              </div>
            </div>

            {/* COLUMN 3: Citation Audit */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onSelectView("citations")}
                  className="text-sm font-bold text-[#111827] hover:text-emerald-700 transition flex items-center gap-1 text-left"
                >
                  <span>Citation Audit</span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                </button>
                <span className="px-2 py-0.5 rounded-md bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-semibold">
                  Live
                </span>
              </div>

              <div className="space-y-3">
                {/* CrossRef Verified */}
                <div className="rounded-xl p-4 border border-[#BBF7D0] bg-[#F0FDF4]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#166534]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#16A34A]" />
                    <span>CrossRef Verified</span>
                  </div>
                  <p className="text-xs mt-1.5 text-[#15803D] leading-relaxed">
                    {data.citationAudit.verifiedCount} /{" "}
                    {data.citationAudit.totalCount} cited DOIs resolved with
                    confirmed metadata.
                  </p>
                </div>

                {/* Retraction Watch Clear */}
                <div className="rounded-xl p-4 border border-[#BBF7D0] bg-[#F0FDF4]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#166534]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#16A34A]" />
                    <span>Retraction Watch Clear</span>
                  </div>
                  <p className="text-xs mt-1.5 text-[#15803D] leading-relaxed">
                    {data.citationAudit.retractedCount === 0
                      ? "Zero retracted references flagged in manuscript bibliography."
                      : `Warning: ${data.citationAudit.retractedCount} retracted citations flagged!`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBVIEW: 4-Persona Reviews In-Depth */}
        {activeView === "personas" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.reviewers.map((rev, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-5 border border-[#E5E7EB] bg-[#F9FAFB] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#111827]">
                        {rev.name}
                      </h3>
                      <p className="text-xs text-neutral-500">{rev.role}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-[#FEF9C3] border border-[#FEF08A] text-[#854D0E] text-xs font-bold">
                      {rev.tag} Priority
                    </span>
                  </div>
                  <blockquote className="text-xs text-[#374151] border-l-2 border-neutral-300 pl-3 italic leading-relaxed">
                    &ldquo;{rev.quote}&rdquo;
                  </blockquote>
                  {rev.detail && (
                    <p className="text-xs text-neutral-600 bg-white p-3 rounded-lg border border-neutral-200">
                      <strong>Prescribed Action:</strong> {rev.detail}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBVIEW: CrossRef Citation Audit */}
        {activeView === "citations" && (
          <div className="rounded-xl border border-[#E5E7EB] p-6 bg-[#F9FAFB] space-y-4">
            <h3 className="text-base font-bold text-[#111827]">
              Reference Integrity &amp; Retraction Verification
            </h3>
            <p className="text-xs text-neutral-600">
              Scans all bibliography entries against CrossRef Open API and Retraction Watch database.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-[#E5E7EB]">
                <span className="text-xs text-neutral-500 font-medium">Total References</span>
                <p className="text-2xl font-bold text-[#111827] mt-1">
                  {data.citationAudit.totalCount}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E5E7EB]">
                <span className="text-xs text-emerald-700 font-medium">CrossRef Verified</span>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {data.citationAudit.verifiedCount}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E5E7EB]">
                <span className="text-xs text-neutral-500 font-medium">Retraction Flags</span>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {data.citationAudit.retractedCount}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SUBVIEW: Journal Recommendations */}
        {activeView === "recommendations" && (
          <div className="rounded-xl border border-[#E5E7EB] p-6 bg-[#F9FAFB] space-y-4">
            <h3 className="text-base font-bold text-[#111827]">
              {data.targetJournal} Editorial Alignment
            </h3>
            <p className="text-xs text-neutral-600">
              Evaluated against high-impact journal scopes, novelty thresholds, and transfer cascades.
            </p>
            <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] space-y-2">
              <span className="text-xs font-semibold text-neutral-700">Primary Fit Recommendation:</span>
              <p className="text-xs text-neutral-600 leading-relaxed">
                The mechanistic findings on DLL3 transcriptional enhancers match the scope of <em>{data.targetJournal}</em>. 
                However, resolving Reviewer Vance&apos;s request for deeper organoid sgRNA coverage will be required to survive initial editor triage.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
