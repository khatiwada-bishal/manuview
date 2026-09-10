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
      <header className="sticky top-0 z-40 w-full border-b border-[#2e2e2e] bg-[#191919]/90 backdrop-blur-md">
        <div className="mx-auto flex h-13 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Left: Notion Breadcrumbs */}
          <div className="flex items-center gap-3 text-sm">
            <Link 
              href="/" 
              className="flex items-center gap-2 px-2 py-1 -ml-2 rounded-md hover:bg-[#252525] text-[#e6e6e6] transition group"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded bg-[#252525] border border-[#333333] text-emerald-400 group-hover:border-emerald-500/40 transition">
                <FileSearch className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium tracking-tight text-[#e6e6e6] text-xs sm:text-sm">
                ManuView
              </span>
            </Link>

            <span className="text-[#4a4a4a] select-none text-xs">/</span>

            <nav className="flex items-center gap-1 text-xs">
              <Link
                href="/scan"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[#9b9a97] hover:text-[#e6e6e6] hover:bg-[#252525] transition"
              >
                <span>📄</span>
                <span className="hidden sm:inline">Pre-Submission Scan</span>
                <span className="sm:hidden">Scan</span>
              </Link>

              {/* Tools Dropdown */}
              <div className="relative" onMouseLeave={() => setToolsDropdown(false)}>
                <button
                  onClick={() => setToolsDropdown(!toolsDropdown)}
                  onMouseEnter={() => setToolsDropdown(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[#9b9a97] hover:text-[#e6e6e6] hover:bg-[#252525] transition"
                >
                  <span>Tools</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#6b6a67]" />
                </button>

                {toolsDropdown && (
                  <div className="absolute top-full -left-2 w-72 rounded-lg bg-[#202020] border border-[#2e2e2e] shadow-2xl p-1.5 z-50 text-xs">
                    <div className="px-2 py-1 text-[10px] font-semibold text-[#6b6a67] uppercase tracking-wider">
                      Research Modules
                    </div>
                    <Link
                      href="/tools/journal-fit"
                      className="flex items-start gap-2.5 p-2 rounded-md hover:bg-[#2a2a2a] text-[#cccccc] hover:text-white transition"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-400 mt-0.5" />
                      <div>
                        <div className="font-medium text-[#e6e6e6]">Journal Fit Predictor</div>
                        <div className="text-[11px] text-[#8a8a86]">Match manuscript against 1,300+ venues</div>
                      </div>
                    </Link>

                    <Link
                      href="/tools/reference-checker"
                      className="flex items-start gap-2.5 p-2 rounded-md hover:bg-[#2a2a2a] text-[#cccccc] hover:text-white transition"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                      <div>
                        <div className="font-medium text-[#e6e6e6]">Reference Integrity Audit</div>
                        <div className="text-[11px] text-[#8a8a86]">Crossref &amp; Retraction Watch verification</div>
                      </div>
                    </Link>

                    <Link
                      href="/tools/citation-claim"
                      className="flex items-start gap-2.5 p-2 rounded-md hover:bg-[#2a2a2a] text-[#cccccc] hover:text-white transition"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5" />
                      <div>
                        <div className="font-medium text-[#e6e6e6]">Citation Claim Validator</div>
                        <div className="text-[11px] text-[#8a8a86]">Audit if cited study supports statement</div>
                      </div>
                    </Link>

                    <Link
                      href="/tools/prisma"
                      className="flex items-start gap-2.5 p-2 rounded-md hover:bg-[#2a2a2a] text-[#cccccc] hover:text-white transition"
                    >
                      <Layers className="w-4 h-4 text-emerald-400 mt-0.5" />
                      <div>
                        <div className="font-medium text-[#e6e6e6]">PRISMA Flow Diagram</div>
                        <div className="text-[11px] text-[#8a8a86]">Reconcile screening counts &amp; export SVG</div>
                      </div>
                    </Link>

                    <div className="my-1 border-t border-[#2e2e2e]" />

                    <Link
                      href="/tools"
                      className="flex items-center justify-between p-2 rounded-md hover:bg-[#2a2a2a] text-emerald-400 text-xs font-medium transition"
                    >
                      <span>View all 8 tools</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              <Link 
                href="/examples" 
                className="hidden md:inline-flex items-center px-2.5 py-1 rounded-md text-[#9b9a97] hover:text-[#e6e6e6] hover:bg-[#252525] transition"
              >
                Examples
              </Link>
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* AI Settings Button (Notion Ghost style) */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#222222] hover:bg-[#2a2a2a] border border-[#333333] text-xs font-normal text-[#9b9a97] hover:text-[#e6e6e6] transition"
              title="Configure Local Ollama or API Keys"
            >
              <Settings className="w-3.5 h-3.5 text-[#9b9a97]" />
              <span className="hidden sm:inline">AI Settings</span>
            </button>

            {/* GitHub Star */}
            <a
              href="https://github.com/khatiwada-bishal/manuview"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md text-[#8a8a86] hover:text-[#e6e6e6] hover:bg-[#252525] transition"
              title="Star on GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            {/* Notion-style Action Button */}
            <Link
              href="/scan"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#252525] hover:bg-[#2e2e2e] border border-[#383838] hover:border-[#484848] text-xs font-medium text-[#e6e6e6] transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
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
