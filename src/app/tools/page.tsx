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
    <div className="min-h-screen bg-[#090d16] text-slate-100 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-3">
            <Sliders className="w-3.5 h-3.5" />
            100% Free Research Utilities
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
            Single-Purpose Submission Tools
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Modular tools for choosing a journal, checking evidence, assembling submission packages, and answering peer review. No sign-up required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.id}
                href={t.href}
                className="group flex flex-col justify-between p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90 transition shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-800 border border-slate-700/80 text-emerald-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {t.runtime}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-400 block mb-1">
                    {t.badge}
                  </span>
                  <h3 className="text-lg font-serif font-semibold text-white mb-2 group-hover:text-emerald-300 transition">
                    {t.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6 font-light">
                    {t.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Open tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Banner to Full Scan */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-serif font-bold text-white mb-1">
              Need a full manuscript diagnostic that runs all of the above?
            </h3>
            <p className="text-xs text-slate-400 font-light">
              The Pre-Submission Scan evaluates claims, statistics, controls, and 4 reviewer personas in one comprehensive pass.
            </p>
          </div>
          <Link
            href="/scan"
            className="flex-shrink-0 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition"
          >
            Run Pre-Submission Scan &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
