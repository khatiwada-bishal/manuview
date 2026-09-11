import React from "react";
import Link from "next/link";
import { BookOpen, FileCheck, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";

export default function ExamplesPage() {
  const examples = [
    {
      field: "Biomedical Science",
      title: "Transcriptional regulation of DLL3 and neuroendocrine lineage identity in small cell lung cancer",
      source: "bioRxiv Preprint / Target: Nature Communications",
      findings: "Marker-based CRISPR screens nominate POU2F1 as an activator of DLL3. Discovery is promising, but headline cis-regulatory code claim is correlative, AlphaFold analysis is asked to carry mechanistic weight it cannot, and ChIP-seq peak calling skipped negative controls.",
      matchedPeerReview: "5 of 5 reviewer concerns matched in public Nature Communications transparent review file.",
      link: "/scan"
    },
    {
      field: "Clinical Medicine",
      title: "A multistrain probiotic for tau biomarkers and cognition in early cognitive impairment: a double-blind randomized controlled trial",
      source: "medRxiv Preprint / Target: The Lancet Neurology",
      findings: "Trial reported as confirmatory without pre-registration, prespecified primary endpoint, or multiplicity control. Several tables are internally impossible (total mean cannot be produced by its own group means), and title claim runs well past single plasma marker.",
      matchedPeerReview: "Flagged CONSORT desk-reject items before submission.",
      link: "/scan"
    },
    {
      field: "Machine Learning & AI",
      title: "Variance-controlled off-policy reinforcement learning for stable asynchronous LLM training",
      source: "arXiv Preprint / Target: NeurIPS / IEEE TPAMI",
      findings: "Addresses asynchronous RL training collapse, but implemented gradient estimator is under-specified, minimum-variance baseline is derived for the wrong importance weights, and 2.5x speedup claim rests on single training run without error bars.",
      matchedPeerReview: "Directly matched NeurIPS Reviewer 2 & 4 technical pushback.",
      link: "/scan"
    },
    {
      field: "Epidemiology",
      title: "Accounting for contact network uncertainty in epidemic inferences",
      source: "medRxiv / Target: Science Translational Medicine",
      findings: "Bayesian framework for contact network reconstruction. Heavy reliance on synthetic network topologies without sensitivity analysis for missing edges in high-density urban settings.",
      matchedPeerReview: "Surfaced missing empirical network validation requested in Round 1.",
      link: "/scan"
    }
  ];

  return (
    <div className="min-h-screen text-neutral-900 dark:text-white py-14 aura-bg-gradient aura-grid-pattern">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="text-4xl mb-3 select-none">📚</div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-black/[0.04] dark:bg-white/[0.06] text-neutral-700 dark:text-neutral-300 border border-black/10 dark:border-white/10 mb-3 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Transparent Peer-Review Benchmarks</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3 font-serif">
            Example Reviews on Real Public Preprints
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed">
            Inspect how the reviewer-calibrated diagnostic evaluates real arXiv, bioRxiv, and medRxiv papers side-by-side with their eventual peer-review outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          {examples.map((ex, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl liquid-glass-card-interactive flex flex-col justify-between transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 uppercase tracking-wider">
                    {ex.field}
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">{ex.source}</span>
                </div>

                <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2 leading-snug">
                  {ex.title}
                </h3>

                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                  {ex.findings}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-black/5 dark:border-white/10">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-xs text-emerald-900 dark:text-emerald-300 border border-emerald-500/20 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{ex.matchedPeerReview}</span>
                </div>

                <Link
                  href="/scan"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  <span>Test this paper in scanner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Frosted Glass Callout Footer */}
        <div className="text-center p-8 rounded-3xl liquid-glass-card max-w-xl mx-auto">
          <div className="text-3xl mb-3 select-none">📄</div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
            Ready to scan your own draft?
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
            Upload your paper (.docx, .pdf, or text) to run the full 6-dimension diagnostic rubric and 4-persona simulation.
          </p>
          <Link
            href="/scan"
            className="px-5 py-2.5 rounded-xl liquid-glass-btn-primary text-white font-semibold text-xs shadow-xs transition inline-flex items-center gap-2 active:scale-[0.98]"
          >
            <span>Launch Free Pre-Submission Scan</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
