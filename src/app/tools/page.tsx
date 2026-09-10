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
    <div className="min-h-screen bg-[#191919] text-[#e6e6e6] py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="text-4xl mb-3 select-none">🧰</div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-normal bg-[#222222] text-[#9b9a97] border border-[#333333] mb-3">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Free Research Utilities</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-2">
            Single-Purpose Submission Tools
          </h1>
          <p className="text-[#9b9a97] text-xs sm:text-sm leading-relaxed font-light">
            Modular utilities for choosing a journal, checking evidence, assembling submission packages, and answering peer review. No sign-up required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.id}
                href={t.href}
                className="group flex flex-col justify-between p-4 rounded-lg bg-[#202020] border border-[#2e2e2e] hover:border-[#383838] hover:bg-[#232323] transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded bg-[#252525] border border-[#333333] text-emerald-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#282828] text-[#8a8a86] border border-[#333333]">
                      {t.runtime}
                    </span>
                  </div>

                  <span className="text-[11px] font-medium text-emerald-400 block mb-0.5">
                    {t.badge}
                  </span>
                  <h3 className="text-sm font-semibold text-white mb-1.5 group-hover:text-emerald-300 transition">
                    {t.title}
                  </h3>
                  <p className="text-xs text-[#9b9a97] leading-relaxed mb-4 font-light">
                    {t.description}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs font-medium text-[#4dab83] group-hover:translate-x-0.5 transition-transform">
                  <span>Open tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Banner to Full Scan in Notion Callout style */}
        <div className="p-5 rounded-lg bg-[#202020] border border-[#2e2e2e] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-xl select-none">📄</span>
            <div>
              <h3 className="text-sm font-semibold text-white mb-0.5">
                Need a comprehensive pre-submission diagnostic?
              </h3>
              <p className="text-xs text-[#9b9a97] font-light">
                The Pre-Submission Scan evaluates claims, statistics, controls, and 4 reviewer personas in one pass.
              </p>
            </div>
          </div>
          <Link
            href="/scan"
            className="flex-shrink-0 px-3.5 py-2 rounded bg-[#252525] hover:bg-[#2f2f2f] text-white text-xs font-medium border border-[#3e3e3e] transition"
          >
            Run Pre-Submission Scan &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
