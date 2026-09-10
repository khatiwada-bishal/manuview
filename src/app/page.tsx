import React from "react";
import Link from "next/link";
import { 
  FileSearch, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Scale, 
  Search, 
  BarChart3, 
  BookOpen, 
  Layers 
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-[#090d16]">
        {/* Glow accents */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Mission Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-8 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              100% Free &amp; Open Source &bull; Education &amp; Science Belong to Everyone
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold font-serif tracking-tight text-white mb-6 leading-[1.12]">
              Catch what reviewers will, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                before you submit.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto font-light">
              Stop paying commercial services $39 to $1,800 to review your manuscript. ManuView applies a reviewer-calibrated peer-review rubric to surface desk-rejection hazards, causal overclaims, and citation bugs—for free.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/scan"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base shadow-xl shadow-emerald-600/25 active:scale-95 transition"
              >
                <Sparkles className="w-5 h-5" />
                <span>Run Free Manuscript Scan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/tools"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-medium text-base hover:text-white transition"
              >
                Explore 8 Research Tools
              </Link>
            </div>

            {/* Quick stats / Highlights */}
            <div className="mt-14 grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-8 text-left max-w-xl mx-auto">
              <div>
                <div className="text-2xl font-bold text-white font-serif">6-Dim</div>
                <div className="text-xs text-slate-400">Peer-Review Rubric</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400 font-serif">100% Free</div>
                <div className="text-xs text-slate-400">Zero Paywalls Ever</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400 font-serif">Local AI</div>
                <div className="text-xs text-slate-400">Ollama Offline Privacy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy / Differentiation Table */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-2">
              Why We Built ManuView
            </h2>
            <p className="text-3xl font-serif font-bold text-white mb-4">
              Scientific critique is not grammar polishing.
            </p>
            <p className="text-slate-400 text-sm">
              Generic LLMs are flattering, and grammar checkers only see commas. Editors desk-reject on methodology and overclaims.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-2xl overflow-hidden border border-slate-800 text-left text-sm bg-slate-900/40">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="p-4 sm:p-5">Dimension</th>
                  <th className="p-4 sm:p-5">Grammar Tools (Paperpal, Grammarly)</th>
                  <th className="p-4 sm:p-5">Generic LLMs (ChatGPT, Claude)</th>
                  <th className="p-4 sm:p-5 text-emerald-300 bg-emerald-950/30">ManuView (Open Source)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Focus Level</td>
                  <td className="p-4 sm:p-5 text-slate-400">Sentence level (typos, passive voice)</td>
                  <td className="p-4 sm:p-5 text-slate-400">Conversational summaries &amp; rewriting</td>
                  <td className="p-4 sm:p-5 font-medium text-emerald-200 bg-emerald-950/20">Manuscript-level scientific &amp; structural critique</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Reviewer Posture</td>
                  <td className="p-4 sm:p-5 text-slate-400">Mechanical spelling correction</td>
                  <td className="p-4 sm:p-5 text-slate-400">Agreeable / flattering bias</td>
                  <td className="p-4 sm:p-5 font-medium text-emerald-200 bg-emerald-950/20">Calibrated top-journal editorial skepticism</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Critical Detection</td>
                  <td className="p-4 sm:p-5 text-slate-400">Grammar &amp; word choice</td>
                  <td className="p-4 sm:p-5 text-slate-400">Misses unsupported causal links</td>
                  <td className="p-4 sm:p-5 font-medium text-emerald-200 bg-emerald-950/20">Causal overclaims, missing controls, power gaps</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Citation Integrity</td>
                  <td className="p-4 sm:p-5 text-slate-400">Formatting style only</td>
                  <td className="p-4 sm:p-5 text-slate-400">Frequently hallucinates fake papers</td>
                  <td className="p-4 sm:p-5 font-medium text-emerald-200 bg-emerald-950/20">Real-time Crossref &amp; Retraction Watch verification</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Cost &amp; Access</td>
                  <td className="p-4 sm:p-5 text-slate-400">$20 - $30 / month</td>
                  <td className="p-4 sm:p-5 text-slate-400">$20 / month + cloud logging</td>
                  <td className="p-4 sm:p-5 font-semibold text-emerald-300 bg-emerald-950/30">100% Free &amp; Run Offline via Ollama</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* The 6 Scoring Dimensions */}
      <section className="py-24 bg-[#090d16] border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-2">
              The Peer-Review Rubric
            </h2>
            <p className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
              The 6 dimensions journal editors screen during triage
            </p>
            <p className="text-slate-400 text-sm">
              Each dimension is scored 1 to 5, calibrated against publication expectations at journals like Nature, Cell, Science, and The Lancet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dim 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold font-serif mb-4 border border-emerald-500/20">
                1
              </div>
              <h3 className="text-lg font-serif font-semibold text-white mb-2">Originality &amp; Novelty</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Does the draft introduce a genuinely new finding, mechanism, or algorithm? Flags incremental-only advances and derivative framings.
              </p>
              <div className="text-[11px] text-emerald-300/80 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/10">
                Catches: “Incremental delta over 2023 baselines without paradigm improvement.”
              </div>
            </div>

            {/* Dim 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold font-serif mb-4 border border-blue-500/20">
                2
              </div>
              <h3 className="text-lg font-serif font-semibold text-white mb-2">Importance &amp; Broad Interest</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Would researchers outside the narrow subfield care? Checks whether the abstract links the discovery to fundamental field-level questions.
              </p>
              <div className="text-[11px] text-blue-300/80 bg-blue-950/40 p-2.5 rounded-lg border border-blue-500/10">
                Catches: “Hyper-specialized focus lacking cross-disciplinary significance.”
              </div>
            </div>

            {/* Dim 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold font-serif mb-4 border border-amber-500/20">
                3
              </div>
              <h3 className="text-lg font-serif font-semibold text-white mb-2">Strength of Claims vs. Evidence</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Scans for overstatement patterns: using &quot;demonstrates&quot; without mechanistic proof, claiming causation from correlative data, and missing negative controls.
              </p>
              <div className="text-[11px] text-amber-300/80 bg-amber-950/40 p-2.5 rounded-lg border border-amber-500/10">
                Catches: “Causal claim made without rescue experiment or inhibitor.”
              </div>
            </div>

            {/* Dim 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold font-serif mb-4 border border-purple-500/20">
                4
              </div>
              <h3 className="text-lg font-serif font-semibold text-white mb-2">Methodological Soundness</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Verifies sample size power justification, statistical test suitability, blinding, randomization, and figure-data consistency.
              </p>
              <div className="text-[11px] text-purple-300/80 bg-purple-950/40 p-2.5 rounded-lg border border-purple-500/10">
                Catches: “Underpowered cohort (n=6) without pre-specified power calculation.”
              </div>
            </div>

            {/* Dim 5 */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold font-serif mb-4 border border-teal-500/20">
                5
              </div>
              <h3 className="text-lg font-serif font-semibold text-white mb-2">Clarity &amp; Narrative Flow</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Evaluates abstract structure (Problem &rarr; Gap &rarr; Method &rarr; Finding &rarr; Impact), figure caption completeness, and readability.
              </p>
              <div className="text-[11px] text-teal-300/80 bg-teal-950/40 p-2.5 rounded-lg border border-teal-500/10">
                Catches: “Missing knowledge gap bridge in opening paragraph.”
              </div>
            </div>

            {/* Dim 6 */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold font-serif mb-4 border border-rose-500/20">
                6
              </div>
              <h3 className="text-lg font-serif font-semibold text-white mb-2">Prior Work &amp; Reference Integrity</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Live verification of DOIs against Crossref and Retraction Watch. Flags hallucinated citations, retracted works, and high self-citation ratios.
              </p>
              <div className="text-[11px] text-rose-300/80 bg-rose-950/40 p-2.5 rounded-lg border border-rose-500/10">
                Catches: “Unresolvable DOI indicating AI hallucination or retracted paper.”
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Persona Reviewer Simulator Preview */}
      <section className="py-24 bg-slate-950 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-4">
                <Users className="w-3.5 h-3.5" />
                The Dossier Simulation
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6 leading-tight">
                Simulate your 4 peer reviewers before sending to an editor.
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light">
                Manuscripts are rarely rejected because of bad prose; they are rejected because one specific reviewer persona found a vulnerability they couldn&apos;t forgive. ManuView passes your paper through four specialized lenses:
              </p>

              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">Methods Reviewer:</span> Scrutinizes controls, protocols, reagents, and independent reproducibility.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">Domain Expert:</span> Evaluates biological/theoretical significance and compares against 2024 competitor baselines.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">Journal Editor:</span> Assesses desk-rejection risk, target audience appeal, and broad impact.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">Biostatistician:</span> Checks normality distributions, p-hacking risks, and multiple testing corrections (FDR).
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="text-xs font-semibold text-slate-200">Priority A Objection (Methods Reviewer)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold uppercase">
                  Desk Reject Trigger
                </span>
              </div>

              <blockquote className="text-xs italic text-slate-300 border-l-2 border-rose-500 pl-3 py-1 mb-4 leading-relaxed">
                &quot;The authors assert in line 162 that compound K directly inhibits kinase phosphorylation. However, Western blot Figure 3B lacks the total protein loading control lane, and no rescue assay is presented. Without this, the causal claim cannot be accepted.&quot;
              </blockquote>

              <div className="p-3 rounded-xl bg-slate-800/80 text-xs text-slate-300 border border-slate-700/60">
                <span className="font-semibold text-emerald-400 block mb-1">Actionable Pre-Submission Resolution:</span>
                Add the non-phosphorylated total protein control to Figure 3B, or revise text to describe association rather than direct inhibition.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Research Tools Grid */}
      <section className="py-24 bg-[#090d16] border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-2">
                Standalone Utilities
              </h2>
              <p className="text-3xl font-serif font-bold text-white">
                Modular submission tools for every step
              </p>
            </div>
            <Link
              href="/tools"
              className="mt-4 md:mt-0 text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              View all 8 tools &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/tools/journal-fit"
              className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900/80 transition group"
            >
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit mb-4 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Journal Fit Predictor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Matches title + abstract against 1,300+ journals to rank Reach, Realistic, and Fallback venues with acceptance hazard notes.
              </p>
            </Link>

            <Link
              href="/tools/reference-checker"
              className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900/80 transition group"
            >
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit mb-4 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Reference &amp; Retraction Checker</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Paste your bibliography to check Crossref DOIs in real time, catching unresolvable AI hallucinations and retracted papers.
              </p>
            </Link>

            <Link
              href="/tools/citation-claim"
              className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900/80 transition group"
            >
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit mb-4 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Citation Claim Validator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Validates whether the paper you cited actually supports the sentence you attached to it, offering evidence-aligned rewrites.
              </p>
            </Link>

            <Link
              href="/tools/prisma"
              className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900/80 transition group"
            >
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 w-fit mb-4 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">PRISMA Flow Diagram Generator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Client-side PRISMA 2020 systematic review flow diagram. Automatically catches arithmetic conflicts and exports clean SVG.
              </p>
            </Link>

            <Link
              href="/tools/cover-letter"
              className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900/80 transition group"
            >
              <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 w-fit mb-4 group-hover:scale-105 transition-transform">
                <FileSearch className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Journal Cover Letter Generator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Assembles an editor-ready formal submission letter conveying novelty, target journal fit, and non-preferred reviewers.
              </p>
            </Link>

            <Link
              href="/tools/response-builder"
              className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900/80 transition group"
            >
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 w-fit mb-4 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Response to Reviewers Workspace</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Converts unstructured decision letters into an itemized point-by-point rebuttal matrix and revision checklist.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Local-First & Privacy Section */}
      <section className="py-20 bg-slate-950 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-6 border border-emerald-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-white mb-4">
            Your unpublished research never leaves your control.
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-8 max-w-2xl mx-auto font-light">
            You don&apos;t have to trust a commercial cloud with your sensitive unpublished discoveries. ManuView supports <strong>100% offline local AI execution</strong> using Ollama (<code className="text-emerald-300">llama3.3</code>, <code className="text-emerald-300">mistral</code>, or <code className="text-emerald-300">deepseek-r1</code>).
          </p>

          <div className="inline-flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Zero model training &bull; Zero database retention &bull; 100% Open Source MIT License</span>
          </div>
        </div>
      </section>
    </div>
  );
}
