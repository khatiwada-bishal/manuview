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
      {/* Top Notion Announcement Banner */}
      <div className="bg-[#12151B] text-neutral-300 border-b border-white/10 hover:bg-[#181D26] py-1.5 px-4 text-center text-[11px] sm:text-xs font-medium flex items-center justify-center gap-1 hover:bg-[#f0f0ee] transition cursor-pointer">
        <Link href="/scan" className="inline-flex items-center gap-1.5">
          <span className="font-semibold">✨ Introducing ManuView 2.0:</span>
          <span className="text-neutral-400">Field-Adaptive 4-Persona Peer-Review Simulation</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#888888]" />
        </Link>
      </div>

      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0A0B0E]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Left: Notion Logo & Navigation */}
          <div className="flex items-center gap-6 text-sm">
            <Link 
              href="/" 
              className="flex items-center gap-2.5 px-1 py-1 rounded-md hover:opacity-85 transition group"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded bg-white text-black font-serif font-bold text-xs shadow-xs">
                M
              </div>
              <span className="font-semibold tracking-tight text-white text-sm sm:text-base">
                ManuView
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-xs sm:text-sm font-medium text-neutral-300">
              <Link
                href="/scan"
                className="px-2.5 py-1.5 rounded-md hover:text-white hover:bg-white/10 transition"
              >
                Pre-Submission Scan
              </Link>

              {/* Tools Dropdown */}
              <div className="relative" onMouseLeave={() => setToolsDropdown(false)}>
                <button
                  onClick={() => setToolsDropdown(!toolsDropdown)}
                  onMouseEnter={() => setToolsDropdown(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:text-white hover:bg-white/10 transition"
                >
                  <span>Research Tools</span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {toolsDropdown && (
                  <div className="absolute top-full -left-2 w-72 rounded-xl bg-[#12151B] border border-white/15 shadow-2xl p-2 z-50 text-xs animate-fade-in text-neutral-200">
                    <div className="px-2 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                      Research Modules
                    </div>
                    <Link
                      href="/tools/journal-fit"
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
                    >
                      <BookOpen className="w-4 h-4 text-[#0075eb] mt-0.5" />
                      <div>
                        <div className="font-medium text-neutral-100">Journal Fit Predictor</div>
                        <div className="text-[11px] text-neutral-400">Match manuscript against 1,300+ venues</div>
                      </div>
                    </Link>

                    <Link
                      href="/tools/reference-checker"
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#0075eb] mt-0.5" />
                      <div>
                        <div className="font-medium text-neutral-100">Reference Integrity Audit</div>
                        <div className="text-[11px] text-neutral-400">Crossref &amp; Retraction Watch verification</div>
                      </div>
                    </Link>

                    <Link
                      href="/tools/citation-claim"
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
                    >
                      <Sparkles className="w-4 h-4 text-[#0075eb] mt-0.5" />
                      <div>
                        <div className="font-medium text-neutral-100">Citation Claim Validator</div>
                        <div className="text-[11px] text-neutral-400">Audit if cited study supports statement</div>
                      </div>
                    </Link>

                    <Link
                      href="/tools/prisma"
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
                    >
                      <Layers className="w-4 h-4 text-[#0075eb] mt-0.5" />
                      <div>
                        <div className="font-medium text-neutral-100">PRISMA Flow Diagram</div>
                        <div className="text-[11px] text-neutral-400">Reconcile screening counts &amp; export SVG</div>
                      </div>
                    </Link>

                    <div className="my-1 border-t border-white/10" />

                    <Link
                      href="/tools"
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f7f7f5] text-[#388BFD] text-xs font-semibold hover:text-white transition"
                    >
                      <span>View all 8 tools</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              <Link 
                href="/examples" 
                className="px-2.5 py-1.5 rounded-md hover:text-white hover:bg-white/10 transition"
              >
                Examples
              </Link>
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* AI Settings Button (Notion Ghost style) */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-[#f5f5f4] text-xs font-medium text-neutral-400 hover:text-neutral-100 transition"
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
              className="p-1.5 rounded-md text-[#666666] hover:text-white hover:bg-white/10 transition"
              title="Star on GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            {/* Notion-style Action Button (Iconic Blue Button from Screenshot) */}
            <Link
              href="/scan"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#0075eb] hover:bg-[#0066cc] text-xs sm:text-sm font-medium text-white shadow-xs transition active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5 text-white/90" />
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
