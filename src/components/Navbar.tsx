"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FileSearch, 
  Settings, 
  Sparkles, 
  ChevronDown, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  FileText,
  Sliders,
  ExternalLink,
  ChevronRight,
  Users,
  Zap,
  RefreshCw
} from "lucide-react";
import { ProviderSettingsModal } from "./ProviderSettingsModal";
import { useApiConnection } from "@/lib/useApiConnection";

export function Navbar() {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toolsDropdown, setToolsDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Live API Connection state (Feature Parity with Desktop)
  const {
    isConnected,
    isLoading: isApiLoading,
    modelName,
    latencyMs,
  } = useApiConnection();

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setToolsDropdown(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setToolsDropdown(false);
    }, 250);
  };

  const toggleDropdown = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setToolsDropdown((prev) => !prev);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setToolsDropdown(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setToolsDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {/* Top AI Announcement Strip */}
      <div className="bg-[#0D0F17] text-neutral-300 border-b border-white/10 py-1.5 px-4 text-center text-[11px] sm:text-xs font-medium flex items-center justify-center gap-1.5 transition">
        <Link href="/scan" className="inline-flex items-center gap-2 group">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/70 border border-emerald-500/30 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            v2.0
          </span>
          <span className="text-neutral-300 group-hover:text-white transition">
            Field-Adaptive 4-Persona Peer-Review Simulation &amp; Crossref Audit
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300 group-hover:translate-x-0.5 transition" />
        </Link>
      </div>

      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#08090D]/85 backdrop-blur-xl shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.05)]">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Left: Brand Emblem & Navigation */}
          <div className="flex items-center gap-7 text-sm">
            <Link 
              href="/" 
              className="flex items-center gap-2.5 px-1 py-1 rounded-lg hover:opacity-90 transition group"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-white to-neutral-200 text-black font-serif font-black text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),0_2px_8px_rgba(0,0,0,0.3)] ring-1 ring-white/30">
                M
              </div>
              <span className="font-semibold tracking-tight text-white text-base">
                ManuView
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-xs sm:text-sm font-medium text-neutral-300">
              <Link
                href="/scan"
                className="px-3 py-1.5 rounded-md hover:text-white hover:bg-white/[0.08] transition"
              >
                Pre-Submission Scan
              </Link>

              {/* Tools Dropdown */}
              <div 
                ref={dropdownRef} 
                className="relative" 
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={toggleDropdown}
                  aria-expanded={toolsDropdown}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                    toolsDropdown 
                      ? "text-white bg-white/[0.1]" 
                      : "hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  <span>Research Tools</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-150 ${toolsDropdown ? "rotate-180 text-white" : ""}`} />
                </button>

                {toolsDropdown && (
                  <div 
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="absolute top-full -left-6 sm:-left-12 pt-2 w-[92vw] max-w-[580px] sm:w-[580px] z-50 animate-fade-in"
                  >
                    <div className="rounded-2xl bg-[#0F121C]/95 backdrop-blur-2xl border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.7)] p-4 text-xs text-neutral-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Column 1: Diagnostic & Verification */}
                        <div className="space-y-1">
                        <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                          Auditing &amp; Verification
                        </div>

                        <Link
                          href="/tools/journal-fit"
                          onClick={() => setToolsDropdown(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition group"
                        >
                          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition flex-shrink-0 mt-0.5">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-100 text-xs">Journal Fit Predictor</div>
                            <div className="text-[11px] text-neutral-400 leading-normal mt-0.5">Match against 1,300+ venues</div>
                          </div>
                        </Link>

                        <Link
                          href="/tools/reference-checker"
                          onClick={() => setToolsDropdown(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition group"
                        >
                          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition flex-shrink-0 mt-0.5">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-100 text-xs">Reference Integrity Audit</div>
                            <div className="text-[11px] text-neutral-400 leading-normal mt-0.5">Crossref &amp; Retraction Watch check</div>
                          </div>
                        </Link>

                        <Link
                          href="/tools/citation-claim"
                          onClick={() => setToolsDropdown(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition group"
                        >
                          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition flex-shrink-0 mt-0.5">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-100 text-xs">Citation Claim Validator</div>
                            <div className="text-[11px] text-neutral-400 leading-normal mt-0.5">Audit if cited paper supports claim</div>
                          </div>
                        </Link>
                      </div>

                      {/* Column 2: Submission & Rebuttal */}
                      <div className="space-y-1">
                        <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                          Submission &amp; Rebuttal
                        </div>

                        <Link
                          href="/tools/prisma"
                          onClick={() => setToolsDropdown(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition group"
                        >
                          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition flex-shrink-0 mt-0.5">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-100 text-xs">PRISMA Flow Diagram</div>
                            <div className="text-[11px] text-neutral-400 leading-normal mt-0.5">Reconcile counts &amp; export SVG</div>
                          </div>
                        </Link>

                        <Link
                          href="/tools/cover-letter"
                          onClick={() => setToolsDropdown(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition group"
                        >
                          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 group-hover:bg-teal-500/20 transition flex-shrink-0 mt-0.5">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-100 text-xs">Journal Cover Letter</div>
                            <div className="text-[11px] text-neutral-400 leading-normal mt-0.5">Editor-calibrated formal letter</div>
                          </div>
                        </Link>

                        <Link
                          href="/tools/response-builder"
                          onClick={() => setToolsDropdown(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition group"
                        >
                          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 transition flex-shrink-0 mt-0.5">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-100 text-xs">Response to Reviewers</div>
                            <div className="text-[11px] text-neutral-400 leading-normal mt-0.5">Rebuttal matrix &amp; revision checklist</div>
                          </div>
                        </Link>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between px-2">
                      <span className="text-[11px] text-neutral-400">All tools 100% free • Client-side privacy</span>
                      <Link
                        href="/tools"
                        onClick={() => setToolsDropdown(false)}
                        className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs font-semibold transition"
                      >
                        <span>Explore all research tools</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

              <Link 
                href="/examples" 
                className="px-3 py-1.5 rounded-md hover:text-white hover:bg-white/[0.08] transition"
              >
                Examples
              </Link>
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Live AI Engine Status & Latency Badge (Feature Parity with Desktop) */}
            {isApiLoading ? (
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition shadow-xs cursor-pointer"
                title="Checking AI connection status..."
              >
                <RefreshCw className="w-3 h-3 animate-spin text-neutral-400" />
                <span className="hidden sm:inline text-[11px]">Connecting...</span>
              </button>
            ) : !isConnected ? (
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-medium transition shadow-xs cursor-pointer"
                title="No AI connection active. Click to configure API keys or local Ollama."
              >
                <span className="inline-block w-2 h-2 rounded-full bg-rose-500" />
                <span className="font-semibold text-[11px] sm:text-xs">Not Connected</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-xs font-medium transition shadow-xs cursor-pointer"
                title="AI Engine Active. Click to configure models & providers."
              >
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold truncate max-w-[120px] sm:max-w-[170px] text-[11px] sm:text-xs">
                  {modelName || "AI Connected"}
                </span>
                {latencyMs !== undefined && latencyMs !== null && (
                  <span className="text-emerald-400/80 font-mono text-[11px] hidden sm:flex items-center">
                    ( <Zap className="w-2.5 h-2.5 text-amber-400 fill-amber-400 inline mr-0.5" />
                    {latencyMs}ms )
                  </span>
                )}
              </button>
            )}

            {/* AI Settings Cog */}
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
              title="Configure API Keys & Models"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {/* GitHub Star */}
            <a
              href="https://github.com/khatiwada-bishal/manuview"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.08] transition"
              title="Star on GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            {/* High-Contrast Action Button */}
            <Link
              href="/scan"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-xs sm:text-sm font-semibold text-black shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),0_2px_10px_rgba(0,0,0,0.3)] transition active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Get ManuView free</span>
            </Link>
          </div>
        </div>
      </header>

      <ProviderSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
