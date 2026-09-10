"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileSearch, Settings, Sparkles, ChevronDown, BookOpen, Layers, CheckCircle2 } from "lucide-react";
import { ProviderSettingsModal } from "./ProviderSettingsModal";

export function Navbar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toolsDropdown, setToolsDropdown] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                <FileSearch className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  ManuView
                  <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Open Source
                  </span>
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <Link href="/scan" className="hover:text-white transition">
                Pre-Submission Scan
              </Link>

              {/* Tools Dropdown */}
              <div className="relative" onMouseLeave={() => setToolsDropdown(false)}>
                <button
                  onClick={() => setToolsDropdown(!toolsDropdown)}
                  onMouseEnter={() => setToolsDropdown(true)}
                  className="flex items-center gap-1 hover:text-white transition py-2"
                >
                  Free Tools
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {toolsDropdown && (
                  <div className="absolute top-full -left-2 w-72 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 text-xs">
                    <Link
                      href="/tools/journal-fit"
                      className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-800/80 text-slate-200 hover:text-white transition"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-400 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-100">Journal Fit Predictor</div>
                        <div className="text-[11px] text-slate-400">Match title & abstract against 1,300+ venues</div>
                      </div>
                    </Link>

                    <Link
                      href="/tools/reference-checker"
                      className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-800/80 text-slate-200 hover:text-white transition"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-100">Reference & Retraction Checker</div>
                        <div className="text-[11px] text-slate-400">Query Crossref & Retraction Watch in real time</div>
                      </div>
                    </Link>

                    <Link
                      href="/tools/citation-claim"
                      className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-800/80 text-slate-200 hover:text-white transition"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-100">Citation Claim Validator</div>
                        <div className="text-[11px] text-slate-400">Verify if cited paper actually backs your sentence</div>
                      </div>
                    </Link>

                    <Link
                      href="/tools/prisma"
                      className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-800/80 text-slate-200 hover:text-white transition"
                    >
                      <Layers className="w-4 h-4 text-emerald-400 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-100">PRISMA Flow Diagram Generator</div>
                        <div className="text-[11px] text-slate-400">Reconcile screening counts & export SVG</div>
                      </div>
                    </Link>

                    <Link
                      href="/tools"
                      className="block p-2 text-center text-emerald-400 hover:underline font-medium border-t border-slate-800 mt-1"
                    >
                      View all 8 tools &rarr;
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/examples" className="hover:text-white transition">
                Example Reviews
              </Link>
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* AI Settings */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-600 transition"
              title="Configure Local Ollama or API Keys"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">AI Settings</span>
            </button>

            {/* GitHub Link */}
            <a
              href="https://github.com/khatiwada-bishal/manuview"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
              title="Star on GitHub"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            {/* CTA */}
            <Link
              href="/scan"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 active:scale-95 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Review Manuscript</span>
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
