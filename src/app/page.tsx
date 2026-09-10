"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  BarChart3, 
  BookOpen, 
  Layers, 
  Check, 
  Search, 
  ShieldCheck, 
  SlidersHorizontal,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  FileText,
  Tag,
  FlaskConical,
  GraduationCap
} from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'paper' | 'personas' | 'crossref' | 'recommendations'>('paper');
  return (
    <div className="flex flex-col bg-white text-[#2F3437]">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION                                               */}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="mx-auto max-w-5xl text-center">
          {/* Main Headline with Iconic Inline Yellow Pill */}
          <h1 className="text-4xl sm:text-6xl md:text-[68px] font-bold text-[#2F3437] tracking-[-0.03em] leading-[1.08] mb-6">
            Where researchers and <br />
            agents{" "}
            <span className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#fcedd7] text-[#915809] border border-[#f5dcb7] font-semibold text-2xl sm:text-4xl md:text-5xl align-middle mx-1 sm:mx-2 shadow-xs select-none">
              <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#e38817] inline-block" />
              Review
            </span>{" "}
            together.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#787774] mb-8 max-w-2xl mx-auto leading-relaxed font-normal">
            Catch desk-reject flaws, citation hallucinations, and causal overclaims before submitting to top journals. A free, open-source editorial diagnostic for science.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14 sm:mb-18">
            <Link
              href="/scan"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-white hover:bg-neutral-200 text-black font-semibold text-sm shadow-md transition active:scale-[0.98]"
            >
              <span>Try ManuView free</span>
            </Link>

            <Link
              href="/tools"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-md text-neutral-300 hover:text-white hover:bg-white/10 font-medium text-sm transition"
            >
              <span>Explore Research Tools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* --------------------------------------------------------- */}
          {/* Hero App Window Mockup with Notion Hand-Drawn Characters */}
          {/* --------------------------------------------------------- */}
          <div className="relative mx-auto max-w-4xl text-left">
            {/* Peeking Notion Character 1 (Left Side - Girl with Bun) */}
            <div className="absolute -left-10 sm:-left-16 top-16 sm:top-24 w-16 sm:w-24 z-20 pointer-events-none select-none">
              <svg viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-sm">
                {/* Hair bun */}
                <ellipse cx="42" cy="22" rx="14" ry="14" fill="white" stroke="#111111" strokeWidth="2.5" />
                <path d="M35 15 C45 10, 50 25, 42 32" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
                {/* Head */}
                <ellipse cx="50" cy="50" rx="26" ry="28" fill="white" stroke="#111111" strokeWidth="2.5" />
                {/* Hair front */}
                <path d="M26 40 C35 28, 65 30, 74 46" fill="#111111" />
                {/* Eyebrows */}
                <path d="M36 42 Q42 39 48 42" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
                <path d="M56 42 Q62 39 68 42" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
                {/* Eyes */}
                <ellipse cx="43" cy="50" rx="3.5" ry="4" fill="#111111" />
                <ellipse cx="63" cy="50" rx="3.5" ry="4" fill="#111111" />
                {/* Nose */}
                <path d="M53 50 L50 58 L55 59" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {/* Smile */}
                <path d="M46 66 Q53 72 60 66" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
                {/* Cheeks */}
                <circle cx="37" cy="58" r="3" fill="#ffb4b4" opacity="0.6" />
                <circle cx="69" cy="58" r="3" fill="#ffb4b4" opacity="0.6" />
                {/* Neck & Body */}
                <path d="M44 78 L44 95 L20 150 L90 150 L64 95 L64 78" fill="white" stroke="#111111" strokeWidth="2.5" />
                {/* Collar */}
                <path d="M44 95 Q54 104 64 95" stroke="#111111" strokeWidth="2" />
                {/* Hands grasping the window edge */}
                <ellipse cx="86" cy="92" rx="7" ry="11" fill="white" stroke="#111111" strokeWidth="2.5" />
                <ellipse cx="92" cy="105" rx="6" ry="9" fill="white" stroke="#111111" strokeWidth="2.5" />
              </svg>
            </div>

            {/* Peeking Notion Character 2 (Top Right - Researcher with Glasses) */}
            <div className="absolute -right-8 sm:-right-12 -top-12 sm:-top-16 w-20 sm:w-28 z-20 pointer-events-none select-none">
              <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-sm">
                {/* Head */}
                <path d="M25 70 C20 40, 40 15, 75 15 C105 15, 115 45, 110 70 Z" fill="white" stroke="#111111" strokeWidth="2.5" />
                {/* Hair tufts */}
                <path d="M45 15 C40 8, 30 10, 32 18" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M70 15 C75 5, 88 8, 82 18" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
                {/* Pencil behind ear */}
                <rect x="92" y="10" width="6" height="28" transform="rotate(35 92 10)" fill="#f1a23a" stroke="#111111" strokeWidth="2" />
                {/* Round Glasses */}
                <circle cx="52" cy="46" r="14" fill="white" stroke="#111111" strokeWidth="2.5" />
                <circle cx="85" cy="46" r="14" fill="white" stroke="#111111" strokeWidth="2.5" />
                <path d="M66 46 L71 46" stroke="#111111" strokeWidth="2.5" />
                <path d="M38 46 L28 44" stroke="#111111" strokeWidth="2" />
                <path d="M99 46 L108 44" stroke="#111111" strokeWidth="2" />
                {/* Eyes behind glasses */}
                <circle cx="52" cy="46" r="3" fill="#111111" />
                <circle cx="85" cy="46" r="3" fill="#111111" />
                {/* Nose */}
                <path d="M68 50 Q72 58 66 61" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
                {/* Hands resting on top edge */}
                <ellipse cx="40" cy="74" rx="10" ry="7" fill="white" stroke="#111111" strokeWidth="2.5" />
                <ellipse cx="88" cy="74" rx="10" ry="7" fill="white" stroke="#111111" strokeWidth="2.5" />
              </svg>
            </div>

            {/* Window Container */}
            <div className="rounded-2xl border border-[#EBEBEA] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.08)] overflow-hidden">
              {/* macOS Window Titlebar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#EBEBEA] bg-[#F7F7F5] select-none text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]" />
                </div>
                <div className="text-[11px] text-[#787774] font-medium flex items-center gap-1.5">
                  <span>🔬 Oncology Institute</span>
                  <span className="text-[#cccccc]">/</span>
                  <span className="text-[#2F3437]">📄 DLL3 SCLC Nature Pre-Submission</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#787774]">
                  <span className="px-2 py-0.5 rounded bg-[#EBF3FB] text-[#18569C] border border-[#CDE1F8] font-semibold">Active</span>
                </div>
              </div>

              {/* Window Interior: Notion Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
                {/* Left Notion Sidebar */}
                <div className="hidden md:block md:col-span-3 border-r border-[#EBEBEA] bg-[#F7F7F5] p-3 text-xs space-y-4">
                  <div className="flex items-center gap-2 px-2 py-1 font-semibold text-[#2F3437]">
                    <div className="w-4 h-4 rounded bg-black text-white flex items-center justify-center text-[10px] font-serif">M</div>
                    <span>Cancer Genomics</span>
                  </div>

                  <div className="space-y-0.5 text-[#787774]">
                    <div className="px-2 py-1 rounded hover:bg-[#f0f0ee] cursor-pointer flex items-center gap-2 text-[#2F3437] font-medium">
                      <Search className="w-3.5 h-3.5 text-[#9B9A97]" />
                      <span>Search</span>
                    </div>
                    <div className="px-2 py-1 rounded hover:bg-[#f0f0ee] cursor-pointer flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#0075eb]" />
                      <span>Notion AI Review</span>
                    </div>
                    <div className="px-2 py-1 rounded hover:bg-[#f0f0ee] cursor-pointer flex items-center gap-2">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#9B9A97]" />
                      <span>AI Settings</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="px-2 pb-1 text-[10px] font-semibold text-[#999999] uppercase tracking-wider">
                      Workspaces
                    </div>
                    <div className="space-y-0.5">
                      <button
                        type="button"
                        onClick={() => setActiveTab('paper')}
                        className={`w-full text-left px-2 py-1.5 rounded font-medium flex items-center gap-2 transition cursor-pointer ${
                          activeTab === 'paper' ? 'bg-[#EBEBEA] text-[#2F3437]' : 'hover:bg-[#EBEBEA] text-[#787774]'
                        }`}
                      >
                        <span>📄</span>
                        <span className="truncate">DLL3 Activation Paper</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('personas')}
                        className={`w-full text-left px-2 py-1.5 rounded font-medium flex items-center gap-2 transition cursor-pointer ${
                          activeTab === 'personas' ? 'bg-[#EBEBEA] text-[#2F3437]' : 'hover:bg-[#EBEBEA] text-[#787774]'
                        }`}
                      >
                        <span>👥</span>
                        <span className="truncate">4-Persona Reviews</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('crossref')}
                        className={`w-full text-left px-2 py-1.5 rounded font-medium flex items-center gap-2 transition cursor-pointer ${
                          activeTab === 'crossref' ? 'bg-[#EBEBEA] text-[#2F3437]' : 'hover:bg-[#EBEBEA] text-[#787774]'
                        }`}
                      >
                        <span>✅</span>
                        <span className="truncate">CrossRef Audit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('recommendations')}
                        className={`w-full text-left px-2 py-1.5 rounded font-medium flex items-center gap-2 transition cursor-pointer ${
                          activeTab === 'recommendations' ? 'bg-[#EBEBEA] text-[#2F3437]' : 'hover:bg-[#EBEBEA] text-[#787774]'
                        }`}
                      >
                        <span>📑</span>
                        <span className="truncate">Nature Recommendations</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Document Canvas with Interactive Tab States */}
                <div className="p-6 md:p-8 md:col-span-9 bg-white space-y-5">
                  {activeTab === 'paper' && (
                    <>
                      <div>
                        <div className="text-3xl mb-2 select-none">🧬</div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#2F3437] tracking-tight">
                          Nature Communications Pre-Submission
                        </h2>
                      </div>

                      <div className="rounded-xl border border-[#EBEBEA] bg-[#F7F7F5] p-3 text-xs divide-y divide-[#EBEBEA]">
                        <div className="flex items-center py-1.5 px-1">
                          <span className="w-32 text-[#787774] flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" /> Target Journal
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#FBF3DB] text-[#78510E] border border-[#F4E2B6] font-semibold">
                            Nature Communications
                          </span>
                        </div>

                        <div className="flex items-center py-1.5 px-1">
                          <span className="w-32 text-[#787774] flex items-center gap-1.5">
                            <SlidersHorizontal className="w-3.5 h-3.5" /> AI Engine
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EDF6EE] text-[#1E5A2A] border border-[#CBE7CE] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1E5A2A]" />
                            GEMINI 2.5 FLASH (⚡ 142ms)
                          </span>
                        </div>

                        <div className="flex items-center py-1.5 px-1">
                          <span className="w-32 text-[#787774] flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5" /> Triage Readiness
                          </span>
                          <span className="font-semibold text-[#2F3437]">
                            78 / 100 &bull; <span className="text-[#78510E]">Revision Prioritized</span>
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        <div className="p-3.5 rounded-xl border border-[#EBEBEA] bg-white shadow-2xs space-y-2">
                          <div className="flex items-center justify-between text-xs font-semibold text-[#2F3437]">
                            <span>Triage Vulnerabilities</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F7F7F5] text-[#787774]">2</span>
                          </div>
                          <div className="p-2.5 rounded-lg border border-[#F7CECC] bg-[#FDF0EF] text-xs space-y-1">
                            <div className="font-semibold text-[#7C2D2B] flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Causal Overclaim
                            </div>
                            <p className="text-[11px] text-[#7C2D2B]/90 leading-snug">
                              Abstract claims POU2F1 proves DLL3 expression without rescue control.
                            </p>
                          </div>
                          <div className="p-2.5 rounded-lg border border-[#F4E2B6] bg-[#FBF3DB] text-xs space-y-1">
                            <div className="font-semibold text-[#78510E] flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Sample Size Power
                            </div>
                            <p className="text-[11px] text-[#78510E]/90 leading-snug">
                              Cohort n=8 lacks a priori statistical power calculation.
                            </p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl border border-[#EBEBEA] bg-white shadow-2xs space-y-2">
                          <div className="flex items-center justify-between text-xs font-semibold text-[#2F3437]">
                            <span>4-Persona Reviews</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F7F7F5] text-[#787774]">4</span>
                          </div>
                          <div className="p-2.5 rounded-lg border border-[#EBEBEA] bg-[#F7F7F5] text-xs space-y-1">
                            <div className="font-semibold text-[#2F3437] flex items-center justify-between">
                              <span>Dr. Vance (Methods)</span>
                              <span className="text-[10px] px-1.5 rounded bg-[#FBF3DB] text-[#78510E] border border-[#F4E2B6]">Major</span>
                            </div>
                            <p className="text-[11px] text-[#787774] leading-snug">
                              &ldquo;sgRNA library coverage depth must be confirmed in organoids.&rdquo;
                            </p>
                          </div>
                          <div className="p-2.5 rounded-lg border border-[#EBEBEA] bg-[#F7F7F5] text-xs space-y-1">
                            <div className="font-semibold text-[#2F3437] flex items-center justify-between">
                              <span>Dr. Sorkin (Stats)</span>
                              <span className="text-[10px] px-1.5 rounded bg-[#FBF3DB] text-[#78510E] border border-[#F4E2B6]">Major</span>
                            </div>
                            <p className="text-[11px] text-[#787774] leading-snug">
                              &ldquo;Parametric t-test used on small sample size without normality test.&rdquo;
                            </p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl border border-[#EBEBEA] bg-white shadow-2xs space-y-2">
                          <div className="flex items-center justify-between text-xs font-semibold text-[#2F3437]">
                            <span>Citation Audit</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EDF6EE] text-[#1E5A2A] border border-[#CBE7CE]">Live</span>
                          </div>
                          <div className="p-2.5 rounded-lg border border-[#CBE7CE] bg-[#EDF6EE] text-xs space-y-1">
                            <div className="font-semibold text-[#1E5A2A] flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> CrossRef Verified
                            </div>
                            <p className="text-[11px] text-[#1E5A2A]/90 leading-snug">
                              15 / 15 cited DOIs resolved with confirmed metadata.
                            </p>
                          </div>
                          <div className="p-2.5 rounded-lg border border-[#CBE7CE] bg-[#EDF6EE] text-xs space-y-1">
                            <div className="font-semibold text-[#1E5A2A] flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Retraction Watch Clear
                            </div>
                            <p className="text-[11px] text-[#1E5A2A]/90 leading-snug">
                              Zero retracted references flagged in manuscript bibliography.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'personas' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-[#2F3437]">4-Persona Independent Reviewers</h3>
                        <span className="text-xs text-[#787774]">Field-calibrated domain referees</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-xl border border-[#EBEBEA] bg-[#F7F7F5] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-[#2F3437]">Methods Specialist (Assay Rigor &amp; Controls)</span>
                            <span className="text-[10px] px-1.5 rounded bg-[#FDF0EF] text-[#7C2D2B] border border-[#F7CECC]">Major Rev</span>
                          </div>
                          <p className="text-xs text-[#787774] italic">
                            &ldquo;POU2F1 binding to the DLL3 distal enhancer element is correlative. shRNA knockdown without complementary CRISPR rescue leaves an open alternative hypothesis.&rdquo;
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl border border-[#EBEBEA] bg-[#F7F7F5] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-[#2F3437]">Senior Journal Editor (Novelty &amp; Triage)</span>
                            <span className="text-[10px] px-1.5 rounded bg-[#FBF3DB] text-[#78510E] border border-[#F4E2B6]">Editorial Triage</span>
                          </div>
                          <p className="text-xs text-[#787774] italic">
                            &ldquo;The title claim of a &lsquo;universal predictive biomarker&rsquo; is an overreach for a retrospective organoid cohort (n=8). Scope must be moderated for submission.&rdquo;
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl border border-[#EBEBEA] bg-[#F7F7F5] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-[#2F3437]">Quantitative Biostatistician (Power &amp; Multiplicity)</span>
                            <span className="text-[10px] px-1.5 rounded bg-[#FDF0EF] text-[#7C2D2B] border border-[#F7CECC]">Desk Reject Risk</span>
                          </div>
                          <p className="text-xs text-[#787774] italic">
                            &ldquo;No multiplicity correction (FDR / Bonferroni) applied to 1,200 sgRNA targets. Unpaired t-test was used on small samples without Shapiro-Wilk testing.&rdquo;
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl border border-[#EBEBEA] bg-[#F7F7F5] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-[#2F3437]">Domain Specialist (Mechanistic Oncology)</span>
                            <span className="text-[10px] px-1.5 rounded bg-[#EDF6EE] text-[#1E5A2A] border border-[#CBE7CE]">High Value</span>
                          </div>
                          <p className="text-xs text-[#787774] italic">
                            &ldquo;The biological nomination of POU2F1 is genuinely promising for SCLC. Addressing the control experiments will significantly elevate acceptance probability.&rdquo;
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'crossref' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-[#2F3437]">CrossRef &amp; Retraction Screening</h3>
                        <span className="text-xs text-[#1E5A2A] font-semibold bg-[#EDF6EE] px-2 py-0.5 rounded-md border border-[#CBE7CE]">100% Deterministic</span>
                      </div>
                      <div className="border border-[#EBEBEA] rounded-xl overflow-hidden text-xs">
                        <div className="p-2.5 bg-[#F7F7F5] border-b border-[#EBEBEA] font-semibold text-[#787774] flex items-center justify-between">
                          <span>Cited Reference</span>
                          <span>Audit Status</span>
                        </div>
                        <div className="p-3 border-b border-[#EBEBEA] flex items-center justify-between">
                          <div>
                            <div className="font-medium text-[#2F3437]">Saunders D, et al. A DLL3-targeted ADC for SCLC.</div>
                            <div className="text-[11px] text-[#787774]">DOI: 10.1126/scitranslmed.aac9459 &bull; Sci Transl Med</div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EDF6EE] text-[#1E5A2A] border border-[#CBE7CE]">
                            CrossRef Verified
                          </span>
                        </div>
                        <div className="p-3 flex items-center justify-between bg-[#FDF0EF]">
                          <div>
                            <div className="font-medium text-[#7C2D2B]">Wakefield AJ, et al. Ileal-lymphoid-nodular hyperplasia... (1998)</div>
                            <div className="text-[11px] text-[#7C2D2B]/90">DOI: 10.1016/S0140-6736(97)11096-0 &bull; Lancet</div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-[#7C2D2B] border border-[#F7CECC]">
                            RETRACTED (Flagged)
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'recommendations' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-[#2F3437]">Target Journal Tiers &amp; Hazards</h3>
                        <span className="text-xs text-[#787774]">Curated catalog match</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-xl border border-[#DFD5F5] bg-[#F6F3F9] space-y-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#57338C] border border-[#DFD5F5]">Reach &bull; IF 14.7</span>
                          <h4 className="font-bold text-sm text-[#2F3437] mt-1">Nature Communications</h4>
                          <p className="text-xs text-[#787774]">Mechanistic rigor required. Must include rescue experiment before submission.</p>
                        </div>
                        <div className="p-3.5 rounded-xl border border-[#CBE7CE] bg-[#EDF6EE] space-y-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#1E5A2A] border border-[#CBE7CE]">Realistic &bull; IF 8.8</span>
                          <h4 className="font-bold text-sm text-[#2F3437] mt-1">Cell Reports</h4>
                          <p className="text-xs text-[#787774]">High scope fit for POU2F1 discovery with moderate revisions.</p>
                        </div>
                        <div className="p-3.5 rounded-xl border border-[#CDE1F8] bg-[#EBF3FB] space-y-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#18569C] border border-[#CDE1F8]">Fallback &bull; IF 5.2</span>
                          <h4 className="font-bold text-sm text-[#2F3437] mt-1">Oncogene</h4>
                          <p className="text-xs text-[#787774]">Safe publishing target if organoid rescue experiments cannot be completed in time.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. LOGO BAR (Scholarly Publisher Venues)                      */}
      {/* ------------------------------------------------------------- */}
      <section className="py-10 border-y border-white/10 bg-[#12151B]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-6">
            Calibrated for formatting and editorial standards of leading peer-reviewed venues
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-sm sm:text-base font-serif font-bold text-neutral-300 tracking-wider">
            <span className="hover:text-white transition">NATURE</span>
            <span className="hover:text-white transition">SCIENCE</span>
            <span className="hover:text-white transition">CELL</span>
            <span className="hover:text-white transition">THE LANCET</span>
            <span className="hover:text-white transition">PNAS</span>
            <span className="hover:text-white transition">PLOS ONE</span>
            <span className="hover:text-white transition">IEEE TPAMI</span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. BENTO GRID SECTION: "AI where your research works."        */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 px-4 sm:px-6 bg-[#0A0B0E]">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-12">
            AI where your research works.
          </h2>

          {/* Bento Top Row (Two 50% Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Bento Card 1 */}
            <div className="rounded-2xl border border-[#EBEBEA] bg-white p-7 sm:p-8 shadow-xs flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between text-xs text-[#9B9A97] mb-2 font-medium">
                  <span>Editorial Synthesis</span>
                  <div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#2F3437] tracking-tight mb-4">
                  Bring everything into one system of record.
                </h3>
              </div>

              {/* Mini UI Mockup inside card */}
              <div className="rounded-xl border border-[#EBEBEA] bg-[#F7F7F5] p-4 text-xs space-y-2 mt-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#ecece9]">
                  <span className="font-semibold text-[#2F3437]">Pre-Submission Rubric</span>
                  <span className="text-[11px] text-[#9B9A97]">Calibrated to Nature</span>
                </div>
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[#787774]">Originality &amp; Novelty</span>
                    <span className="px-2 py-0.5 rounded bg-[#EDF6EE] text-[#1E5A2A] border border-[#CBE7CE] font-medium">4.5 / 5.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#787774]">Claims vs Evidence</span>
                    <span className="px-2 py-0.5 rounded bg-[#FBF3DB] text-[#78510E] border border-[#F4E2B6] font-medium">Overclaim Risk</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#787774]">Methodological Soundness</span>
                    <span className="px-2 py-0.5 rounded bg-[#f5f5f4] text-[#787774] font-medium">Power Calculation Needed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 2 */}
            <div className="rounded-2xl border border-[#EBEBEA] bg-white p-7 sm:p-8 shadow-xs flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between text-xs text-[#9B9A97] mb-2 font-medium">
                  <span>Citation Audit</span>
                  <div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#2F3437] tracking-tight mb-4">
                  Get answers instantly with live verification.
                </h3>
              </div>

              {/* Chart & Search Mockup */}
              <div className="rounded-xl border border-[#EBEBEA] bg-[#F7F7F5] p-4 text-xs space-y-3 mt-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full border-4 border-[#0075eb] border-t-[#0075eb] border-r-[#0075eb] border-b-[#cce3fb] border-l-[#0075eb] flex items-center justify-center font-bold text-sm text-[#0075eb]">
                    94%
                  </div>
                  <div>
                    <div className="font-semibold text-[#2F3437]">Recency Profile</div>
                    <div className="text-[11px] text-[#787774]">94% citations published within last 5 years</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#EBEBEA] shadow-xs text-xs">
                  <Search className="w-3.5 h-3.5 text-[#0075eb]" />
                  <span className="text-[#787774] truncate">What are our biggest desk-reject risks?</span>
                  <span className="ml-auto w-5 h-5 rounded bg-[#0075eb] text-white flex items-center justify-center text-[10px]">
                    &rarr;
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Middle Row (Wide 100% Card) */}
          <div className="rounded-2xl border border-[#EBEBEA] bg-[#F7F7F5] p-7 sm:p-8 shadow-xs mb-6 hover:shadow-md transition">
            <div className="flex items-center justify-between text-xs text-[#9B9A97] mb-2 font-medium">
              <span>Peer-Review Simulation</span>
              <div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
                <Check className="w-2.5 h-2.5" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#2F3437] tracking-tight mb-4">
              Keep reviews moving 24/7 with expert agents.
            </h3>

            {/* 4 Persona Cards in Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              <div className="p-3.5 rounded-xl bg-white border border-[#EBEBEA] shadow-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-xs text-[#2F3437]">
                  <FlaskConical className="w-3.5 h-3.5 text-[#0075eb]" />
                  <span>Methods Specialist</span>
                </div>
                <p className="text-[11px] text-[#787774]">
                  Assesses CRISPR library representation, sequencing coverage, and negative controls.
                </p>
                <div className="text-[10px] font-semibold text-[#0075eb] bg-[#eef5fd] px-2 py-0.5 rounded">
                  Protocol Reproducibility
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#EBEBEA] shadow-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-xs text-[#2F3437]">
                  <GraduationCap className="w-3.5 h-3.5 text-[#e38817]" />
                  <span>Domain Expert</span>
                </div>
                <p className="text-[11px] text-[#787774]">
                  Evaluates biological plausibility, pathway mechanism, and novelty against 2024 literature.
                </p>
                <div className="text-[10px] font-semibold text-[#915809] bg-[#faecd7] px-2 py-0.5 rounded">
                  Mechanistic Novelty
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#EBEBEA] shadow-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-xs text-[#2F3437]">
                  <BookOpen className="w-3.5 h-3.5 text-[#9a6dd7]" />
                  <span>Senior Journal Editor</span>
                </div>
                <p className="text-[11px] text-[#787774]">
                  Screens broad interest, translational implications, and immediate desk-rejection hazards.
                </p>
                <div className="text-[10px] font-semibold text-[#7642bb] bg-[#f3edf9] px-2 py-0.5 rounded">
                  Desk-Reject Triage
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#EBEBEA] shadow-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-xs text-[#2F3437]">
                  <BarChart3 className="w-3.5 h-3.5 text-[#2b7a4b]" />
                  <span>Senior Biostatistician</span>
                </div>
                <p className="text-[11px] text-[#787774]">
                  Audits sample power calculations, multiplicity adjustments (FDR), and variance metrics.
                </p>
                <div className="text-[10px] font-semibold text-[#2b7a4b] bg-[#eefaf3] px-2 py-0.5 rounded">
                  Statistical Validity
                </div>
              </div>
            </div>
          </div>

          {/* 5 Bottom Quick Tool Integration Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <Link
              href="/tools/reference-checker"
              className="p-4 rounded-xl border border-[#EBEBEA] bg-white hover:border-[#cccccc] hover:shadow-sm transition flex flex-col justify-between group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#EBF3FB] text-[#18569C] border border-[#CDE1F8] flex items-center justify-center mb-3">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs text-[#2F3437] group-hover:text-[#0075eb] flex items-center justify-between">
                  <span>Reference Audit</span>
                  <span className="text-[#9B9A97]">&rarr;</span>
                </div>
                <p className="text-[11px] text-[#787774] mt-0.5">Crossref verification</p>
              </div>
            </Link>

            <Link
              href="/tools/prisma"
              className="p-4 rounded-xl border border-[#EBEBEA] bg-white hover:border-[#cccccc] hover:shadow-sm transition flex flex-col justify-between group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FBF3DB] text-[#78510E] border border-[#F4E2B6] flex items-center justify-center mb-3">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs text-[#2F3437] group-hover:text-[#915809] flex items-center justify-between">
                  <span>PRISMA 2020</span>
                  <span className="text-[#9B9A97]">&rarr;</span>
                </div>
                <p className="text-[11px] text-[#787774] mt-0.5">Flow diagrams &amp; SVG</p>
              </div>
            </Link>

            <Link
              href="/tools/journal-fit"
              className="p-4 rounded-xl border border-[#EBEBEA] bg-white hover:border-[#cccccc] hover:shadow-sm transition flex flex-col justify-between group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FDF0EF] text-[#7C2D2B] flex items-center justify-center mb-3">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs text-[#2F3437] group-hover:text-[#7C2D2B] flex items-center justify-between">
                  <span>Journal Fit</span>
                  <span className="text-[#9B9A97]">&rarr;</span>
                </div>
                <p className="text-[11px] text-[#787774] mt-0.5">Match 20+ venues</p>
              </div>
            </Link>

            <Link
              href="/tools/citation-claim"
              className="p-4 rounded-xl border border-[#EBEBEA] bg-white hover:border-[#cccccc] hover:shadow-sm transition flex flex-col justify-between group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#EDF6EE] text-[#1E5A2A] border border-[#CBE7CE] flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs text-[#2F3437] group-hover:text-[#2b7a4b] flex items-center justify-between">
                  <span>Citation Claim</span>
                  <span className="text-[#9B9A97]">&rarr;</span>
                </div>
                <p className="text-[11px] text-[#787774] mt-0.5">Audit claim accuracy</p>
              </div>
            </Link>

            <Link
              href="/tools/cover-letter"
              className="p-4 rounded-xl border border-[#EBEBEA] bg-white hover:border-[#cccccc] hover:shadow-sm transition flex flex-col justify-between group col-span-2 sm:col-span-1"
            >
              <div className="w-8 h-8 rounded-lg bg-[#F6F3F9] text-[#57338C] border border-[#DFD5F5] flex items-center justify-center mb-3">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs text-[#2F3437] group-hover:text-[#7642bb] flex items-center justify-between">
                  <span>Cover Letter</span>
                  <span className="text-[#9B9A97]">&rarr;</span>
                </div>
                <p className="text-[11px] text-[#787774] mt-0.5">Editor-grade letters</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. SCHOLARLY STANDARDS & VERIFIABLE INTEGRITY                 */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 px-4 sm:px-6 bg-[#0A0B0E] border-t border-white/10">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
              Built for verifiable publishing standards.
            </h2>
            <p className="text-sm text-neutral-400 font-light leading-relaxed">
              Designed around empirical integrity checks, real-time registry lookups, and standardized editorial guidelines to catch fatal rejection hazards before journal submission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Standard Card 1: CrossRef Registry */}
            <div className="rounded-2xl border border-[#EBEBEA] bg-[#F7F7F5] p-7 flex flex-col justify-between hover:border-[#d0d0d0] transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white border border-[#EBEBEA] flex items-center justify-center text-lg mb-5 shadow-2xs">
                  🔍
                </div>
                <h3 className="text-base font-bold text-[#2F3437] mb-2">CrossRef Registry Verification</h3>
                <p className="text-xs text-[#787774] leading-relaxed">
                  Directly resolves cited DOIs against CrossRef APIs to flag unresolvable citations, dead URLs, and hallucinated reference titles that trigger immediate editorial red flags.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-[#EBEBEA] flex items-center justify-between text-[11px] text-[#787774]">
                <span className="font-semibold text-[#2F3437]">Deterministic Audit</span>
                <span className="font-mono text-[#18569C]">api.crossref.org</span>
              </div>
            </div>

            {/* Standard Card 2: Retraction Watch */}
            <div className="rounded-2xl border border-[#EBEBEA] bg-[#F7F7F5] p-7 flex flex-col justify-between hover:border-[#d0d0d0] transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white border border-[#EBEBEA] flex items-center justify-center text-lg mb-5 shadow-2xs">
                  ⚠️
                </div>
                <h3 className="text-base font-bold text-[#2F3437] mb-2">Retraction Screening</h3>
                <p className="text-xs text-[#787774] leading-relaxed">
                  Screens bibliography DOIs against retraction registries and publisher notices. Automatically detects whether your foundational literature has been retracted or corrected.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-[#EBEBEA] flex items-center justify-between text-[11px] text-[#787774]">
                <span className="font-semibold text-[#2F3437]">Integrity Shield</span>
                <span className="font-mono text-[#7C2D2B]">Zero Retraction Policy</span>
              </div>
            </div>

            {/* Standard Card 3: EQUATOR & PRISMA */}
            <div className="rounded-2xl border border-[#EBEBEA] bg-[#F7F7F5] p-7 flex flex-col justify-between hover:border-[#d0d0d0] transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white border border-[#EBEBEA] flex items-center justify-center text-lg mb-5 shadow-2xs">
                  📋
                </div>
                <h3 className="text-base font-bold text-[#2F3437] mb-2">Reporting Guideline Compliance</h3>
                <p className="text-xs text-[#787774] leading-relaxed">
                  Calibrated against EQUATOR Network checklists (PRISMA 2020, CONSORT, STROBE) to ensure sample size power justifications, randomization, and blinding statements are complete.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-[#EBEBEA] flex items-center justify-between text-[11px] text-[#787774]">
                <span className="font-semibold text-[#2F3437]">EQUATOR Guidelines</span>
                <span className="font-mono text-[#1E5A2A]">Checklist Auditing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. GET STARTED TODAY CTA SECTION                              */}
      {/* ------------------------------------------------------------- */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 bg-[#F7F7F5] border-t border-[#EBEBEA] text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl sm:text-5xl font-bold text-[#2F3437] tracking-tight mb-6">
            Get started today.
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/scan"
              className="px-5 py-2.5 rounded-md bg-[#000000] hover:bg-[#2F3437] text-white font-medium text-sm shadow-xs transition active:scale-[0.98]"
            >
              Try ManuView free
            </Link>

            <Link
              href="/examples"
              className="px-4 py-2.5 rounded-md text-[#2F3437] hover:text-[#0075eb] hover:bg-white font-medium text-sm transition"
            >
              Explore sample preprints
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
