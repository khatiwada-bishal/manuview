"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShieldCheck, FileSearch } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-black/5 dark:border-white/10 bg-white/60 dark:bg-[#0A0B0E]/80 backdrop-blur-xl text-neutral-600 dark:text-neutral-400 text-xs py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mb-12">
          {/* Logo & Identity */}
          <div className="col-span-2 sm:col-span-3 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-200 font-semibold text-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-black dark:bg-white text-white dark:text-black font-serif font-bold text-xs shadow-xs">
                M
              </div>
              <span className="tracking-tight text-base font-semibold">ManuView</span>
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-xs">
              Open-source pre-submission scientific peer-review diagnostics. Free and open to every researcher worldwide.
            </p>
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-[11px] pt-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-retention &bull; Privacy by default</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-200 mb-3 text-xs">
              Product
            </h4>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li><Link href="/scan" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition">Pre-Submission Scan</Link></li>
              <li><Link href="/examples" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition">Sample Preprints</Link></li>
              <li><Link href="/scan" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition">The 6 Scoring Rubrics</Link></li>
              <li><Link href="/scan" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition">4-Persona Peer Review</Link></li>
              <li><Link href="/tools/journal-fit" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition">Journal Fit Predictor</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-200 mb-3 text-xs">
              Research Tools
            </h4>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li><Link href="/tools/reference-checker" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition">Reference &amp; Retraction Audit</Link></li>
              <li><Link href="/tools/citation-claim" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition">Citation Claim Validator</Link></li>
              <li><Link href="/tools/prisma" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition">PRISMA 2020 Flow Generator</Link></li>
              <li><Link href="/tools/cover-letter" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition">Cover Letter Generator</Link></li>
              <li><Link href="/tools/response-builder" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition">Rebuttal Response Matrix</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-200 mb-3 text-xs">
              Resources
            </h4>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li><Link href="/examples" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition">Preprint Case Studies</Link></li>
              <li><Link href="/tools" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition">Tool Documentation</Link></li>
              <li><Link href="/scan" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition">Local Ollama Guide</Link></li>
              <li><Link href="/scan" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition">Desk-Rejection Hazards</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-200 mb-3 text-xs">
              Open Science
            </h4>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li>
                <a
                  href="https://github.com/khatiwada-bishal/manuview"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-neutral-900 dark:hover:text-neutral-200 transition flex items-center gap-1.5"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/khatiwada-bishal/manuview/blob/main/LICENSE"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-neutral-900 dark:hover:text-neutral-200 transition"
                >
                  MIT License
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/khatiwada-bishal/manuview/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-neutral-900 dark:hover:text-neutral-200 transition"
                >
                  Contribute Rubrics
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-500 dark:text-neutral-400 text-[11px]">
          <div className="flex flex-wrap items-center gap-4">
            <span>&copy; 2026 ManuView. Dedicated to open scientific inquiry.</span>
            <span className="hover:text-neutral-900 dark:hover:text-neutral-200 cursor-pointer transition">Zero Data Retention</span>
            <span className="hover:text-neutral-900 dark:hover:text-neutral-200 cursor-pointer transition">MIT Open Source</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
              <span>for science</span>
            </div>
            <span className="px-2 py-0.5 rounded border border-black/10 dark:border-white/10 bg-black/[0.04] dark:bg-white/[0.05] text-neutral-700 dark:text-neutral-300 font-medium text-[10px]">
              🌐 English (US)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
