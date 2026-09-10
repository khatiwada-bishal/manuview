import React from "react";
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
  return (
    <div className="flex flex-col bg-white text-[#111111]">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION                                               */}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="mx-auto max-w-5xl text-center">
          {/* Main Headline with Iconic Inline Yellow Pill */}
          <h1 className="text-4xl sm:text-6xl md:text-[68px] font-bold text-[#111111] tracking-[-0.03em] leading-[1.08] mb-6">
            Where researchers and <br />
            agents{" "}
            <span className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#fcedd7] text-[#915809] border border-[#f5dcb7] font-semibold text-2xl sm:text-4xl md:text-5xl align-middle mx-1 sm:mx-2 shadow-xs select-none">
              <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#e38817] inline-block" />
              Review
            </span>{" "}
            together.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#555555] mb-8 max-w-2xl mx-auto leading-relaxed font-normal">
            Catch desk-reject flaws, citation hallucinations, and causal overclaims before submitting to top journals. A free, open-source editorial diagnostic for science.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14 sm:mb-18">
            <Link
              href="/scan"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#0075eb] hover:bg-[#0066cc] text-white font-medium text-sm shadow-xs transition active:scale-[0.98]"
            >
              <span>Try ManuView free</span>
            </Link>

            <Link
              href="/tools"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md text-[#111111] hover:text-[#0075eb] hover:bg-[#f5f5f4] font-medium text-sm transition"
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
            <div className="rounded-2xl border border-[#e5e5e5] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.08)] overflow-hidden">
              {/* macOS Window Titlebar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0f0ee] bg-[#fafafa] select-none text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]" />
                </div>
                <div className="text-[11px] text-[#777777] font-medium flex items-center gap-1.5">
                  <span>🔬 Oncology Institute</span>
                  <span className="text-[#cccccc]">/</span>
                  <span className="text-[#111111]">📄 DLL3 SCLC Nature Pre-Submission</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#777777]">
                  <span className="px-2 py-0.5 rounded bg-[#eef5fd] text-[#0075eb] font-semibold">Active</span>
                </div>
              </div>

              {/* Window Interior: Notion Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
                {/* Left Notion Sidebar */}
                <div className="hidden md:block md:col-span-3 border-r border-[#f0f0ee] bg-[#fbfbfa] p-3 text-xs space-y-4">
                  <div className="flex items-center gap-2 px-2 py-1 font-semibold text-[#111111]">
                    <div className="w-4 h-4 rounded bg-black text-white flex items-center justify-center text-[10px] font-serif">M</div>
                    <span>Cancer Genomics</span>
                  </div>

                  <div className="space-y-0.5 text-[#666666]">
                    <div className="px-2 py-1 rounded hover:bg-[#f0f0ee] cursor-pointer flex items-center gap-2 text-[#111111] font-medium">
                      <Search className="w-3.5 h-3.5 text-[#888888]" />
                      <span>Search</span>
                    </div>
                    <div className="px-2 py-1 rounded hover:bg-[#f0f0ee] cursor-pointer flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#0075eb]" />
                      <span>Notion AI Review</span>
                    </div>
                    <div className="px-2 py-1 rounded hover:bg-[#f0f0ee] cursor-pointer flex items-center gap-2">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#888888]" />
                      <span>AI Settings</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="px-2 pb-1 text-[10px] font-semibold text-[#999999] uppercase tracking-wider">
                      Workspaces
                    </div>
                    <div className="space-y-0.5">
                      <div className="px-2 py-1.5 rounded bg-[#f0f0ee] text-[#111111] font-medium flex items-center gap-2">
                        <span>📄</span>
                        <span className="truncate">DLL3 Activation Paper</span>
                      </div>
                      <div className="px-2 py-1.5 rounded hover:bg-[#f0f0ee] text-[#666666] flex items-center gap-2">
                        <span>👥</span>
                        <span className="truncate">4-Persona Reviews</span>
                      </div>
                      <div className="px-2 py-1.5 rounded hover:bg-[#f0f0ee] text-[#666666] flex items-center gap-2">
                        <span>✅</span>
                        <span className="truncate">CrossRef Audit</span>
                      </div>
                      <div className="px-2 py-1.5 rounded hover:bg-[#f0f0ee] text-[#666666] flex items-center gap-2">
                        <span>📑</span>
                        <span className="truncate">Nature Recommendations</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Document Canvas */}
                <div className="p-6 md:p-8 md:col-span-9 bg-white space-y-6">
                  {/* Notion Page Icon & Title */}
                  <div>
                    <div className="text-3xl mb-2 select-none">🧬</div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
                      Nature Communications Pre-Submission
                    </h2>
                  </div>

                  {/* Notion Database Property Rows */}
                  <div className="rounded-lg border border-[#e8e8e6] bg-[#fafafa] p-3 text-xs divide-y divide-[#ecece9]">
                    <div className="flex items-center py-1.5 px-1">
                      <span className="w-32 text-[#787774] flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" /> Target Journal
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#faecd7] text-[#915809] font-medium">
                        Nature Communications
                      </span>
                    </div>

                    <div className="flex items-center py-1.5 px-1">
                      <span className="w-32 text-[#787774] flex items-center gap-1.5">
                        <SlidersHorizontal className="w-3.5 h-3.5" /> AI Engine
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#eefaf3] text-[#2b7a4b] font-medium border border-[#c6e8d2]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2b7a4b]" />
                        GEMINI 1.5 FLASH (⚡ 184ms)
                      </span>
                    </div>

                    <div className="flex items-center py-1.5 px-1">
                      <span className="w-32 text-[#787774] flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" /> Triage Readiness
                      </span>
                      <span className="font-semibold text-[#111111]">
                        78 / 100 &bull; <span className="text-[#e38817]">Major Revision Recommended</span>
                      </span>
                    </div>
                  </div>

                  {/* Notion Kanban / Card Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {/* Column 1 */}
                    <div className="p-3 rounded-xl border border-[#eaeaea] bg-white shadow-xs space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#111111]">
                        <span>Triage Vulnerabilities</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f5f5f4] text-[#777777]">2</span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-[#f0f0ee] bg-[#fbfbfa] text-xs space-y-1">
                        <div className="font-semibold text-[#c52b2b] flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Causal Overclaim
                        </div>
                        <p className="text-[11px] text-[#666666] leading-snug">
                          Abstract claims POU2F1 proves DLL3 expression without rescue control.
                        </p>
                      </div>
                      <div className="p-2.5 rounded-lg border border-[#f0f0ee] bg-[#fbfbfa] text-xs space-y-1">
                        <div className="font-semibold text-[#d48816] flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Sample Size Power
                        </div>
                        <p className="text-[11px] text-[#666666] leading-snug">
                          Cohort n=8 lacks a priori statistical power calculation.
                        </p>
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="p-3 rounded-xl border border-[#eaeaea] bg-white shadow-xs space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#111111]">
                        <span>4-Persona Reviews</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f5f5f4] text-[#777777]">4</span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-[#f0f0ee] bg-[#fbfbfa] text-xs space-y-1">
                        <div className="font-semibold text-[#111111] flex items-center justify-between">
                          <span>Dr. Vance (Methods)</span>
                          <span className="text-[10px] px-1.5 rounded bg-[#faecd7] text-[#915809]">Major</span>
                        </div>
                        <p className="text-[11px] text-[#666666] leading-snug">
                          &ldquo;sgRNA library coverage depth must be confirmed in organoids.&rdquo;
                        </p>
                      </div>
                      <div className="p-2.5 rounded-lg border border-[#f0f0ee] bg-[#fbfbfa] text-xs space-y-1">
                        <div className="font-semibold text-[#111111] flex items-center justify-between">
                          <span>Dr. Sorkin (Stats)</span>
                          <span className="text-[10px] px-1.5 rounded bg-[#faecd7] text-[#915809]">Major</span>
                        </div>
                        <p className="text-[11px] text-[#666666] leading-snug">
                          &ldquo;Parametric t-test used on small sample size without normality test.&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* Column 3 */}
                    <div className="p-3 rounded-xl border border-[#eaeaea] bg-white shadow-xs space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#111111]">
                        <span>Citation Audit</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#eefaf3] text-[#2b7a4b]">Live</span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-[#c6e8d2] bg-[#f3fbf6] text-xs space-y-1">
                        <div className="font-semibold text-[#2b7a4b] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> CrossRef Verified
                        </div>
                        <p className="text-[11px] text-[#337a50] leading-snug">
                          15 / 15 cited DOIs resolved with confirmed metadata.
                        </p>
                      </div>
                      <div className="p-2.5 rounded-lg border border-[#c6e8d2] bg-[#f3fbf6] text-xs space-y-1">
                        <div className="font-semibold text-[#2b7a4b] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Retraction Watch Clear
                        </div>
                        <p className="text-[11px] text-[#337a50] leading-snug">
                          Zero retracted references flagged in manuscript bibliography.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. LOGO BAR (Scholarly Publisher Venues)                      */}
      {/* ------------------------------------------------------------- */}
      <section className="py-10 border-y border-[#eaeaea] bg-[#fafafa]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#888888] mb-6">
            Empowering authors publishing in premier scientific journals worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-sm sm:text-base font-serif font-bold text-[#888888] tracking-wider">
            <span className="hover:text-[#111111] transition">NATURE</span>
            <span className="hover:text-[#111111] transition">SCIENCE</span>
            <span className="hover:text-[#111111] transition">CELL</span>
            <span className="hover:text-[#111111] transition">THE LANCET</span>
            <span className="hover:text-[#111111] transition">PNAS</span>
            <span className="hover:text-[#111111] transition">PLOS ONE</span>
            <span className="hover:text-[#111111] transition">IEEE TPAMI</span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. BENTO GRID SECTION: "AI where your research works."        */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl sm:text-5xl font-bold text-[#111111] tracking-tight mb-12">
            AI where your research works.
          </h2>

          {/* Bento Top Row (Two 50% Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Bento Card 1 */}
            <div className="rounded-2xl border border-[#eaeaea] bg-white p-7 sm:p-8 shadow-xs flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between text-xs text-[#888888] mb-2 font-medium">
                  <span>Editorial Synthesis</span>
                  <div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight mb-4">
                  Bring everything into one system of record.
                </h3>
              </div>

              {/* Mini UI Mockup inside card */}
              <div className="rounded-xl border border-[#eaeaea] bg-[#fafafa] p-4 text-xs space-y-2 mt-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#ecece9]">
                  <span className="font-semibold text-[#111111]">Pre-Submission Rubric</span>
                  <span className="text-[11px] text-[#888888]">Calibrated to Nature</span>
                </div>
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[#555555]">Originality &amp; Novelty</span>
                    <span className="px-2 py-0.5 rounded bg-[#eefaf3] text-[#2b7a4b] font-medium">4.5 / 5.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#555555]">Claims vs Evidence</span>
                    <span className="px-2 py-0.5 rounded bg-[#faecd7] text-[#915809] font-medium">Overclaim Risk</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#555555]">Methodological Soundness</span>
                    <span className="px-2 py-0.5 rounded bg-[#f5f5f4] text-[#555555] font-medium">Power Calculation Needed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 2 */}
            <div className="rounded-2xl border border-[#eaeaea] bg-white p-7 sm:p-8 shadow-xs flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between text-xs text-[#888888] mb-2 font-medium">
                  <span>Citation Audit</span>
                  <div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight mb-4">
                  Get answers instantly with live verification.
                </h3>
              </div>

              {/* Chart & Search Mockup */}
              <div className="rounded-xl border border-[#eaeaea] bg-[#fafafa] p-4 text-xs space-y-3 mt-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full border-4 border-[#0075eb] border-t-[#0075eb] border-r-[#0075eb] border-b-[#cce3fb] border-l-[#0075eb] flex items-center justify-center font-bold text-sm text-[#0075eb]">
                    94%
                  </div>
                  <div>
                    <div className="font-semibold text-[#111111]">Recency Profile</div>
                    <div className="text-[11px] text-[#777777]">94% citations published within last 5 years</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#e5e5e5] shadow-xs text-xs">
                  <Search className="w-3.5 h-3.5 text-[#0075eb]" />
                  <span className="text-[#555555] truncate">What are our biggest desk-reject risks?</span>
                  <span className="ml-auto w-5 h-5 rounded bg-[#0075eb] text-white flex items-center justify-center text-[10px]">
                    &rarr;
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Middle Row (Wide 100% Card) */}
          <div className="rounded-2xl border border-[#eaeaea] bg-[#fbfbfa] p-7 sm:p-8 shadow-xs mb-6 hover:shadow-md transition">
            <div className="flex items-center justify-between text-xs text-[#888888] mb-2 font-medium">
              <span>Peer-Review Simulation</span>
              <div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
                <Check className="w-2.5 h-2.5" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight mb-4">
              Keep reviews moving 24/7 with expert agents.
            </h3>

            {/* 4 Persona Cards in Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              <div className="p-3.5 rounded-xl bg-white border border-[#e5e5e5] shadow-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-xs text-[#111111]">
                  <FlaskConical className="w-3.5 h-3.5 text-[#0075eb]" />
                  <span>Methods Specialist</span>
                </div>
                <p className="text-[11px] text-[#666666]">
                  Assesses CRISPR library representation, sequencing coverage, and negative controls.
                </p>
                <div className="text-[10px] font-semibold text-[#0075eb] bg-[#eef5fd] px-2 py-0.5 rounded">
                  Protocol Reproducibility
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#e5e5e5] shadow-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-xs text-[#111111]">
                  <GraduationCap className="w-3.5 h-3.5 text-[#e38817]" />
                  <span>Domain Expert</span>
                </div>
                <p className="text-[11px] text-[#666666]">
                  Evaluates biological plausibility, pathway mechanism, and novelty against 2024 literature.
                </p>
                <div className="text-[10px] font-semibold text-[#915809] bg-[#faecd7] px-2 py-0.5 rounded">
                  Mechanistic Novelty
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#e5e5e5] shadow-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-xs text-[#111111]">
                  <BookOpen className="w-3.5 h-3.5 text-[#9a6dd7]" />
                  <span>Senior Journal Editor</span>
                </div>
                <p className="text-[11px] text-[#666666]">
                  Screens broad interest, translational implications, and immediate desk-rejection hazards.
                </p>
                <div className="text-[10px] font-semibold text-[#7642bb] bg-[#f3edf9] px-2 py-0.5 rounded">
                  Desk-Reject Triage
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#e5e5e5] shadow-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-xs text-[#111111]">
                  <BarChart3 className="w-3.5 h-3.5 text-[#2b7a4b]" />
                  <span>Senior Biostatistician</span>
                </div>
                <p className="text-[11px] text-[#666666]">
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
              className="p-4 rounded-xl border border-[#eaeaea] bg-white hover:border-[#cccccc] hover:shadow-sm transition flex flex-col justify-between group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#eef5fd] text-[#0075eb] flex items-center justify-center mb-3">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs text-[#111111] group-hover:text-[#0075eb] flex items-center justify-between">
                  <span>Reference Audit</span>
                  <span className="text-[#888888]">&rarr;</span>
                </div>
                <p className="text-[11px] text-[#777777] mt-0.5">Crossref verification</p>
              </div>
            </Link>

            <Link
              href="/tools/prisma"
              className="p-4 rounded-xl border border-[#eaeaea] bg-white hover:border-[#cccccc] hover:shadow-sm transition flex flex-col justify-between group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#faecd7] text-[#915809] flex items-center justify-center mb-3">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs text-[#111111] group-hover:text-[#915809] flex items-center justify-between">
                  <span>PRISMA 2020</span>
                  <span className="text-[#888888]">&rarr;</span>
                </div>
                <p className="text-[11px] text-[#777777] mt-0.5">Flow diagrams &amp; SVG</p>
              </div>
            </Link>

            <Link
              href="/tools/journal-fit"
              className="p-4 rounded-xl border border-[#eaeaea] bg-white hover:border-[#cccccc] hover:shadow-sm transition flex flex-col justify-between group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#fdeeee] text-[#c52b2b] flex items-center justify-center mb-3">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs text-[#111111] group-hover:text-[#c52b2b] flex items-center justify-between">
                  <span>Journal Fit</span>
                  <span className="text-[#888888]">&rarr;</span>
                </div>
                <p className="text-[11px] text-[#777777] mt-0.5">Match 20+ venues</p>
              </div>
            </Link>

            <Link
              href="/tools/citation-claim"
              className="p-4 rounded-xl border border-[#eaeaea] bg-white hover:border-[#cccccc] hover:shadow-sm transition flex flex-col justify-between group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#eefaf3] text-[#2b7a4b] flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs text-[#111111] group-hover:text-[#2b7a4b] flex items-center justify-between">
                  <span>Citation Claim</span>
                  <span className="text-[#888888]">&rarr;</span>
                </div>
                <p className="text-[11px] text-[#777777] mt-0.5">Audit claim accuracy</p>
              </div>
            </Link>

            <Link
              href="/tools/cover-letter"
              className="p-4 rounded-xl border border-[#eaeaea] bg-white hover:border-[#cccccc] hover:shadow-sm transition flex flex-col justify-between group col-span-2 sm:col-span-1"
            >
              <div className="w-8 h-8 rounded-lg bg-[#f3edf9] text-[#7642bb] flex items-center justify-center mb-3">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs text-[#111111] group-hover:text-[#7642bb] flex items-center justify-between">
                  <span>Cover Letter</span>
                  <span className="text-[#888888]">&rarr;</span>
                </div>
                <p className="text-[11px] text-[#777777] mt-0.5">Editor-grade letters</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. TESTIMONIALS SECTION: "Trusted by teams that ship."        */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 px-4 sm:px-6 bg-white border-t border-[#eaeaea]">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl sm:text-5xl font-bold text-[#111111] tracking-tight mb-12">
            Trusted by researchers that publish.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Duotone Card 1: Red / Coral (Nature Communications) */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-gradient-to-br from-[#c93b3b] via-[#d64545] to-[#a82424] text-white p-7 flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between z-10">
                <span className="font-serif font-bold text-base tracking-tight">nature communications</span>
              </div>

              <div className="z-10 space-y-4">
                <p className="text-xs sm:text-sm leading-relaxed font-medium text-white/95">
                  &ldquo;ManuView caught a fatal multiple-testing multiplicity flaw in our Methods that would have triggered immediate desk rejection. We fixed it before submission and were accepted.&rdquo;
                </p>
                <div className="pt-2 border-t border-white/20">
                  <div className="font-semibold text-xs">Dr. Aris Vance</div>
                  <div className="text-[11px] text-white/80">Lead Investigator, Oncology Institute</div>
                </div>
              </div>

              {/* Duotone Background Grain/Wave Overlay */}
              <div className="absolute inset-0 bg-black/15 pointer-events-none" />
            </div>

            {/* Duotone Card 2: Ocean Blue (Cell Reports) */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-gradient-to-br from-[#1e5088] via-[#2463aa] to-[#123863] text-white p-7 flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between z-10">
                <span className="font-serif font-bold text-base tracking-tight">Cell Reports</span>
              </div>

              <div className="z-10 space-y-4">
                <p className="text-xs sm:text-sm leading-relaxed font-medium text-white/95">
                  &ldquo;The 4-persona peer-review simulation prepared our team for the exact objections our referees raised during revision. It is like having an editorial board in your pocket.&rdquo;
                </p>
                <div className="pt-2 border-t border-white/20">
                  <div className="font-semibold text-xs">Prof. Elena Rostova</div>
                  <div className="text-[11px] text-white/80">Chair of Computational Genomics</div>
                </div>
              </div>

              {/* Duotone Background Grain/Wave Overlay */}
              <div className="absolute inset-0 bg-black/15 pointer-events-none" />
            </div>

            {/* Duotone Card 3: Golden Amber (The Lancet) */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-gradient-to-br from-[#b87d19] via-[#c98d24] to-[#8f5e0c] text-white p-7 flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between z-10">
                <span className="font-serif font-bold text-base tracking-tight">THE LANCET</span>
              </div>

              <div className="z-10 space-y-4">
                <p className="text-xs sm:text-sm leading-relaxed font-medium text-white/95">
                  &ldquo;We ran all 82 references through the integrity scanner and caught a retracted paper we did not know about. Saved our lab from an embarrassing correction notice.&rdquo;
                </p>
                <div className="pt-2 border-t border-white/20">
                  <div className="font-semibold text-xs">Dr. Marcus Sorkin</div>
                  <div className="text-[11px] text-white/80">Director of Clinical Biostatistics</div>
                </div>
              </div>

              {/* Duotone Background Grain/Wave Overlay */}
              <div className="absolute inset-0 bg-black/15 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. GET STARTED TODAY CTA SECTION                              */}
      {/* ------------------------------------------------------------- */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 bg-[#fafafa] border-t border-[#eaeaea] text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl sm:text-5xl font-bold text-[#111111] tracking-tight mb-6">
            Get started today.
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/scan"
              className="px-5 py-2.5 rounded-md bg-[#0075eb] hover:bg-[#0066cc] text-white font-medium text-sm shadow-xs transition active:scale-[0.98]"
            >
              Try ManuView free
            </Link>

            <Link
              href="/examples"
              className="px-4 py-2.5 rounded-md text-[#111111] hover:text-[#0075eb] hover:bg-white font-medium text-sm transition"
            >
              Explore sample preprints
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
