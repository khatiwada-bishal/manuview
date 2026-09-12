"use client";

import { useState, useEffect, useCallback } from "react";
import { ProviderConfig } from "./types";

export interface ApiConnectionState {
  isConnected: boolean;
  isLoading: boolean;
  modelName: string | null;
  latencyMs: number | null;
  provider: string | null;
  errorMessage?: string;
}

export function useApiConnection() {
  const [state, setState] = useState<ApiConnectionState>({
    isConnected: false,
    isLoading: true,
    modelName: null,
    latencyMs: null,
    provider: null,
  });

  const checkConnection = useCallback(async (signal?: AbortSignal) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      let config: ProviderConfig | undefined;
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("manuview_provider_config");
        if (saved) {
          try {
            config = JSON.parse(saved);
          } catch {}
        }
      }

      const res = await fetch("/api/config/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
        signal,
      });

      const data = await res.json();
      if (data && data.success) {
        const rawModel = data.model || "AI Model";
        const cleanModel = rawModel.toUpperCase().replace(/-/g, " ");
        setState({
          isConnected: true,
          isLoading: false,
          modelName: cleanModel,
          latencyMs: typeof data.latencyMs === "number" ? data.latencyMs : null,
          provider: data.provider || "AI",
        });
      } else {
        setState({
          isConnected: false,
          isLoading: false,
          modelName: null,
          latencyMs: null,
          provider: null,
          errorMessage: data?.message || "Not connected",
        });
      }
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setState({
        isConnected: false,
        isLoading: false,
        modelName: null,
        latencyMs: null,
        provider: null,
        errorMessage: err?.message || "Connection failed",
      });
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    checkConnection(controller.signal);

    const handleConfigChange = () => {
      checkConnection(controller.signal);
    };

    window.addEventListener("manuview_config_changed", handleConfigChange);
    return () => {
      controller.abort();
      window.removeEventListener("manuview_config_changed", handleConfigChange);
    };
  }, [checkConnection]);

  return {
    ...state,
    refresh: () => checkConnection(),
  };
}
