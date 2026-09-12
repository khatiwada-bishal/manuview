import React from "react";
import Link from "next/link";
import { 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  FileText, 
  Users, 
  FileSearch, 
  ShieldCheck, 
  ArrowRight,
  Sliders
} from "lucide-react";

export default function ToolsIndexPage() {
  const tools = [
    {
      id: "journal-fit",
      title: "Journal Fit Predictor",
      badge: "Corpus of 1,300+ Venues",
      description: "Paste your title and abstract to match against high-impact journals, ranking Reach, Realistic, and Fallback venues with acceptance hazard notes.",
      href: "/tools/journal-fit",
      icon: BookOpen,
      color: "emerald",
      runtime: "~3 seconds",
    },
    {
      id: "reference-checker",
      title: "Reference & Retraction Checker",
      badge: "Live Crossref + Retraction Watch",
      description: "Paste your bibliography to check DOIs in real time. Flag unresolvable AI hallucinations, retracted papers, and format inconsistencies.",
      href: "/tools/reference-checker",
      icon: CheckCircle2,
      color: "blue",
      runtime: "~5-8 seconds",
    },
    {
      id: "citation-claim",
      title: "Citation Claim Validator",
      badge: "OpenAlex NLI Engine",
      description: "Confirm whether a cited paper's abstract actually supports the specific sentence you attached to it. Provides suggested evidence-aligned rewrites.",
      href: "/tools/citation-claim",
      icon: Sparkles,
      color: "amber",
      runtime: "~6 seconds",
    },
    {
      id: "prisma",
      title: "PRISMA 2020 Flow Diagram Generator",
      badge: "Instant In-Browser SVG",
      description: "Reconcile systematic review identification, screening, eligibility, and inclusion counts. Catches arithmetic discrepancies and exports publication-ready SVG.",
      href: "/tools/prisma",
      icon: Layers,
      color: "purple",
      runtime: "Instant (Client-side)",
    },
    {
      id: "cover-letter",
      title: "Journal Cover Letter Generator",
      badge: "Editor-Calibrated",
      description: "Generate an editor-ready formal submission cover letter highlighting scientific novelty, journal readership fit, and non-preferred reviewers.",
      href: "/tools/cover-letter",
      icon: FileText,
      color: "teal",
      runtime: "~5 seconds",
    },
    {
      id: "response-builder",
      title: "Response to Reviewers Workspace",
      badge: "Rebuttal Matrix",
      description: "Turn an unstructured decision letter into an itemized point-by-point rebuttal table, revision checklist, and polite draft responses.",
      href: "/tools/response-builder",
      icon: Users,
      color: "rose",
      runtime: "~10 seconds",
    },
  ];

  return (
    <div className="min-h-screen text-neutral-900 dark:text-white py-14 aura-bg-gradient aura-grid-pattern">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="text-4xl mb-3 select-none">🧰</div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-black/[0.04] dark:bg-white/[0.06] text-neutral-700 dark:text-neutral-300 border border-black/10 dark:border-white/10 mb-3 shadow-2xs">
            <Sliders className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span>100% Free Research Utilities</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white tracking-tight mb-3 font-serif">
            Single-Purpose Submission Tools
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed">
            Modular utilities for choosing a journal, checking evidence, assembling submission packages, and answering peer review. No sign-up required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.id}
                href={t.href}
                className="group flex flex-col justify-between p-6 rounded-3xl liquid-glass-card-interactive transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-black/[0.03] dark:bg-white/[0.05] text-neutral-600 dark:text-neutral-400 border border-black/5 dark:border-white/10 font-medium">
                      {t.runtime}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 block mb-1">
                    {t.badge}
                  </span>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {t.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                    {t.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform pt-3 border-t border-black/5 dark:border-white/10">
                  <span>Open tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Banner to Full Scan in Liquid Glass style */}
        <div className="p-6 sm:p-7 rounded-3xl liquid-glass-card flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <span className="text-3xl select-none">📄</span>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
                Need a comprehensive pre-submission diagnostic?
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                The Pre-Submission Scan evaluates claims, statistics, controls, and 5 reviewer personas in one pass.
              </p>
            </div>
          </div>
          <Link
            href="/scan"
            className="flex-shrink-0 px-5 py-2.5 rounded-xl liquid-glass-btn-primary text-white font-semibold text-xs shadow-xs transition active:scale-[0.98]"
          >
            Run Pre-Submission Scan &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
