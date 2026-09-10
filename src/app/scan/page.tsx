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
  ChevronDown
} from "lucide-react";
import { FullReviewReport, PriorityIssue, ReviewerPersonaFeedback, ProviderConfig, AvailableModel } from "@/lib/types";
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
    setInputText(SAMPLE_PREPRINT_TEXT);
    setTargetJournal("Nature Communications");
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
    <div className="min-h-screen bg-white text-[#2F3437] py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Top Breadcrumb & Page Icon */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#787774]">
            <span>Workspace</span>
            <span>/</span>
            <span>Diagnostics</span>
            <span>/</span>
            <span className="text-[#2F3437]">Pre-Submission Scan</span>
          </div>

          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#F7F7F5] border border-[#EBEBEA] text-xs text-[#787774] hover:text-[#2F3437] shadow-2xs transition"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{activeProviderInfo.name}</span>
          </button>
        </div>

        {/* Notion Page Header */}
        <div className="mb-8">
          <div className="text-4xl mb-3 select-none">📄</div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2F3437] mb-2 font-serif">
            Manuscript Pre-Submission Diagnostic
          </h1>
          <p className="text-sm text-[#787774] font-light">
            Calibrated peer-review rubric to surface desk-rejection hazards, causal overclaims, missing controls, and citation integrity bugs.
          </p>
        </div>

        {/* Notion Properties Block (Database metadata rows) */}
        <div className="mb-8 rounded-xl bg-[#F7F7F5] border border-[#EBEBEA] p-4 text-xs divide-y divide-[#eaeaea]">
          {/* Property 1: Target Journal */}
          <div className="flex items-center py-2 px-1">
            <div className="w-36 flex items-center gap-2 text-[#787774]">
              <Tag className="w-3.5 h-3.5" />
              <span>Target Journal</span>
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={targetJournal}
                onChange={(e) => setTargetJournal(e.target.value)}
                placeholder="e.g., Nature Communications, Cell, Lancet"
                className="w-full bg-transparent text-[#2F3437] placeholder-[#888888] focus:outline-none text-xs hover:bg-white px-2 py-1 rounded-lg transition"
              />
            </div>
          </div>

          {/* Property 2: AI Diagnostic Engine */}
          <div className="flex items-center py-2 px-1">
            <div className="w-36 flex items-center gap-2 text-[#787774]">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>AI Engine</span>
            </div>
            <div className="flex-1 flex flex-wrap items-center gap-2">
              {/* 1. Connected & Operational -> Green with Interactive Model Switcher */}
              {apiStatus === 'connected' && (
                <div className="relative inline-block">
                  <button
                    type="button"
                    onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#EDF6EE] text-[#1E5A2A] border border-[#CBE7CE] hover:bg-[#E2F0E3] transition shadow-2xs cursor-pointer"
                    title="Click to switch between available models"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#1E5A2A]" />
                    <span>{activeProviderInfo.name}: <span className="font-mono">{activeProviderInfo.model}</span></span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#1E5A2A] ml-0.5" />
                  </button>

                  {modelDropdownOpen && (
                    <div className="absolute left-0 mt-1.5 w-72 rounded-2xl bg-white border border-[#EBEBEA] shadow-xl p-2.5 z-40 animate-fade-in text-xs">
                      <div className="px-2 py-1.5 text-[11px] font-semibold text-[#787774] border-b border-[#EBEBEA] uppercase tracking-wider flex items-center justify-between">
                        <span>Select Available Model</span>
                        <span className="text-[10px] text-[#18569C] font-semibold">{availableModels.length} models</span>
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
                                  ? "bg-[#F7F7F5] text-[#2F3437] font-semibold border border-[#2F3437]"
                                  : "text-[#2F3437] hover:bg-[#F7F7F5]"
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-xs truncate">{m.id}</span>
                                  {m.tag && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded font-medium bg-[#EBF3FB] text-[#18569C] border border-[#CDE1F8]">
                                      {m.tag}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-[#787774] truncate mt-0.5">{m.description}</div>
                              </div>
                              {isCur && <Check className="w-3.5 h-3.5 text-[#1E5A2A] flex-shrink-0 mt-0.5" />}
                            </button>
                          );
                        })}
                      </div>
                      <div className="pt-2 border-t border-[#EBEBEA] flex items-center justify-between px-1">
                        <button
                          type="button"
                          onClick={() => {
                            setModelDropdownOpen(false);
                            setSettingsOpen(true);
                          }}
                          className="text-[11px] text-[#18569C] hover:underline font-semibold"
                        >
                          AI Settings &amp; Custom Keys &rarr;
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. Unconfigured / Missing Key -> Orange */}
              {apiStatus === 'unconfigured' && (
                <span 
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#FBF3DB] text-[#78510E] border border-[#F4E2B6]"
                  title="No API key configured in browser settings or .env.local"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#78510E]" />
                  No API Key (Setup Required)
                </span>
              )}

              {/* 3. Invalid Key / Connection Failed -> Red */}
              {apiStatus === 'error' && (
                <span 
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#FDF0EF] text-[#7C2D2B] border border-[#F7CECC]"
                  title={apiErrorMessage || "Connection probe failed"}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9B2C2C]" />
                  {activeProviderInfo.name}: Connection Failed
                </span>
              )}

              {/* 4. Probing / Testing -> Blue */}
              {apiStatus === 'checking' && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#EBF3FB] text-[#18569C] border border-[#CDE1F8]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0A85EA] animate-pulse" />
                  Testing {activeProviderInfo.name}...
                </span>
              )}

              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="text-[11px] text-[#18569C] hover:underline font-medium"
              >
                Configure
              </button>

              <button
                type="button"
                onClick={checkProviderStatus}
                disabled={pinging}
                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-white hover:bg-[#F7F7F5] border border-[#EBEBEA] text-[#2F3437] shadow-2xs transition disabled:opacity-50"
                title="Test API connection & ping latency"
              >
                <Activity className={`w-3 h-3 ${pinging ? "animate-spin text-emerald-400" : "text-[#787774]"}`} />
                <span>{pinging ? "Testing Ping..." : "Check Connection"}</span>
              </button>

              {scanPingResult && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border ${
                    scanPingResult.success
                      ? "bg-[#EDF6EE] text-[#1E5A2A] border-[#CBE7CE]"
                      : "bg-[#FDF0EF] text-[#7C2D2B] border-[#F7CECC]"
                  }`}
                  title={scanPingResult.error || scanPingResult.message}
                >
                  <Zap className="w-3 h-3" />
                  <span>
                    {scanPingResult.success
                      ? `⚡ ${scanPingResult.latencyMs}ms (${scanPingResult.message})`
                      : `Failed: ${scanPingResult.error || scanPingResult.message}`}
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Property 3: Audit Scope */}
          <div className="flex items-center py-2 px-1">
            <div className="w-36 flex items-center gap-2 text-[#787774]">
              <Hash className="w-3.5 h-3.5" />
              <span>Diagnostic Scope</span>
            </div>
            <div className="flex-1 text-[#787774]">
              6 Dimensions &bull; 4 Reviewer Personas &bull; Crossref DOI Resolution &bull; Retraction Screening
            </div>
          </div>

          {/* Property 4: Privacy & Retention */}
          <div className="flex items-center py-2 px-1">
            <div className="w-36 flex items-center gap-2 text-[#787774]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Data Retention</span>
            </div>
            <div className="flex-1 text-[#1E5A2A] flex items-center gap-1.5">
              <span>Zero-storage &bull; In-memory only &bull; Never trained on</span>
            </div>
          </div>
        </div>

        {/* Input Form Card */}
        {!report && (
          <div className="space-y-6">
            {/* Notion Callout Box: Sample Preprint Tip */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F7F7F5] border border-[#EBEBEA] text-xs text-[#787774]">
              <span className="text-base select-none">💡</span>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>
                  First time testing ManuView? Load our sample preprint to run an instant diagnostic report.
                </span>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#F7F7F5] text-[#2F3437] font-medium text-xs border border-[#EBEBEA] shadow-2xs transition flex items-center gap-1 self-start sm:self-auto whitespace-nowrap"
                >
                  <RefreshCw className="w-3 h-3" />
                  Load Sample Preprint
                </button>
              </div>
            </div>

            <form onSubmit={handleRunScan} className="space-y-5">
              {/* Document Input: Tabs / File or Text */}
              <div className="rounded-xl bg-[#F7F7F5] border border-[#EBEBEA] p-6 space-y-4">
                <div className="text-xs font-medium text-[#787774] uppercase tracking-wider">
                  Manuscript Draft
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* File Upload Box */}
                  <div>
                    <label className="text-xs text-[#787774] mb-1.5 block font-medium">
                      Upload Document (.docx, .txt)
                    </label>
                    <label className="flex flex-col items-center justify-center border border-dashed border-[#d0d0d0] hover:border-[#0A85EA] rounded-xl p-6 bg-white hover:bg-[#EBF3FB]/20 cursor-pointer transition group">
                      <Upload className="w-6 h-6 text-[#9B9A97] group-hover:text-[#18569C] transition mb-2" />
                      <span className="text-xs text-[#787774] font-medium text-center truncate max-w-full px-2">
                        {file ? file.name : "Click to choose file or drag & drop"}
                      </span>
                      <span className="text-[11px] text-[#787774] mt-1">Word (.docx) or Text file</span>
                      <input
                        type="file"
                        accept=".docx,.txt"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Direct Paste Box */}
                  <div>
                    <label className="text-xs text-[#787774] mb-1.5 block font-medium">
                      Or Paste Manuscript Text
                    </label>
                    <textarea
                      rows={6}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Paste Title, Abstract, Methods, and References here..."
                      className="w-full p-3 rounded-xl bg-white border border-[#EBEBEA] text-xs text-[#2F3437] placeholder-[#888888] focus:outline-none focus:border-[#0A85EA] font-mono leading-relaxed transition resize-y shadow-2xs"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-[#FDF0EF] border border-[#F7CECC] text-[#7C2D2B] text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Connection Status Callout Banners */}
              {apiStatus === 'unconfigured' && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#FBF3DB] border border-[#F4E2B6] text-xs text-[#78510E]">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-[#78510E] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#78510E] block">LLM API Connection Required:</span>
                      <span className="text-[#78510E]/90">
                        Pre-submission diagnostic scans require an active AI model to generate peer-review simulation and editorial triage. You can upload files or paste text now, but must configure an API key to run the scan.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettingsOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#FBF3DB] hover:bg-[#F4E2B6] text-[#78510E] font-medium text-xs border border-[#F4E2B6] transition whitespace-nowrap self-start sm:self-auto"
                  >
                    Configure AI Settings
                  </button>
                </div>
              )}

              {apiStatus === 'error' && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#FDF0EF] border border-[#F7CECC] text-xs text-[#7C2D2B]">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-[#7C2D2B] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#7C2D2B] block">API Key Not Working / Unreachable:</span>
                      <span className="font-mono text-[11px] text-[#7C2D2B] block mt-0.5 break-words">
                        {apiErrorMessage || "Unable to communicate with the configured model. Please verify your credentials."}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
                    <button
                      type="button"
                      onClick={checkProviderStatus}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#F7F7F5] text-[#7C2D2B] font-medium text-xs border border-[#F7CECC] transition whitespace-nowrap"
                    >
                      Retry Ping
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettingsOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-[#FDF0EF] hover:bg-[#F7CECC] text-[#7C2D2B] font-medium text-xs border border-[#F7CECC] transition whitespace-nowrap"
                    >
                      Fix in Settings
                    </button>
                  </div>
                </div>
              )}

              {apiStatus === 'checking' && (
                <div className="p-3.5 rounded-xl bg-[#EBF3FB] border border-[#CDE1F8] text-xs text-[#18569C] flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#58a6ff] flex-shrink-0" />
                  <span>Verifying LLM API connection status...</span>
                </div>
              )}

              {/* Submit Action */}
              <button
                type="submit"
                disabled={loading || apiStatus !== 'connected'}
                className={`w-full py-3 px-4 rounded-lg font-medium text-xs sm:text-sm border transition flex items-center justify-center gap-2 shadow-sm ${
                  apiStatus === 'connected' && !loading
                    ? "bg-[#0A85EA] hover:bg-[#0075EB] text-[#2F3437] border-[#0A85EA] hover:border-[#0066cc] active:scale-[0.99] cursor-pointer shadow-sm"
                    : "bg-[#eaeaea] text-[#9B9A97] border-[#e0e0e0] opacity-80 cursor-not-allowed"
                }`}
                title={apiStatus !== 'connected' ? "Valid LLM API connection required to run diagnostic scan" : "Run Pre-Submission Diagnostic Scan"}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>{loadingStep || "Analyzing Manuscript..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className={`w-4 h-4 ${apiStatus === 'connected' ? "text-emerald-400" : "text-[#6b6a67]"}`} />
                    <span>Run Pre-Submission Diagnostic Scan</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Diagnostic Report Results (Notion Document View) */}
        {report && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Navigation Bar in Results */}
            <div className="flex items-center justify-between pb-3 border-b border-[#EBEBEA]">
              <button
                onClick={() => setReport(null)}
                className="flex items-center gap-1.5 text-xs text-[#787774] hover:text-[#2F3437] hover:bg-[#F7F7F5] px-2.5 py-1 rounded-lg transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Input</span>
              </button>

              <div className="flex items-center gap-2 text-xs text-[#787774]">
                <span>Target:</span>
                <span className="text-[#2F3437] font-medium">{report.targetJournal || "General High Impact"}</span>
              </div>
            </div>

            {/* Document Title Header */}
            <div className="space-y-2">
              <div className="text-3xl select-none">📑</div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F3437] leading-snug">
                {report.title}
              </h2>
            </div>

            {/* Document Classification & Personalized Salutation Callout */}
            {report.classification && (
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

            {/* Non-Academic File: Suppress Rubrics & Display Guidance */}
            {report.classification && !report.classification.isAcademicManuscript ? (
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
                    ManuView&apos;s <strong>Submission Readiness Score</strong>, <strong>Editorial Triage Synthesis</strong>, <strong>6 Evaluation Dimensions</strong>, <strong>4-Persona Reviewer Simulation</strong>, <strong>Citation Integrity Audit</strong>, and <strong>Target Journal Recommendation Tiers</strong> are specifically calibrated against empirical research papers and clinical trial standards. Because this file is classified as <strong>{report.classification?.categoryLabel || "Non-Academic Content"}</strong>, journal peer-review metrics are not applicable and have been omitted.
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
                        <li>• Peer-Reviewed Citations: <span className="text-[#2F3437]">{report.citationIntegrity.totalReferences > 0 ? `${report.citationIntegrity.totalReferences} found` : "0 references detected"}</span></li>
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
                      Upload a Research Paper (.docx / text)
                    </button>
                  </div>
                </div>
              </div>
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
                      <span className="text-4xl font-bold font-serif text-[#2F3437]">{report.overallScore}</span>
                      <span className="text-[#9B9A97] text-sm font-serif">/100</span>
                    </div>
                    <div className={`mt-1 px-2.5 py-0.5 rounded text-[11px] font-medium border ${
                      report.overallScore >= 80 ? "bg-[#EDF6EE] text-[#1E5A2A] border-[#CBE7CE]" :
                      report.overallScore >= 65 ? "bg-[#FBF3DB] text-[#78510E] border-[#F4E2B6]" :
                      "bg-[#FDF0EF] text-[#7C2D2B] border-[#F7CECC]"
                    }`}>
                      {report.overallScore >= 80 ? "Submission Ready" :
                       report.overallScore >= 65 ? "Revision Prioritized" :
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

                {/* The 6 Evaluation Dimensions */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#2F3437]">
                    <BarChart3 className="w-4 h-4 text-[#787774]" />
                    <span>The 6 Evaluation Dimensions (1–5 Scale)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(report.dimensions).map(([key, dim]) => (
                      <div key={key} className="p-4 rounded-xl bg-[#F7F7F5] border border-[#EBEBEA] flex flex-col justify-between hover:border-[#d0d0d0] hover:shadow-2xs transition">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-[#2F3437]">{dim.label}</span>
                            <span className={`px-2 py-0.5 rounded font-mono text-xs font-semibold border ${
                              dim.score >= 4 ? "bg-[#EDF6EE] text-[#1E5A2A] border-[#CBE7CE]" :
                              dim.score === 3 ? "bg-[#FBF3DB] text-[#78510E] border-[#F4E2B6]" :
                              "bg-[#FDF0EF] text-[#7C2D2B] border-[#F7CECC]"
                            }`}>
                              {dim.score} / 5
                            </span>
                          </div>
                          <p className="text-xs text-[#787774] leading-relaxed mb-3 font-light">
                            {dim.verdict}
                          </p>
                        </div>

                        {dim.vulnerabilities.length > 0 && (
                          <div className="pt-2 border-t border-[#EBEBEA] text-[11px] text-[#7C2D2B] flex items-start gap-1.5">
                            <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                            <span className="truncate">{dim.vulnerabilities[0]}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prioritized Action Plan */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#2F3437]">
                    <AlertCircle className="w-4 h-4 text-[#7C2D2B]" />
                    <span>Prioritized Action Plan before Submission</span>
                  </div>

                  <div className="space-y-3">
                    {report.priorityIssues.map((issue: PriorityIssue) => (
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
                          </div>
                          <span className="text-[11px] text-[#787774]">
                            {issue.priority === "A" ? "Desk-Reject Vulnerability" : "Major Reviewer Challenge"}
                          </span>
                        </div>

                        <h4 className="text-sm font-semibold text-[#2F3437]">{issue.title}</h4>
                        <p className="text-xs text-[#787774] leading-relaxed">{issue.description}</p>

                        {/* Notion Quote Block */}
                        <div className="border-l-2 border-[#d0d0d0] pl-3 py-0.5 text-xs italic text-[#2F3437] font-serif">
                          &ldquo;{issue.reviewerQuote}&rdquo;
                        </div>

                        {/* Notion Action Box */}
                        <div className="p-3 rounded-xl bg-white border border-[#CBE7CE] text-xs text-[#1E5A2A] flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-[#2F3437] block mb-0.5">Required Pre-Submission Fix:</span>
                            {issue.actionableFix}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4-Persona Peer-Review Simulation */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#2F3437]">
                      <Users className="w-4 h-4 text-[#787774]" />
                      <span>4-Persona Peer-Review Simulation</span>
                    </div>
                    <span className="text-[11px] text-[#787774]">
                      Independent domain evaluations
                    </span>
                  </div>

                  {/* Notion-style database view tabs */}
                  <div className="flex items-center gap-1 border-b border-[#EBEBEA] pb-1 overflow-x-auto">
                    {report.reviewerPersonas.map((p: ReviewerPersonaFeedback, idx: number) => {
                      const isActive = selectedPersona === idx;
                      return (
                        <button
                          key={p.persona}
                          onClick={() => setSelectedPersona(idx)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition ${
                            isActive
                              ? "bg-white text-[#2F3437] font-semibold border border-[#d0d0d0] shadow-2xs"
                              : "text-[#787774] hover:text-[#2F3437] hover:bg-[#F7F7F5]"
                          }`}
                        >
                          <span>
                            {p.persona === "methods_reviewer" ? "🔬" :
                             p.persona === "domain_expert" ? "🧬" :
                             p.persona === "journal_editor" ? "📑" : "📊"}
                          </span>
                          <span>{p.name.split(" ")[0]} {p.name.split(" ")[1]}</span>
                          {p.decisionRecommendation && (
                            <span className={`text-[9px] px-1 py-0.2 rounded border ${
                              p.decisionRecommendation.includes("Reject")
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
                  {report.reviewerPersonas[selectedPersona] && (() => {
                    const active = report.reviewerPersonas[selectedPersona];
                    const isReject = active.decisionRecommendation?.includes("Reject");
                    return (
                      <div className="p-6 rounded-xl bg-[#F7F7F5] border border-[#EBEBEA] space-y-5 animate-fade-in">
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

                        {/* Fatal Reviewer Objection Callout */}
                        <div className="p-3.5 rounded-xl bg-[#FDF0EF] border border-[#F7CECC] text-xs text-[#7C2D2B] flex items-start gap-2.5">
                          <span className="text-base select-none">⚠️</span>
                          <div>
                            <span className="font-semibold text-[#2F3437] block mb-0.5 uppercase tracking-wider text-[10px]">
                              Fatal Reviewer Objection:
                            </span>
                            {active.keyChallenge}
                          </div>
                        </div>

                        {/* Detailed Peer-Review Assessment */}
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-[#787774] uppercase tracking-wider">
                            Detailed Peer-Review Assessment:
                          </div>
                          <div className="text-xs text-[#787774] leading-relaxed font-light p-3.5 rounded-xl bg-white border border-[#EBEBEA] text-[#2F3437] whitespace-pre-line">
                            {active.assessment}
                          </div>
                        </div>

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
