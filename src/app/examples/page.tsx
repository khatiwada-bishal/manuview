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
    <div className="min-h-screen bg-[#090d16] text-slate-100 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            Transparent Peer-Review Benchmarks
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
            Example Reviews on Real Public Preprints
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Inspect how the reviewer-calibrated diagnostic evaluates real arXiv, bioRxiv, and medRxiv papers side-by-side with their eventual peer-review outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {examples.map((ex, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase tracking-wider">
                    {ex.field}
                  </span>
                  <span className="text-[11px] text-slate-500">{ex.source}</span>
                </div>

                <h3 className="text-base font-serif font-bold text-white mb-3 leading-snug">
                  {ex.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-4 font-light">
                  {ex.findings}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="p-3 rounded-xl bg-slate-950 text-xs text-emerald-300/90 border border-slate-800/80 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{ex.matchedPeerReview}</span>
                </div>

                <Link
                  href="/scan"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  <span>Test this paper in scanner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center p-8 rounded-2xl bg-slate-900/30 border border-slate-800 max-w-2xl mx-auto">
          <h3 className="text-lg font-serif font-semibold text-white mb-2">
            Ready to scan your own paper?
          </h3>
          <p className="text-xs text-slate-400 mb-6 font-light">
            Upload your draft (.docx or text) to run the full 6-dimension diagnostic rubric and 4-persona simulation.
          </p>
          <Link
            href="/scan"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg transition"
          >
            Launch Free Pre-Submission Scan &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
