import React from "react";
import Link from "next/link";
import { Heart, ShieldCheck, FileSearch } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <FileSearch className="w-5 h-5 text-emerald-400" />
              ManuView
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              An open-source pre-submission scientific peer-review diagnostic suite. Built to eliminate commercial paywalls on academic feedback.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero data retention &bull; Privacy by default</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Flagship Diagnostic</h4>
            <ul className="space-y-2">
              <li><Link href="/scan" className="hover:text-white transition">Pre-Submission Scan</Link></li>
              <li><Link href="/examples" className="hover:text-white transition">6 Real Preprint Examples</Link></li>
              <li><Link href="/scan#rubric" className="hover:text-white transition">The 6 Scoring Dimensions</Link></li>
              <li><Link href="/scan#personas" className="hover:text-white transition">4-Persona Reviewer Simulation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Free Research Tools</h4>
            <ul className="space-y-2">
              <li><Link href="/tools/journal-fit" className="hover:text-white transition">Journal Fit Predictor</Link></li>
              <li><Link href="/tools/reference-checker" className="hover:text-white transition">Reference & Retraction Checker</Link></li>
              <li><Link href="/tools/citation-claim" className="hover:text-white transition">Citation Claim Validator</Link></li>
              <li><Link href="/tools/prisma" className="hover:text-white transition">PRISMA Flow Generator</Link></li>
              <li><Link href="/tools/cover-letter" className="hover:text-white transition">Cover Letter Generator</Link></li>
              <li><Link href="/tools/response-builder" className="hover:text-white transition">Rebuttal Response Workspace</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Open Science</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/khatiwada-bishal/manuview"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/khatiwada-bishal/manuview/blob/main/LICENSE"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition"
                >
                  MIT License
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/khatiwada-bishal/manuview/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition"
                >
                  Contribute Rubrics
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            &copy; 2026 ManuView. Dedicated to free and open scientific inquiry worldwide.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            Created with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for the global research community.
          </div>
        </div>
      </div>
    </footer>
  );
}
