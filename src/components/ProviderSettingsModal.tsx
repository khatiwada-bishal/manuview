"use client";

import React, { useState, useEffect } from "react";
import { ProviderConfig, LLMProvider } from "@/lib/types";
import { Settings, ShieldCheck, Cpu, Key, X, CheckCircle2, FileCode } from "lucide-react";

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

    // Check server-side .env status
    fetch("/api/config/status")
      .then(res => res.json())
      .then(data => setServerStatus(data))
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Engine &amp; API Key Settings</h3>
            <p className="text-xs text-slate-400">Configure your LLM provider to power real, live pre-submission reviews.</p>
          </div>
        </div>

        {/* Server environment indicator */}
        {serverStatus?.hasServerKey ? (
          <div className="p-3.5 mb-5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Active Server Key Detected:</span> Using <code className="text-emerald-300 uppercase font-bold">{serverStatus.activeProvider}</code> from your <code className="text-emerald-300 font-mono">.env.local</code> file on the backend.
            </div>
          </div>
        ) : (
          <div className="p-3.5 mb-5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-300">
            <FileCode className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Tip for Developers:</span> You can also simply create a <code className="text-amber-200 font-mono">.env.local</code> file with <code className="text-amber-200 font-mono">GEMINI_API_KEY=your_key</code> or <code className="text-amber-200 font-mono">GROQ_API_KEY=your_key</code> or paste it below.
            </div>
          </div>
        )}

        {/* Provider Selection */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Select AI Engine
            </label>
            <div className="grid grid-cols-2 gap-2">
              {/* Gemini */}
              <button
                type="button"
                onClick={() => setConfig({ ...config, provider: "gemini", model: "gemini-1.5-flash" })}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium transition ${
                  config.provider === "gemini"
                    ? "bg-emerald-950/40 border-emerald-500 text-white shadow-sm"
                    : "bg-slate-800/40 border-slate-700 text-slate-300 hover:border-slate-600"
                }`}
              >
                <Key className="w-4 h-4 text-blue-400" />
                <div className="text-left">
                  <div className="leading-tight font-semibold">Google Gemini</div>
                  <div className="text-[10px] text-emerald-400">Recommended &bull; Free tier</div>
                </div>
              </button>

              {/* Groq */}
              <button
                type="button"
                onClick={() => setConfig({ ...config, provider: "groq", model: "llama-3.3-70b-versatile" })}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium transition ${
                  config.provider === "groq"
                    ? "bg-emerald-950/40 border-emerald-500 text-white shadow-sm"
                    : "bg-slate-800/40 border-slate-700 text-slate-300 hover:border-slate-600"
                }`}
              >
                <Key className="w-4 h-4 text-amber-400" />
                <div className="text-left">
                  <div className="leading-tight font-semibold">Groq (Llama 3.3)</div>
                  <div className="text-[10px] text-amber-400">Ultra-fast &bull; Free tier</div>
                </div>
              </button>

              {/* OpenAI */}
              <button
                type="button"
                onClick={() => setConfig({ ...config, provider: "openai", model: "gpt-4o-mini" })}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium transition ${
                  config.provider === "openai"
                    ? "bg-emerald-950/40 border-emerald-500 text-white shadow-sm"
                    : "bg-slate-800/40 border-slate-700 text-slate-300 hover:border-slate-600"
                }`}
              >
                <Key className="w-4 h-4 text-purple-400" />
                <div className="text-left">
                  <div className="leading-tight font-semibold">OpenAI</div>
                  <div className="text-[10px] text-purple-400">GPT-4o-mini</div>
                </div>
              </button>

              {/* Ollama */}
              <button
                type="button"
                onClick={() => setConfig({ ...config, provider: "ollama", model: "llama3.3" })}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium transition ${
                  config.provider === "ollama"
                    ? "bg-emerald-950/40 border-emerald-500 text-white shadow-sm"
                    : "bg-slate-800/40 border-slate-700 text-slate-300 hover:border-slate-600"
                }`}
              >
                <Cpu className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <div className="leading-tight font-semibold">Local Ollama</div>
                  <div className="text-[10px] text-emerald-400">100% Offline &amp; Free</div>
                </div>
              </button>
            </div>
          </div>

          {/* API Key Input */}
          {config.provider !== "ollama" ? (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  {config.provider.toUpperCase()} API Key
                </label>
                {config.provider === "gemini" && (
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-emerald-400 hover:underline"
                  >
                    Get free Gemini key &rarr;
                  </a>
                )}
                {config.provider === "groq" && (
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    Get free Groq key &rarr;
                  </a>
                )}
              </div>
              <input
                type="password"
                value={config.apiKey || ""}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                placeholder={config.provider === "gemini" ? "AIzaSy..." : "sk-..."}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono transition"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Saved securely only inside your browser&apos;s localStorage or use <code className="text-slate-300">.env.local</code>.
              </p>

              {config.provider === "openai" && (
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    API Base URL (for Custom OpenAI Proxies)
                  </label>
                  <input
                    type="text"
                    value={config.baseUrl || ""}
                    onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                    placeholder="e.g. https://ai.psu.blue/v1 (or leave blank for default OpenAI)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono transition"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Compatible with custom endpoints like <code className="text-emerald-400">https://ai.psu.blue/v1</code>.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Local Ollama Base URL
              </label>
              <input
                type="text"
                value={config.baseUrl || "http://localhost:11434"}
                onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono transition"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Run <code className="text-emerald-400">ollama serve</code> and <code className="text-emerald-400">ollama run llama3.3</code> on your machine.
              </p>
            </div>
          )}

          {/* Model Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Model Name
            </label>
            <input
              type="text"
              value={config.model}
              onChange={(e) => setConfig({ ...config, model: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono transition"
            />
          </div>
        </div>

        {/* Privacy badge */}
        <div className="mt-5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-2.5 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Zero data retention &bull; Your manuscripts are never stored or used to train models.</span>
        </div>

        {/* Save button */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition shadow-lg shadow-emerald-600/20"
          >
            {savedSuccess ? "Saved!" : "Save & Activate"}
          </button>
        </div>
      </div>
    </div>
  );
}
