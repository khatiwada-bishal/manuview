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
  SlidersHorizontal,
  Hash,
  Tag,
  CheckSquare,
  GraduationCap,
  FlaskConical,
  Code,
  Info,
  Lightbulb,
  ArrowLeft,
  Activity,
  Zap,
  Check,
  ChevronDown,
  Download,
  Printer,
  Globe,
  FileCode,
  Bookmark,
  Scale,
  MessageSquare,
  ShieldAlert
} from "lucide-react";
import { FullReviewReport, BriefJournalFitReport, ReviewReport, PriorityIssue, ReviewerPersonaFeedback, ProviderConfig, AvailableModel } from "@/lib/types";
import { ProviderSettingsModal } from "@/components/ProviderSettingsModal";
import JournalCombobox from "@/components/JournalCombobox";
import { BriefJournalFitView, BriefJournalFitPrintView } from "@/components/BriefJournalFitView";
import { exportInteractiveHtmlReport, exportWordDocReport, exportLatexRebuttalTable, exportBibTeX } from "@/lib/export-generator";

// Sample preprint for instant one-click testing
const SAMPLE_PREPRINT_TITLE = "Single-cell transcriptional profiling of DLL3 activation in neuroendocrine lung carcinoma";
const SAMPLE_PREPRINT_ABSTRACT = "Small cell lung cancer (SCLC) exhibits rapid recurrence and therapy resistance. Delta-like ligand 3 (DLL3) is an established cell-surface target for antibody-drug conjugates and T-cell engagers. However, the precise cis-regulatory mechanisms controlling DLL3 transcription remain uncharacterized. Here, we perform marker-based CRISPR-Cas9 screens and identify the transcription factor POU2F1 as a primary driver of DLL3 expression. We demonstrate that POU2F1 directly binds the DLL3 distal enhancer element to drive chemoresistance in clinical isolates. Knockdown of POU2F1 caused significant downregulation of DLL3 mRNA across 8 patient-derived organoid lines. Our findings prove that targeting POU2F1 will rescue therapeutic efficacy in neuroendocrine lung carcinoma and provide a universal predictive biomarker for clinical stratification.";
const SAMPLE_PREPRINT_KEYWORDS = "small cell lung cancer, DLL3, POU2F1, CRISPR screen, organoids, chemoresistance, antibody-drug conjugates";
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
  const [manuscriptTitle, setManuscriptTitle] = useState("");
  const [manuscriptAbstract, setManuscriptAbstract] = useState("");
  const [manuscriptKeywords, setManuscriptKeywords] = useState("");
  const [targetJournal, setTargetJournal] = useState("");
  const [targetJournalError, setTargetJournalError] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [report, setReport] = useState<ReviewReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<number>(0);
  const [issueFilter, setIssueFilter] = useState<'all' | 'A' | 'B' | 'C'>('all');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [availableModels, setAvailableModels] = useState<AvailableModel[]>([]);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [pinging, setPinging] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'unconfigured' | 'error'>('checking');
  const [apiErrorMessage, setApiErrorMessage] = useState<string>("");
  const [scanPingResult, setScanPingResult] = useState<{
    success: boolean;
    latencyMs: number;
    message: string;
    error?: string;
  } | null>(null);
  const [activeProviderInfo, setActiveProviderInfo] = useState<{
    type: 'server' | 'browser' | 'offline';
    name: string;
    model: string;
  }>({ type: 'offline', name: 'AI Engine', model: 'Checking status...' });

  React.useEffect(() => {
    checkProviderStatus();
  }, []);

  const checkProviderStatus = async () => {
    setPinging(true);
    setApiStatus('checking');
    setApiErrorMessage("");

    const saved = localStorage.getItem("manuview_provider_config");
    let browserConfig: ProviderConfig | null = null;
    if (saved) {
      try { browserConfig = JSON.parse(saved); } catch {}
    }

    let hasServerKey = false;
    let serverProvider = "";
    try {
      const res = await fetch("/api/config/status");
      const data = await res.json();
      hasServerKey = !!data.hasServerKey;
      serverProvider = data.activeProvider || "";
    } catch {}

    const hasClientKey = !!(browserConfig && browserConfig.apiKey?.trim());
    const isOllama = browserConfig?.provider === 'ollama';

    // Fetch available models for dropdown
    try {
      const modelRes = await fetch("/api/config/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: browserConfig || { provider: (hasServerKey ? serverProvider : 'gemini') as any } }),
      });
      const modelData = await modelRes.json();
      if (modelData.success && Array.isArray(modelData.models)) {
        setAvailableModels(modelData.models);
      }
    } catch {}

    // 1. If no key configured anywhere and not local ollama -> unconfigured (Orange state)
    if (!hasClientKey && !hasServerKey && !isOllama) {
      setActiveProviderInfo({
        type: 'offline',
        name: 'No Provider',
        model: 'Requires API Key',
      });
      setApiStatus('unconfigured');
      setScanPingResult(null);
      setPinging(false);
      return;
    }

    // Set initial display name
    if (hasClientKey) {
      setActiveProviderInfo({
        type: 'browser',
        name: browserConfig!.provider.toUpperCase(),
        model: browserConfig!.model || 'configured',
      });
    } else if (isOllama) {
      setActiveProviderInfo({
        type: 'browser',
        name: 'Local Ollama',
        model: browserConfig!.model || 'llama3.3',
      });
    } else if (hasServerKey) {
      setActiveProviderInfo({
        type: 'server',
        name: serverProvider.toUpperCase(),
        model: 'from .env.local',
      });
    }

    // 2. Perform live connection test via /api/config/test
    try {
      let res: Response;
      if (hasClientKey || isOllama) {
        res = await fetch("/api/config/test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(browserConfig),
        });
      } else {
        res = await fetch("/api/config/test", { method: "GET" });
      }

      const data = await res.json();
      if (data.success) {
        setApiStatus('connected');
        setScanPingResult({
          success: true,
          latencyMs: data.latencyMs || 0,
          message: data.message || "Connection operational",
        });
        if (Array.isArray(data.availableModels) && data.availableModels.length > 0) {
          setAvailableModels(data.availableModels);
        }
      } else {
        setApiStatus('error');
        const errMsg = data.error || data.message || "Connection failed";
        setApiErrorMessage(errMsg);
        setScanPingResult({
          success: false,
          latencyMs: data.latencyMs || 0,
          message: data.message || "Connection failed",
          error: errMsg,
        });
      }
    } catch (err: any) {
      setApiStatus('error');
      const errMsg = err?.message || "Network error checking connection";
      setApiErrorMessage(errMsg);
      setScanPingResult({
        success: false,
        latencyMs: 0,
        message: "Network test failed",
        error: errMsg,
      });
    } finally {
      setPinging(false);
    }
  };


  const handleTargetJournalChange = (val: string) => {
    setTargetJournal(val);
    if (val.trim()) {
      setTargetJournalError(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!report) return;
    const originalTitle = document.title;
    const sanitized = (report.title || "Manuscript")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 45);
    document.title = `ManuView_Diagnostic_Report_${sanitized}`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  };

  const handleExportHTML = () => {
    if (!report) return;
    exportInteractiveHtmlReport(report);
  };

  const handleExportWord = () => {
    if (!report) return;
    exportWordDocReport(report);
  };

  const handleExportLatex = () => {
    if (!report) return;
    exportLatexRebuttalTable(report);
  };

  const handleExportBibTeX = () => {
    if (!report) return;
    exportBibTeX(report);
  };

  const handleSelectModel = (newModel: string) => {
    const saved = localStorage.getItem("manuview_provider_config");
    let currentConfig: ProviderConfig = {
      provider: "gemini",
      model: newModel,
      baseUrl: "http://localhost:11434",
      apiKey: "",
    };
    if (saved) {
      try {
        currentConfig = { ...JSON.parse(saved), model: newModel };
      } catch {}
    } else {
      currentConfig.model = newModel;
    }
    localStorage.setItem("manuview_provider_config", JSON.stringify(currentConfig));
    setActiveProviderInfo((prev) => ({ ...prev, model: newModel }));
    setModelDropdownOpen(false);
  };

  const handleLoadSample = () => {
    setManuscriptTitle(SAMPLE_PREPRINT_TITLE);
    setManuscriptAbstract(SAMPLE_PREPRINT_ABSTRACT);
    setManuscriptKeywords(SAMPLE_PREPRINT_KEYWORDS);
    setInputText(SAMPLE_PREPRINT_TEXT);
    setTargetJournal("Nature Communications");
    setTargetJournalError(false);
    setFile(null);
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleRunScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (apiStatus !== 'connected') {
      setError(
        apiStatus === 'unconfigured'
          ? "Pre-submission scan is disabled: No LLM API connection configured. Please set your API key in AI Settings."
          : "Pre-submission scan is disabled: The configured LLM connection is not working. Please fix your credentials in AI Settings."
      );
      return;
    }
    if (!targetJournal.trim()) {
      setTargetJournalError(true);
      setError("Target Journal is required. Please specify the journal you intend to submit to (e.g., Nature Genetics, Cancer Discovery, IEEE TPAMI).");
      return;
    }

    const isFileScan = !!file;
    const hasMetadata = !!(manuscriptTitle.trim() && manuscriptAbstract.trim());

    if (!isFileScan && !hasMetadata && !inputText.trim()) {
      setError("Please either upload a manuscript document (.pdf, .docx, .txt) or provide Manuscript Title and Abstract.");
      return;
    }

    setError(null);
    setLoading(true);
    setReport(null);

    let t1: any, t2: any, t3: any, t4: any;

    if (isFileScan) {
      // Progressive status updates for full document audit
      setLoadingStep("Extracting sections and parsing bibliography...");
      t1 = setTimeout(() => setLoadingStep("Resolving references against Crossref & Retraction Watch..."), 1200);
      t2 = setTimeout(() => setLoadingStep("Auditing causal claims against experimental controls..."), 2400);
      t3 = setTimeout(() => setLoadingStep("Evaluating methodology, sample power, and statistics..."), 3600);
      t4 = setTimeout(() => setLoadingStep("Simulating 5 peer-reviewer personas (including Devil's Advocate)..."), 4800);
    } else {
      // Fast editorial scope validation
      setLoadingStep("Evaluating manuscript title & abstract scope...");
      t1 = setTimeout(() => setLoadingStep(`Calibrating against ${targetJournal}'s aims and editorial criteria...`), 1000);
      t2 = setTimeout(() => setLoadingStep("Auditing keyword resonance and potential desk-reject hazards..."), 2000);
    }

    try {
      // Get user's provider config from localStorage if any
      const savedConfig = localStorage.getItem("manuview_provider_config");

      const formData = new FormData();
      if (file) formData.append("file", file);
      if (manuscriptTitle) formData.append("title", manuscriptTitle);
      if (manuscriptAbstract) formData.append("abstract", manuscriptAbstract);
      if (manuscriptKeywords) formData.append("keywords", manuscriptKeywords);
      if (inputText && !manuscriptTitle) formData.append("text", inputText);
      if (targetJournal) formData.append("targetJournal", targetJournal);
      if (savedConfig) formData.append("providerConfig", savedConfig);
      formData.append("mode", isFileScan ? "full" : "brief_fit");

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
    <div className="min-h-screen text-[#111827] dark:text-[#F8FAFC] py-8 sm:py-12 print:bg-white print:p-0 aura-bg-gradient aura-grid-pattern">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 print:max-w-none print:p-0">
        
        {/* Top Breadcrumb & Page Controls */}
        <div className="mb-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span>Workspace</span>
            <span>/</span>
            <span>Diagnostics</span>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white font-medium">Pre-Submission Scan</span>
          </div>

          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl liquid-glass-btn-secondary text-xs text-neutral-700 dark:text-neutral-300 transition shadow-xs cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
            <span>{activeProviderInfo.name}</span>
          </button>
        </div>

        {/* Workspace Card Container (Elevated Paper Sheet / Liquid Glass on Dark Canvas) */}
        <div className="aura-paper-sheet rounded-3xl p-6 sm:p-10 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.08)] border border-black/5 dark:border-white/10 print:border-none print:shadow-none print:p-0 print:rounded-none">

        {/* Modern Studio Header */}
        <div className="mb-8 print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Diagnostic Suite v2.0</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono hidden sm:inline">
                Crossref &bull; Retraction Watch &bull; 6 Dimensions
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-2.5">
            Manuscript Pre-Submission Diagnostic
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl">
            Calibrated peer-review simulation to surface desk-rejection hazards, causal overclaims, missing controls, and citation integrity bugs before formal submission.
          </p>
        </div>

        {/* Diagnostic Configuration Card */}
        <div className="mb-6 rounded-2xl liquid-glass-card border border-black/5 dark:border-white/10 p-5 print:hidden space-y-4 shadow-sm relative z-30">
          {/* Top Row: Target Journal Selection & AI Status Indicator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Target Journal Field */}
            <div className="lg:col-span-7 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Target Journal</span>
                  <span className="text-rose-500 font-bold" title="Required">*</span>
                </label>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Calibrates editorial acceptance rubric
                </span>
              </div>
              <div className="relative z-30">
                <JournalCombobox
                  value={targetJournal}
                  onChange={handleTargetJournalChange}
                  hasError={targetJournalError}
                  placeholder="Search 1,390+ academic journals or type custom title..."
                />
              </div>
              {targetJournalError && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Target Journal is required for calibrated rubric evaluation.</span>
                </p>
              )}
            </div>

            {/* AI Engine & Connection Status */}
            <div className="lg:col-span-5 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>AI Engine &amp; Model</span>
                </label>
                <button
                  type="button"
                  onClick={() => setSettingsOpen(true)}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Configure &rarr;
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Connected with Model Switcher Dropdown */}
                {apiStatus === 'connected' && (
                  <div className="relative inline-block flex-1 min-w-[180px] z-30">
                    <button
                      type="button"
                      onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-medium liquid-glass-btn-secondary cursor-pointer shadow-xs"
                      title="Click to switch between available models"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span className="truncate">
                          {activeProviderInfo.name}: <span className="font-mono font-semibold">{activeProviderInfo.model}</span>
                        </span>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${modelDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {modelDropdownOpen && (
                      <div className="absolute left-0 mt-1.5 w-80 rounded-2xl liquid-glass-modal p-2.5 z-40 animate-fade-in text-xs shadow-2xl border border-black/10 dark:border-white/10">
                        <div className="px-2 py-1.5 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 border-b border-black/5 dark:border-white/10 uppercase tracking-wider flex items-center justify-between">
                          <span>Available Models</span>
                          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">{availableModels.length} models</span>
                        </div>
                        <div className="max-h-56 overflow-y-auto py-1 space-y-1">
                          {availableModels.map((m) => {
                            const isCur = activeProviderInfo.model === m.id;
                            return (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => handleSelectModel(m.id)}
                                className={`w-full text-left px-2.5 py-2 rounded-xl transition flex items-start justify-between gap-2 ${
                                  isCur
                                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/20"
                                    : "text-neutral-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10"
                                }`}
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-xs truncate">{m.id}</span>
                                    {m.tag && (
                                      <span className="text-[9px] px-1.5 py-0.2 rounded font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                        {m.tag}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">{m.description}</div>
                                </div>
                                {isCur && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />}
                              </button>
                            );
                          })}
                        </div>
                        <div className="pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between px-1">
                          <button
                            type="button"
                            onClick={() => {
                              setModelDropdownOpen(false);
                              setSettingsOpen(true);
                            }}
                            className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                          >
                            AI Settings &amp; Custom Endpoints &rarr;
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Unconfigured state */}
                {apiStatus === 'unconfigured' && (
                  <button
                    type="button"
                    onClick={() => setSettingsOpen(true)}
                    className="flex-1 flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      <span>API Key Setup Required</span>
                    </div>
                    <span className="text-[10px] underline">Open Settings &rarr;</span>
                  </button>
                )}

                {/* Connection Error */}
                {apiStatus === 'error' && (
                  <button
                    type="button"
                    onClick={() => setSettingsOpen(true)}
                    className="flex-1 flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">Connection Offline</span>
                    </div>
                    <span className="text-[10px] underline shrink-0">Fix &rarr;</span>
                  </button>
                )}

                {/* Testing state */}
                {apiStatus === 'checking' && (
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Testing Connection...</span>
                  </div>
                )}

                {/* Unified Ping Value & Test Ping Button */}
                <button
                  type="button"
                  onClick={checkProviderStatus}
                  disabled={pinging}
                  title={
                    pinging
                      ? "Testing API latency..."
                      : scanPingResult
                      ? `${scanPingResult.success ? `Latency: ${scanPingResult.latencyMs}ms` : "Provider offline"} — Click to re-test ping`
                      : "Test API latency & verify connection"
                  }
                  className={`group relative min-w-[88px] sm:min-w-[96px] h-9 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shadow-xs disabled:opacity-60 cursor-pointer ${
                    pinging
                      ? "liquid-glass-btn-secondary text-blue-600 dark:text-blue-400 border border-blue-500/30"
                      : scanPingResult
                      ? scanPingResult.success
                        ? "bg-emerald-500/10 hover:bg-emerald-500/20 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border border-emerald-500/25 dark:border-emerald-700/40 text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200"
                        : "bg-rose-500/10 hover:bg-rose-500/20 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 border border-rose-500/25 dark:border-rose-700/40 text-rose-700 dark:text-rose-300 hover:text-rose-800 dark:hover:text-rose-200"
                      : "liquid-glass-btn-secondary text-neutral-700 dark:text-neutral-200 border border-black/5 dark:border-white/10"
                  }`}
                >
                  {pinging ? (
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 animate-spin text-blue-500 shrink-0" />
                      <span>Testing...</span>
                    </div>
                  ) : scanPingResult ? (
                    <>
                      {/* Default View: Shows Ping Value */}
                      <div className="flex items-center gap-1 font-mono font-bold group-hover:hidden transition-all duration-150">
                        <Zap className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                        <span>{scanPingResult.success ? `${scanPingResult.latencyMs}ms` : "Offline"}</span>
                      </div>

                      {/* Hover View: Shows Test Ping */}
                      <div className="hidden group-hover:flex items-center gap-1.5 transition-all duration-150">
                        <Activity className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300 shrink-0 transition-transform group-hover:scale-110" />
                        <span>Test Ping</span>
                      </div>
                    </>
                  ) : (
                    /* Initial View: No Ping Value Yet */
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 shrink-0" />
                      <span>Test Ping</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row: Feature Capabilities & Privacy Badges */}
          <div className="pt-3 border-t border-black/5 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-600 dark:text-neutral-400">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="flex items-center gap-1 font-medium">
                <CheckSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>6 Evaluation Dimensions</span>
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">&bull;</span>
              <span className="flex items-center gap-1 font-medium">
                <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>5 Reviewer Personas</span>
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">&bull;</span>
              <span className="flex items-center gap-1 font-medium">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Crossref DOI &amp; Retraction Check</span>
              </span>
            </div>

            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero data retention &bull; In-memory only</span>
            </div>
          </div>
        </div>

        {/* Input Form Card */}
        {!report && (
          <div className="space-y-6">
            {/* Quick Demo Preprint Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl liquid-glass-card border border-amber-500/20 dark:border-amber-500/20 bg-gradient-to-r from-amber-500/5 via-transparent to-blue-500/5 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                    First time evaluating ManuView?
                  </div>
                  <div className="text-neutral-600 dark:text-neutral-400 text-[11px] mt-0.5">
                    Load our peer-reviewed cancer genomics sample preprint to test all 6 diagnostic rubrics instantly.
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLoadSample}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl liquid-glass-btn-secondary text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition shadow-xs shrink-0 self-start sm:self-auto cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Load Sample Preprint</span>
              </button>
            </div>

            <form onSubmit={handleRunScan} className="space-y-5">
              {/* Manuscript Draft Submission Studio */}
              <div className="rounded-3xl liquid-glass-card border border-black/5 dark:border-white/10 p-5 sm:p-7 space-y-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                      Manuscript Draft Submission
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Upload full document or paste text
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  {/* Left Column (5 cols): File Upload Dropzone */}
                  <div className="lg:col-span-5 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                        Upload Full Manuscript
                      </label>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        Full Audit
                      </span>
                    </div>

                    <label className={`flex-1 flex flex-col items-center justify-center rounded-2xl p-6 transition-all duration-200 cursor-pointer min-h-[260px] text-center border-2 border-dashed ${
                      file
                        ? "bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/40 dark:border-blue-500/40"
                        : "liquid-glass-card hover:bg-black/[0.02] dark:hover:bg-white/[0.04] border-black/15 dark:border-white/15 hover:border-blue-500/50"
                    }`}>
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 shadow-2xs">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 max-w-full truncate px-3">
                        {file ? file.name : "Drop manuscript file here, or browse"}
                      </span>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs px-2">
                        {file
                          ? `${(file.size / 1024).toFixed(1)} KB • Click to replace`
                          : "Supports PDF, DOCX, TXT. Generates all 5 persona reports & bibliography check."}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.docx,.txt,application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    {file && (
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline self-end mt-2 cursor-pointer font-medium"
                      >
                        Remove file &amp; use Title / Abstract
                      </button>
                    )}
                  </div>

                  {/* Right Column (7 cols): Title, Abstract & Keywords */}
                  <div className="lg:col-span-7 space-y-3.5 liquid-glass-card rounded-2xl p-4 sm:p-5 border border-black/5 dark:border-white/10 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10">
                      <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                        Or Provide Title, Abstract &amp; Keywords
                      </label>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                        Quick Journal Fit
                      </span>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center justify-between">
                        <span>Manuscript Title <span className="text-rose-500">*</span></span>
                      </label>
                      <input
                        type="text"
                        value={manuscriptTitle}
                        onChange={(e) => {
                          setManuscriptTitle(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="e.g. Single-cell transcriptional profiling of DLL3..."
                        className="w-full px-3.5 py-2 rounded-xl liquid-glass-input text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                          Abstract <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {manuscriptAbstract.trim() ? `${manuscriptAbstract.trim().split(/\s+/).length} words` : "0 words"}
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        value={manuscriptAbstract}
                        onChange={(e) => {
                          setManuscriptAbstract(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="Paste or summarize background, main findings, methodology, and conclusions..."
                        className="w-full p-3 rounded-xl liquid-glass-input text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 leading-relaxed focus:outline-none resize-y"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1 block">
                        Keywords <span className="text-neutral-400 font-normal">(comma-separated)</span>
                      </label>
                      <input
                        type="text"
                        value={manuscriptKeywords}
                        onChange={(e) => setManuscriptKeywords(e.target.value)}
                        placeholder="e.g. small cell lung cancer, DLL3, CRISPR screen, organoids"
                        className="w-full px-3.5 py-2 rounded-xl liquid-glass-input text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span className="font-medium">{error}</span>
                  </div>
                )}
              </div>

              {/* Connection Status Callout Banners */}
              {apiStatus === 'unconfigured' && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-300">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-900 dark:text-amber-200 block">LLM API Connection Required:</span>
                      <span className="text-amber-800/90 dark:text-amber-300/90">
                        Pre-submission diagnostic scans require an active AI model to generate peer-review simulation and editorial triage. You can upload files or paste text now, but must configure an API key to run the scan.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettingsOpen(true)}
                    className="px-3.5 py-2 rounded-xl liquid-glass-btn-secondary text-amber-800 dark:text-amber-200 font-semibold text-xs transition whitespace-nowrap self-start sm:self-auto cursor-pointer"
                  >
                    Configure AI Settings
                  </button>
                </div>
              )}

              {apiStatus === 'error' && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-800 dark:text-rose-300">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-rose-900 dark:text-rose-200 block">API Key Not Working / Unreachable:</span>
                      <span className="font-mono text-[11px] text-rose-800/90 dark:text-rose-300/90 block mt-0.5 break-words">
                        {apiErrorMessage || "Unable to communicate with the configured model. Please verify your credentials."}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
                    <button
                      type="button"
                      onClick={checkProviderStatus}
                      className="px-3 py-1.5 rounded-xl liquid-glass-btn-secondary text-rose-800 dark:text-rose-200 font-semibold text-xs transition whitespace-nowrap cursor-pointer"
                    >
                      Retry Ping
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettingsOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl liquid-glass-btn-primary text-white font-semibold text-xs transition whitespace-nowrap cursor-pointer"
                    >
                      Fix in Settings
                    </button>
                  </div>
                </div>
              )}

              {apiStatus === 'checking' && (
                <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-500 shrink-0" />
                  <span>Verifying LLM API connection status...</span>
                </div>
              )}

              {/* Flagship Prominent Action Button */}
              <button
                type="submit"
                disabled={loading || apiStatus !== 'connected'}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-2 shadow-lg cursor-pointer ${
                  apiStatus === 'connected' && !loading
                    ? "liquid-glass-btn-cta active:scale-[0.99]"
                    : "opacity-60 bg-neutral-300 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-400/20 cursor-not-allowed shadow-none"
                }`}
                title={apiStatus !== 'connected' ? "Valid LLM API connection required to run diagnostic scan" : "Run Pre-Submission Diagnostic Scan"}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2.5">
                    <RefreshCw className="w-5 h-5 animate-spin text-white shrink-0" />
                    <span>{loadingStep || "Analyzing Manuscript..."}</span>
                  </span>
                ) : (
                  <div className="flex items-center justify-center gap-2.5">
                    <Sparkles className="w-5 h-5 shrink-0 text-white" />
                    <span>
                      {file ? "Run Comprehensive Pre-Submission Diagnostic" : "Validate Target Journal Scope & Fit"}
                    </span>
                  </div>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Diagnostic Report Results (Interactive Notion Web View) */}
        {report && (
          report.mode === "brief_fit" ? (
            <BriefJournalFitView
              report={report as BriefJournalFitReport}
              onBack={() => setReport(null)}
              onDownloadPDF={handleDownloadPDF}
              activeProviderInfo={activeProviderInfo}
            />
          ) : (
            <div className="space-y-8 animate-fade-in print:hidden">


            {/* Top Navigation Bar in Results */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/5 dark:border-white/10 print:hidden">
              <button
                onClick={() => setReport(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-glass-btn-secondary text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition cursor-pointer self-start"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Input</span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <div className="hidden md:flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mr-1">
                  <span>Target:</span>
                  <span className="text-neutral-900 dark:text-white font-medium bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-lg border border-black/5 dark:border-white/10">{report.targetJournal || "General High Impact"}</span>
                </div>

                <button
                  type="button"
                  onClick={handleExportHTML}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-glass-btn-secondary text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition shadow-2xs cursor-pointer"
                  title="Export self-contained Interactive Web Report (.html) for offline viewing and sharing"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Interactive HTML</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportWord}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-glass-btn-secondary text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition shadow-2xs cursor-pointer"
                  title="Export Diagnostic Report as Microsoft Word Document (.doc / .docx)"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Word (.docx)</span>
                </button>

                {report.isEligibleForReview !== false && (
                  <button
                    type="button"
                    onClick={handleExportLatex}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-glass-btn-secondary text-xs font-semibold text-purple-700 dark:text-purple-300 transition shadow-2xs cursor-pointer"
                    title="Export LaTeX Point-by-Point Author Rebuttal Matrix (.tex)"
                  >
                    <FileCode className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>LaTeX Rebuttal</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleExportBibTeX}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-glass-btn-secondary text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition shadow-2xs cursor-pointer"
                  title="Export Audited Citations as BibTeX (.bib)"
                >
                  <Bookmark className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>BibTeX (.bib)</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl liquid-glass-btn-primary text-white text-xs font-semibold transition shadow-xs cursor-pointer"
                  title="Download / Save as PDF Diagnostic Report"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF Report</span>
                </button>
              </div>
            </div>

            {/* Document Title Header */}
            <div className="space-y-2">
              <div className="text-3xl select-none">📑</div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F3437] leading-snug">
                {report.title}
              </h2>
            </div>

            {/* Document Classification & Personalized Salutation Callout (Only for review-eligible manuscripts) */}
            {report.isEligibleForReview !== false && report.classification && report.classification.isAcademicManuscript && (
              <div className={`p-5 rounded-xl border text-xs space-y-3 ${
                report.classification.isAcademicManuscript
                  ? "bg-[#EDF6EE] border-[#CBE7CE] text-[#1E5A2A]"
                  : report.classification.category === "source_code"
                  ? "bg-[#EBF3FB] border-[#CDE1F8] text-[#18569C]"
                  : report.classification.category === "resume_cv"
                  ? "bg-[#EBF3FB] border-[#CDE1F8] text-[#18569C]"
                  : "bg-[#FBF3DB] border-[#F4E2B6] text-[#78510E]"
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#EBEBEA]">
                  <div className="flex items-center gap-2">
                    <span className="text-base select-none">
                      {report.classification.isAcademicManuscript ? "🔬" :
                       report.classification.category === "source_code" ? "💻" :
                       report.classification.category === "resume_cv" ? "👤" : "⚠️"}
                    </span>
                    <span className="font-semibold text-[#2F3437]">
                      Document Classification: {report.classification.categoryLabel}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-white/70 border border-[#EBEBEA]">
                      {report.classification.isAcademicManuscript ? "Academic Paper" : "Non-Manuscript Content"}
                    </span>
                  </div>

                  {!report.classification.isAcademicManuscript && (
                    <button
                      type="button"
                      onClick={handleLoadSample}
                      className="px-2.5 py-1 rounded bg-white hover:bg-[#F7F7F5] text-[#2F3437] border border-[#EBEBEA] shadow-2xs text-[11px] font-medium transition flex items-center gap-1 self-start sm:self-auto"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Test with Sample Research Preprint
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="font-medium text-[#2F3437]">
                    {report.classification.salutation}
                  </div>
                  <p className="leading-relaxed opacity-90 font-light">
                    {report.classification.advisoryMessage}
                  </p>

                  {/* Detected Features Pills */}
                  {report.classification.detectedFeatures && report.classification.detectedFeatures.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      {report.classification.detectedFeatures.map((feat, idx) => (
                        <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-white/70 border border-[#EBEBEA] text-[#2F3437]">
                          &bull; {feat}
                        </span>
                      ))}
                    </div>
                  )}

                  {report.classification.customGuidance && (
                    <div className="mt-2 pt-2 border-t border-white/10 text-[11px] flex items-start gap-1.5">
                      <span className="font-semibold text-[#2F3437]">Recommended Action:</span>
                      <span>{report.classification.customGuidance}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ineligible: Already Published Article OR Non-Academic File */}
            {report.isEligibleForReview === false || (report.classification && !report.classification.isAcademicManuscript) ? (
              report.ineligibilityReason === "already_published" ? (
                <div className="p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-emerald-950">Already Published Article Detected</h3>
                        <p className="text-xs text-emerald-800">
                          Established record in scholarly literature. Pre-submission peer-review simulation safely bypassed.
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Published Article
                    </span>
                  </div>

                  {report.publishedDetails && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-emerald-200/70 text-xs">
                      {report.publishedDetails.journalName && (
                        <div className="p-3 rounded-xl bg-white/90 border border-emerald-200/60">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Published Journal</span>
                          <span className="font-semibold text-emerald-950 truncate block mt-0.5" title={report.publishedDetails.journalName}>
                            {report.publishedDetails.journalName}
                          </span>
                        </div>
                      )}
                      {report.publishedDetails.publicationDate && (
                        <div className="p-3 rounded-xl bg-white/90 border border-emerald-200/60">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Publication Date</span>
                          <span className="font-semibold text-emerald-950 block mt-0.5">
                            {report.publishedDetails.publicationDate}
                          </span>
                        </div>
                      )}
                      {report.publishedDetails.publisher && (
                        <div className="p-3 rounded-xl bg-white/90 border border-emerald-200/60">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Publisher</span>
                          <span className="font-semibold text-emerald-950 truncate block mt-0.5" title={report.publishedDetails.publisher}>
                            {report.publishedDetails.publisher}
                          </span>
                        </div>
                      )}
                      {report.publishedDetails.doi && (
                        <div className="p-3 rounded-xl bg-white/90 border border-emerald-200/60">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Official Article DOI</span>
                          <a
                            href={`https://doi.org/${report.publishedDetails.doi}`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-emerald-700 hover:text-emerald-900 hover:underline inline-flex items-center gap-1 truncate block mt-0.5"
                          >
                            <span className="truncate">{report.publishedDetails.doi}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-white/80 border border-emerald-200/60 text-xs text-neutral-700">
                    <span className="font-bold text-emerald-950 block mb-1">Status Note:</span>
                    <p className="leading-relaxed">{report.summary}</p>
                  </div>

                  <div className="pt-3 border-t border-emerald-200/70 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="button"
                      onClick={handleLoadSample}
                      className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#0A85EA] hover:bg-[#0075EB] text-white shadow-sm text-xs font-medium transition flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Load Sample Preprint to See Full Peer-Review Diagnostic
                    </button>
                    <button
                      type="button"
                      onClick={() => setReport(null)}
                      className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium transition"
                    >
                      Upload an Unpublished Draft (.pdf / .docx / text)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-[#F7F7F5] border border-[#EBEBEA] space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#78510E] uppercase tracking-wider">
                      <Info className="w-4 h-4" />
                      Academic Peer-Review Rubrics Omitted
                    </div>
                    <h3 className="text-xl font-serif font-bold text-[#2F3437]">
                      Why are scientific peer-review scores omitted for this file?
                    </h3>
                    <p className="text-xs sm:text-sm text-[#787774] leading-relaxed font-light">
                      ManuView&apos;s <strong>Submission Readiness Score</strong>, <strong>Editorial Triage Synthesis</strong>, <strong>6 Evaluation Dimensions</strong>, <strong>5-Persona Reviewer Simulation</strong>, <strong>Citation Integrity Audit</strong>, and <strong>Target Journal Recommendation Tiers</strong> are specifically calibrated against empirical research papers and clinical trial standards. Because this file is classified as <strong>{report.classification?.categoryLabel || "Non-Academic Content"}</strong>, journal peer-review metrics are not applicable and have been omitted.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#EBEBEA] text-xs">
                      <div className="p-4 rounded-xl bg-white border border-[#EBEBEA]">
                        <div className="font-medium text-[#2F3437] mb-2 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                          What ManuView Reviews
                        </div>
                        <ul className="space-y-1.5 text-[#787774]">
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                            Empirical research papers &amp; preprints (bioRxiv, arXiv, medRxiv)
                          </li>
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                            IMRaD structured drafts (Abstract, Methods, Results, Discussion)
                          </li>
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                            Causal claims, experimental controls, and sample size power
                          </li>
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                            Reference lists with Crossref DOIs &amp; Retraction Watch screening
                          </li>
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl bg-white border border-[#EBEBEA]">
                        <div className="font-medium text-[#2F3437] mb-2 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#78510E]" />
                          Detected in This Submission
                        </div>
                        <ul className="space-y-1.5 text-[#787774]">
                          <li>• File Type: <span className="text-[#2F3437] font-medium">{report.classification.categoryLabel}</span></li>
                          <li>• Identified Role: <span className="text-[#2F3437] font-medium">{report.classification.salutation}</span></li>
                          <li>• Scientific Sections: <span className="text-[#78510E]">Not present (IMRaD absent)</span></li>
                          <li>• Peer-Reviewed Citations: <span className="text-[#2F3437]">{report.citationIntegrity && report.citationIntegrity.totalReferences > 0 ? `${report.citationIntegrity.totalReferences} found` : "0 references detected"}</span></li>
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#EBEBEA] flex flex-col sm:flex-row items-center gap-3">
                      <button
                        type="button"
                        onClick={handleLoadSample}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#0A85EA] hover:bg-[#0075EB] text-[#2F3437] border border-[#0A85EA] shadow-sm text-xs font-medium transition flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                        Load Sample Preprint to See Full Peer-Review Diagnostic
                      </button>
                      <button
                        type="button"
                        onClick={() => setReport(null)}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white hover:bg-[#F7F7F5] text-[#787774] hover:text-[#2F3437] border border-[#EBEBEA] text-xs font-medium transition"
                      >
                        Upload a Research Paper (.pdf / .docx / text)
                      </button>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <>
                {/* Score & Editorial Triage Block */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Readiness Score Card */}
                  <div className="p-5 rounded-xl bg-[#F7F7F5] border border-[#EBEBEA] flex flex-col justify-center items-center text-center">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#787774] mb-1">
                      Readiness Score
                    </div>
                    <div className="flex items-baseline gap-1 my-1">
                      <span className="text-4xl font-bold font-serif text-[#2F3437]">{report.overallScore ?? 0}</span>
                      <span className="text-[#9B9A97] text-sm font-serif">/100</span>
                    </div>
                    <div className={`mt-1 px-2.5 py-0.5 rounded text-[11px] font-medium border ${
                      (report.overallScore ?? 0) >= 80 ? "bg-[#EDF6EE] text-[#1E5A2A] border-[#CBE7CE]" :
                      (report.overallScore ?? 0) >= 65 ? "bg-[#FBF3DB] text-[#78510E] border-[#F4E2B6]" :
                      "bg-[#FDF0EF] text-[#7C2D2B] border-[#F7CECC]"
                    }`}>
                      {(report.overallScore ?? 0) >= 80 ? "Submission Ready" :
                       (report.overallScore ?? 0) >= 65 ? "Revision Prioritized" :
                       "Substantive Hazards"}
                    </div>
                  </div>

                  {/* Editorial Summary Callout */}
                  <div className="md:col-span-3 p-5 rounded-xl bg-[#F7F7F5] border border-[#EBEBEA] flex flex-col justify-center">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E5A2A] mb-2">
                      <span className="text-sm select-none">📌</span>
                      <span className="uppercase tracking-wider">Editorial Triage Synthesis</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#787774] leading-relaxed font-light">
                      {report.summary}
                    </p>
                  </div>
                </div>

                {/* Reporting Guideline Compliance Audit Card (STROBE, CONSORT, PRISMA, ARRIVE, etc.) */}
                {report.reportingGuideline && (
                  <div className="p-5 rounded-xl bg-[#F7F7F5] border border-[#EBEBEA] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EBEBEA]">
                      <div>
                        <div className="flex items-center gap-2">
                          <Scale className="w-4 h-4 text-[#1E5A2A]" />
                          <h3 className="text-sm font-semibold text-[#2F3437]">
                            Reporting Guideline Compliance: {report.reportingGuideline.guidelineName}
                          </h3>
                        </div>
                        <p className="text-xs text-[#787774] mt-0.5">
                          Standard: {report.reportingGuideline.standardType}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-[#787774]">Audit Score:</span>
                        <span className="text-xs font-bold text-[#1E5A2A] bg-[#EDF6EE] px-2.5 py-0.5 rounded-full border border-[#CBE7CE]">
                          {report.reportingGuideline.scorePercent}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-lg bg-white border border-[#CBE7CE] space-y-2 text-xs">
                        <span className="font-semibold text-[#1E5A2A] uppercase tracking-wider text-[10px] block">
                          Compliant Checklist Items:
                        </span>
                        <ul className="space-y-1.5 text-[#1E5A2A]">
                          {report.reportingGuideline.compliantItems.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-500" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-lg bg-white border border-[#F4E2B6] space-y-2 text-xs">
                        <span className="font-semibold text-[#78510E] uppercase tracking-wider text-[10px] block">
                          Missing or Partial Reporting Items:
                        </span>
                        <ul className="space-y-1.5 text-[#78510E]">
                          {report.reportingGuideline.missingOrPartialItems.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* The 6 Evaluation Dimensions */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#2F3437]">
                      <BarChart3 className="w-4 h-4 text-[#787774]" />
                      <span>The 6 Evaluation Dimensions (1–5 Scale)</span>
                    </div>
                    <span className="text-[11px] text-[#787774]">Calibrated against top-tier standards</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(report.dimensions || {}).map(([key, dim]) => (
                      <div key={key} className="p-4 rounded-xl bg-[#F7F7F5] border border-[#EBEBEA] flex flex-col justify-between hover:border-[#d0d0d0] hover:shadow-2xs transition space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#2F3437]">{dim.label}</span>
                            <span className={`px-2 py-0.5 rounded font-mono text-xs font-semibold border ${
                              dim.score >= 4 ? "bg-[#EDF6EE] text-[#1E5A2A] border-[#CBE7CE]" :
                              dim.score === 3 ? "bg-[#FBF3DB] text-[#78510E] border-[#F4E2B6]" :
                              "bg-[#FDF0EF] text-[#7C2D2B] border-[#F7CECC]"
                            }`}>
                              {dim.score} / 5
                            </span>
                          </div>
                          <p className="text-xs text-[#787774] leading-relaxed font-light">
                            {dim.verdict}
                          </p>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-[#EBEBEA] text-xs">
                          {dim.strengths && dim.strengths.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-semibold text-[#1E5A2A] uppercase tracking-wider block">Strengths:</span>
                              <ul className="space-y-1 text-[#1E5A2A] text-[11px]">
                                {dim.strengths.map((s, i) => (
                                  <li key={i} className="flex items-start gap-1">
                                    <span className="font-bold">&bull;</span>
                                    <span>{s}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {dim.vulnerabilities && dim.vulnerabilities.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-semibold text-[#7C2D2B] uppercase tracking-wider block">Vulnerabilities:</span>
                              <ul className="space-y-1 text-[#7C2D2B] text-[11px]">
                                {dim.vulnerabilities.map((v, i) => (
                                  <li key={i} className="flex items-start gap-1">
                                    <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                    <span>{v}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prioritized Action Plan */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#2F3437]">
                      <AlertCircle className="w-4 h-4 text-[#7C2D2B]" />
                      <span>Prioritized Action Plan before Submission</span>
                    </div>

                    {/* Priority Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIssueFilter("all")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                          issueFilter === "all"
                            ? "bg-white text-[#2F3437] font-semibold border border-[#d0d0d0] shadow-2xs"
                            : "text-[#787774] hover:text-[#2F3437] hover:bg-[#F7F7F5]"
                        }`}
                      >
                        All ({(report.priorityIssues || []).length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setIssueFilter("A")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                          issueFilter === "A"
                            ? "bg-[#FDF0EF] text-[#7C2D2B] font-semibold border border-[#F7CECC] shadow-2xs"
                            : "text-[#7C2D2B] hover:bg-[#FDF0EF]"
                        }`}
                      >
                        🚨 Priority A
                      </button>
                      <button
                        type="button"
                        onClick={() => setIssueFilter("B")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                          issueFilter === "B"
                            ? "bg-[#FBF3DB] text-[#78510E] font-semibold border border-[#F4E2B6] shadow-2xs"
                            : "text-[#78510E] hover:bg-[#FBF3DB]"
                        }`}
                      >
                        ⚠️ Priority B
                      </button>
                      <button
                        type="button"
                        onClick={() => setIssueFilter("C")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                          issueFilter === "C"
                            ? "bg-[#EDF6EE] text-[#1E5A2A] font-semibold border border-[#CBE7CE] shadow-2xs"
                            : "text-[#1E5A2A] hover:bg-[#EDF6EE]"
                        }`}
                      >
                        💡 Priority C
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {(report.priorityIssues || [])
                      .filter((iss: PriorityIssue) => issueFilter === "all" || iss.priority === issueFilter)
                      .map((issue: PriorityIssue) => (
                      <div
                        key={issue.id}
                        className="p-5 rounded-xl bg-[#F7F7F5] border border-[#EBEBEA] space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              issue.priority === "A" ? "bg-[#FDF0EF] text-[#7C2D2B] border-[#F7CECC]" :
                              issue.priority === "B" ? "bg-[#FBF3DB] text-[#78510E] border-[#F4E2B6]" :
                              "bg-white text-[#787774] border-[#EBEBEA]"
                            }`}>
                              Priority {issue.priority}
                            </span>
                            <span className="text-[11px] font-medium text-[#787774] uppercase tracking-wide">
                              {issue.category}
                            </span>
                            <span className="font-mono text-[10px] text-[#787774]">{issue.id}</span>
                          </div>
                          <span className="text-[11px] text-[#787774]">
                            {issue.priority === "A" ? "Desk-Reject Hazard" : "Reviewer Objection"}
                          </span>
                        </div>

                        <h4 className="text-sm font-semibold text-[#2F3437]">{issue.title}</h4>
                        <p className="text-xs text-[#787774] leading-relaxed">{issue.description}</p>

                        {/* Typed Evidence Anchor */}
                        {issue.evidenceAnchor && (
                          <div className="p-2.5 rounded-lg bg-white border border-[#CBD5E1] text-[11px] font-mono text-[#2F3437] flex items-center gap-2">
                            <FileCode className="w-3.5 h-3.5 text-[#0A85EA] shrink-0" />
                            <span className="font-bold text-[#787774] uppercase tracking-wider text-[9px] px-1.5 py-0.5 rounded bg-[#F7F7F5] border border-[#EBEBEA]">
                              Anchor
                            </span>
                            <span className="truncate">{issue.evidenceAnchor}</span>
                          </div>
                        )}

                        {/* Reviewer Anticipated Reaction */}
                        {issue.reviewerQuote && (
                          <div className="border-l-2 border-[#d0d0d0] pl-3 py-0.5 text-xs italic text-[#2F3437] font-serif">
                            &ldquo;{issue.reviewerQuote}&rdquo;
                          </div>
                        )}

                        {/* Required Pre-Submission Fix */}
                        {issue.actionableFix && (
                          <div className="p-3 rounded-xl bg-white border border-[#CBE7CE] text-xs text-[#1E5A2A] flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-[#2F3437] block mb-0.5">Required Pre-Submission Fix:</span>
                              {issue.actionableFix}
                            </div>
                          </div>
                        )}

                        {/* Point-by-Point Author Rebuttal Strategy */}
                        {issue.rebuttalStrategy && (
                          <div className="p-3 rounded-xl bg-white border border-[#BFDBFE] text-xs text-[#18569C] flex items-start gap-2">
                            <MessageSquare className="w-3.5 h-3.5 text-[#0A85EA] flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-[#18569C] block mb-0.5">
                                Point-by-Point Author Rebuttal Framing (for Journal Response Letter):
                              </span>
                              <p className="leading-relaxed font-light whitespace-pre-line text-[#18569C]">
                                {issue.rebuttalStrategy}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5-Persona Peer-Review Simulation (Adversarial Panel) */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#2F3437]">
                      <Users className="w-4 h-4 text-[#787774]" />
                      <span>5-Persona Peer-Review Simulation (Adversarial Panel)</span>
                    </div>
                    <span className="text-[11px] text-[#787774]">
                      Independent domain evaluations
                    </span>
                  </div>

                  {/* Notion-style database view tabs */}
                  <div className="flex items-center gap-1 border-b border-[#EBEBEA] pb-1 overflow-x-auto">
                    {(report.reviewerPersonas || []).map((p: ReviewerPersonaFeedback, idx: number) => {
                      const isActive = selectedPersona === idx;
                      const isDevilsAdvocate = p.persona === "devils_advocate" || idx === 4;
                      return (
                        <button
                          key={p.persona || idx}
                          onClick={() => setSelectedPersona(idx)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition cursor-pointer ${
                            isActive
                              ? isDevilsAdvocate
                                ? "bg-[#7F1D1D] text-white font-semibold border border-[#7F1D1D] shadow-2xs"
                                : "bg-white text-[#2F3437] font-semibold border border-[#d0d0d0] shadow-2xs"
                              : isDevilsAdvocate
                              ? "text-[#7C2D2B] bg-[#FDF0EF] hover:bg-[#FCE6E5] border border-[#F7CECC]"
                              : "text-[#787774] hover:text-[#2F3437] hover:bg-[#F7F7F5]"
                          }`}
                        >
                          <span>
                            {p.persona === "methods_reviewer" ? "🔬" :
                             p.persona === "domain_expert" ? "🧬" :
                             p.persona === "journal_editor" ? "📑" :
                             p.persona === "statistician" ? "📊" :
                             p.persona === "devils_advocate" ? "⚡" :
                             (idx === 0 ? "🔬" : idx === 1 ? "🧬" : idx === 2 ? "📑" : idx === 3 ? "📊" : "⚡")}
                          </span>
                          <span>{p.name.split(" ")[0]} {p.name.split(" ")[1] || ""}</span>
                          {isDevilsAdvocate && (
                            <span className={`text-[9px] uppercase px-1 py-0.2 rounded font-bold ${
                              isActive ? "bg-white/20 text-white" : "bg-[#FDF0EF] text-[#7C2D2B] border border-[#F7CECC]"
                            }`}>
                              Stress-Test
                            </span>
                          )}
                          {p.decisionRecommendation && (
                            <span className={`text-[9px] px-1 py-0.2 rounded border ${
                              isActive
                                ? "bg-black/10 text-inherit border-transparent"
                                : p.decisionRecommendation.includes("Reject")
                                ? "text-[#7C2D2B] border-[#F7CECC] bg-[#FDF0EF]"
                                : "text-[#78510E] border-[#F4E2B6] bg-[#FBF3DB]"
                            }`}>
                              {p.decisionRecommendation}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active persona card */}
                  {report.reviewerPersonas && report.reviewerPersonas[selectedPersona] && (() => {
                    const active = report.reviewerPersonas[selectedPersona];
                    const isReject = active.decisionRecommendation?.includes("Reject");
                    const isDevilsAdvocate = active.persona === "devils_advocate" || selectedPersona === 4;
                    return (
                      <div className={`p-6 rounded-xl bg-[#F7F7F5] border border-[#EBEBEA] space-y-5 animate-fade-in ${
                        isDevilsAdvocate ? "border-rose-300 ring-1 ring-rose-200" : ""
                      }`}>
                        {/* Header with Title and Affiliation */}
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 pb-4 border-b border-[#EBEBEA]">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-base font-serif font-bold text-[#2F3437]">
                                {active.name}
                              </h4>
                              {active.decisionRecommendation && (
                                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                                  isReject
                                    ? "bg-[#FDF0EF] text-[#7C2D2B] border-[#F7CECC]"
                                    : "bg-[#FBF3DB] text-[#78510E] border-[#F4E2B6]"
                                }`}>
                                  Decision: {active.decisionRecommendation}
                                </span>
                              )}
                              {isDevilsAdvocate && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
                                  ⚡ Hostile Stress-Test / Adversarial Referee
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-[#787774]">
                              {active.title}
                            </div>
                            {active.affiliation && (
                              <div className="text-[11px] text-[#787774] flex items-center gap-1.5">
                                <GraduationCap className="w-3.5 h-3.5" />
                                <span>{active.affiliation}</span>
                              </div>
                            )}
                          </div>

                          {active.expertise && (
                            <div className="p-2.5 rounded-lg bg-white border border-[#EBEBEA] text-[11px] text-[#787774] md:max-w-xs">
                              <span className="font-semibold text-[#1E5A2A] block mb-0.5">Focus:</span>
                              {active.expertise}
                            </div>
                          )}
                        </div>

                        {/* Evidence Anchors (Grounding) */}
                        {active.evidenceAnchors && active.evidenceAnchors.length > 0 && (
                          <div className="space-y-1.5">
                            <div className="text-xs font-semibold text-[#787774] uppercase tracking-wider flex items-center gap-1.5">
                              <FileCode className="w-3.5 h-3.5 text-[#0A85EA]" />
                              <span>Manuscript Evidence Anchors (Grounding):</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {active.evidenceAnchors.map((anchor: string, aIdx: number) => (
                                <span
                                  key={aIdx}
                                  className="font-mono text-[11px] px-2.5 py-1 rounded bg-white border border-[#CBD5E1] text-[#2F3437]"
                                >
                                  {anchor}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Fatal Reviewer Objection Callout */}
                        {active.keyChallenge && (
                          <div className="p-3.5 rounded-xl bg-[#FDF0EF] border border-[#F7CECC] text-xs text-[#7C2D2B] flex items-start gap-2.5">
                            <span className="text-base select-none">⚠️</span>
                            <div>
                              <span className="font-semibold text-[#2F3437] block mb-0.5 uppercase tracking-wider text-[10px]">
                                Fatal Reviewer Objection:
                              </span>
                              {active.keyChallenge}
                            </div>
                          </div>
                        )}

                        {/* Detailed Peer-Review Assessment */}
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-[#787774] uppercase tracking-wider">
                            Detailed Peer-Review Assessment:
                          </div>
                          <div className="text-xs text-[#787774] leading-relaxed font-light p-3.5 rounded-xl bg-white border border-[#EBEBEA] text-[#2F3437] whitespace-pre-line">
                            {active.assessment}
                          </div>
                        </div>

                        {/* Adversarial Defenses & Pre-emptive Arguments to Prepare */}
                        {active.counterArguments && active.counterArguments.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-xs font-semibold text-[#5B21B6] uppercase tracking-wider flex items-center gap-1.5">
                              <ShieldAlert className="w-3.5 h-3.5 text-[#7C3AED]" />
                              <span>Adversarial Defenses &amp; Pre-emptive Arguments to Prepare:</span>
                            </div>
                            <div className="space-y-1.5">
                              {active.counterArguments.map((arg: string, cIdx: number) => (
                                <div key={cIdx} className="p-2.5 rounded-lg bg-white border border-[#DDD6FE] text-xs text-[#5B21B6] flex items-start gap-2">
                                  <span className="font-mono text-[#7C3AED] font-bold text-[11px] mt-0.5">[{cIdx + 1}]</span>
                                  <span className="leading-relaxed">{arg}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Major Vulnerabilities */}
                        {active.majorCritiques && active.majorCritiques.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-xs font-semibold text-[#7C2D2B] uppercase tracking-wider flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Major Methodological Vulnerabilities:</span>
                            </div>
                            <div className="space-y-1.5">
                              {active.majorCritiques.map((critique: string, i: number) => (
                                <div key={i} className="p-2.5 rounded-lg bg-white border border-[#EBEBEA] text-xs text-[#2F3437] flex items-start gap-2">
                                  <span className="font-mono text-[#7C2D2B] font-bold text-[11px] mt-0.5">[{i + 1}]</span>
                                  <span className="leading-relaxed">{critique}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Missing Controls */}
                        {active.missingControlsOrAnalyses && active.missingControlsOrAnalyses.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-xs font-semibold text-[#78510E] uppercase tracking-wider flex items-center gap-1.5">
                              <FlaskConical className="w-3.5 h-3.5" />
                              <span>Missing Experimental Controls &amp; Analyses:</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {active.missingControlsOrAnalyses.map((ctrl: string, i: number) => (
                                <div key={i} className="p-2.5 rounded-lg bg-white border border-[#EBEBEA] text-xs text-[#2F3437] flex items-start gap-2">
                                  <span className="text-[#78510E] font-bold">•</span>
                                  <span className="leading-relaxed">{ctrl}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Mandatory Revisions Demanded */}
                        <div className="space-y-2 pt-2 border-t border-[#EBEBEA]">
                          <div className="text-xs font-semibold text-[#1E5A2A] uppercase tracking-wider flex items-center gap-1.5">
                            <CheckSquare className="w-3.5 h-3.5" />
                            <span>Mandatory Revisions Demanded for Re-Review:</span>
                          </div>
                          <div className="space-y-1.5">
                            {active.mustAddressItems.map((item: string, i: number) => (
                              <div key={i} className="p-2.5 rounded-lg bg-white border border-[#EBEBEA] text-xs text-[#2F3437] flex items-start gap-2">
                                <span className="text-[#1E5A2A] font-bold">✓</span>
                                <span className="leading-relaxed">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Citation & Reference Integrity Audit */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#2F3437]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Citation &amp; Reference Integrity Audit</span>
                  </div>

                  {/* Stat tiles */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#F7F7F5] border border-[#EBEBEA] text-center">
                      <div className="text-xl font-bold font-serif text-[#2F3437]">{report.citationIntegrity.totalReferences}</div>
                      <div className="text-[11px] text-[#787774]">Total References</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F7F7F5] border border-[#EBEBEA] text-center">
                      <div className="text-xl font-bold font-serif text-[#1E5A2A]">{report.citationIntegrity.verifiedCount}</div>
                      <div className="text-[11px] text-[#787774]">Crossref Verified</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F7F7F5] border border-[#EBEBEA] text-center">
                      <div className={`text-xl font-bold font-serif ${report.citationIntegrity.unresolvableCount > 0 ? "text-[#7C2D2B]" : "text-[#2F3437]"}`}>
                        {report.citationIntegrity.unresolvableCount}
                      </div>
                      <div className="text-[11px] text-[#787774]">Unresolvable DOIs</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F7F7F5] border border-[#EBEBEA] text-center">
                      <div className={`text-xl font-bold font-serif ${report.citationIntegrity.retractedCount > 0 ? "text-[#7C2D2B]" : "text-[#1E5A2A]"}`}>
                        {report.citationIntegrity.retractedCount}
                      </div>
                      <div className="text-[11px] text-[#787774]">Retracted Flagged</div>
                    </div>
                  </div>

                  {/* Notion Table View for References */}
                  <div className="rounded-xl bg-[#F7F7F5] border border-[#EBEBEA] overflow-hidden">
                    <div className="p-3 bg-white border-b border-[#EBEBEA] text-[11px] font-semibold text-[#787774] uppercase tracking-wider">
                      Bibliography Samples
                    </div>
                    <div className="divide-y divide-[#eaeaea]">
                      {report.citationIntegrity.references.slice(0, 5).map((ref, idx) => (
                        <div key={idx} className="p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                          <div className="space-y-0.5 max-w-xl">
                            <div className="text-[#2F3437] font-medium truncate">{ref.title || ref.raw}</div>
                            <div className="text-[11px] text-[#787774] flex items-center gap-2">
                              {ref.doi && <span>DOI: {ref.doi}</span>}
                              {ref.journal && <span>&bull; {ref.journal}</span>}
                              {ref.year && <span>&bull; {ref.year}</span>}
                            </div>
                          </div>

                          <div className="flex-shrink-0">
                            {ref.isRetracted ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FDF0EF] text-[#7C2D2B] border border-[#F7CECC]">
                                RETRACTED
                              </span>
                            ) : ref.status === 'valid' ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EDF6EE] text-[#1E5A2A] border border-[#CBE7CE]">
                                Crossref Verified
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#2e281b] text-[#78510E] border border-[#4a3e26]">
                                Unverified
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Target Journal Recommendation Tiers */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#2F3437]">
                    <BookOpen className="w-4 h-4 text-[#787774]" />
                    <span>Target Journal Recommendation Tiers</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {report.journalRecommendations.map((rec, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#F7F7F5] border border-[#EBEBEA] flex flex-col justify-between hover:border-[#d0d0d0] transition">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              rec.tier === 'Reach' ? 'bg-[#F6F3F9] text-[#57338C] border-[#DFD5F5]' :
                              rec.tier === 'Realistic' ? 'bg-[#EDF6EE] text-[#1E5A2A] border-[#CBE7CE]' :
                              'bg-[#EBF3FB] text-[#18569C] border-[#CDE1F8]'
                            }`}>
                              {rec.tier} Tier
                            </span>
                            <span className="text-xs font-mono font-semibold text-[#787774]">
                              IF: {rec.impactFactor}
                            </span>
                          </div>

                          <h4 className="text-sm font-serif font-bold text-[#2F3437] mb-0.5">{rec.journalName}</h4>
                          <p className="text-[11px] text-[#787774] mb-3">{rec.publisher}</p>

                          <div className="p-2.5 rounded-lg bg-white border border-[#EBEBEA] text-[11px] text-[#787774] mb-3">
                            <span className="font-semibold text-[#2F3437] block mb-0.5">Scope Rationale:</span>
                            {rec.scopeRationale}
                          </div>
                        </div>

                        <div className="text-[11px] text-[#7C2D2B] pt-2 border-t border-[#EBEBEA]">
                          <span className="font-semibold block mb-0.5">Desk-Reject Hazard:</span>
                          {rec.rejectionRisks[0] || "Methodological rigor requirements"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )
      )}


        {/* ================================================================= */}
        {/* DEDICATED PUBLICATION-GRADE PDF REPORT (VISIBLE ONLY IN PRINT/PDF) */}
        {/* ================================================================= */}
        {report && (
          <div className="hidden print:block print-only-report text-[#111111] bg-white p-0 space-y-6">
            {report.mode === "brief_fit" ? (
              <BriefJournalFitPrintView
                report={report as BriefJournalFitReport}
                activeProviderInfo={activeProviderInfo}
              />
            ) : (
              <>
                {/* 1. Official Academic Header */}
            <div className="border-b-2 border-[#111111] pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-black text-white font-serif font-bold text-sm flex items-center justify-center">
                    M
                  </div>
                  <div>
                    <h1 className="text-xl font-bold font-serif tracking-tight text-[#111111] leading-none">
                      ManuView Academic Pre-Submission Diagnostic Report
                    </h1>
                    <p className="text-[10px] text-[#555555] tracking-wider uppercase mt-0.5">
                      Field-Adaptive Peer-Review Simulation &bull; Deterministic Citation Integrity Audit
                    </p>
                  </div>
                </div>
                <div className="text-right text-[10px] text-[#555555] space-y-0.5">
                  <div><strong>Report ID:</strong> {report.id}</div>
                  <div><strong>Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
              </div>

              {/* Manuscript Metadata Summary Grid */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[#F7F7F5] border border-[#E5E5E5] text-[11px] mt-3">
                <div>
                  <span className="text-[#666666] block text-[10px]">Manuscript Title:</span>
                  <span className="font-bold text-[#111111] leading-tight block">{report.title}</span>
                  <span className="text-[10px] text-[#555555] block mt-1">
                    Classification: <strong>{report.classification?.categoryLabel || "Academic Manuscript"}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-l border-[#E5E5E5] pl-3">
                  <div>
                    <span className="text-[#666666] block text-[10px]">Target Journal:</span>
                    <span className="font-bold text-[#111111] block">{report.targetJournal || "General High Impact"}</span>
                  </div>
                  <div>
                    <span className="text-[#666666] block text-[10px]">Evaluated AI Engine:</span>
                    <span className="font-mono text-[#111111] text-[10px] block">{activeProviderInfo.name} ({activeProviderInfo.model})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Executive Editorial Triage Summary */}
            <div className="avoid-break p-4 rounded-xl border border-[#D0D0D0] bg-[#FAFAFA] space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-lg bg-[#111111] text-white font-mono font-bold text-sm">
                    {report.overallScore ?? 0} / 100
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#666666] font-semibold">
                      Submission Readiness Verdict
                    </div>
                    <div className="text-xs font-bold text-[#111111]">
                      {(report.overallScore ?? 0) >= 80 ? "Conditionally Ready with Minor Revisions" :
                       (report.overallScore ?? 0) >= 60 ? "Major Revisions Prior to Submission Recommended" :
                       "High Desk-Rejection Vulnerability — Substantial Re-Framing Required"}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] font-semibold px-2 py-0.5 rounded border border-[#CBE7CE] bg-[#EDF6EE] text-[#1E5A2A]">
                  Verified Peer-Review Rubric
                </div>
              </div>
              <p className="text-[11px] leading-relaxed text-[#2F3437] italic">
                &ldquo;{report.summary}&rdquo;
              </p>
            </div>

            {/* 3. The 6 Evaluation Dimensions Matrix */}
            <div className="avoid-break space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111] border-b border-[#E5E5E5] pb-1">
                1. The 6 Evaluation Dimensions (1–5 Scholarly Scale)
              </h2>
              <table className="w-full text-left text-[10.5px] border-collapse border border-[#E5E5E5]">
                <thead>
                  <tr className="bg-[#F7F7F5] border-b border-[#E5E5E5]">
                    <th className="p-2 border-r border-[#E5E5E5] font-semibold text-[#111111] w-44">Dimension</th>
                    <th className="p-2 border-r border-[#E5E5E5] font-semibold text-[#111111] w-14 text-center">Score</th>
                    <th className="p-2 border-r border-[#E5E5E5] font-semibold text-[#111111] w-36">Verdict</th>
                    <th className="p-2 font-semibold text-[#111111]">Key Strengths &amp; Vulnerabilities</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(report.dimensions || {}).map(([key, dim], idx) => (
                    <tr key={key} className={`border-b border-[#E5E5E5] ${idx % 2 === 1 ? 'bg-[#FAFAFA]' : ''}`}>
                      <td className="p-2 border-r border-[#E5E5E5] font-medium text-[#111111]">{dim.label}</td>
                      <td className="p-2 border-r border-[#E5E5E5] text-center font-mono font-bold text-[#111111]">{dim.score}/5</td>
                      <td className="p-2 border-r border-[#E5E5E5] text-[#2F3437]">{dim.verdict}</td>
                      <td className="p-2 text-[#444444]">
                        {dim.strengths && dim.strengths.length > 0 && (
                          <span className="text-[#1E5A2A] font-medium">✓ {dim.strengths.join(", ")}. </span>
                        )}
                        {dim.vulnerabilities && dim.vulnerabilities.length > 0 && (
                          <span className="text-[#7C2D2B]">⚠ {dim.vulnerabilities.join(", ")}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 4. Priority Issues & Fatal Rejection Flaws */}
            {report.priorityIssues && report.priorityIssues.length > 0 && (
              <div className="avoid-break space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111] border-b border-[#E5E5E5] pb-1">
                  2. Priority Pre-Submission Action Items
                </h2>
                <div className="space-y-2">
                  {report.priorityIssues.map((issue, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#111111]">
                          Priority {issue.priority}: {issue.title} ({issue.category})
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded border bg-[#FDF0EF] text-[#7C2D2B] border-[#F7CECC]">
                          Fatal Flaw Hazard
                        </span>
                      </div>
                      <p className="text-[#333333] text-[10.5px]">{issue.description}</p>
                      {issue.reviewerQuote && (
                        <p className="text-[10px] text-[#666666] italic bg-white p-1.5 rounded border border-[#EBEBEA]">
                          Referee critique: {issue.reviewerQuote}
                        </p>
                      )}
                      <div className="text-[10.5px] text-[#1E5A2A] font-medium pt-0.5">
                        <strong>Required Action:</strong> {issue.actionableFix}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. ALL 5-PERSONA REVIEWERS (PRINTED IN FULL SEQUENTIALLY) */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111] border-b border-[#E5E5E5] pb-1">
                3. 5-Persona Peer-Review Simulation (Full Referee Critiques)
              </h2>
              <div className="space-y-3.5">
                {(report.reviewerPersonas || []).map((persona, idx) => (
                  <div key={idx} className="avoid-break p-3.5 rounded-xl border border-[#D0D0D0] bg-[#FFFFFF] space-y-2 text-[10.5px]">
                    <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-1.5">
                      <div>
                        <h3 className="font-bold text-xs text-[#111111]">
                          Reviewer {idx + 1}: {persona.name}
                        </h3>
                        <div className="text-[10px] text-[#666666]">{persona.title} &bull; {persona.affiliation}</div>
                        <div className="text-[9.5px] text-[#888888] font-mono">Expertise: {persona.expertise}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-[#FDF0EF] text-[#7C2D2B] border-[#F7CECC]">
                          {persona.decisionRecommendation}
                        </span>
                        <div className="text-[9.5px] text-[#666666] mt-0.5 font-medium">{persona.roleDescription}</div>
                      </div>
                    </div>

                    <div className="text-[11px] leading-relaxed text-[#2F3437] space-y-1.5 whitespace-pre-line">
                      <p className="font-semibold text-[#111111]">Primary Challenge: {persona.keyChallenge}</p>
                      <p>{persona.assessment}</p>
                    </div>

                    {persona.majorCritiques && persona.majorCritiques.length > 0 && (
                      <div className="pt-1.5 border-t border-[#EBEBEA]">
                        <span className="font-semibold text-[#111111] block mb-0.5">Major Methodological Critiques:</span>
                        <ul className="list-disc pl-4 space-y-0.5 text-[#444444]">
                          {persona.majorCritiques.map((c, cIdx) => (
                            <li key={cIdx}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {persona.missingControlsOrAnalyses && persona.missingControlsOrAnalyses.length > 0 && (
                      <div className="pt-1.5 border-t border-[#EBEBEA]">
                        <span className="font-semibold text-[#7C2D2B] block mb-0.5">Missing Controls / Required Analyses:</span>
                        <ul className="list-disc pl-4 space-y-0.5 text-[#555555]">
                          {persona.missingControlsOrAnalyses.map((m, mIdx) => (
                            <li key={mIdx}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {persona.mustAddressItems && persona.mustAddressItems.length > 0 && (
                      <div className="pt-1.5 border-t border-[#EBEBEA]">
                        <span className="font-semibold text-[#1E5A2A] block mb-0.5">Mandatory Revisions for Acceptance:</span>
                        <ul className="list-disc pl-4 space-y-0.5 text-[#444444]">
                          {persona.mustAddressItems.map((item, iIdx) => (
                            <li key={iIdx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Citation & Reference Integrity Audit */}
            <div className="avoid-break space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111] border-b border-[#E5E5E5] pb-1">
                4. Citation &amp; Reference Integrity Audit
              </h2>
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-[#F7F7F5] border border-[#E5E5E5] text-center text-xs">
                <div>
                  <span className="text-[10px] text-[#666666] block">Total References</span>
                  <span className="font-mono font-bold text-sm text-[#111111]">{report.citationIntegrity?.totalReferences || 0}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#666666] block">Unresolvable DOIs</span>
                  <span className={`font-mono font-bold text-sm ${report.citationIntegrity?.unresolvableCount ? "text-[#7C2D2B]" : "text-[#1E5A2A]"}`}>
                    {report.citationIntegrity?.unresolvableCount || 0}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#666666] block">Retracted Papers Flagged</span>
                  <span className={`font-mono font-bold text-sm ${report.citationIntegrity?.retractedCount ? "text-[#7C2D2B]" : "text-[#1E5A2A]"}`}>
                    {report.citationIntegrity?.retractedCount || 0}
                  </span>
                </div>
              </div>

              {report.citationIntegrity?.references && report.citationIntegrity.references.length > 0 && (
                <table className="w-full text-left text-[10px] border-collapse border border-[#E5E5E5] mt-2">
                  <thead>
                    <tr className="bg-[#F7F7F5] border-b border-[#E5E5E5]">
                      <th className="p-1.5 border-r border-[#E5E5E5] font-semibold text-[#111111]">Audited Reference</th>
                      <th className="p-1.5 border-r border-[#E5E5E5] font-semibold text-[#111111] w-28">DOI</th>
                      <th className="p-1.5 font-semibold text-[#111111] w-28 text-center">CrossRef Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.citationIntegrity.references.slice(0, 10).map((ref, rIdx) => (
                      <tr key={rIdx} className="border-b border-[#E5E5E5]">
                        <td className="p-1.5 border-r border-[#E5E5E5] text-[#2F3437]">{ref.title || ref.raw}</td>
                        <td className="p-1.5 border-r border-[#E5E5E5] font-mono text-[#555555]">{ref.doi || "No DOI"}</td>
                        <td className="p-1.5 text-center">
                          {ref.isRetracted ? (
                            <span className="font-bold text-[#7C2D2B]">RETRACTED</span>
                          ) : ref.status === 'valid' ? (
                            <span className="font-semibold text-[#1E5A2A]">Verified</span>
                          ) : (
                            <span className="font-semibold text-[#78510E]">Unresolvable</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* 7. Target Journal Recommendations */}
            {report.journalRecommendations && report.journalRecommendations.length > 0 && (
              <div className="avoid-break space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111] border-b border-[#E5E5E5] pb-1">
                  5. Calibrated Target Journal Recommendations
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  {report.journalRecommendations.map((rec, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-[#D0D0D0] bg-[#FAFAFA] text-[10.5px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#111111]">{rec.tier} Tier</span>
                        <span className="font-mono font-semibold text-[#555555]">IF: {rec.impactFactor}</span>
                      </div>
                      <h4 className="font-bold text-[#111111]">{rec.journalName}</h4>
                      <div className="text-[10px] text-[#666666]">{rec.publisher}</div>
                      <div className="p-1.5 rounded bg-white border border-[#EBEBEA] text-[10px] text-[#333333]">
                        <strong>Scope Rationale:</strong> {rec.scopeRationale}
                      </div>
                      <div className="text-[10px] text-[#7C2D2B] pt-1 border-t border-[#EBEBEA]">
                        <strong>Desk-Reject Hazard:</strong> {rec.rejectionRisks[0] || "Methodological rigor requirements"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. Official Confidentiality & Legal Notice Footer */}
            <div className="pt-4 border-t border-[#E5E5E5] text-[9.5px] text-[#777777] flex items-center justify-between">
              <span>ManuView Academic Pre-Submission Diagnostic Audit &bull; Confidential Research Document</span>
              <span>Generated locally with zero data retention &bull; {report.id}</span>
            </div>
              </>
            )}
          </div>
        )}

        </div> {/* End Workspace Card Container */}

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
