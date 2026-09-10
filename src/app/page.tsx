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
    <div className="flex flex-col bg-[#191919] text-[#e6e6e6]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 border-b border-[#2e2e2e]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 relative z-10 text-center">
          {/* Notion Page Icon & Mission Tag */}
          <div className="text-4xl mb-4 select-none">🔬</div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-normal bg-[#222222] text-[#9b9a97] border border-[#333333] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Open Source &bull; Education &amp; Science Belong to Everyone</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-5 leading-tight tracking-tight">
            Catch what peer reviewers will, <br />
            <span className="text-emerald-400">
              before you submit.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#9b9a97] mb-8 leading-relaxed max-w-xl mx-auto font-light">
            Stop paying commercial services $39 to $1,800 for surface-level manuscript reviews. ManuView applies an authentic top-journal peer-review rubric to diagnose desk-rejection hazards, causal overclaims, and citation bugs—for free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/scan"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#252525] hover:bg-[#2d2d2d] text-white font-medium text-xs sm:text-sm border border-[#3d3d3d] hover:border-[#555555] active:scale-95 transition"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Run Free Manuscript Scan</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8a8a86]" />
            </Link>

            <Link
              href="/tools"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-transparent hover:bg-[#222222] text-[#9b9a97] hover:text-[#e6e6e6] border border-[#2e2e2e] font-normal text-xs sm:text-sm transition"
            >
              Explore 8 Research Tools
            </Link>
          </div>

          {/* Quick stats in Notion metadata style */}
          <div className="mt-12 grid grid-cols-3 gap-3 border-t border-[#2e2e2e] pt-6 text-left max-w-md mx-auto">
            <div className="p-2.5 rounded-lg bg-[#202020] border border-[#2e2e2e]">
              <div className="text-lg font-serif font-bold text-white">6-Dim</div>
              <div className="text-[11px] text-[#8a8a86]">Editorial Rubric</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#202020] border border-[#2e2e2e]">
              <div className="text-lg font-serif font-bold text-emerald-400">100% Free</div>
              <div className="text-[11px] text-[#8a8a86]">Zero Paywalls</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#202020] border border-[#2e2e2e]">
              <div className="text-lg font-serif font-bold text-blue-400">Local AI</div>
              <div className="text-[11px] text-[#8a8a86]">Ollama Offline</div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy / Differentiation Table (Notion Database Table style) */}
      <section className="py-16 border-b border-[#2e2e2e]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="text-xs font-medium uppercase tracking-widest text-[#8a8a86] mb-1.5">
              The Peer-Review Philosophy
            </div>
            <h2 className="text-2xl font-serif font-bold text-white mb-2">
              Scientific critique is not grammar polishing.
            </h2>
            <p className="text-xs text-[#9b9a97]">
              Generic LLMs are flattering, and grammar checkers only see commas. Editors desk-reject on methodology and overclaims.
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#2e2e2e] bg-[#202020]">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[#2e2e2e] bg-[#1a1a1a] text-[11px] font-medium uppercase tracking-wider text-[#8a8a86]">
                  <th className="p-3.5">Dimension</th>
                  <th className="p-3.5">Grammar Checkers</th>
                  <th className="p-3.5">Generic LLMs</th>
                  <th className="p-3.5 text-emerald-400 bg-[#1c2e24]">ManuView (Open Source)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a] text-[#cccccc]">
                <tr>
                  <td className="p-3.5 font-medium text-white">Focus Level</td>
                  <td className="p-3.5 text-[#8a8a86]">Sentence level (typos, passive voice)</td>
                  <td className="p-3.5 text-[#8a8a86]">Conversational summaries &amp; rewriting</td>
                  <td className="p-3.5 font-medium text-[#4dab83] bg-[#1c2e24]/40">Manuscript-level scientific critique</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-white">Reviewer Posture</td>
                  <td className="p-3.5 text-[#8a8a86]">Mechanical spelling correction</td>
                  <td className="p-3.5 text-[#8a8a86]">Agreeable / flattering bias</td>
                  <td className="p-3.5 font-medium text-[#4dab83] bg-[#1c2e24]/40">Top-journal editorial skepticism</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-white">Critical Detection</td>
                  <td className="p-3.5 text-[#8a8a86]">Grammar &amp; word choice</td>
                  <td className="p-3.5 text-[#8a8a86]">Misses unsupported causal links</td>
                  <td className="p-3.5 font-medium text-[#4dab83] bg-[#1c2e24]/40">Causal overclaims, missing controls, power gaps</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-white">Citation Integrity</td>
                  <td className="p-3.5 text-[#8a8a86]">Formatting style only</td>
                  <td className="p-3.5 text-[#8a8a86]">Frequently hallucinates fake papers</td>
                  <td className="p-3.5 font-medium text-[#4dab83] bg-[#1c2e24]/40">Live Crossref &amp; Retraction Watch verification</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-white">Cost &amp; Access</td>
                  <td className="p-3.5 text-[#8a8a86]">$20 - $30 / month</td>
                  <td className="p-3.5 text-[#8a8a86]">$20 / month + cloud logging</td>
                  <td className="p-3.5 font-medium text-[#4dab83] bg-[#1c2e24]/60">100% Free &amp; Run Offline via Ollama</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* The 6 Scoring Dimensions */}
      <section className="py-16 border-b border-[#2e2e2e]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="text-xs font-medium uppercase tracking-widest text-[#8a8a86] mb-1.5">
              The Peer-Review Rubric
            </div>
            <h2 className="text-2xl font-serif font-bold text-white mb-2">
              The 6 dimensions journal editors screen in triage
            </h2>
            <p className="text-xs text-[#9b9a97]">
              Each dimension is scored 1 to 5, calibrated against high-impact publication expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Dim 1 */}
            <div className="p-4 rounded-lg bg-[#202020] border border-[#2e2e2e] hover:border-[#383838] transition">
              <div className="w-7 h-7 rounded bg-[#2a2a2a] text-white flex items-center justify-center font-bold text-xs mb-3">
                1
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">Originality &amp; Novelty</h3>
              <p className="text-xs text-[#9b9a97] leading-relaxed mb-3">
                Does the draft introduce a genuinely new finding, mechanism, or algorithm? Flags incremental-only advances.
              </p>
              <div className="text-[11px] text-[#4dab83] bg-[#1c2e24] p-2 rounded border border-[#284a36]">
                Catches: &ldquo;Incremental delta without paradigm improvement.&rdquo;
              </div>
            </div>

            {/* Dim 2 */}
            <div className="p-4 rounded-lg bg-[#202020] border border-[#2e2e2e] hover:border-[#383838] transition">
              <div className="w-7 h-7 rounded bg-[#2a2a2a] text-white flex items-center justify-center font-bold text-xs mb-3">
                2
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">Importance &amp; Broad Interest</h3>
              <p className="text-xs text-[#9b9a97] leading-relaxed mb-3">
                Would researchers outside the narrow subfield care? Checks whether the abstract links to fundamental questions.
              </p>
              <div className="text-[11px] text-[#529cca] bg-[#192636] p-2 rounded border border-[#254263]">
                Catches: &ldquo;Hyper-specialized focus lacking cross-disciplinary impact.&rdquo;
              </div>
            </div>

            {/* Dim 3 */}
            <div className="p-4 rounded-lg bg-[#202020] border border-[#2e2e2e] hover:border-[#383838] transition">
              <div className="w-7 h-7 rounded bg-[#2a2a2a] text-white flex items-center justify-center font-bold text-xs mb-3">
                3
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">Claims vs. Evidence</h3>
              <p className="text-xs text-[#9b9a97] leading-relaxed mb-3">
                Scans for overstatement patterns: claiming causation from correlative data, and missing negative controls.
              </p>
              <div className="text-[11px] text-[#f1b854] bg-[#2e281b] p-2 rounded border border-[#4a3e26]">
                Catches: &ldquo;Causal claim made without rescue experiment or inhibitor.&rdquo;
              </div>
            </div>

            {/* Dim 4 */}
            <div className="p-4 rounded-lg bg-[#202020] border border-[#2e2e2e] hover:border-[#383838] transition">
              <div className="w-7 h-7 rounded bg-[#2a2a2a] text-white flex items-center justify-center font-bold text-xs mb-3">
                4
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">Methodological Soundness</h3>
              <p className="text-xs text-[#9b9a97] leading-relaxed mb-3">
                Verifies sample size power justification, statistical test suitability, blinding, and randomization.
              </p>
              <div className="text-[11px] text-[#9a6dd7] bg-[#291f33] p-2 rounded border border-[#442c5c]">
                Catches: &ldquo;Underpowered cohort (n=6) without power calculation.&rdquo;
              </div>
            </div>

            {/* Dim 5 */}
            <div className="p-4 rounded-lg bg-[#202020] border border-[#2e2e2e] hover:border-[#383838] transition">
              <div className="w-7 h-7 rounded bg-[#2a2a2a] text-white flex items-center justify-center font-bold text-xs mb-3">
                5
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">Clarity &amp; Narrative Flow</h3>
              <p className="text-xs text-[#9b9a97] leading-relaxed mb-3">
                Evaluates abstract structure (Problem &rarr; Gap &rarr; Method &rarr; Finding &rarr; Impact) and readability.
              </p>
              <div className="text-[11px] text-[#4dab83] bg-[#1c2e24] p-2 rounded border border-[#284a36]">
                Catches: &ldquo;Missing knowledge gap bridge in opening paragraph.&rdquo;
              </div>
            </div>

            {/* Dim 6 */}
            <div className="p-4 rounded-lg bg-[#202020] border border-[#2e2e2e] hover:border-[#383838] transition">
              <div className="w-7 h-7 rounded bg-[#2a2a2a] text-white flex items-center justify-center font-bold text-xs mb-3">
                6
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">Prior Work &amp; Citations</h3>
              <p className="text-xs text-[#9b9a97] leading-relaxed mb-3">
                Live verification of DOIs against Crossref and Retraction Watch. Flags hallucinated citations and retracted works.
              </p>
              <div className="text-[11px] text-[#ff7373] bg-[#2d1f1f] p-2 rounded border border-[#4a2b2b]">
                Catches: &ldquo;Unresolvable DOI indicating AI hallucination or retracted paper.&rdquo;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Persona Reviewer Simulation Preview */}
      <section className="py-16 border-b border-[#2e2e2e]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-normal bg-[#222222] text-[#9b9a97] border border-[#333333] mb-3">
                <Users className="w-3.5 h-3.5" />
                <span>The Persona Simulation</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-white mb-3">
                Simulate your 4 peer reviewers before the editor sees your draft.
              </h2>
              <p className="text-xs text-[#9b9a97] leading-relaxed mb-5 font-light">
                Manuscripts are rarely rejected because of grammar; they are rejected because one specific reviewer persona found a vulnerability they couldn&apos;t forgive.
              </p>

              <div className="space-y-2 text-xs text-[#cccccc]">
                <div className="p-2.5 rounded-lg bg-[#202020] border border-[#2e2e2e]">
                  <span className="font-semibold text-white">🔬 Methods Specialist:</span> Scrutinizes controls, protocols, reagents, and reproducibility.
                </div>
                <div className="p-2.5 rounded-lg bg-[#202020] border border-[#2e2e2e]">
                  <span className="font-semibold text-white">🧬 Domain Expert:</span> Evaluates biological significance against competitor baselines.
                </div>
                <div className="p-2.5 rounded-lg bg-[#202020] border border-[#2e2e2e]">
                  <span className="font-semibold text-white">📑 Journal Editor:</span> Assesses desk-rejection risk, target audience appeal, and broad scope.
                </div>
                <div className="p-2.5 rounded-lg bg-[#202020] border border-[#2e2e2e]">
                  <span className="font-semibold text-white">📊 Biostatistician:</span> Checks normality distributions, p-hacking risks, and multiple testing corrections.
                </div>
              </div>
            </div>

            <div className="p-5 rounded-lg bg-[#202020] border border-[#2e2e2e] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#2e2e2e]">
                <span className="text-xs font-medium text-white">Simulated Fatal Reviewer Objection</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#2d1f1f] text-[#ff7373] border border-[#4a2b2b] uppercase font-bold">
                  Priority A
                </span>
              </div>

              <blockquote className="text-xs italic text-[#cccccc] border-l-2 border-[#ff7373] pl-3 py-0.5 leading-relaxed font-serif">
                &ldquo;The authors assert that compound K directly inhibits kinase phosphorylation. However, Figure 3B lacks the total protein loading control, and no rescue assay is presented. Without this, the causal claim cannot be accepted.&rdquo;
              </blockquote>

              <div className="p-3 rounded bg-[#1b251f] text-xs text-[#a3d4b6] border border-[#284232]">
                <span className="font-semibold text-white block mb-0.5">Required Pre-Submission Resolution:</span>
                Add the non-phosphorylated total protein control to Figure 3B, or revise text to describe association rather than direct inhibition.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Research Tools Grid */}
      <section className="py-16 border-b border-[#2e2e2e]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <div>
              <div className="text-xs font-medium uppercase tracking-widest text-[#8a8a86] mb-1">
                Modular Utilities
              </div>
              <h2 className="text-2xl font-serif font-bold text-white">
                Standalone submission tools
              </h2>
            </div>
            <Link
              href="/tools"
              className="mt-2 sm:mt-0 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              View all 8 tools &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Link
              href="/tools/journal-fit"
              className="p-4 rounded-lg bg-[#202020] border border-[#2e2e2e] hover:border-[#383838] transition"
            >
              <div className="text-xl mb-2 select-none">📖</div>
              <h3 className="text-xs font-semibold text-white mb-1">Journal Fit Predictor</h3>
              <p className="text-[11px] text-[#9b9a97] leading-relaxed">
                Matches title + abstract against 1,300+ journals to rank Reach, Realistic, and Fallback venues.
              </p>
            </Link>

            <Link
              href="/tools/reference-checker"
              className="p-4 rounded-lg bg-[#202020] border border-[#2e2e2e] hover:border-[#383838] transition"
            >
              <div className="text-xl mb-2 select-none">🔍</div>
              <h3 className="text-xs font-semibold text-white mb-1">Reference &amp; Retraction Checker</h3>
              <p className="text-[11px] text-[#9b9a97] leading-relaxed">
                Paste bibliography to verify Crossref DOIs in real time, catching hallucinations and retracted papers.
              </p>
            </Link>

            <Link
              href="/tools/citation-claim"
              className="p-4 rounded-lg bg-[#202020] border border-[#2e2e2e] hover:border-[#383838] transition"
            >
              <div className="text-xl mb-2 select-none">✨</div>
              <h3 className="text-xs font-semibold text-white mb-1">Citation Claim Validator</h3>
              <p className="text-[11px] text-[#9b9a97] leading-relaxed">
                Validates whether the cited study actually supports the sentence attached to it.
              </p>
            </Link>

            <Link
              href="/tools/prisma"
              className="p-4 rounded-lg bg-[#202020] border border-[#2e2e2e] hover:border-[#383838] transition"
            >
              <div className="text-xl mb-2 select-none">📊</div>
              <h3 className="text-xs font-semibold text-white mb-1">PRISMA Flow Diagram</h3>
              <p className="text-[11px] text-[#9b9a97] leading-relaxed">
                Client-side systematic review flow generator. Reconciles screening counts and exports SVG.
              </p>
            </Link>

            <Link
              href="/tools/cover-letter"
              className="p-4 rounded-lg bg-[#202020] border border-[#2e2e2e] hover:border-[#383838] transition"
            >
              <div className="text-xl mb-2 select-none">✉️</div>
              <h3 className="text-xs font-semibold text-white mb-1">Cover Letter Generator</h3>
              <p className="text-[11px] text-[#9b9a97] leading-relaxed">
                Drafts formal editor-ready submission letter conveying novelty, journal scope, and reviewers.
              </p>
            </Link>

            <Link
              href="/tools/response-builder"
              className="p-4 rounded-lg bg-[#202020] border border-[#2e2e2e] hover:border-[#383838] transition"
            >
              <div className="text-xl mb-2 select-none">📝</div>
              <h3 className="text-xs font-semibold text-white mb-1">Response to Reviewers</h3>
              <p className="text-[11px] text-[#9b9a97] leading-relaxed">
                Converts decision letters into a point-by-point rebuttal matrix and revision checklist.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Local-First & Privacy Section */}
      <section className="py-16 text-center">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="text-3xl mb-3 select-none">🔒</div>
          <h2 className="text-2xl font-serif font-bold text-white mb-2">
            Your unpublished research never leaves your control.
          </h2>
          <p className="text-xs text-[#9b9a97] leading-relaxed mb-6 font-light">
            You don&apos;t have to trust commercial clouds with your unpublished discoveries. ManuView supports <strong>100% offline local AI execution</strong> using Ollama (<code className="text-[#4dab83]">llama3.3</code>, <code className="text-[#4dab83]">mistral</code>, or <code className="text-[#4dab83]">deepseek-r1</code>).
          </p>

          <div className="inline-flex items-center gap-2 p-2.5 rounded-lg bg-[#202020] border border-[#2e2e2e] text-xs text-[#cccccc]">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero model training &bull; Zero database retention &bull; 100% Open Source MIT License</span>
          </div>
        </div>
      </section>
    </div>
  );
}
