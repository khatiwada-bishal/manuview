"use client";

import React, { useState, useEffect, useRef } from "react";
import { ProviderConfig, LLMProvider, AvailableModel } from "@/lib/types";
import { Settings, ShieldCheck, X, CheckCircle2, FileCode, Activity, RefreshCw, AlertCircle, Zap, Check, ChevronDown, Sparkles, Search } from "lucide-react";
import { GeminiLogo, OpenAILogo, GroqLogo, AnthropicLogo, OllamaLogo } from "./BrandLogos";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (config: ProviderConfig) => void;
}

export const DEFAULT_CONFIG: ProviderConfig = {
  provider: "gemini",
  model: "gemini-2.5-flash",
  baseUrl: "http://localhost:11434",
  apiKey: "",
};

export function ProviderSettingsModal({ isOpen, onClose, onSave }: Props) {
  const [config, setConfig] = useState<ProviderConfig>(DEFAULT_CONFIG);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testing, setTesting] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [availableModels, setAvailableModels] = useState<AvailableModel[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [modelSearchQuery, setModelSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    provider: string;
    model: string;
    latencyMs: number;
    message: string;
    error?: string;
  } | null>(null);
  const [serverStatus, setServerStatus] = useState<{
    hasServerKey: boolean;
    activeProvider: string;
    availableProviders: string[];
  } | null>(null);

  useEffect(() => {
    // Check browser local storage
    const saved = localStorage.getItem("manuview_provider_config");
    let currentConfig = DEFAULT_CONFIG;
    if (saved) {
      try {
        currentConfig = JSON.parse(saved);
        setConfig(currentConfig);
      } catch {}
    }

    setTestResult(null);

    // Check server-side .env status
    fetch("/api/config/status")
      .then((res) => res.json())
      .then((data) => setServerStatus(data))
      .catch(() => {});

    // Fetch models for current provider
    loadModelsForProvider(currentConfig);
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setModelDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadModelsForProvider = async (targetConfig: ProviderConfig) => {
    setLoadingModels(true);
    try {
      const res = await fetch("/api/config/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: targetConfig }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.models)) {
        setAvailableModels(data.models);
        // If current model is not set or empty, pick the recommended or first
        if (!targetConfig.model && data.models.length > 0) {
          const rec = data.models.find((m: AvailableModel) => m.recommended) || data.models[0];
          setConfig((prev) => ({ ...prev, model: rec.id }));
        }
      }
    } catch {
      // Fallback: try GET with provider param
      try {
        const res = await fetch(`/api/config/models?provider=${targetConfig.provider}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.models)) {
          setAvailableModels(data.models);
        }
      } catch {}
    } finally {
      setLoadingModels(false);
    }
  };

  const handleProviderChange = (newProvider: LLMProvider) => {
    const defaultModel =
      newProvider === "gemini"
        ? "gemini-2.5-flash"
        : newProvider === "openai"
        ? "gpt-4o"
        : newProvider === "anthropic"
        ? "claude-3-7-sonnet-20250219"
        : newProvider === "groq"
        ? "llama-3.3-70b-versatile"
        : "llama3.3";

    const updated = {
      ...config,
      provider: newProvider,
      model: defaultModel,
    };
    setConfig(updated);
    setTestResult(null);
    loadModelsForProvider(updated);
  };

  const handleCheckConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/config/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });
      const data = await res.json();
      setTestResult(data);
      if (Array.isArray(data.availableModels) && data.availableModels.length > 0) {
        setAvailableModels(data.availableModels);
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        provider: config.provider,
        model: config.model,
        latencyMs: 0,
        message: "Connection failed",
        error: err.message || "Failed to reach diagnostic test server",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    localStorage.setItem("manuview_provider_config", JSON.stringify(config));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("manuview_config_changed"));
    }
    if (onSave) onSave(config);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white border border-[#EBEBEA] shadow-xl p-6 sm:p-7 text-[#2F3437] my-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-[#787774] hover:text-[#2F3437] hover:bg-[#F7F7F5] rounded-md transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="text-2xl select-none">⚙️</div>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-[#2F3437]">
              AI Diagnostic Engine &amp; Models
            </h3>
            <p className="text-xs text-[#787774] mt-0.5">
              Select your LLM provider, verify the connection, and pick verified diagnostic models.
            </p>
          </div>
        </div>

        {/* Server Status Banner (High Contrast Pastel) */}
        {serverStatus?.hasServerKey ? (
          <div className="p-3 mb-5 rounded-xl bg-[#EDF6EE] border border-[#CBE7CE] flex items-start gap-2.5 text-xs text-[#1E5A2A]">
            <CheckCircle2 className="w-4 h-4 text-[#1E5A2A] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#1E5A2A]">Server Key Active:</span> Using{" "}
              <code className="text-[#1E5A2A] uppercase font-bold tracking-wide">{serverStatus.activeProvider}</code> from{" "}
              <code className="font-mono font-medium text-[#1E5A2A]">.env.local</code>. Client keys below will take precedence if provided.
            </div>
          </div>
        ) : (
          <div className="p-3 mb-5 rounded-xl bg-[#FBF3DB] border border-[#F4E2B6] flex items-start gap-2.5 text-xs text-[#78510E]">
            <FileCode className="w-4 h-4 text-[#78510E] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#78510E]">Client Storage Mode:</span> Store your API key in browser local memory, or place it in{" "}
              <code className="font-mono font-medium text-[#78510E]">.env.local</code> for automatic server detection.
            </div>
          </div>
        )}

        <div className="space-y-5">
          {/* 1. Provider Selection Grid */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774] mb-2">
              1. Select AI Engine
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {/* Google Gemini */}
              <button
                type="button"
                onClick={() => handleProviderChange("gemini")}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs transition text-left ${
                  config.provider === "gemini"
                    ? "bg-[#F7F7F5] border-[#2F3437] ring-1 ring-[#2F3437] shadow-2xs"
                    : "bg-white border-[#EBEBEA] hover:bg-[#F7F7F5] text-[#787774] hover:text-[#2F3437]"
                }`}
              >
                <GeminiLogo className="w-4 h-4 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-[#2F3437] leading-tight">Gemini</div>
                  <div className="text-[10px] text-[#0A85EA] font-medium">Google AI</div>
                </div>
              </button>

              {/* OpenAI */}
              <button
                type="button"
                onClick={() => handleProviderChange("openai")}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs transition text-left ${
                  config.provider === "openai"
                    ? "bg-[#F7F7F5] border-[#2F3437] ring-1 ring-[#2F3437] shadow-2xs"
                    : "bg-white border-[#EBEBEA] hover:bg-[#F7F7F5] text-[#787774] hover:text-[#2F3437]"
                }`}
              >
                <div className="p-0.5 rounded bg-[#000000] text-white flex items-center justify-center flex-shrink-0">
                  <OpenAILogo className="w-3 h-3 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-[#2F3437] leading-tight">OpenAI</div>
                  <div className="text-[10px] text-[#57338C] font-medium">GPT-4o &amp; o3</div>
                </div>
              </button>

              {/* Claude */}
              <button
                type="button"
                onClick={() => handleProviderChange("anthropic")}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs transition text-left ${
                  config.provider === "anthropic"
                    ? "bg-[#F7F7F5] border-[#2F3437] ring-1 ring-[#2F3437] shadow-2xs"
                    : "bg-white border-[#EBEBEA] hover:bg-[#F7F7F5] text-[#787774] hover:text-[#2F3437]"
                }`}
              >
                <AnthropicLogo className="w-4 h-4 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-[#2F3437] leading-tight">Claude</div>
                  <div className="text-[10px] text-[#78510E] font-medium">Anthropic</div>
                </div>
              </button>

              {/* Groq */}
              <button
                type="button"
                onClick={() => handleProviderChange("groq")}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs transition text-left ${
                  config.provider === "groq"
                    ? "bg-[#F7F7F5] border-[#2F3437] ring-1 ring-[#2F3437] shadow-2xs"
                    : "bg-white border-[#EBEBEA] hover:bg-[#F7F7F5] text-[#787774] hover:text-[#2F3437]"
                }`}
              >
                <GroqLogo className="w-4 h-4 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-[#2F3437] leading-tight">Groq</div>
                  <div className="text-[10px] text-[#C43834] font-medium">LPU Fast</div>
                </div>
              </button>

              {/* Ollama */}
              <button
                type="button"
                onClick={() => handleProviderChange("ollama")}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs transition text-left ${
                  config.provider === "ollama"
                    ? "bg-[#F7F7F5] border-[#2F3437] ring-1 ring-[#2F3437] shadow-2xs"
                    : "bg-white border-[#EBEBEA] hover:bg-[#F7F7F5] text-[#787774] hover:text-[#2F3437]"
                }`}
              >
                <OllamaLogo className="w-4 h-4 text-[#1E5A2A] flex-shrink-0" />
                <div>
                  <div className="font-semibold text-[#2F3437] leading-tight">Ollama</div>
                  <div className="text-[10px] text-[#1E5A2A] font-medium">100% Offline</div>
                </div>
              </button>
            </div>
          </div>

          {/* 2. API Key / Endpoint Configuration */}
          {config.provider !== "ollama" ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#2F3437]">
                  2. {config.provider === "openai" ? "API Key" : `${config.provider.toUpperCase()} API Key`}
                </label>
                {config.provider === "gemini" && (
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#0A85EA] hover:underline font-medium"
                  >
                    Get free Gemini key &rarr;
                  </a>
                )}
                {config.provider === "groq" && (
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#78510E] hover:underline font-medium"
                  >
                    Get free Groq key &rarr;
                  </a>
                )}
                {config.provider === "anthropic" && (
                  <a
                    href="https://console.anthropic.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#78510E] hover:underline font-medium"
                  >
                    Get Anthropic key &rarr;
                  </a>
                )}
              </div>
              <input
                type="password"
                value={config.apiKey || ""}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                placeholder={
                  config.provider === "gemini"
                    ? "AIzaSy..."
                    : config.provider === "anthropic"
                    ? "sk-ant-..."
                    : "sk-..."
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EBEBEA] focus:border-[#2F3437] focus:outline-none text-xs text-[#2F3437] font-mono transition shadow-2xs placeholder:text-[#9B9A97]"
              />
              <p className="text-[11px] text-[#787774] mt-1">
                Client keys are stored strictly in your local browser sandbox and never shared.
              </p>

              {config.provider === "openai" && (
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-[#2F3437] mb-1">
                    API Base URL (Optional for Proxies / Custom Endpoints)
                  </label>
                  <input
                    type="text"
                    value={config.baseUrl || ""}
                    onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                    placeholder="https://api.openai.com/v1 (or your custom proxy URL)"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#EBEBEA] focus:border-[#2F3437] focus:outline-none text-xs text-[#2F3437] font-mono transition shadow-2xs placeholder:text-[#9B9A97]"
                  />
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-[#2F3437] mb-1.5">
                2. Local Ollama Server URL
              </label>
              <input
                type="text"
                value={config.baseUrl || "http://localhost:11434"}
                onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EBEBEA] focus:border-[#2F3437] focus:outline-none text-xs text-[#2F3437] font-mono transition shadow-2xs"
              />
              <p className="text-[11px] text-[#787774] mt-1">
                Ensure <code className="text-[#1E5A2A] font-semibold">ollama serve</code> is running on your machine.
              </p>
            </div>
          )}

          {/* 3. Available Models Picker (Dropdown Selector) */}
          <div ref={dropdownRef} className="relative z-20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-semibold text-[#2F3437]">
                  3. Select Model
                </label>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F7F7F5] border border-[#EBEBEA] text-[#787774] font-medium">
                  {availableModels.length} available
                </span>
                {loadingModels && (
                  <RefreshCw className="w-3 h-3 text-[#787774] animate-spin ml-1" />
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCustomInput(!showCustomInput);
                  setModelDropdownOpen(false);
                }}
                className="text-[11px] text-[#0A85EA] hover:underline font-medium"
              >
                {showCustomInput ? "Show Preset Models" : "Custom Model ID"}
              </button>
            </div>

            {/* If user toggles custom input */}
            {showCustomInput ? (
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={config.model}
                  onChange={(e) => setConfig({ ...config, model: e.target.value })}
                  placeholder="e.g. gemini-2.5-flash or custom-model-id"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EBEBEA] focus:border-[#2F3437] focus:outline-none text-xs text-[#2F3437] font-mono transition shadow-2xs"
                />
                <p className="text-[11px] text-[#787774]">
                  Enter any model ID supported by your endpoint.
                </p>
              </div>
            ) : (
              /* Dropdown Trigger & Populated Models Menu */
              <div className="relative">
                {/* Dropdown Trigger Button */}
                <button
                  type="button"
                  onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                  className="w-full text-left p-3 rounded-xl bg-white hover:bg-[#F7F7F5] border border-[#EBEBEA] hover:border-[#D0D0CE] transition flex items-center justify-between gap-2 shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0075eb]/20"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-[#2F3437]">
                        {config.model || "Select a model..."}
                      </span>
                      {(() => {
                        const cur = availableModels.find((m) => m.id === config.model);
                        if (cur?.tag) {
                          return (
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.2 rounded-md border ${
                                cur.recommended
                                  ? "bg-[#EBF3FB] text-[#18569C] border-[#CDE1F8]"
                                  : cur.tag.includes("Fast") || cur.tag.includes("Instant")
                                  ? "bg-[#EDF6EE] text-[#1E5A2A] border-[#CBE7CE]"
                                  : cur.tag.includes("Reasoning") || cur.tag.includes("Frontier")
                                  ? "bg-[#F6F3F9] text-[#57338C] border-[#DFD5F5]"
                                  : "bg-[#FBF3DB] text-[#78510E] border-[#F4E2B6]"
                              }`}
                            >
                              {cur.tag}
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </div>
                    <p className="text-[11px] text-[#787774] truncate mt-0.5">
                      {availableModels.find((m) => m.id === config.model)?.description ||
                        "Click to view and choose from available models"}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#787774] flex-shrink-0 transition-transform ${
                      modelDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Populated Dropdown Menu */}
                {modelDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-full rounded-2xl bg-white border border-[#EBEBEA] shadow-2xl p-2 z-50 text-xs animate-fadeIn">
                    {/* Search inside dropdown */}
                    <div className="relative mb-2 px-1">
                      <input
                        type="text"
                        value={modelSearchQuery}
                        onChange={(e) => setModelSearchQuery(e.target.value)}
                        placeholder={`Search ${availableModels.length} models...`}
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#F7F7F5] border border-[#EBEBEA] text-xs text-[#2F3437] placeholder-[#9B9A97] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#0075eb]"
                        autoFocus
                      />
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#9B9A97] pointer-events-none" />
                    </div>

                    {/* Populated Models List */}
                    <div className="max-h-60 overflow-y-auto divide-y divide-[#F7F7F5] overscroll-contain">
                      {(() => {
                        const filtered = availableModels.filter(
                          (m) =>
                            m.id.toLowerCase().includes(modelSearchQuery.toLowerCase()) ||
                            (m.tag && m.tag.toLowerCase().includes(modelSearchQuery.toLowerCase())) ||
                            (m.description && m.description.toLowerCase().includes(modelSearchQuery.toLowerCase()))
                        );

                        if (filtered.length === 0) {
                          return (
                            <div className="p-4 text-center text-xs text-[#787774]">
                              No models matching "{modelSearchQuery}"
                            </div>
                          );
                        }

                        return filtered.map((m) => {
                          const isSelected = config.model === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => {
                                setConfig({ ...config, model: m.id });
                                setModelDropdownOpen(false);
                                setModelSearchQuery("");
                              }}
                              className={`w-full text-left p-2.5 rounded-xl transition flex items-start justify-between gap-2.5 ${
                                isSelected
                                  ? "bg-[#F7F7F5] text-[#2F3437] font-semibold"
                                  : "text-[#2F3437] hover:bg-[#FAF9F7]"
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="font-mono text-xs font-semibold text-[#2F3437]">
                                    {m.id}
                                  </span>
                                  {m.tag && (
                                    <span
                                      className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-md border ${
                                        m.recommended
                                          ? "bg-[#EBF3FB] text-[#18569C] border-[#CDE1F8]"
                                          : m.tag.includes("Fast") || m.tag.includes("Instant")
                                          ? "bg-[#EDF6EE] text-[#1E5A2A] border-[#CBE7CE]"
                                          : m.tag.includes("Reasoning") || m.tag.includes("Frontier")
                                          ? "bg-[#F6F3F9] text-[#57338C] border-[#DFD5F5]"
                                          : "bg-[#FBF3DB] text-[#78510E] border-[#F4E2B6]"
                                      }`}
                                    >
                                      {m.tag}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-[#787774] truncate mt-0.5">
                                  {m.description || m.name}
                                </p>
                              </div>
                              {isSelected && (
                                <Check className="w-4 h-4 text-[#0A85EA] flex-shrink-0 mt-1" />
                              )}
                            </button>
                          );
                        });
                      })()}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Connection Test Feedback Box (Notion Pastel & High Contrast) */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs animate-fade-in ${
                testResult.success
                  ? "bg-[#EDF6EE] border-[#CBE7CE] text-[#1E5A2A]"
                  : "bg-[#FDF0EF] border-[#F7CECC] text-[#7C2D2B]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-[#1E5A2A] flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-[#9B2C2C] flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <span className="font-bold block sm:inline">
                      {testResult.success ? "Connection Operational" : "Connection Test Failed"}
                    </span>
                    <span className="text-[11px] opacity-90 block sm:inline sm:ml-2 truncate">
                      {testResult.message}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <span
                    className={`font-mono text-[11px] px-2 py-0.5 rounded-md border font-bold flex items-center gap-1 bg-white ${
                      testResult.success
                        ? "text-[#1E5A2A] border-[#CBE7CE]"
                        : "text-[#7C2D2B] border-[#F7CECC]"
                    }`}
                  >
                    <Zap className="w-3 h-3" />
                    {testResult.latencyMs} ms
                  </span>
                </div>
              </div>

              {!testResult.success && testResult.error && (
                <div className="mt-2.5 pt-2 border-t border-[#F7CECC] text-[11px] font-mono leading-relaxed break-words text-[#7C2D2B]">
                  {testResult.error}
                </div>
              )}
            </div>
          )}

          {/* Privacy Footnote */}
          <div className="p-2.5 rounded-xl bg-[#F7F7F5] border border-[#EBEBEA] flex items-center gap-2 text-[11px] text-[#787774]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1E5A2A] flex-shrink-0" />
            <span>Zero data retention &bull; Processed strictly in memory &bull; Never trained on.</span>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[#EBEBEA]">
            {/* Check Connection Button */}
            <button
              type="button"
              onClick={handleCheckConnection}
              disabled={testing}
              className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-white hover:bg-[#F7F7F5] disabled:opacity-50 text-[#2F3437] font-medium text-xs border border-[#EBEBEA] shadow-2xs transition"
            >
              {testing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0A85EA]" />
                  <span>Pinging API &amp; Fetching Models...</span>
                </>
              ) : (
                <>
                  <Activity className="w-3.5 h-3.5 text-[#0A85EA]" />
                  <span>Check Connection &amp; Refresh Models</span>
                </>
              )}
            </button>

            {/* Save & Cancel */}
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs text-[#787774] hover:text-[#2F3437] rounded-lg hover:bg-[#F7F7F5] transition font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-[#000000] hover:bg-[#2F3437] text-white font-medium text-xs transition shadow-xs"
              >
                {savedSuccess ? "Saved!" : "Save & Activate"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
