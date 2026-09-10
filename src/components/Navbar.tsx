"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  ChevronRight
} from "lucide-react";
import { ProviderSettingsModal } from "./ProviderSettingsModal";

export function Navbar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toolsDropdown, setToolsDropdown] = useState(false);

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
              <div className="relative" onMouseLeave={() => setToolsDropdown(false)}>
                <button
                  onClick={() => setToolsDropdown(!toolsDropdown)}
                  onMouseEnter={() => setToolsDropdown(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md hover:text-white hover:bg-white/[0.08] transition"
                >
                  <span>Research Tools</span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {toolsDropdown && (
                  <div className="absolute top-full -left-2 w-76 rounded-2xl bg-[#11141D]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-2 z-50 text-xs animate-fade-in text-neutral-200">
                    <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                      Diagnostic Modules
                    </div>
                    <Link
                      href="/tools/journal-fit"
                      className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-neutral-100">Journal Fit Predictor</div>
                        <div className="text-[11px] text-neutral-400">Match manuscript against 1,300+ venues</div>
                      </div>
                    </Link>

                    <Link
                      href="/tools/reference-checker"
                      className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-neutral-100">Reference Integrity Audit</div>
                        <div className="text-[11px] text-neutral-400">Crossref &amp; Retraction Watch verification</div>
                      </div>
                    </Link>

                    <Link
                      href="/tools/citation-claim"
                      className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-neutral-100">Citation Claim Validator</div>
                        <div className="text-[11px] text-neutral-400">Audit if cited study supports statement</div>
                      </div>
                    </Link>

                    <Link
                      href="/tools/prisma"
                      className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition"
                    >
                      <Layers className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-neutral-100">PRISMA Flow Diagram</div>
                        <div className="text-[11px] text-neutral-400">Reconcile screening counts &amp; export SVG</div>
                      </div>
                    </Link>

                    <div className="my-1.5 border-t border-white/10" />

                    <Link
                      href="/tools"
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/10 text-blue-400 hover:text-blue-300 text-xs font-semibold transition"
                    >
                      <span>View all 8 tools</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
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
          <div className="flex items-center gap-3">
            {/* AI Engine Telemetry Pill */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs font-medium text-neutral-300 hover:text-white transition shadow-sm"
              title="Configure API Keys & Diagnostics"
            >
              <Settings className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline">AI Settings</span>
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
