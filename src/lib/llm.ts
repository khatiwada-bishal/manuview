import { ProviderConfig, LLMProvider, AvailableModel } from "./types";

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export function getEnv(key: string): string {
  try {
    const g = (typeof window !== "undefined" ? window : globalThis) as any;
    if (g?.process?.env?.[key]) return String(g.process.env[key]).trim();
    let meta: any = undefined;
    try {
      meta = new Function("try { return import.meta.env; } catch (e) { return undefined; }")();
    } catch {}
    if (meta) {
      if (meta[key]) return String(meta[key]).trim();
      if (meta[`VITE_${key}`]) return String(meta[`VITE_${key}`]).trim();
    }
  } catch {}
  return "";
}

function getSavedClientConfig(): ProviderConfig | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem("manuview_provider_config");
    if (raw) return JSON.parse(raw);
  } catch {}
  return undefined;
}

/**
 * Sanitizes sensitive credentials (API keys, authorization tokens) from error strings (REQ-SEC-01)
 */
export function sanitizeErrorMessage(msg: string): string {
  if (!msg) return "";
  return msg
    .replace(/key=[a-zA-Z0-9_\-]+/gi, "key=[REDACTED]")
    .replace(/Bearer\s+[a-zA-Z0-9_\-\.]+/gi, "Bearer [REDACTED]")
    .replace(/sk-[a-zA-Z0-9_\-]{20,}/gi, "sk-[REDACTED]")
    .replace(/AIza[a-zA-Z0-9_\-]{30,}/gi, "AIza[REDACTED]")
    .replace(/gsk_[a-zA-Z0-9_\-]{20,}/gi, "gsk_[REDACTED]");
}

export function getServerConfigStatus(): {
  hasServerKey: boolean;
  hasClientKey?: boolean;
  activeProvider: LLMProvider | 'none';
  availableProviders: string[];
  baseUrl?: string;
  model?: string;
} {
  const saved = getSavedClientConfig();
  const serverProviders: string[] = [];
  let serverActiveProvider: LLMProvider | 'none' = 'none';

  if (getEnv('OPENAI_API_KEY')) {
    serverProviders.push('openai');
    if (serverActiveProvider === 'none') serverActiveProvider = 'openai';
  }
  if (getEnv('GEMINI_API_KEY') || getEnv('GOOGLE_API_KEY')) {
    serverProviders.push('gemini');
    if (serverActiveProvider === 'none') serverActiveProvider = 'gemini';
  }
  if (getEnv('GROQ_API_KEY')) {
    serverProviders.push('groq');
    if (serverActiveProvider === 'none') serverActiveProvider = 'groq';
  }
  if (getEnv('ANTHROPIC_API_KEY')) {
    serverProviders.push('anthropic');
    if (serverActiveProvider === 'none') serverActiveProvider = 'anthropic';
  }

  const hasServerKey = serverProviders.length > 0;
  const hasClientKey = Boolean(saved && saved.apiKey);

  if (hasClientKey && saved) {
    return {
      hasServerKey,
      hasClientKey: true,
      activeProvider: saved.provider,
      availableProviders: Array.from(new Set([saved.provider, ...serverProviders])),
      baseUrl: saved.baseUrl,
      model: saved.model,
    };
  }

  return {
    hasServerKey,
    hasClientKey: false,
    activeProvider: serverActiveProvider,
    availableProviders: serverProviders,
    baseUrl: getEnv('OPENAI_BASE_URL') || undefined,
    model: getEnv('OPENAI_MODEL') || getEnv('GEMINI_MODEL') || getEnv('GROQ_MODEL') || undefined,
  };
}

const LLM_TIMEOUT_MS = 90_000;

export async function callLLM(
  messages: LLMMessage[],
  config?: ProviderConfig
): Promise<string> {
  // 1. Resolve Provider and Credentials
  const resolvedConfig = config || getSavedClientConfig();
  let provider: LLMProvider = resolvedConfig?.provider || "ollama";
  let apiKey: string = resolvedConfig?.apiKey || "";
  let model: string = resolvedConfig?.model || "";
  let baseUrl: string = resolvedConfig?.baseUrl || "http://localhost:11434";

  // If no apiKey provided by client, auto-detect from server environment variables
  if (!apiKey) {
    if (provider === "gemini" || (!config && (getEnv('GEMINI_API_KEY') || getEnv('GOOGLE_API_KEY')))) {
      apiKey = getEnv('GEMINI_API_KEY') || getEnv('GOOGLE_API_KEY');
      if (apiKey) {
        provider = "gemini";
        model = model || getEnv('GEMINI_MODEL') || "gemini-1.5-flash";
      }
    } else if (provider === "groq" || (!config && getEnv('GROQ_API_KEY'))) {
      apiKey = getEnv('GROQ_API_KEY');
      if (apiKey) {
        provider = "groq";
        model = model || getEnv('GROQ_MODEL') || "llama-3.3-70b-versatile";
      }
    } else if (provider === "openai" || (!config && getEnv('OPENAI_API_KEY'))) {
      apiKey = getEnv('OPENAI_API_KEY');
      if (apiKey) {
        provider = "openai";
        model = model || getEnv('OPENAI_MODEL') || "gpt-4o-mini";
      }
    } else if (provider === "anthropic" || (!config && getEnv('ANTHROPIC_API_KEY'))) {
      apiKey = getEnv('ANTHROPIC_API_KEY');
      if (apiKey) {
        provider = "anthropic";
        model = model || getEnv('ANTHROPIC_MODEL') || "claude-3-5-sonnet-20241022";
      }
    }
  }

  // If still no API key and provider was not explicitly set to Ollama, check any available env key
  if (!apiKey && provider !== "ollama") {
    const serverStatus = getServerConfigStatus();
    if (serverStatus.hasServerKey && serverStatus.activeProvider !== 'none') {
      provider = serverStatus.activeProvider;
      if (provider === "gemini") apiKey = getEnv('GEMINI_API_KEY') || getEnv('GOOGLE_API_KEY');
      else if (provider === "groq") apiKey = getEnv('GROQ_API_KEY');
      else if (provider === "openai") apiKey = getEnv('OPENAI_API_KEY');
      else if (provider === "anthropic") apiKey = getEnv('ANTHROPIC_API_KEY');
    }
  }

  if (!apiKey && provider !== "ollama") {
    throw new Error(`No API key configured for ${provider.toUpperCase()}. Please configure your API key in AI Settings.`);
  }

  // -----------------------------------------------------------
  // 1. Google Gemini API
  // -----------------------------------------------------------
  if (provider === "gemini" && apiKey) {
    const geminiModel = model || "gemini-1.5-flash";
    const cleanModel = encodeURIComponent(geminiModel.trim());
    const cleanKey = encodeURIComponent(apiKey.trim());
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${cleanKey}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);
    try {
      const systemMessage = messages.find(m => m.role === 'system')?.content;
      const nonSystemMessages = messages.filter(m => m.role !== 'system');

      // Ensure alternating turns without consecutive duplicate roles
      let contents: any[] = [];
      if (nonSystemMessages.length === 0 && systemMessage) {
        contents = [{ role: 'user', parts: [{ text: systemMessage }] }];
      } else {
        nonSystemMessages.forEach(m => {
          const role = m.role === 'assistant' ? 'model' : 'user';
          if (contents.length > 0 && contents[contents.length - 1].role === role) {
            contents[contents.length - 1].parts[0].text += `\n\n${m.content}`;
          } else {
            contents.push({ role, parts: [{ text: m.content }] });
          }
        });
      }

      const requestPayload: any = {
        contents,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
        },
      };

      if (systemMessage) {
        requestPayload.systemInstruction = {
          parts: [{ text: systemMessage }],
        };
      }

      let response = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
      });

      // Fallback: If systemInstruction or responseMimeType is rejected on legacy models with 400, retry merged
      if (!response.ok && response.status === 400 && systemMessage) {
        console.warn("Gemini rejected systemInstruction/json mode, retrying with prepended prompt...");
        const mergedText = `[SYSTEM INSTRUCTIONS]\n${systemMessage}\n\n[USER INPUT]\n${nonSystemMessages.map(m => m.content).join("\n\n")}`;
        response = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: mergedText }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 8192 },
          }),
          signal: controller.signal,
        });
      }

      if (!response.ok) {
        let errText = `HTTP ${response.status}`;
        try {
          const errJson = await response.json();
          errText = errJson.error?.message || errText;
        } catch {
          errText = (await response.text()) || errText;
        }
        const safeErr = sanitizeErrorMessage(errText);
        console.error("Gemini API error:", response.status, safeErr);
        throw new Error(`Gemini API error (${response.status}): ${safeErr}`);
      }
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
      throw new Error("Gemini returned empty candidate response.");
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error(`Google Gemini call timed out after ${LLM_TIMEOUT_MS / 1000}s`);
      }
      const safeMsg = sanitizeErrorMessage(err.message);
      console.error("Gemini call failed:", safeMsg);
      throw new Error(`Google Gemini call failed: ${safeMsg}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // -----------------------------------------------------------
  // 2. Groq / OpenAI Compatible API
  // -----------------------------------------------------------
  if ((provider === "groq" || provider === "openai") && apiKey) {
    let endpoint = "https://api.openai.com/v1/chat/completions";
    if (provider === "groq") {
      endpoint = "https://api.groq.com/openai/v1/chat/completions";
    } else {
      const customBase = config?.baseUrl || getEnv('OPENAI_BASE_URL');
      if (customBase) {
        let cleanBase = customBase.trim();
        if (!cleanBase.startsWith("http://") && !cleanBase.startsWith("https://")) {
          cleanBase = `https://${cleanBase}`;
        }
        cleanBase = cleanBase.replace(/\/+$/, "");
        endpoint = cleanBase.endsWith("/chat/completions") ? cleanBase : `${cleanBase}/chat/completions`;
      }
    }
    const chosenModel = model || getEnv('OPENAI_MODEL') || (provider === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o-mini");
    const isReasoningModel = /^o[13](?:-|$)/i.test(chosenModel);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);

    try {
      const formattedMessages = messages.map(m => {
        if (isReasoningModel && m.role === 'system') {
          return { role: 'developer', content: m.content };
        }
        return m;
      });

      const requestPayload: any = {
        model: chosenModel,
        messages: formattedMessages,
        stream: false,
      };

      if (isReasoningModel) {
        requestPayload.max_completion_tokens = 8192;
        // Reasoning models reject temperature parameter
      } else {
        requestPayload.temperature = 0.2;
        requestPayload.max_tokens = 8192;
      }

      const isJsonRequested = messages.some((m) => /json/i.test(m.content));
      if (provider === "groq" || (provider === "openai" && isJsonRequested && !isReasoningModel)) {
        requestPayload.response_format = { type: "json_object" };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
      });

      if (!response.ok) {
        let errMessage = `HTTP ${response.status}`;
        try {
          const errJson = await response.json();
          errMessage = errJson.error?.message || errJson.message || errMessage;
        } catch {
          errMessage = (await response.text()) || errMessage;
        }
        const safeErr = sanitizeErrorMessage(errMessage);
        console.error(`${provider} API error:`, response.status, safeErr);
        throw new Error(`${provider.toUpperCase()} API error (${response.status}): ${safeErr}`);
      }
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) return content;
      throw new Error(`${provider.toUpperCase()} returned empty completion response.`);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error(`${provider.toUpperCase()} call timed out after ${LLM_TIMEOUT_MS / 1000}s`);
      }
      const safeMsg = sanitizeErrorMessage(err.message);
      console.error(`${provider} call failed:`, safeMsg);
      throw new Error(`${provider.toUpperCase()} call failed: ${safeMsg}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // -----------------------------------------------------------
  // 3. Anthropic Claude API
  // -----------------------------------------------------------
  if (provider === "anthropic" && apiKey) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);
    try {
      const systemMessage = messages.find(m => m.role === 'system')?.content || "";
      const userAssistantMessages = messages
        .filter(m => m.role !== 'system')
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey.trim(),
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: model || "claude-3-5-sonnet-20241022",
          max_tokens: 8192,
          system: systemMessage,
          messages: userAssistantMessages,
          temperature: 0.2,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        let errMessage = `HTTP ${response.status}`;
        try {
          const errJson = await response.json();
          errMessage = errJson.error?.message || errMessage;
        } catch {
          errMessage = (await response.text()) || errMessage;
        }
        const safeErr = sanitizeErrorMessage(errMessage);
        console.error("Anthropic API error:", response.status, safeErr);
        throw new Error(`Anthropic API error (${response.status}): ${safeErr}`);
      }
      const data = await response.json();
      const text = data.content?.[0]?.text;
      if (text) return text;
      throw new Error("Anthropic returned empty message response.");
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error(`Anthropic call timed out after ${LLM_TIMEOUT_MS / 1000}s`);
      }
      const safeMsg = sanitizeErrorMessage(err.message);
      console.error("Anthropic call failed:", safeMsg);
      throw new Error(`Anthropic call failed: ${safeMsg}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // -----------------------------------------------------------
  // 4. Local Ollama (100% Offline & Free)
  // -----------------------------------------------------------
  if (provider === "ollama") {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);
    try {
      let cleanBase = (baseUrl || "http://localhost:11434").trim();
      if (!cleanBase.startsWith("http://") && !cleanBase.startsWith("https://")) {
        cleanBase = `http://${cleanBase}`;
      }
      cleanBase = cleanBase.replace(/\/+$/, "");

      const isJsonRequested = messages.some((m) => /json/i.test(m.content));
      const requestPayload: any = {
        model: model || getEnv('OLLAMA_MODEL') || "llama3.3",
        messages,
        stream: false,
        options: {
          temperature: 0.2,
          num_predict: 8192,
          num_ctx: 16384,
        },
      };
      if (isJsonRequested) {
        requestPayload.format = "json";
      }

      const response = await fetch(`${cleanBase}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
      });

      if (response.ok) {
        const data = await response.json();
        return data.message?.content || "";
      }
      throw new Error(`Ollama service returned HTTP ${response.status}`);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error(`Local Ollama service call timed out after ${LLM_TIMEOUT_MS / 1000}s`);
      }
      const safeMsg = sanitizeErrorMessage(err.message);
      throw new Error(`Local Ollama service unreachable at ${baseUrl}: ${safeMsg}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw new Error(`Unable to complete AI evaluation. Provider ${provider} is not configured.`);
}



export const CURATED_MODELS: Record<LLMProvider, AvailableModel[]> = {
  gemini: [
    {
      id: "gemini-2.5-flash",
      name: "Gemini 2.5 Flash",
      description: "Google's newest adaptive thinking model. Fast, multimodal, and highly accurate for triage.",
      tag: "✨ Recommended",
      recommended: true,
    },
    {
      id: "gemini-2.5-pro",
      name: "Gemini 2.5 Pro",
      description: "Frontier scientific reasoning model for deep experimental and causal validation.",
      tag: "🧠 Frontier Reasoning",
      recommended: false,
    },
    {
      id: "gemini-2.0-flash",
      name: "Gemini 2.0 Flash",
      description: "Next-gen sub-second inference speed for instant diagnostics.",
      tag: "⚡ Ultra Fast",
      recommended: false,
    },
    {
      id: "gemini-1.5-flash",
      name: "Gemini 1.5 Flash",
      description: "Proven lightweight production model with balanced quality and speed.",
      tag: "Stable",
      recommended: false,
    },
    {
      id: "gemini-1.5-pro",
      name: "Gemini 1.5 Pro",
      description: "Massive 2M token context window for comprehensive manuscript + supplement analysis.",
      tag: "2M Context",
      recommended: false,
    },
  ],
  openai: [
    {
      id: "gpt-4o",
      name: "GPT-4o (Omni)",
      description: "OpenAI flagship high-intelligence model for nuanced peer-review simulation.",
      tag: "✨ Recommended",
      recommended: true,
    },
    {
      id: "gpt-4o-mini",
      name: "GPT-4o Mini",
      description: "Fast, cost-efficient model for quick pre-submission screening.",
      tag: "⚡ Fast & Affordable",
      recommended: false,
    },
    {
      id: "o3-mini",
      name: "o3-mini (STEM)",
      description: "Specialized STEM reasoning model for methodology, statistics, and sample power.",
      tag: "🧠 STEM Reasoning",
      recommended: false,
    },
    {
      id: "o1",
      name: "o1 (Full Reasoning)",
      description: "Deep reflective thinking for intricate causal claims and mechanism proofs.",
      tag: "🧠 Deep Thinking",
      recommended: false,
    },
    {
      id: "gpt-4-turbo",
      name: "GPT-4 Turbo",
      description: "Previous generation frontier model with 128k context.",
      tag: "Legacy",
      recommended: false,
    },
  ],
  anthropic: [
    {
      id: "claude-3-7-sonnet-20250219",
      name: "Claude 3.7 Sonnet",
      description: "Anthropic's latest hybrid reasoning model. Exceptional academic critique and editorial voice.",
      tag: "✨ Latest / Recommended",
      recommended: true,
    },
    {
      id: "claude-3-5-sonnet-20241022",
      name: "Claude 3.5 Sonnet",
      description: "Renowned standard for scholarly writing, tone, and deep methodological critique.",
      tag: "Editorial Standard",
      recommended: false,
    },
    {
      id: "claude-3-5-haiku-20241022",
      name: "Claude 3.5 Haiku",
      description: "Rapid inference for initial sanity checks and fast scans.",
      tag: "⚡ Ultra Fast",
      recommended: false,
    },
    {
      id: "claude-3-opus-20240229",
      name: "Claude 3 Opus",
      description: "Deep synthesis for complex, multidisciplinary manuscripts.",
      tag: "Nuanced",
      recommended: false,
    },
  ],
  groq: [
    {
      id: "llama-3.3-70b-versatile",
      name: "Llama 3.3 70B Versatile",
      description: "Meta 70B flagship model on Groq LPUs (~300 tokens/sec). Full peer-review fidelity.",
      tag: "✨ Recommended",
      recommended: true,
    },
    {
      id: "llama-3.1-8b-instant",
      name: "Llama 3.1 8B Instant",
      description: "Blazing fast speed (~800 tokens/sec) for real-time section checks.",
      tag: "⚡ 800 tok/sec",
      recommended: false,
    },
    {
      id: "deepseek-r1-distill-llama-70b",
      name: "DeepSeek R1 Distill 70B",
      description: "Reasoning-distilled model for mathematical proof and control auditing.",
      tag: "🧠 Reasoning",
      recommended: false,
    },
    {
      id: "mixtral-8x7b-32768",
      name: "Mixtral 8x7B MoE",
      description: "Mistral MoE architecture with 32k context window.",
      tag: "MoE",
      recommended: false,
    },
  ],
  ollama: [
    {
      id: "llama3.3",
      name: "Llama 3.3 (Local)",
      description: "Meta Llama 3.3 on local machine. 100% private & offline.",
      tag: "✨ Recommended Local",
      recommended: true,
    },
    {
      id: "deepseek-r1",
      name: "DeepSeek R1 (Local)",
      description: "Local reasoning model for methodology checks.",
      tag: "🧠 Reasoning",
      recommended: false,
    },
    {
      id: "mistral",
      name: "Mistral 7B (Local)",
      description: "Compact and fast local inference.",
      tag: "Fast Local",
      recommended: false,
    },
    {
      id: "phi3",
      name: "Phi-3 (Local)",
      description: "Microsoft Phi-3 lightweight local model.",
      tag: "Compact",
      recommended: false,
    },
  ],
};

export async function fetchAvailableModels(
  config?: ProviderConfig,
  options?: { throwOnError?: boolean }
): Promise<AvailableModel[]> {
  const serverStatus = getServerConfigStatus();
  const provider: LLMProvider = config?.provider || (serverStatus.activeProvider !== "none" ? serverStatus.activeProvider : "gemini");
  let apiKey = config?.apiKey?.trim() || "";
  let baseUrl = config?.baseUrl?.trim() || "";

  if (!apiKey) {
    if (provider === "gemini") apiKey = getEnv('GEMINI_API_KEY') || getEnv('GOOGLE_API_KEY');
    else if (provider === "groq") apiKey = getEnv('GROQ_API_KEY');
    else if (provider === "openai") apiKey = getEnv('OPENAI_API_KEY');
    else if (provider === "anthropic") apiKey = getEnv('ANTHROPIC_API_KEY');
  }
  if (!baseUrl) {
    if (provider === "openai") baseUrl = getEnv('OPENAI_BASE_URL') || "https://api.openai.com/v1";
    else if (provider === "ollama") baseUrl = getEnv('OLLAMA_BASE_URL') || "http://localhost:11434";
  }

  const defaultList = CURATED_MODELS[provider] || CURATED_MODELS.gemini;

  if (options?.throwOnError && !apiKey && provider !== "ollama") {
    throw new Error(`Please enter your ${provider.toUpperCase()} API key first.`);
  }

  try {
    if (provider === "gemini" && apiKey) {
      const cleanKey = encodeURIComponent(apiKey.trim());
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`, {
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.models)) {
          const liveModels: AvailableModel[] = data.models
            .filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"))
            .map((m: any) => {
              const id = m.name.replace(/^models\//, "");
              const existing = defaultList.find((d) => d.id === id);
              return {
                id,
                name: m.displayName || existing?.name || id,
                description: existing?.description || m.description || "Google Generative AI Model",
                tag: existing?.tag || (id.includes("flash") ? "⚡ Fast" : id.includes("pro") ? "🧠 Frontier" : undefined),
                recommended: existing?.recommended || id.includes("2.5-flash") || id.includes("1.5-flash"),
                isLive: true,
              };
            });
          if (liveModels.length > 0) {
            return liveModels.sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0));
          }
        }
      } else if (options?.throwOnError) {
        let errMessage = `HTTP ${res.status}`;
        try {
          const errJson = await res.json();
          errMessage = errJson.error?.message || errMessage;
        } catch {
          errMessage = (await res.text()) || errMessage;
        }
        throw new Error(`Gemini API error (${res.status}): ${errMessage}`);
      }
    } else if (provider === "openai" && apiKey) {
      let cleanBase = (baseUrl || "https://api.openai.com/v1").trim();
      if (!cleanBase.startsWith("http://") && !cleanBase.startsWith("https://")) {
        cleanBase = `https://${cleanBase}`;
      }
      cleanBase = cleanBase.replace(/\/+$/, "");
      const endpoint = cleanBase.endsWith("/models") ? cleanBase : `${cleanBase}/models`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${apiKey.trim()}` },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.data)) {
          const chatIds = data.data
            .map((m: any) => m.id)
            .filter((id: string) => id.includes("gpt") || id.startsWith("o1") || id.startsWith("o3") || id.includes("chat") || id.includes("claude"));
          if (chatIds.length > 0) {
            const mapped: AvailableModel[] = chatIds.map((id: string) => {
              const existing = defaultList.find((d) => d.id === id);
              return {
                id,
                name: existing?.name || id,
                description: existing?.description || `OpenAI model ${id}`,
                tag: existing?.tag || (id.startsWith("o") ? "🧠 Reasoning" : id.includes("mini") ? "⚡ Fast" : undefined),
                recommended: existing?.recommended || id === "gpt-4o",
                isLive: true,
              };
            });
            return mapped.sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0));
          }
        }
      } else if (options?.throwOnError) {
        let errMessage = `HTTP ${res.status}`;
        try {
          const errJson = await res.json();
          errMessage = errJson.error?.message || errJson.message || errMessage;
        } catch {
          errMessage = (await res.text()) || errMessage;
        }
        throw new Error(`OpenAI API error (${res.status}): ${errMessage}`);
      }
    } else if (provider === "groq" && apiKey) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { Authorization: `Bearer ${apiKey.trim()}` },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.data)) {
          const mapped: AvailableModel[] = data.data
            .filter((m: any) => m.active !== false)
            .map((m: any) => {
              const id = m.id;
              const existing = defaultList.find((d) => d.id === id);
              return {
                id,
                name: existing?.name || id,
                description: existing?.description || `Groq LPU accelerated model (${m.owned_by || "Meta"})`,
                tag: existing?.tag || (id.includes("70b") ? "✨ High Quality" : id.includes("8b") ? "⚡ Ultra Fast" : undefined),
                recommended: existing?.recommended || id.includes("llama-3.3-70b"),
                isLive: true,
              };
            });
          if (mapped.length > 0) {
            return mapped.sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0));
          }
        }
      } else if (options?.throwOnError) {
        let errMessage = `HTTP ${res.status}`;
        try {
          const errJson = await res.json();
          errMessage = errJson.error?.message || errJson.message || errMessage;
        } catch {
          errMessage = (await res.text()) || errMessage;
        }
        throw new Error(`Groq API error (${res.status}): ${errMessage}`);
      }
    } else if (provider === "anthropic" && apiKey) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch("https://api.anthropic.com/v1/models", {
        headers: {
          "x-api-key": apiKey.trim(),
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.data)) {
          const mapped: AvailableModel[] = data.data.map((m: any) => {
            const id = m.id;
            const existing = defaultList.find((d) => d.id === id);
            return {
              id,
              name: m.display_name || existing?.name || id,
              description: existing?.description || `Anthropic model ${id}`,
              tag: existing?.tag || (id.includes("sonnet") ? "🧠 Frontier" : id.includes("haiku") ? "⚡ Fast" : undefined),
              recommended: existing?.recommended || id.includes("sonnet-3-7") || id.includes("sonnet-3-5"),
              isLive: true,
            };
          });
          if (mapped.length > 0) {
            return mapped.sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0));
          }
        }
      } else if (options?.throwOnError) {
        let errMessage = `HTTP ${res.status}`;
        try {
          const errJson = await res.json();
          errMessage = errJson.error?.message || errMessage;
        } catch {
          errMessage = (await res.text()) || errMessage;
        }
        throw new Error(`Anthropic API error (${res.status}): ${errMessage}`);
      }
    } else if (provider === "ollama") {
      let cleanBase = (baseUrl || "http://localhost:11434").trim();
      if (!cleanBase.startsWith("http://") && !cleanBase.startsWith("https://")) {
        cleanBase = `http://${cleanBase}`;
      }
      cleanBase = cleanBase.replace(/\/+$/, "");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${cleanBase}/api/tags`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.models) && data.models.length > 0) {
          const installed: AvailableModel[] = data.models.map((m: any, idx: number) => ({
            id: m.name,
            name: `${m.name} (Installed)`,
            description: `Locally pulled model (${Math.round(((m.size || 0) / 1024 / 1024 / 1024) * 10) / 10} GB)`,
            tag: idx === 0 ? "✨ Active Local" : "Local",
            recommended: idx === 0,
            isLive: true,
          }));
          return installed;
        } else if (options?.throwOnError) {
          throw new Error(`Connected to Ollama, but no local models were found. Run 'ollama pull llama3.3' in your terminal.`);
        }
      } else if (options?.throwOnError) {
        throw new Error(`Ollama server returned HTTP ${res.status}. Check that 'ollama serve' is running.`);
      }
    }
  } catch (err: any) {
    if (options?.throwOnError) {
      throw err;
    }
  }

  return defaultList;
}

export interface ConnectionTestResult {
  success: boolean;
  provider: LLMProvider;
  model: string;
  latencyMs: number;
  message: string;
  error?: string;
  availableModels: AvailableModel[];
  details?: {
    endpoint?: string;
    statusCode?: number;
  };
}


export async function testLLMConnection(
  config?: ProviderConfig
): Promise<ConnectionTestResult> {
  // 1. Resolve Provider and Credentials
  const serverStatus = getServerConfigStatus();
  let provider: LLMProvider = config?.provider || (serverStatus.activeProvider !== 'none' ? serverStatus.activeProvider : "ollama");
  let apiKey: string = config?.apiKey?.trim() || "";
  let model: string = config?.model?.trim() || "";
  let baseUrl: string = (config?.baseUrl || (provider === 'openai' ? getEnv('OPENAI_BASE_URL') : undefined) || getEnv('OLLAMA_BASE_URL') || "http://localhost:11434").trim();

  // If no apiKey provided, resolve from environment
  if (!apiKey && provider !== "ollama") {
    if (provider === "gemini") {
      apiKey = getEnv('GEMINI_API_KEY') || getEnv('GOOGLE_API_KEY');
      model = model || getEnv('GEMINI_MODEL') || "gemini-1.5-flash";
    } else if (provider === "groq") {
      apiKey = getEnv('GROQ_API_KEY');
      model = model || getEnv('GROQ_MODEL') || "llama-3.3-70b-versatile";
    } else if (provider === "openai") {
      apiKey = getEnv('OPENAI_API_KEY');
      model = model || getEnv('OPENAI_MODEL') || "gpt-4o-mini";
      if (!config?.baseUrl && getEnv('OPENAI_BASE_URL')) {
        baseUrl = getEnv('OPENAI_BASE_URL');
      }
    } else if (provider === "anthropic") {
      apiKey = getEnv('ANTHROPIC_API_KEY');
      model = model || getEnv('ANTHROPIC_MODEL') || "claude-3-5-sonnet-20241022";
    }
  }

  // If still no API key and provider requires one:
  if (!apiKey && provider !== "ollama") {
    return {
      success: false,
      provider,
      model: model || "unknown",
      latencyMs: 0,
      message: `No API key provided for ${provider.toUpperCase()}`,
      error: `Please provide a valid ${provider.toUpperCase()} API key or configure it in .env.local`,
      availableModels: CURATED_MODELS[provider] || CURATED_MODELS.gemini,
    };
  }

  const startTime = Date.now();
  const timeoutMs = 15000;
  const availableModels = await fetchAvailableModels({ provider, model, apiKey, baseUrl });

  try {
    // -----------------------------------------------------------
    // 1. Google Gemini Ping Probe
    // -----------------------------------------------------------
    if (provider === "gemini") {
      const geminiModel = model || "gemini-1.5-flash";
      const cleanModel = encodeURIComponent(geminiModel.trim());
      const cleanKey = encodeURIComponent(apiKey.trim());
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${cleanKey}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "ping" }] }],
          generationConfig: { maxOutputTokens: 2 },
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const latencyMs = Date.now() - startTime;

      if (response.ok) {
        return {
          success: true,
          provider: "gemini",
          model: geminiModel,
          latencyMs,
          message: `Connected to Google Gemini (${geminiModel}) in ${latencyMs}ms`,
          availableModels,
          details: { statusCode: response.status },
        };
      } else {
        let errMessage = `HTTP ${response.status}`;
        try {
          const errJson = await response.json();
          errMessage = errJson.error?.message || errMessage;
        } catch {
          errMessage = await response.text() || errMessage;
        }
        return {
          success: false,
          provider: "gemini",
          model: geminiModel,
          latencyMs,
          message: `Gemini API returned error ${response.status}`,
          error: sanitizeErrorMessage(errMessage),
          availableModels,
          details: { statusCode: response.status },
        };
      }
    }

    // -----------------------------------------------------------
    // 2. OpenAI / Compatible Proxy / Groq Ping Probe
    // -----------------------------------------------------------
    if (provider === "openai" || provider === "groq") {
      let endpoint = "https://api.openai.com/v1/chat/completions";
      if (provider === "groq") {
        endpoint = "https://api.groq.com/openai/v1/chat/completions";
      } else {
        const customBase = config?.baseUrl || getEnv('OPENAI_BASE_URL');
        if (customBase) {
          let cleanBase = customBase.trim();
          if (!cleanBase.startsWith("http://") && !cleanBase.startsWith("https://")) {
            cleanBase = `https://${cleanBase}`;
          }
          cleanBase = cleanBase.replace(/\/+$/, "");
          endpoint = cleanBase.endsWith("/chat/completions") ? cleanBase : `${cleanBase}/chat/completions`;
        }
      }

      const chosenModel = model || (provider === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o-mini");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: chosenModel,
          messages: [{ role: "user", content: "ping" }],
          max_tokens: 2,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const latencyMs = Date.now() - startTime;

      if (response.ok) {
        return {
          success: true,
          provider,
          model: chosenModel,
          latencyMs,
          message: `Connected to ${provider.toUpperCase()} (${chosenModel}) in ${latencyMs}ms`,
          availableModels,
          details: { endpoint, statusCode: response.status },
        };
      } else {
        let errMessage = `HTTP ${response.status}`;
        try {
          const errJson = await response.json();
          errMessage = errJson.error?.message || errJson.message || errMessage;
        } catch {
          errMessage = await response.text() || errMessage;
        }
        return {
          success: false,
          provider,
          model: chosenModel,
          latencyMs,
          message: `${provider.toUpperCase()} connection failed (${response.status})`,
          error: sanitizeErrorMessage(errMessage),
          availableModels,
          details: { endpoint, statusCode: response.status },
        };
      }
    }

    // -----------------------------------------------------------
    // 3. Anthropic Claude Ping Probe
    // -----------------------------------------------------------
    if (provider === "anthropic") {
      const chosenModel = model || "claude-3-5-sonnet-20241022";
      const endpoint = "https://api.anthropic.com/v1/messages";

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey.trim(),
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: chosenModel,
          max_tokens: 2,
          messages: [{ role: "user", content: "ping" }],
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const latencyMs = Date.now() - startTime;

      if (response.ok) {
        return {
          success: true,
          provider: "anthropic",
          model: chosenModel,
          latencyMs,
          message: `Connected to Anthropic (${chosenModel}) in ${latencyMs}ms`,
          availableModels,
          details: { statusCode: response.status },
        };
      } else {
        let errMessage = `HTTP ${response.status}`;
        try {
          const errJson = await response.json();
          errMessage = errJson.error?.message || errMessage;
        } catch {
          errMessage = await response.text() || errMessage;
        }
        return {
          success: false,
          provider: "anthropic",
          model: chosenModel,
          latencyMs,
          message: `Anthropic API returned error ${response.status}`,
          error: sanitizeErrorMessage(errMessage),
          availableModels,
          details: { statusCode: response.status },
        };
      }
    }

    // -----------------------------------------------------------
    // 4. Local Ollama Ping Probe
    // -----------------------------------------------------------
    if (provider === "ollama") {
      let cleanBase = (baseUrl || "http://localhost:11434").trim();
      if (!cleanBase.startsWith("http://") && !cleanBase.startsWith("https://")) {
        cleanBase = `http://${cleanBase}`;
      }
      cleanBase = cleanBase.replace(/\/+$/, "");
      const tagsUrl = `${cleanBase}/api/tags`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(tagsUrl, {
        method: "GET",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const latencyMs = Date.now() - startTime;

      if (response.ok) {
        let installedModels: string[] = [];
        try {
          const data = await response.json();
          if (Array.isArray(data.models)) {
            installedModels = data.models.map((m: any) => m.name);
          }
        } catch {}

        const chosenModel = model || "llama3.3";
        const hasModel = installedModels.some(m => m.includes(chosenModel));

        return {
          success: true,
          provider: "ollama",
          model: chosenModel,
          latencyMs,
          message: hasModel
            ? `Local Ollama is active with ${chosenModel} (${latencyMs}ms)`
            : `Local Ollama is reachable (${latencyMs}ms). ${installedModels.length} models installed.`,
          availableModels,
          details: { endpoint: cleanBase, statusCode: response.status },
        };
      } else {
        return {
          success: false,
          provider: "ollama",
          model: model || "llama3.3",
          latencyMs,
          message: `Ollama service returned status ${response.status}`,
          error: sanitizeErrorMessage(`Ollama at ${cleanBase} responded with status ${response.status}`),
          availableModels,
        };
      }
    }

    return {
      success: false,
      provider,
      model: model || "unknown",
      latencyMs: 0,
      message: `Unsupported provider: ${provider}`,
      error: `Unknown provider ${provider}`,
      availableModels: CURATED_MODELS[provider] || CURATED_MODELS.gemini,
    };
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    const isTimeout = err.name === "AbortError" || err.message?.includes("abort");

    return {
      success: false,
      provider,
      model: model || "unknown",
      latencyMs,
      message: isTimeout ? `Connection timed out after ${timeoutMs / 1000}s` : `Connection failed`,
      error: isTimeout
        ? `Request timed out. Ensure the endpoint and network are reachable.`
        : sanitizeErrorMessage(err.message || "Network error: Unable to reach the API server."),
      availableModels: CURATED_MODELS[provider] || CURATED_MODELS.gemini,
    };
  }
}

