"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Upload, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  RefreshCw,
  ExternalLink,
  ChevronRight,
  FileCheck,
  Settings,
  Key,
  Cpu,
  Code,
  Info,
  Lightbulb
} from "lucide-react";
import { FullReviewReport, PriorityIssue, ReviewerPersonaFeedback, ProviderConfig } from "@/lib/types";
import { ProviderSettingsModal } from "@/components/ProviderSettingsModal";

// Sample preprint for instant one-click testing
const SAMPLE_PREPRINT_TITLE = "Single-cell transcriptional profiling of DLL3 activation in neuroendocrine lung carcinoma";
const SAMPLE_PREPRINT_TEXT = `Title: Single-cell transcriptional profiling of DLL3 activation in neuroendocrine lung carcinoma

Abstract:
Small cell lung cancer (SCLC) exhibits rapid recurrence and therapy resistance. Delta-like ligand 3 (DLL3) is an established cell-surface target for antibody-drug conjugates and T-cell engagers. However, the precise cis-regulatory mechanisms controlling DLL3 transcription remain uncharacterized. Here, we perform marker-based CRISPR-Cas9 screens and identify the transcription factor POU2F1 as a primary driver of DLL3 expression. We demonstrate that POU2F1 directly binds the DLL3 distal enhancer element to drive chemoresistance in clinical isolates. Knockdown of POU2F1 caused significant downregulation of DLL3 mRNA across 8 patient-derived organoid lines. Our findings prove that targeting POU2F1 will rescue therapeutic efficacy in neuroendocrine lung carcinoma and provide a universal predictive biomarker for clinical stratification.

Methods:
Patient-derived neuroendocrine organoids (n=8) were maintained in 3D Matrigel culture. For CRISPR knockout screens, a custom sgRNA library targeting 1,200 chromatin regulators was transduced at an MOI of 0.3. Differential expression was evaluated using single-cell RNA sequencing on Illumina NovaSeq 6000. Significance testing was conducted via two-tailed unpaired Student's t-tests (p < 0.05 considered significant).

Results:
POU2F1 was nominated as the top hit in the genome-wide enrichment assay (Fold Change = 4.2, p = 0.002). Correlative RNA-seq analysis indicated elevated POU2F1 expression in recurrent vs. treatment-naive cohorts. Western blot analysis confirmed reduction of DLL3 upon shRNA treatment.

Discussion:
Our study proves that POU2F1 is the essential master regulator of neuroendocrine identity in lung cancer. Targeting this regulatory axis will prevent relapse in all patients receiving DLL3-targeted therapeutics.

References:
1. Saunders D, et al. A DLL3-targeted antibody-drug conjugate for small cell lung cancer. Sci Transl Med. 2015. DOI: 10.1126/scitranslmed.aac9459
2. Rudin CM, et al. Molecular subtypes of small cell lung cancer: a synthesis of biology and therapeutics. Nat Rev Cancer. 2019. DOI: 10.1038/s41568-019-0133-9
3. Fake A, Hallucinated B. AI generated non-existent reference. J Cancer. 2024. DOI: 10.1038/s41586-999-fake01
4. Wakefield AJ, et al. Ileal-lymphoid-nodular hyperplasia and pervasive developmental disorder in children. Lancet. 1998. DOI: 10.1016/S0140-6736(97)11096-0`;

export default function ScanPage() {
  const [inputText, setInputText] = useState("");
  const [targetJournal, setTargetJournal] = useState("Nature Communications");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [report, setReport] = useState<FullReviewReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<number>(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeProviderInfo, setActiveProviderInfo] = useState<{
    type: 'server' | 'browser' | 'offline';
    name: string;
    model: string;
  }>({ type: 'offline', name: 'Offline Demo Mode', model: 'Deterministic Diagnostic' });

  React.useEffect(() => {
    checkProviderStatus();
  }, []);

  const checkProviderStatus = async () => {
    const saved = localStorage.getItem("manuview_provider_config");
    let browserConfig: ProviderConfig | null = null;
    if (saved) {
      try { browserConfig = JSON.parse(saved); } catch {}
    }

    if (browserConfig && browserConfig.apiKey) {
      setActiveProviderInfo({
        type: 'browser',
        name: browserConfig.provider.toUpperCase(),
        model: browserConfig.model,
      });
      return;
    }

    try {
      const res = await fetch("/api/config/status");
      const data = await res.json();
      if (data.hasServerKey) {
        setActiveProviderInfo({
          type: 'server',
          name: `${data.activeProvider.toUpperCase()}`,
          model: 'from .env.local',
        });
        return;
      }
    } catch {}

    if (browserConfig && browserConfig.provider === 'ollama') {
      setActiveProviderInfo({
        type: 'browser',
        name: 'Local Ollama',
        model: browserConfig.model || 'llama3.3',
      });
      return;
    }

    setActiveProviderInfo({
      type: 'offline',
      name: 'Offline Demo Fallback',
      model: 'Deterministic Diagnostic',
    });
  };

  const handleLoadSample = () => {
    setInputText(SAMPLE_PREPRINT_TEXT);
    setTargetJournal("Nature Communications");
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleRunScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !file) {
      setError("Please paste your manuscript text or upload a document file.");
      return;
    }

    setError(null);
    setLoading(true);
    setReport(null);

    // Progressive status updates
    setLoadingStep("Extracting sections and parsing bibliography...");
    const t1 = setTimeout(() => setLoadingStep("Resolving references against Crossref & Retraction Watch..."), 1200);
    const t2 = setTimeout(() => setLoadingStep("Auditing causal claims against experimental controls..."), 2400);
    const t3 = setTimeout(() => setLoadingStep("Evaluating methodology, sample power, and statistics..."), 3600);
    const t4 = setTimeout(() => setLoadingStep("Simulating 4 peer-reviewer personas..."), 4800);

    try {
      // Get user's provider config from localStorage if any
      const savedConfig = localStorage.getItem("manuview_provider_config");

      const formData = new FormData();
      if (file) formData.append("file", file);
      if (inputText) formData.append("text", inputText);
      if (targetJournal) formData.append("targetJournal", targetJournal);
      if (savedConfig) formData.append("providerConfig", savedConfig);

      const res = await fetch("/api/review", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate diagnostic report.");
      }

      setReport(data.report);
    } catch (err: any) {
      setError(err.message || "An error occurred during diagnostic review.");
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      setLoading(false);
      setLoadingStep("");
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Reviewer-Calibrated Pre-Submission Diagnostic
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
            Manuscript Readiness &amp; Rejection Risk Scan
          </h1>
          <p className="text-slate-400 text-sm">
            Upload your paper to diagnose the methodological gaps, causal overclaims, and citation bugs editors flag in triage.
          </p>
        </div>

        {/* AI Engine Status Banner */}
        <div className={`p-3.5 mb-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
          activeProviderInfo.type !== 'offline'
            ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
            : "bg-slate-900/80 border-slate-800 text-slate-300"
        }`}>
          <div className="flex items-center gap-2.5">
            {activeProviderInfo.type !== 'offline' ? (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
            )}
            <div>
              <span className="font-semibold text-white">AI Diagnostic Engine: </span>
              <span className="text-slate-300">{activeProviderInfo.name} ({activeProviderInfo.model})</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeProviderInfo.type === 'offline' && (
              <span className="text-[11px] text-amber-300/90 hidden sm:inline">
                (Add API Key to run real models)
              </span>
            )}
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition flex items-center gap-1.5 whitespace-nowrap"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-400" />
              <span>{activeProviderInfo.type === 'offline' ? "Connect API Key" : "Change Engine"}</span>
            </button>
          </div>
        </div>

        {/* Input Form Card */}
        {!report && (
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 shadow-2xl mb-12">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <FileText className="w-4 h-4 text-emerald-400" />
                Submit Draft for Diagnostic Review
              </div>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Load Sample Preprint (Test Demo)
              </button>
            </div>

            <form onSubmit={handleRunScan} className="space-y-6">
              {/* Target Journal */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Target Journal (Optional)
                </label>
                <input
                  type="text"
                  value={targetJournal}
                  onChange={(e) => setTargetJournal(e.target.value)}
                  placeholder="e.g., Nature, Nature Communications, Cell, Lancet, IEEE TPAMI"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  If left blank, the diagnostic evaluates against general high-impact publication standards.
                </p>
              </div>

              {/* Upload or Paste */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* File Upload */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Upload Document (.docx, .txt)
                  </label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 bg-slate-950/50 cursor-pointer transition group">
                    <Upload className="w-8 h-8 text-slate-500 group-hover:text-emerald-400 transition mb-2" />
                    <span className="text-xs text-slate-300 font-medium text-center">
                      {file ? file.name : "Click to browse or drag & drop file"}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1">Word (.docx) or Text file</span>
                    <input
                      type="file"
                      accept=".docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Direct Paste */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Or Paste Manuscript Text
                  </label>
                  <textarea
                    rows={6}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste Title, Abstract, Methods, and References here..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition font-mono"
                  />
                </div>
              </div>

              {/* Privacy notice */}
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Zero data retention: Your manuscript is analyzed in-memory and never used to train models.</span>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-sm shadow-xl shadow-emerald-600/20 active:scale-98 transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{loadingStep || "Analyzing Manuscript..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Pre-Submission Diagnostic Scan</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Diagnostic Report Results */}
        {report && (
          <div className="space-y-10 animate-fade-in">
            {/* Action Bar */}
            <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-3">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h2 className="text-sm font-semibold text-white truncate max-w-md">{report.title}</h2>
                  <div className="text-[11px] text-slate-400">Targeting: {report.targetJournal || "General High Impact"}</div>
                </div>
              </div>
              <button
                onClick={() => setReport(null)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition"
              >
                Scan Another Draft
              </button>
            </div>

            {/* Document Type & Personalized User Address Banner */}
            {report.classification && (
              <div className={`p-6 rounded-2xl border ${
                report.classification.isAcademicManuscript
                  ? "bg-gradient-to-br from-emerald-950/30 via-slate-900/70 to-slate-950 border-emerald-500/30 shadow-lg shadow-emerald-950/10"
                  : report.classification.category === "source_code"
                  ? "bg-gradient-to-br from-indigo-950/30 via-slate-900/70 to-slate-950 border-indigo-500/30 shadow-lg shadow-indigo-950/10"
                  : report.classification.category === "resume_cv"
                  ? "bg-gradient-to-br from-blue-950/30 via-slate-900/70 to-slate-950 border-blue-500/30 shadow-lg shadow-blue-950/10"
                  : "bg-gradient-to-br from-rose-950/20 via-slate-900/70 to-slate-950 border-rose-500/30 shadow-lg shadow-rose-950/10"
              }`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-3.5">
                    <div className={`p-3 rounded-xl border ${
                      report.classification.isAcademicManuscript
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : report.classification.category === "source_code"
                        ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                        : report.classification.category === "resume_cv"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}>
                      {report.classification.isAcademicManuscript ? (
                        <BookOpen className="w-5 h-5" />
                      ) : report.classification.category === "source_code" ? (
                        <Code className="w-5 h-5" />
                      ) : report.classification.category === "resume_cv" ? (
                        <Users className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Document Classification
                      </div>
                      <div className="text-base font-bold text-white flex items-center gap-2">
                        {report.classification.categoryLabel}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                          report.classification.isAcademicManuscript
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        }`}>
                          {report.classification.isAcademicManuscript ? "Academic Research" : "Non-Manuscript File"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!report.classification.isAcademicManuscript && (
                    <button
                      type="button"
                      onClick={handleLoadSample}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition flex items-center gap-1.5 self-start md:self-center"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Test with Sample Research Preprint
                    </button>
                  )}
                </div>

                <div className="pt-4 space-y-3">
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      report.classification.isAcademicManuscript ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                    }`} />
                    {report.classification.salutation}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    {report.classification.advisoryMessage}
                  </p>

                  {/* Detected Features Chips */}
                  {report.classification.detectedFeatures && report.classification.detectedFeatures.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-2">
                      {report.classification.detectedFeatures.map((feat, idx) => (
                        <span key={idx} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                          {report.classification.isAcademicManuscript ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Info className="w-3 h-3 text-amber-400" />
                          )}
                          {feat}
                        </span>
                      ))}
                    </div>
                  )}

                  {report.classification.customGuidance && (
                    <div className="mt-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-200">Recommended Action: </span>
                        {report.classification.customGuidance}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Score & Summary Banner */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Overall Score */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 flex flex-col justify-center items-center text-center">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Submission Readiness
                </div>
                <div className="relative flex items-center justify-center mb-2">
                  <span className="text-5xl font-bold font-serif text-white">{report.overallScore}</span>
                  <span className="text-slate-500 text-lg font-serif">/100</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  report.overallScore >= 80 ? "bg-emerald-500/20 text-emerald-300" :
                  report.overallScore >= 65 ? "bg-amber-500/20 text-amber-300" :
                  "bg-rose-500/20 text-rose-300"
                }`}>
                  {report.overallScore >= 80 ? "Submission Ready" :
                   report.overallScore >= 65 ? "Revision Prioritized" :
                   "Substantive Hazards"}
                </div>
              </div>

              {/* Editorial Summary */}
              <div className="md:col-span-3 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Editorial Triage Synthesis
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-light">
                  {report.summary}
                </p>
              </div>
            </div>

            {/* 6 Dimensions Grid */}
            <div>
              <h3 className="text-lg font-serif font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                The 6 Evaluation Dimensions (1–5 Scale)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(report.dimensions).map(([key, dim]) => (
                  <div key={key} className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-200">{dim.label}</span>
                        <span className={`px-2 py-0.5 rounded font-bold font-serif text-xs ${
                          dim.score >= 4 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                          dim.score === 3 ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                          "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        }`}>
                          {dim.score} / 5
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-3">
                        {dim.verdict}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-3 border-t border-slate-800 text-[11px]">
                      {dim.vulnerabilities.length > 0 && (
                        <div className="text-rose-300 flex items-start gap-1.5">
                          <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5 text-rose-400" />
                          <span>{dim.vulnerabilities[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Issues Matrix */}
            <div>
              <h3 className="text-lg font-serif font-semibold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-400" />
                Prioritized Action Plan before Submission
              </h3>

              <div className="space-y-4">
                {report.priorityIssues.map((issue: PriorityIssue) => (
                  <div
                    key={issue.id}
                    className={`p-5 rounded-2xl border ${
                      issue.priority === "A"
                        ? "bg-rose-950/20 border-rose-900/60"
                        : issue.priority === "B"
                        ? "bg-amber-950/20 border-amber-900/60"
                        : "bg-slate-900/60 border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          issue.priority === "A" ? "bg-rose-500 text-white" :
                          issue.priority === "B" ? "bg-amber-500 text-slate-950" :
                          "bg-slate-700 text-slate-200"
                        }`}>
                          Priority {issue.priority}
                        </span>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                          {issue.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {issue.priority === "A" ? "Desk-Reject Vulnerability" : "Major Reviewer Challenge"}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-white mb-2">{issue.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">{issue.description}</p>

                    {/* Reviewer Simulation Quote */}
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs italic text-slate-300 mb-3">
                      {issue.reviewerQuote}
                    </div>

                    {/* Concrete Actionable Fix */}
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/50 text-xs text-emerald-200">
                      <span className="font-semibold text-emerald-400 block mb-0.5">Required Pre-Submission Fix:</span>
                      {issue.actionableFix}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4-Persona Reviewer Simulation */}
            <div>
              <h3 className="text-lg font-serif font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                4-Persona Peer-Review Simulation
              </h3>

              {/* Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {report.reviewerPersonas.map((p: ReviewerPersonaFeedback, idx: number) => (
                  <button
                    key={p.persona}
                    onClick={() => setSelectedPersona(idx)}
                    className={`p-3 rounded-xl text-left border text-xs transition ${
                      selectedPersona === idx
                        ? "bg-slate-800 border-emerald-500 text-white shadow-sm"
                        : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="font-semibold truncate">{p.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{p.roleDescription}</div>
                  </button>
                ))}
              </div>

              {/* Active persona card */}
              {report.reviewerPersonas[selectedPersona] && (
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {report.reviewerPersonas[selectedPersona].name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {report.reviewerPersonas[selectedPersona].roleDescription}
                      </p>
                    </div>
                    <div className="text-xs text-amber-400 font-medium">
                      Key Challenge: {report.reviewerPersonas[selectedPersona].keyChallenge}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {report.reviewerPersonas[selectedPersona].assessment}
                  </p>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Must-Address Points:
                    </span>
                    {report.reviewerPersonas[selectedPersona].mustAddressItems.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Citation & Reference Integrity Section */}
            <div>
              <h3 className="text-lg font-serif font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Citation &amp; Reference Integrity Audit
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                  <div className="text-2xl font-bold font-serif text-white">
                    {report.citationIntegrity.totalReferences}
                  </div>
                  <div className="text-xs text-slate-400">Total References</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                  <div className="text-2xl font-bold font-serif text-emerald-400">
                    {report.citationIntegrity.verifiedCount}
                  </div>
                  <div className="text-xs text-slate-400">Crossref Verified</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                  <div className={`text-2xl font-bold font-serif ${
                    report.citationIntegrity.unresolvableCount > 0 ? "text-rose-400" : "text-slate-300"
                  }`}>
                    {report.citationIntegrity.unresolvableCount}
                  </div>
                  <div className="text-xs text-slate-400">Unresolvable DOIs (AI Risk)</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                  <div className={`text-2xl font-bold font-serif ${
                    report.citationIntegrity.retractedCount > 0 ? "text-rose-400" : "text-emerald-400"
                  }`}>
                    {report.citationIntegrity.retractedCount}
                  </div>
                  <div className="text-xs text-slate-400">Retracted Papers Flagged</div>
                </div>
              </div>

              {/* Sample verified refs */}
              <div className="rounded-2xl bg-slate-900/40 border border-slate-800 divide-y divide-slate-800">
                {report.citationIntegrity.references.slice(0, 5).map((ref, idx) => (
                  <div key={idx} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1 max-w-2xl">
                      <div className="text-slate-200 font-medium truncate">{ref.title || ref.raw}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        {ref.doi && <span>DOI: {ref.doi}</span>}
                        {ref.journal && <span>&bull; {ref.journal}</span>}
                        {ref.year && <span>&bull; {ref.year}</span>}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {ref.isRetracted ? (
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 font-semibold text-[10px] border border-rose-500/30">
                          RETRACTED
                        </span>
                      ) : ref.status === 'valid' ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[10px] border border-emerald-500/30">
                          Crossref Verified
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-semibold text-[10px] border border-amber-500/30">
                          Unverified
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Journal Strategy */}
            <div>
              <h3 className="text-lg font-serif font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                Target Journal Recommendation Tiers
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {report.journalRecommendations.map((rec, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          rec.tier === 'Reach' ? 'bg-purple-500/20 text-purple-300' :
                          rec.tier === 'Realistic' ? 'bg-emerald-500/20 text-emerald-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {rec.tier} Tier
                        </span>
                        <span className="text-xs font-serif font-bold text-slate-300">
                          IF: {rec.impactFactor}
                        </span>
                      </div>

                      <h4 className="text-base font-serif font-bold text-white mb-1">{rec.journalName}</h4>
                      <p className="text-[11px] text-slate-400 mb-4">{rec.publisher}</p>

                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300 mb-3">
                        <span className="font-semibold text-slate-200 block mb-1">Scope Rationale:</span>
                        {rec.scopeRationale}
                      </div>
                    </div>

                    <div className="text-[11px] text-rose-300/90 pt-3 border-t border-slate-800">
                      <span className="font-semibold block mb-0.5 text-rose-400">Desk-Reject Hazard:</span>
                      {rec.rejectionRisks[0] || "Methodological rigor requirements"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <ProviderSettingsModal
          isOpen={settingsOpen}
          onClose={() => {
            setSettingsOpen(false);
            checkProviderStatus();
          }}
          onSave={() => checkProviderStatus()}
        />
      </div>
    </div>
  );
}
