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
    <div className="min-h-screen bg-white text-[#111111] py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="text-4xl mb-3 select-none">📚</div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#f0f7ff] text-[#0075eb] border border-[#d0e5ff] mb-3">
            <BookOpen className="w-3.5 h-3.5 text-[#0075eb]" />
            <span>Transparent Peer-Review Benchmarks</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111] mb-2 font-serif">
            Example Reviews on Real Public Preprints
          </h1>
          <p className="text-[#666666] text-xs sm:text-sm leading-relaxed">
            Inspect how the reviewer-calibrated diagnostic evaluates real arXiv, bioRxiv, and medRxiv papers side-by-side with their eventual peer-review outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {examples.map((ex, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-[#fafafa] border border-[#eaeaea] flex flex-col justify-between hover:border-[#d0d0d0] hover:shadow-sm transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#e6f4ea] text-[#137333] border border-[#ceead6] uppercase tracking-wider">
                    {ex.field}
                  </span>
                  <span className="text-[11px] text-[#888888]">{ex.source}</span>
                </div>

                <h3 className="text-sm font-semibold text-[#111111] mb-2 leading-snug">
                  {ex.title}
                </h3>

                <p className="text-xs text-[#555555] leading-relaxed mb-4">
                  {ex.findings}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-[#eaeaea]">
                <div className="p-2.5 rounded-lg bg-white text-xs text-[#137333] border border-[#ceead6] flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1e8e3e] flex-shrink-0 mt-0.5" />
                  <span>{ex.matchedPeerReview}</span>
                </div>

                <Link
                  href="/scan"
                  className="inline-flex items-center gap-1.5 text-xs text-[#0075eb] hover:underline font-medium"
                >
                  <span>Test this paper in scanner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Notion-style Callout Footer */}
        <div className="text-center p-8 rounded-xl bg-[#fafafa] border border-[#eaeaea] max-w-xl mx-auto">
          <div className="text-2xl mb-2 select-none">📄</div>
          <h3 className="text-base font-bold text-[#111111] mb-1">
            Ready to scan your own draft?
          </h3>
          <p className="text-xs text-[#666666] mb-5">
            Upload your paper (.docx or text) to run the full 6-dimension diagnostic rubric and 4-persona simulation.
          </p>
          <Link
            href="/scan"
            className="px-4 py-2 rounded-lg bg-[#0075eb] hover:bg-[#0066cc] text-white font-medium text-xs shadow-sm transition inline-flex items-center gap-1.5"
          >
            Launch Free Pre-Submission Scan &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
