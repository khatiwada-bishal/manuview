"use client";

import React, { useState, useEffect } from "react";
import { ProviderConfig, LLMProvider } from "@/lib/types";
import { Settings, ShieldCheck, X, CheckCircle2, FileCode, Activity, RefreshCw, AlertCircle, Zap } from "lucide-react";
import { GeminiLogo, OpenAILogo, GroqLogo, AnthropicLogo, OllamaLogo } from "./BrandLogos";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (config: ProviderConfig) => void;
}

export const DEFAULT_CONFIG: ProviderConfig = {
  provider: "gemini",
  model: "gemini-1.5-flash",
  baseUrl: "http://localhost:11434",
  apiKey: "",
};

export function ProviderSettingsModal({ isOpen, onClose, onSave }: Props) {
  const [config, setConfig] = useState<ProviderConfig>(DEFAULT_CONFIG);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testing, setTesting] = useState(false);
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
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch {}
    }

    setTestResult(null);

    // Check server-side .env status
    fetch("/api/config/status")
      .then(res => res.json())
      .then(data => setServerStatus(data))
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

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
    if (onSave) onSave(config);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#eaeaea] shadow-2xl p-6 text-[#111111] my-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-[#888888] hover:text-[#111111] rounded-md transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="text-xl select-none">⚙️</div>
          <div>
            <h3 className="text-base font-semibold text-[#111111]">AI Engine &amp; API Key Settings</h3>
            <p className="text-xs text-[#666666]">Select your provider and add credentials for real-time peer-review diagnostics.</p>
          </div>
        </div>

        {/* Server environment indicator */}
        {serverStatus?.hasServerKey ? (
          <div className="p-3 mb-4 rounded-xl bg-[#e6f4ea] border border-[#ceead6] flex items-start gap-2.5 text-xs text-[#137333]">
            <CheckCircle2 className="w-4 h-4 text-[#1e8e3e] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#137333]">Server Key Detected:</span> Using <code className="text-[#0d652d] uppercase font-bold">{serverStatus.activeProvider}</code> from your <code className="text-[#0d652d] font-mono">.env.local</code>.
            </div>
          </div>
        ) : (
          <div className="p-3 mb-4 rounded-xl bg-[#fef7e0] border border-[#fce8b2] flex items-start gap-2.5 text-xs text-[#b06000]">
            <FileCode className="w-4 h-4 text-[#b06000] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#8f4a00]">Client Key:</span> Add your API key below in browser memory, or place it in <code className="font-mono font-medium text-[#8f4a00]">.env.local</code>.
            </div>
          </div>
        )}

        {/* Provider Selection Grid */}
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-[#888888] mb-2">
              Select AI Engine
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {/* 1. Google Gemini */}
              <button
                type="button"
                onClick={() => setConfig({ ...config, provider: "gemini", model: "gemini-1.5-flash" })}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition ${
                  config.provider === "gemini"
                    ? "bg-[#f0f7ff] border-[#0075eb] text-[#0075eb] ring-1 ring-[#0075eb]"
                    : "bg-[#fafafa] border-[#eaeaea] text-[#555555] hover:text-[#111111] hover:bg-white hover:border-[#d0d0d0]"
                }`}
              >
                <GeminiLogo className="w-4 h-4 flex-shrink-0" />
                <div className="text-left">
                  <div className="leading-tight font-semibold text-xs">Gemini</div>
                  <div className="text-[10px] text-[#0075eb]">Google</div>
                </div>
              </button>

              {/* 2. OpenAI / Custom Proxy */}
              <button
                type="button"
                onClick={() => setConfig({ ...config, provider: "openai", model: "gpt-4o" })}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition ${
                  config.provider === "openai"
                    ? "bg-[#f0f7ff] border-[#0075eb] text-[#0075eb] ring-1 ring-[#0075eb]"
                    : "bg-[#fafafa] border-[#eaeaea] text-[#555555] hover:text-[#111111] hover:bg-white hover:border-[#d0d0d0]"
                }`}
              >
                <div className="p-0.5 rounded bg-[#111111] text-white flex items-center justify-center flex-shrink-0">
                  <OpenAILogo className="w-3 h-3 text-white" />
                </div>
                <div className="text-left">
                  <div className="leading-tight font-semibold text-xs">OpenAI</div>
                  <div className="text-[10px] text-purple-600">Proxy/GPT-4o</div>
                </div>
              </button>

              {/* 3. Anthropic Claude */}
              <button
                type="button"
                onClick={() => setConfig({ ...config, provider: "anthropic", model: "claude-3-5-sonnet-20241022" })}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition ${
                  config.provider === "anthropic"
                    ? "bg-[#f0f7ff] border-[#0075eb] text-[#0075eb] ring-1 ring-[#0075eb]"
                    : "bg-[#fafafa] border-[#eaeaea] text-[#555555] hover:text-[#111111] hover:bg-white hover:border-[#d0d0d0]"
                }`}
              >
                <AnthropicLogo className="w-4 h-4 flex-shrink-0" />
                <div className="text-left">
                  <div className="leading-tight font-semibold text-xs">Claude</div>
                  <div className="text-[10px] text-amber-700">Anthropic</div>
                </div>
              </button>

              {/* 4. Groq */}
              <button
                type="button"
                onClick={() => setConfig({ ...config, provider: "groq", model: "llama-3.3-70b-versatile" })}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition ${
                  config.provider === "groq"
                    ? "bg-[#f0f7ff] border-[#0075eb] text-[#0075eb] ring-1 ring-[#0075eb]"
                    : "bg-[#fafafa] border-[#eaeaea] text-[#555555] hover:text-[#111111] hover:bg-white hover:border-[#d0d0d0]"
                }`}
              >
                <GroqLogo className="w-4 h-4 flex-shrink-0" />
                <div className="text-left">
                  <div className="leading-tight font-semibold text-xs">Groq</div>
                  <div className="text-[10px] text-orange-600">Llama 3.3</div>
                </div>
              </button>

              {/* 5. Local Ollama */}
              <button
                type="button"
                onClick={() => setConfig({ ...config, provider: "ollama", model: "llama3.3" })}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition ${
                  config.provider === "ollama"
                    ? "bg-[#f0f7ff] border-[#0075eb] text-[#0075eb] ring-1 ring-[#0075eb]"
                    : "bg-[#fafafa] border-[#eaeaea] text-[#555555] hover:text-[#111111] hover:bg-white hover:border-[#d0d0d0]"
                }`}
              >
                <OllamaLogo className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div className="text-left">
                  <div className="leading-tight font-semibold text-xs">Ollama</div>
                  <div className="text-[10px] text-emerald-600">100% Offline</div>
                </div>
              </button>
            </div>
          </div>

          {/* API Key Input */}
          {config.provider !== "ollama" ? (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs text-[#333333] font-medium">
                  {config.provider === 'openai' ? 'API Key' : `${config.provider.toUpperCase()} API Key`}
                </label>
                {config.provider === "gemini" && (
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#0075eb] hover:underline font-medium"
                  >
                    Get free Gemini key &rarr;
                  </a>
                )}
                {config.provider === "groq" && (
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#e06c00] hover:underline font-medium"
                  >
                    Get free Groq key &rarr;
                  </a>
                )}
                {config.provider === "anthropic" && (
                  <a
                    href="https://console.anthropic.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-amber-700 hover:underline font-medium"
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
                  config.provider === "gemini" ? "AIzaSy..." :
                  config.provider === "anthropic" ? "sk-ant-..." :
                  "sk-..."
                }
                className="w-full px-3 py-2 rounded-lg bg-[#fafafa] border border-[#eaeaea] focus:border-[#0075eb] focus:bg-white text-xs text-[#111111] focus:outline-none font-mono transition"
              />
              <p className="text-[11px] text-[#888888] mt-1">
                Stored securely only in your local browser storage.
              </p>

              {/* Custom Base URL (Available for OpenAI / Custom Proxies) */}
              {config.provider === "openai" && (
                <div className="mt-2.5">
                  <label className="block text-xs text-[#333333] font-medium mb-1">
                    API Base URL (Optional for Proxies / Custom Endpoints)
                  </label>
                  <input
                    type="text"
                    value={config.baseUrl || ""}
                    onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                    placeholder="https://api.your-provider.com/v1 (or leave blank for official OpenAI)"
                    className="w-full px-3 py-2 rounded-lg bg-[#fafafa] border border-[#eaeaea] focus:border-[#0075eb] focus:bg-white text-xs text-[#111111] focus:outline-none font-mono transition"
                  />
                  <p className="text-[11px] text-[#888888] mt-1">
                    Supports any OpenAI-compatible custom gateway or self-hosted endpoint.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs text-[#333333] font-medium mb-1">
                Local Ollama Base URL
              </label>
              <input
                type="text"
                value={config.baseUrl || "http://localhost:11434"}
                onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#fafafa] border border-[#eaeaea] focus:border-[#0075eb] focus:bg-white text-xs text-[#111111] focus:outline-none font-mono transition"
              />
              <p className="text-[11px] text-[#888888] mt-1">
                Run <code className="text-emerald-600 font-medium">ollama serve</code> and <code className="text-emerald-600 font-medium">ollama run llama3.3</code> on your machine.
              </p>
            </div>
          )}

          {/* Model Name */}
          <div>
            <label className="block text-xs text-[#333333] font-medium mb-1">
              Model Name
            </label>
            <input
              type="text"
              value={config.model}
              onChange={(e) => setConfig({ ...config, model: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#fafafa] border border-[#eaeaea] focus:border-[#0075eb] focus:bg-white text-xs text-[#111111] focus:outline-none font-mono transition"
            />
          </div>
        </div>

        {/* Privacy badge */}
        <div className="mt-4 p-2.5 rounded-xl bg-[#fafafa] border border-[#eaeaea] flex items-center gap-2 text-[11px] text-[#666666]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1e8e3e] flex-shrink-0" />
          <span>Zero data retention &bull; Processed in-memory, never stored or trained on.</span>
        </div>

        {/* Connection Test Result Callout */}
        {testResult && (
          <div className={`mt-3.5 p-3 rounded-xl border text-xs ${
            testResult.success
              ? "bg-[#e6f4ea] border-[#ceead6] text-[#137333]"
              : "bg-[#fce8e6] border-[#fad2cf] text-[#c5221f]"
          }`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-[#1e8e3e] flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#d93025] flex-shrink-0" />
                )}
                <div>
                  <span className="font-semibold text-[#111111]">
                    {testResult.success ? "Connection Verified" : "Connection Failed"}
                  </span>
                  <span className="text-[11px] block sm:inline sm:ml-2">
                    {testResult.message}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`font-mono text-[11px] px-2 py-0.5 rounded-md border font-semibold flex items-center gap-1 ${
                  testResult.success
                    ? "bg-white text-[#137333] border-[#ceead6]"
                    : "bg-white text-[#c5221f] border-[#fad2cf]"
                }`}>
                  <Zap className="w-3 h-3" />
                  {testResult.latencyMs} ms
                </span>
              </div>
            </div>
            {!testResult.success && testResult.error && (
              <div className="mt-2 pt-2 border-t border-[#fad2cf] text-[11px] text-[#c5221f] font-mono leading-relaxed break-words">
                {testResult.error}
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-4 border-t border-[#eaeaea]">
          {/* Check connection button */}
          <button
            type="button"
            onClick={handleCheckConnection}
            disabled={testing}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-[#fafafa] disabled:opacity-50 text-[#37352f] font-medium text-xs border border-[#eaeaea] shadow-xs transition"
          >
            {testing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0075eb]" />
                <span>Pinging Engine...</span>
              </>
            ) : (
              <>
                <Activity className="w-3.5 h-3.5 text-[#0075eb]" />
                <span>Check Connection</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs text-[#666666] hover:text-[#111111] rounded-lg hover:bg-[#fafafa] transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-[#0075eb] hover:bg-[#0066cc] text-white font-medium text-xs transition shadow-xs"
            >
              {savedSuccess ? "Saved!" : "Save & Activate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
