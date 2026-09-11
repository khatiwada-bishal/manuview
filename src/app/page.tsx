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
  GraduationCap,
  PanelLeft,
  Download,
  Printer,
  Scale,
  Compass,
  ShieldAlert,
  Trash2,
  Moon,
  Sun,
  X,
  ChevronDown,
  Settings,
  AlertCircle
} from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'personas' | 'dimensions' | 'issues' | 'journals'>('overview');
  const [heroViewMode, setHeroViewMode] = useState<'interactive' | 'native'>('interactive');
  return (
    <div className="flex flex-col min-h-screen text-neutral-900 dark:text-white">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION                                               */}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-16 sm:pt-24 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden aura-bg-gradient aura-grid-pattern">
        <div className="mx-auto max-w-5xl text-center">
          {/* AI Badge Chip */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.05] border border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300 text-xs font-medium mb-6 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">Pre-Submission Scientific Diagnostics</span>
          </div>

          {/* Main Headline with Iconic Inline Yellow Pill */}
          <h1 className="text-4xl sm:text-6xl md:text-[68px] font-bold text-neutral-900 dark:text-white tracking-[-0.03em] leading-[1.08] mb-6">
            Where researchers and <br />
            agents{" "}
            <span className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#fcedd7] text-[#915809] border border-[#f5dcb7] font-semibold text-2xl sm:text-4xl md:text-5xl align-middle mx-1 sm:mx-2 shadow-md select-none">
              <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#e38817] inline-block" />
              Review
            </span>{" "}
            together.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto leading-relaxed font-normal">
            Catch desk-reject flaws, citation hallucinations, and causal overclaims before submitting to top journals. A free, open-source editorial diagnostic for science.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14 sm:mb-18">
            <Link
              href="/scan"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl liquid-glass-btn-primary text-white font-semibold text-sm shadow-xs transition active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Try ManuView free</span>
            </Link>

            <Link
              href="/tools"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl liquid-glass-btn-secondary text-neutral-700 dark:text-neutral-200 font-medium text-sm transition"
            >
              <span>Explore Research Tools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* --------------------------------------------------------- */}
          {/* Scientific Review Trio Interactive Ribbon                 */}
          {/* --------------------------------------------------------- */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12 select-none">
            {/* Character 1: The Author Drafter */}
            <button
              type="button"
              onClick={() => { setActiveTab('overview'); setHeroViewMode('interactive'); }}
              className={`group relative flex items-center gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl transition-all duration-300 text-left border cursor-pointer ${
                activeTab === 'overview' && heroViewMode === 'interactive'
                  ? "liquid-glass-card bg-white/95 dark:bg-white/10 border-blue-500/50 dark:border-blue-400/50 shadow-md ring-2 ring-blue-500/20"
                  : "liquid-glass-card hover:bg-white/70 dark:hover:bg-white/[0.07] border-black/5 dark:border-white/10"
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center overflow-hidden shrink-0 border border-blue-500/20">
                <img
                  src="/illustrations/researcher-typing-laptop.png"
                  alt="Author Drafter"
                  className="w-9 h-9 object-contain dark:invert dark:brightness-150 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">1. Author Drafter</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-md font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Self-Audit</span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">Pre-submission diagnostics</p>
              </div>
            </button>

            {/* Character 2: The Co-Authors / Referees */}
            <button
              type="button"
              onClick={() => { setActiveTab('personas'); setHeroViewMode('interactive'); }}
              className={`group relative flex items-center gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl transition-all duration-300 text-left border cursor-pointer ${
                activeTab === 'personas' && heroViewMode === 'interactive'
                  ? "liquid-glass-card bg-white/95 dark:bg-white/10 border-purple-500/50 dark:border-purple-400/50 shadow-md ring-2 ring-purple-500/20"
                  : "liquid-glass-card hover:bg-white/70 dark:hover:bg-white/[0.07] border-black/5 dark:border-white/10"
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center overflow-hidden shrink-0 border border-purple-500/20">
                <img
                  src="/illustrations/researchers-collaborating.png"
                  alt="Simulated Referees"
                  className="w-9 h-9 object-contain dark:invert dark:brightness-150 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">2. Referee Simulation</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-md font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">5 Personas</span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">Stress-test controls &amp; claims</p>
              </div>
            </button>

            {/* Character 3: The Journal Editor */}
            <button
              type="button"
              onClick={() => { setActiveTab('journals'); setHeroViewMode('interactive'); }}
              className={`group relative flex items-center gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl transition-all duration-300 text-left border cursor-pointer ${
                activeTab === 'journals' && heroViewMode === 'interactive'
                  ? "liquid-glass-card bg-white/95 dark:bg-white/10 border-emerald-500/50 dark:border-emerald-400/50 shadow-md ring-2 ring-emerald-500/20"
                  : "liquid-glass-card hover:bg-white/70 dark:hover:bg-white/[0.07] border-black/5 dark:border-white/10"
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center overflow-hidden shrink-0 border border-emerald-500/20">
                <img
                  src="/illustrations/researcher-reading-journal.png"
                  alt="Editorial Decision"
                  className="w-9 h-9 object-contain dark:invert dark:brightness-150 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">3. Editorial Decision</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-md font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Acceptance</span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">Journal fit &amp; zero retractions</p>
              </div>
            </button>
          </div>

          {/* --------------------------------------------------------- */}
          {/* Hero macOS Desktop App Mockup (100% Parity with Desktop)  */}
          {/* --------------------------------------------------------- */}
          <div className="relative mx-auto max-w-5xl text-left">

            {/* Left Flanking Character: Drafter with floating thought bubble */}
            <div className="hidden xl:block absolute -left-44 top-32 w-40 z-30 pointer-events-auto">
              <div 
                className="relative group cursor-pointer" 
                onClick={() => { setActiveTab('overview'); setHeroViewMode('interactive'); }}
                title="Click to view manuscript self-audit report"
              >
                {/* Speech Bubble */}
                <div className="mb-2 p-3 rounded-2xl liquid-glass-card border border-black/10 dark:border-white/15 text-[11px] text-neutral-800 dark:text-neutral-200 shadow-xl transition-all duration-300 group-hover:translate-y-[-2px]">
                  <div className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 text-[10px] uppercase tracking-wider mb-0.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Author Drafter</span>
                  </div>
                  &ldquo;Auditing sample power &amp; controls before our referees see it.&rdquo;
                </div>
                {/* Character Image */}
                <div className="relative p-2 rounded-2xl liquid-glass-card/60 backdrop-blur-sm">
                  <img
                    src="/illustrations/researcher-typing-laptop.png"
                    alt="Author Drafter"
                    className="w-full h-auto drop-shadow-md dark:invert dark:brightness-150 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>

            {/* Top-Right Flanking Character: Collaborators / Referee Reviewers */}
            <div className="hidden xl:block absolute -right-44 -top-8 w-44 z-30 pointer-events-auto">
              <div 
                className="relative group cursor-pointer" 
                onClick={() => { setActiveTab('personas'); setHeroViewMode('interactive'); }}
                title="Click to view 5-persona simulated reviews"
              >
                {/* Speech Bubble */}
                <div className="mb-2 p-3 rounded-2xl liquid-glass-card border border-black/10 dark:border-white/15 text-[11px] text-neutral-800 dark:text-neutral-200 shadow-xl transition-all duration-300 group-hover:translate-y-[-2px]">
                  <div className="flex items-center gap-1 font-bold text-purple-600 dark:text-purple-400 text-[10px] uppercase tracking-wider mb-0.5">
                    <Users className="w-3 h-3" />
                    <span>Referees Simulated</span>
                  </div>
                  &ldquo;Devil&apos;s advocate caught a missing control in Fig 3B!&rdquo;
                </div>
                {/* Character Image */}
                <div className="relative p-2 rounded-2xl liquid-glass-card/60 backdrop-blur-sm">
                  <img
                    src="/illustrations/researchers-collaborating.png"
                    alt="Peer Reviewers"
                    className="w-full h-auto drop-shadow-md dark:invert dark:brightness-150 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>

            {/* Bottom-Right Flanking Character: Journal Reader / Editor with Paper */}
            <div className="hidden xl:block absolute -right-44 bottom-14 w-40 z-30 pointer-events-auto">
              <div 
                className="relative group cursor-pointer" 
                onClick={() => { setActiveTab('journals'); setHeroViewMode('interactive'); }}
                title="Click to view target journal fit recommendations"
              >
                {/* Character Image */}
                <div className="relative p-2 rounded-2xl liquid-glass-card/60 backdrop-blur-sm mb-2">
                  <img
                    src="/illustrations/researcher-reading-journal.png"
                    alt="Journal Editor"
                    className="w-full h-auto drop-shadow-md dark:invert dark:brightness-150 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {/* Speech Bubble */}
                <div className="p-3 rounded-2xl liquid-glass-card border border-black/10 dark:border-white/15 text-[11px] text-neutral-800 dark:text-neutral-200 shadow-xl transition-all duration-300 group-hover:translate-y-[-2px]">
                  <div className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 text-[10px] uppercase tracking-wider mb-0.5">
                    <BookOpen className="w-3 h-3" />
                    <span>Accepted Article</span>
                  </div>
                  &ldquo;Immediate acceptance. Cleanest bibliography in months.&rdquo;
                </div>
              </div>
            </div>

            {/* Main Window Frame */}
            <div className="rounded-2xl sm:rounded-3xl border border-black/10 dark:border-white/10 liquid-glass-canvas shadow-[0_30px_90px_-15px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.4)] dark:shadow-[0_30px_90px_-15px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden">
              
              {/* 1. macOS Top Chrome / Tab Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/5 dark:border-white/10 liquid-glass-header select-none text-xs gap-3">
                {/* Left: macOS Traffic Lights */}
                <div className="flex items-center gap-2 mr-2 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
                </div>

                {/* Center / Navigation Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 flex-1 min-w-0">
                  {/* AI Review Tab */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 text-xs font-medium shrink-0 cursor-default">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    <span>AI Review</span>
                  </div>

                  {/* Active Document Tab (Single-cell transcripti...) */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E2536] text-neutral-900 dark:text-white font-semibold shadow-xs border border-black/5 dark:border-white/10 text-xs shrink-0">
                    <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="truncate max-w-[130px] sm:max-w-[180px]">Single-cell transcripti...</span>
                    <button type="button" className="p-0.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Secondary Tool Tabs */}
                  <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 text-xs font-medium shrink-0 transition">
                    <Compass className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Journal Fit</span>
                  </div>

                  <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 text-xs font-medium shrink-0 transition">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                    <span>Reference Audit</span>
                  </div>

                  <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 text-xs font-medium shrink-0 transition">
                    <Layers className="w-3.5 h-3.5 text-purple-500" />
                    <span>PRISMA 2020</span>
                  </div>

                  <div className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 text-xs font-medium shrink-0 transition">
                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Cover Letter</span>
                  </div>

                  <div className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 text-xs font-medium shrink-0 transition">
                    <MessageSquare className="w-3.5 h-3.5 text-rose-500" />
                    <span>Response Matrix</span>
                  </div>
                </div>

                {/* Right Top Bar Controls: View Mode Switcher + Theme Toggle */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* View Mode Toggle: Interactive vs Native macOS Screenshot */}
                  <div className="flex items-center p-0.5 rounded-lg bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 text-[10px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setHeroViewMode('interactive')}
                      className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                        heroViewMode === 'interactive'
                          ? "bg-white dark:bg-[#1E2536] text-neutral-900 dark:text-white shadow-2xs"
                          : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                      }`}
                    >
                      Interactive
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroViewMode('native')}
                      className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                        heroViewMode === 'native'
                          ? "bg-white dark:bg-[#1E2536] text-neutral-900 dark:text-white shadow-2xs"
                          : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                      }`}
                    >
                      Native App
                    </button>
                  </div>

                  <div className="w-7 h-7 rounded-lg liquid-glass-btn-secondary flex items-center justify-center text-neutral-600 dark:text-amber-400 cursor-pointer">
                    <Moon className="w-3.5 h-3.5 block dark:hidden" />
                    <Sun className="w-3.5 h-3.5 hidden dark:block" />
                  </div>
                </div>
              </div>

              {/* 2. Window Body: Sidebar + Main Content Dashboard OR Native App Preview */}
              {heroViewMode === 'interactive' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
                
                {/* Left Desktop Sidebar */}
                <div className="hidden lg:flex lg:col-span-4 xl:col-span-3 border-r border-black/5 dark:border-white/10 liquid-glass-sidebar p-3.5 text-xs flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    {/* Brand Banner */}
                    <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-serif font-bold text-xs shadow-xs">
                          M
                        </div>
                        <div>
                          <div className="font-bold text-xs text-neutral-900 dark:text-white tracking-tight">
                            ManuView Desktop
                          </div>
                          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                            Research &amp; Review Suite
                          </div>
                        </div>
                      </div>
                      <button type="button" className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 transition">
                        <PanelLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Services Section */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between px-2 pb-1 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                        <span>Services</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-neutral-200/80 dark:bg-white/10 text-[9px] font-semibold text-neutral-600 dark:text-neutral-300">
                          7
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold cursor-pointer">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span className="truncate">Pre-Submission AI Review</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition">
                          <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="truncate">Journal Fit Predictor</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition">
                          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                          <span className="truncate">Reference Integrity Audit</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span className="truncate">Citation Claim Validator</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition">
                          <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                          <span className="truncate">PRISMA Flow Diagram</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition">
                          <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <span className="truncate">Journal Cover Letter</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition">
                          <MessageSquare className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                          <span className="truncate">Review Response Builder</span>
                        </div>
                      </div>
                    </div>

                    {/* Search Input Box */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        readOnly
                        value="Search articles..."
                        className="w-full pl-8 pr-8 py-1.5 rounded-xl liquid-glass-input text-[11px] text-neutral-400 select-none cursor-default"
                      />
                      <span className="absolute right-2 top-2 px-1.5 py-0.2 text-[9px] font-mono rounded bg-neutral-200/80 dark:bg-white/10 text-neutral-500 dark:text-neutral-400 border border-black/5 dark:border-white/10">
                        ⌘K
                      </span>
                    </div>

                    {/* Articles Section */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between px-2 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                        <span>Articles</span>
                        <span className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline">
                          + New
                        </span>
                      </div>

                      {/* Active Article Card */}
                      <button
                        type="button"
                        onClick={() => setActiveTab('overview')}
                        className={`w-full text-left p-2 rounded-xl transition flex items-center justify-between gap-1.5 ${
                          activeTab === 'overview'
                            ? "bg-white dark:bg-white/10 shadow-xs border border-black/5 dark:border-white/10"
                            : "hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span className="truncate font-semibold text-neutral-900 dark:text-white text-xs">
                            Single-cell transcr...
                          </span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 shrink-0">
                          35%
                        </span>
                      </button>

                      {/* Sub-tree Navigation Items */}
                      <div className="pl-5 space-y-0.5 border-l border-black/5 dark:border-white/10 ml-3.5">
                        <button
                          type="button"
                          onClick={() => setActiveTab('personas')}
                          className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 transition text-[11px] font-medium ${
                            activeTab === 'personas'
                              ? "bg-purple-500/15 text-purple-700 dark:text-purple-300 font-semibold"
                              : "text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5"
                          }`}
                        >
                          <Users className="w-3 h-3 text-purple-500" />
                          <span>5-Persona Reviews</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('dimensions')}
                          className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 transition text-[11px] font-medium ${
                            activeTab === 'dimensions'
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold"
                              : "text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5"
                          }`}
                        >
                          <BarChart3 className="w-3 h-3 text-emerald-500" />
                          <span>6 Scoring Dimensions</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('issues')}
                          className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 transition text-[11px] font-medium ${
                            activeTab === 'issues'
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold"
                              : "text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5"
                          }`}
                        >
                          <AlertCircle className="w-3 h-3 text-amber-500" />
                          <span>Priority Action Items</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('journals')}
                          className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 transition text-[11px] font-medium ${
                            activeTab === 'journals'
                              ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 font-semibold"
                              : "text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5"
                          }`}
                        >
                          <BookOpen className="w-3 h-3 text-blue-500" />
                          <span>Target Journals</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Footer */}
                  <div className="pt-3 border-t border-black/5 dark:border-white/10 space-y-2">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>Disclaimer &amp; Usage</span>
                      </div>
                      <span className="text-[10px] opacity-70">ⓘ</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 px-1 pt-1">
                      <span className="font-mono text-[10px]">v1.0.0</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-semibold border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        GEMINI 3.1 FLAS...
                      </span>
                      <Settings className="w-3.5 h-3.5 hover:text-neutral-800 dark:hover:text-white cursor-pointer transition" />
                    </div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-8 xl:col-span-9 p-4 sm:p-6 lg:p-7 space-y-4 overflow-y-auto max-h-[640px]">
                  
                  {activeTab === 'overview' && (
                    <div className="space-y-4 animate-fade-in">
                      {/* CARD 1: Header + Score Card */}
                      <div className="rounded-2xl sm:rounded-3xl liquid-glass-card p-5 sm:p-7 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/5 dark:border-white/10">
                          <span className="font-bold text-sm sm:text-base tracking-tight text-neutral-900 dark:text-white">
                            Manu<span className="text-blue-600 dark:text-blue-400">View</span> Diagnostic Suite
                          </span>

                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs font-semibold text-blue-600 dark:text-blue-400">
                              Target: Journal of Adhesion Science and Technology
                            </span>

                            <button
                              type="button"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold liquid-glass-btn-secondary text-neutral-700 dark:text-neutral-200 transition"
                            >
                              <Download className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                              <span>Export</span>
                              <ChevronDown className="w-3 h-3" />
                            </button>

                            <button
                              type="button"
                              className="p-1.5 rounded-lg liquid-glass-btn-secondary text-neutral-400 hover:text-rose-500 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <h2 className="text-lg sm:text-xl font-serif font-bold text-neutral-900 dark:text-white leading-snug">
                            Single-cell transcriptional profiling of DLL3 activation in neuroendocrine lung carcinoma
                          </h2>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                            Generated on September 10, 2026 · Peer-Review Calibrated Pre-Submission Diagnostic
                          </p>
                        </div>

                        {/* Acceptance Potential Banner */}
                        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl liquid-glass-card">
                          <div className="flex items-baseline">
                            <span className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white">
                              35
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider ml-2">
                              / 100 OVERALL ACCEPTANCE POTENTIAL
                            </span>
                          </div>

                          <Link
                            href="/scan"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print / Save as PDF</span>
                          </Link>
                        </div>
                      </div>

                      {/* CARD 2: Editorial Synthesis & Triage Assessment */}
                      <div className="rounded-2xl sm:rounded-3xl liquid-glass-card p-5 sm:p-6 space-y-2">
                        <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                          Editorial Synthesis &amp; Triage Assessment
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
                          The manuscript presents a potentially interesting link between POU2F1 and DLL3 in SCLC. However, the study suffers from severe methodological limitations, including a small sample size (n=8), lack of mechanistic validation beyond simple knockdown, and egregious issues with the bibliography, including a retracted paper and hallucinated citations.
                        </p>
                      </div>

                      {/* CARD 3: Document Classification */}
                      <div className="rounded-2xl sm:rounded-3xl liquid-glass-card p-5 sm:p-6 space-y-2">
                        <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                          Document Classification: Empirical Laboratory Study
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
                          <strong>Dear Author,:</strong> Your manuscript requires urgent attention regarding reference integrity and the over-extension of causal claims before submission.
                        </p>
                        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                          The current draft contains non-existent references and a retracted citation. These must be purged immediately to avoid automatic desk rejection.
                        </p>
                      </div>

                      {/* CARD 4: STROBE Compliance */}
                      <div className="rounded-2xl sm:rounded-3xl liquid-glass-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
                            <Scale className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                              Reporting Guideline Compliance: STROBE
                            </h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                              Standard: Observational Studies
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Audit Score:</span>
                          <span className="text-sm sm:text-base font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                            30%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sub-view: 5-Persona Reviews */}
                  {activeTab === 'personas' && (
                    <div className="space-y-3.5 animate-fade-in">
                      <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10">
                        <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                          5-Persona Independent Reviewers
                        </h3>
                        <button
                          type="button"
                          onClick={() => setActiveTab('overview')}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          &larr; Back to Overview
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-4 rounded-2xl liquid-glass-card space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-neutral-900 dark:text-white">Dr. Vance (Methods)</span>
                            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">Major Rev</span>
                          </div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-300 italic leading-relaxed font-serif">
                            &ldquo;sgRNA library coverage depth was sequenced across only 8 organoid lines without rescue controls. Representation must be validated.&rdquo;
                          </p>
                        </div>
                        <div className="p-4 rounded-2xl liquid-glass-card space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-neutral-900 dark:text-white">Dr. Sorkin (Stats)</span>
                            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Critical</span>
                          </div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-300 italic leading-relaxed font-serif">
                            &ldquo;Two-tailed Student&apos;s t-test was applied to small cohorts (n=8) without normality testing. Wilcoxon rank-sum required.&rdquo;
                          </p>
                        </div>
                        <div className="p-4 rounded-2xl liquid-glass-card space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-neutral-900 dark:text-white">Senior Editor (Scope)</span>
                            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">Triage</span>
                          </div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-300 italic leading-relaxed font-serif">
                            &ldquo;Universal biomarker claim is premature for a retrospective cohort. Narrow scope to match empirical data.&rdquo;
                          </p>
                        </div>
                        <div className="p-4 rounded-2xl liquid-glass-card space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-neutral-900 dark:text-white">Mechanistic Oncologist</span>
                            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Promising</span>
                          </div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-300 italic leading-relaxed font-serif">
                            &ldquo;Direct POU2F1 regulation of DLL3 is biologically exciting and clinically actionable with proper controls.&rdquo;
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sub-view: 6 Scoring Dimensions */}
                  {activeTab === 'dimensions' && (
                    <div className="space-y-3.5 animate-fade-in">
                      <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10">
                        <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                          6 Scoring Dimensions
                        </h3>
                        <button
                          type="button"
                          onClick={() => setActiveTab('overview')}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          &larr; Back to Overview
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { name: "Originality & Novelty", score: 85, badge: "High", color: "text-emerald-600 dark:text-emerald-400" },
                          { name: "Methodological Rigor", score: 35, badge: "Critical Flaws", color: "text-rose-600 dark:text-rose-400" },
                          { name: "Statistical Validity", score: 40, badge: "Power Issue", color: "text-amber-600 dark:text-amber-400" },
                          { name: "Causal Inference", score: 30, badge: "Overclaim", color: "text-rose-600 dark:text-rose-400" },
                          { name: "Citation Integrity", score: 45, badge: "Retracted DOI", color: "text-rose-600 dark:text-rose-400" },
                          { name: "Readability & Structure", score: 80, badge: "Good", color: "text-emerald-600 dark:text-emerald-400" },
                        ].map((dim, idx) => (
                          <div key={idx} className="p-4 rounded-2xl liquid-glass-card space-y-2">
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span className="text-neutral-900 dark:text-white">{dim.name}</span>
                              <span className={dim.color}>{dim.score}/100 ({dim.badge})</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${dim.score >= 70 ? "bg-emerald-500" : dim.score >= 50 ? "bg-amber-500" : "bg-rose-500"}`}
                                style={{ width: `${dim.score}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sub-view: Priority Action Items */}
                  {activeTab === 'issues' && (
                    <div className="space-y-3.5 animate-fade-in">
                      <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10">
                        <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                          Priority Action Items (Desk-Reject Risks)
                        </h3>
                        <button
                          type="button"
                          onClick={() => setActiveTab('overview')}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          &larr; Back to Overview
                        </button>
                      </div>
                      <div className="space-y-2.5">
                        <div className="p-4 rounded-2xl liquid-glass-card border-l-4 border-l-rose-500 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">1. Causal Overclaim in Title and Abstract</span>
                            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">High Risk</span>
                          </div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-300">
                            Reframe claims of &ldquo;proves universal efficacy&rdquo; to correlative findings in organoids (n=8) to avoid instant editorial rejection.
                          </p>
                        </div>
                        <div className="p-4 rounded-2xl liquid-glass-card border-l-4 border-l-amber-500 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">2. Sample Size Statistical Power</span>
                            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">Medium Risk</span>
                          </div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-300">
                            Include a priori power calculations and replace unpaired Student&apos;s t-test with non-parametric Mann-Whitney test.
                          </p>
                        </div>
                        <div className="p-4 rounded-2xl liquid-glass-card border-l-4 border-l-rose-500 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">3. Retracted Citation in Bibliography</span>
                            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">Immediate Flag</span>
                          </div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-300">
                            Reference #4 (Wakefield et al., Lancet 1998) is retracted. Must be completely expunged from the bibliography.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sub-view: Target Journals */}
                  {activeTab === 'journals' && (
                    <div className="space-y-3.5 animate-fade-in">
                      <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10">
                        <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                          Target Journal Recommendations
                        </h3>
                        <button
                          type="button"
                          onClick={() => setActiveTab('overview')}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          &larr; Back to Overview
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-4 rounded-2xl liquid-glass-card space-y-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">Reach · IF 14.7</span>
                          <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Nature Communications</h4>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">Mechanistic rescue controls required before consideration.</p>
                        </div>
                        <div className="p-4 rounded-2xl liquid-glass-card space-y-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">Realistic · IF 8.8</span>
                          <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Cell Reports</h4>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">High thematic fit for POU2F1 target with moderated claims.</p>
                        </div>
                        <div className="p-4 rounded-2xl liquid-glass-card space-y-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">Fallback · IF 5.2</span>
                          <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Oncogene</h4>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">Strong publication venue if organoid rescue cannot be completed.</p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
              ) : (
                /* Native Desktop App Preview */
                <div className="p-4 sm:p-7 bg-slate-950/5 dark:bg-black/40 flex flex-col items-center justify-center min-h-[580px] animate-fade-in">
                  <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 group">
                    <img
                      src="/illustrations/desktop-app-preview.png"
                      alt="ManuView Native Desktop App Experience"
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 py-3 px-5 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-center justify-between text-white text-xs backdrop-blur-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-semibold tracking-tight">Native macOS Liquid Glass Application Preview</span>
                      </div>
                      <span className="opacity-80 font-mono text-[11px]">1024 × 769 HiDPI · Native Desktop Window</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. LOGO BAR (Scholarly Publisher Venues)                      */}
      {/* ------------------------------------------------------------- */}
      <section className="py-10 border-y border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-[#12151B]/60 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-6">
            Calibrated for formatting and editorial standards of leading peer-reviewed venues
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-sm sm:text-base font-serif font-bold text-neutral-600 dark:text-neutral-300 tracking-wider">
            <span className="hover:text-neutral-900 dark:hover:text-white transition">NATURE</span>
            <span className="hover:text-neutral-900 dark:hover:text-white transition">SCIENCE</span>
            <span className="hover:text-neutral-900 dark:hover:text-white transition">CELL</span>
            <span className="hover:text-neutral-900 dark:hover:text-white transition">THE LANCET</span>
            <span className="hover:text-neutral-900 dark:hover:text-white transition">PNAS</span>
            <span className="hover:text-neutral-900 dark:hover:text-white transition">PLOS ONE</span>
            <span className="hover:text-neutral-900 dark:hover:text-white transition">IEEE TPAMI</span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. BENTO GRID SECTION: "AI where your research works."        */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 px-4 sm:px-6 bg-transparent">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl sm:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight mb-12">
            AI where your research works.
          </h2>

          {/* Bento Top Row (Two 50% Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Bento Card 1 */}
            <div className="rounded-3xl liquid-glass-card p-7 sm:p-8 flex flex-col justify-between transition">
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-2 font-medium">
                  <span>Editorial Synthesis</span>
                  <div className="w-4 h-4 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px]">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mb-4">
                  Bring everything into one system of record.
                </h3>
              </div>

              {/* Mini UI Mockup inside card */}
              <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] p-4 text-xs space-y-2 mt-4">
                <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-200">Pre-Submission Rubric</span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Calibrated to Nature</span>
                </div>
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Originality &amp; Novelty</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 font-medium">4.5 / 5.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Claims vs Evidence</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 font-medium">Overclaim Risk</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Methodological Soundness</span>
                    <span className="px-2 py-0.5 rounded bg-neutral-500/10 text-neutral-700 dark:text-neutral-300 font-medium">Power Calculation Needed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 2 */}
            <div className="rounded-3xl liquid-glass-card p-7 sm:p-8 flex flex-col justify-between transition">
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-2 font-medium">
                  <span>Citation Audit</span>
                  <div className="w-4 h-4 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px]">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mb-4">
                  Get answers instantly with live verification.
                </h3>
              </div>

              {/* Chart & Search Mockup */}
              <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] p-4 text-xs space-y-3 mt-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full border-4 border-blue-500 border-t-blue-500 border-r-blue-500 border-b-blue-200 dark:border-b-blue-900 border-l-blue-500 flex items-center justify-center font-bold text-sm text-blue-600 dark:text-blue-400">
                    94%
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white">Recency Profile</div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400">94% citations published within last 5 years</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-white/[0.06] border border-black/5 dark:border-white/10 shadow-xs text-xs">
                  <Search className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-neutral-500 dark:text-neutral-400 truncate">What are our biggest desk-reject risks?</span>
                  <span className="ml-auto w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center text-[10px]">
                    &rarr;
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Middle Row (Wide 100% Card) */}
          <div className="rounded-3xl liquid-glass-card p-7 sm:p-8 mb-6 transition">
            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-2 font-medium">
              <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-semibold">Peer-Review Simulation</span>
              <div className="w-4 h-4 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px]">
                <Check className="w-2.5 h-2.5" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mb-4">
              Keep reviews moving 24/7 with expert referee agents.
            </h3>

            {/* 4 Persona Cards in Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-xs space-y-2.5 hover:shadow-md transition">
                <div className="flex items-center gap-2 font-semibold text-xs text-emerald-800 dark:text-emerald-300">
                  <FlaskConical className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Methods Specialist</span>
                </div>
                <p className="text-[11px] text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Assesses CRISPR library representation, sequencing coverage, and negative controls.
                </p>
                <div className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-white/70 dark:bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Protocol Reproducibility
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 shadow-xs space-y-2.5 hover:shadow-md transition">
                <div className="flex items-center gap-2 font-semibold text-xs text-purple-800 dark:text-purple-300">
                  <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Domain Expert</span>
                </div>
                <p className="text-[11px] text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Evaluates biological plausibility, pathway mechanism, and novelty against 2024 literature.
                </p>
                <div className="text-[10px] font-semibold text-purple-800 dark:text-purple-300 bg-white/70 dark:bg-purple-950/40 border border-purple-500/20 px-2 py-0.5 rounded">
                  Mechanistic Novelty
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-xs space-y-2.5 hover:shadow-md transition">
                <div className="flex items-center gap-2 font-semibold text-xs text-amber-800 dark:text-amber-300">
                  <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Senior Journal Editor</span>
                </div>
                <p className="text-[11px] text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Screens broad interest, translational implications, and immediate desk-rejection hazards.
                </p>
                <div className="text-[10px] font-semibold text-amber-800 dark:text-amber-300 bg-white/70 dark:bg-amber-950/40 border border-amber-500/20 px-2 py-0.5 rounded">
                  Desk-Reject Triage
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 shadow-xs space-y-2.5 hover:shadow-md transition">
                <div className="flex items-center gap-2 font-semibold text-xs text-cyan-800 dark:text-cyan-300">
                  <BarChart3 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>Biostatistician</span>
                </div>
                <p className="text-[11px] text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Audits sample power calculations, multiplicity adjustments (FDR), and variance metrics.
                </p>
                <div className="text-[10px] font-semibold text-cyan-800 dark:text-cyan-300 bg-white/70 dark:bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded">
                  Statistical Validity
                </div>
              </div>
            </div>
          </div>

          {/* 5 Bottom Quick Tool Integration Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <Link
              href="/tools/reference-checker"
              className="p-4 rounded-2xl liquid-glass-card-interactive flex flex-col justify-between group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-between">
                  <span>Reference Audit</span>
                  <span className="text-neutral-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">Crossref verification</p>
              </div>
            </Link>

            <Link
              href="/tools/prisma"
              className="p-4 rounded-2xl liquid-glass-card-interactive flex flex-col justify-between group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 flex items-center justify-center mb-3">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 flex items-center justify-between">
                  <span>PRISMA 2020</span>
                  <span className="text-neutral-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">Flow diagrams &amp; SVG</p>
              </div>
            </Link>

            <Link
              href="/tools/journal-fit"
              className="p-4 rounded-2xl liquid-glass-card-interactive flex flex-col justify-between group"
            >
              <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20 flex items-center justify-center mb-3">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 group-hover:text-red-600 dark:group-hover:text-red-400 flex items-center justify-between">
                  <span>Journal Fit</span>
                  <span className="text-neutral-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">Match 20+ venues</p>
              </div>
            </Link>

            <Link
              href="/tools/citation-claim"
              className="p-4 rounded-2xl liquid-glass-card-interactive flex flex-col justify-between group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex items-center justify-between">
                  <span>Citation Claim</span>
                  <span className="text-neutral-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">Audit claim accuracy</p>
              </div>
            </Link>

            <Link
              href="/tools/cover-letter"
              className="p-4 rounded-2xl liquid-glass-card-interactive flex flex-col justify-between group col-span-2 sm:col-span-1"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 flex items-center justify-center mb-3">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 flex items-center justify-between">
                  <span>Cover Letter</span>
                  <span className="text-neutral-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">Editor-grade letters</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. SCHOLARLY STANDARDS & VERIFIABLE INTEGRITY                 */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 px-4 sm:px-6 bg-transparent border-t border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl sm:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight mb-4">
              Built for verifiable publishing standards.
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
              Designed around empirical integrity checks, real-time registry lookups, and standardized editorial guidelines to catch fatal rejection hazards before journal submission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Standard Card 1: CrossRef Registry */}
            <div className="rounded-3xl liquid-glass-card p-7 flex flex-col justify-between transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-lg mb-5 shadow-xs">
                  🔍
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2">CrossRef Registry Verification</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Directly resolves cited DOIs against CrossRef APIs to flag unresolvable citations, dead URLs, and hallucinated reference titles that trigger immediate editorial red flags.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                <span className="font-semibold text-neutral-900 dark:text-neutral-200">Deterministic Audit</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">api.crossref.org</span>
              </div>
            </div>

            {/* Standard Card 2: Retraction Watch */}
            <div className="rounded-3xl liquid-glass-card p-7 flex flex-col justify-between transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-lg mb-5 shadow-xs">
                  ⚠️
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2">Retraction Screening</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Screens bibliography DOIs against retraction registries and publisher notices. Automatically detects whether your foundational literature has been retracted or corrected.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                <span className="font-semibold text-neutral-900 dark:text-neutral-200">Integrity Shield</span>
                <span className="font-mono text-rose-600 dark:text-rose-400">Zero Retraction Policy</span>
              </div>
            </div>

            {/* Standard Card 3: EQUATOR & PRISMA */}
            <div className="rounded-3xl liquid-glass-card p-7 flex flex-col justify-between transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-lg mb-5 shadow-xs">
                  📋
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2">Reporting Guideline Compliance</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Calibrated against EQUATOR Network checklists (PRISMA 2020, CONSORT, STROBE) to ensure sample size power justifications, randomization, and blinding statements are complete.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                <span className="font-semibold text-neutral-900 dark:text-neutral-200">EQUATOR Guidelines</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">Checklist Auditing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. GET STARTED TODAY CTA SECTION                              */}
      {/* ------------------------------------------------------------- */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 border-t border-black/5 dark:border-white/10 text-center relative overflow-hidden aura-bg-gradient">
        <div className="mx-auto max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300 text-xs font-medium mb-5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span>Open Source Scientific Integrity</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight mb-4 font-serif">
            Empower your next submission.
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8 max-w-lg mx-auto leading-relaxed">
            Diagnose methodological vulnerabilities, verify cited DOIs in real time, and simulate 4 expert peer reviews before journal editors do.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/scan"
              className="px-6 py-2.5 rounded-xl liquid-glass-btn-primary text-white font-semibold text-sm shadow-xs transition active:scale-[0.98]"
            >
              Try ManuView free
            </Link>

            <Link
              href="/examples"
              className="px-5 py-2.5 rounded-xl liquid-glass-btn-secondary text-neutral-700 dark:text-neutral-200 font-medium text-sm transition"
            >
              Explore sample preprints
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
