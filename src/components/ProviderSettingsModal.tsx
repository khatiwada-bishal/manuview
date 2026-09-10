"use client";

import React, { useState, useEffect } from "react";
import { ProviderConfig, LLMProvider } from "@/lib/types";
import { Settings, ShieldCheck, Cpu, Key, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (config: ProviderConfig) => void;
}

export const DEFAULT_CONFIG: ProviderConfig = {
  provider: "ollama",
  model: "llama3.3",
  baseUrl: "http://localhost:11434",
  apiKey: "",
};

export function ProviderSettingsModal({ isOpen, onClose, onSave }: Props) {
  const [config, setConfig] = useState<ProviderConfig>(DEFAULT_CONFIG);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("manuview_provider_config");
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch {}
    }
  }, []);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem("manuview_provider_config", JSON.stringify(config));
    if (onSave) onSave(config);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Engine & Privacy Settings</h3>
            <p className="text-xs text-slate-400">Choose between 100% offline local inference or your private cloud key.</p>
          </div>
        </div>

        {/* Local vs Cloud Banner */}
        <div className="p-3.5 mb-5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-emerald-300">Privacy Guarantee:</span> Your unpublished manuscripts are never stored or used to train models. When running with local Ollama, zero data ever leaves your computer.
          </div>
        </div>

        {/* Provider Selection */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Inference Provider
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConfig({ ...config, provider: "ollama", model: "llama3.3" })}
                className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition ${
                  config.provider === "ollama"
                    ? "bg-emerald-950/40 border-emerald-500 text-white shadow-sm shadow-emerald-500/10"
                    : "bg-slate-800/40 border-slate-700 text-slate-300 hover:border-slate-600"
                }`}
              >
                <Cpu className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <div className="leading-tight">Local Ollama</div>
                  <div className="text-[10px] text-slate-400">100% Offline & Free</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setConfig({ ...config, provider: "gemini", model: "gemini-1.5-flash" })}
                className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition ${
                  config.provider === "gemini"
                    ? "bg-emerald-950/40 border-emerald-500 text-white shadow-sm shadow-emerald-500/10"
                    : "bg-slate-800/40 border-slate-700 text-slate-300 hover:border-slate-600"
                }`}
              >
                <Key className="w-4 h-4 text-blue-400" />
                <div className="text-left">
                  <div className="leading-tight">Google Gemini</div>
                  <div className="text-[10px] text-slate-400">Cloud API Key</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setConfig({ ...config, provider: "groq", model: "llama-3.3-70b-versatile" })}
                className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition ${
                  config.provider === "groq"
                    ? "bg-emerald-950/40 border-emerald-500 text-white shadow-sm shadow-emerald-500/10"
                    : "bg-slate-800/40 border-slate-700 text-slate-300 hover:border-slate-600"
                }`}
              >
                <Key className="w-4 h-4 text-amber-400" />
                <div className="text-left">
                  <div className="leading-tight">Groq (Ultra-Fast)</div>
                  <div className="text-[10px] text-slate-400">Cloud API Key</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setConfig({ ...config, provider: "openai", model: "gpt-4o-mini" })}
                className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition ${
                  config.provider === "openai"
                    ? "bg-emerald-950/40 border-emerald-500 text-white shadow-sm shadow-emerald-500/10"
                    : "bg-slate-800/40 border-slate-700 text-slate-300 hover:border-slate-600"
                }`}
              >
                <Key className="w-4 h-4 text-purple-400" />
                <div className="text-left">
                  <div className="leading-tight">OpenAI</div>
                  <div className="text-[10px] text-slate-400">Cloud API Key</div>
                </div>
              </button>
            </div>
          </div>

          {/* Model Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Model Name / Tag
            </label>
            <input
              type="text"
              value={config.model}
              onChange={(e) => setConfig({ ...config, model: e.target.value })}
              placeholder={config.provider === 'ollama' ? 'llama3.3, mistral, deepseek-r1' : 'gemini-1.5-flash, gpt-4o-mini'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Ollama URL or API Key */}
          {config.provider === "ollama" ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Ollama Endpoint URL
              </label>
              <input
                type="text"
                value={config.baseUrl || "http://localhost:11434"}
                onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Make sure Ollama is running locally (<code className="text-emerald-400">ollama serve</code>).
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {config.provider.toUpperCase()} API Key
              </label>
              <input
                type="password"
                value={config.apiKey || ""}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                placeholder="sk-..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Key is stored securely only inside your browser&apos;s localStorage.
              </p>
            </div>
          )}
        </div>

        <div className="mt-7 flex items-center justify-end gap-3">
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
            {savedSuccess ? "Saved!" : "Save Configuration"}
          </button>
        </div>
      </div>
    </div>
  );
}
