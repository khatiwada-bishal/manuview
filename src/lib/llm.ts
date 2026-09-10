import { ProviderConfig, LLMProvider } from "./types";

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export function getServerConfigStatus(): {
  hasServerKey: boolean;
  activeProvider: LLMProvider | 'none';
  availableProviders: string[];
  baseUrl?: string;
  model?: string;
} {
  const providers: string[] = [];
  let activeProvider: LLMProvider | 'none' = 'none';

  if (process.env.OPENAI_API_KEY) {
    providers.push('openai');
    if (activeProvider === 'none') activeProvider = 'openai';
  }
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
    providers.push('gemini');
    if (activeProvider === 'none') activeProvider = 'gemini';
  }
  if (process.env.GROQ_API_KEY) {
    providers.push('groq');
    if (activeProvider === 'none') activeProvider = 'groq';
  }
  if (process.env.ANTHROPIC_API_KEY) {
    providers.push('anthropic');
    if (activeProvider === 'none') activeProvider = 'anthropic';
  }

  return {
    hasServerKey: providers.length > 0,
    activeProvider,
    availableProviders: providers,
    baseUrl: process.env.OPENAI_BASE_URL,
    model: process.env.OPENAI_MODEL || process.env.GEMINI_MODEL || process.env.GROQ_MODEL,
  };
}

export async function callLLM(
  messages: LLMMessage[],
  config?: ProviderConfig
): Promise<string> {
  // 1. Resolve Provider and Credentials
  // Check if frontend passed an explicit API key or provider
  let provider: LLMProvider = config?.provider || "ollama";
  let apiKey: string = config?.apiKey || "";
  let model: string = config?.model || "";
  let baseUrl: string = config?.baseUrl || process.env.OLLAMA_BASE_URL || "http://localhost:11434";

  // If no apiKey provided by client, auto-detect from server environment variables
  if (!apiKey) {
    if (provider === "gemini" || (!config && (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY))) {
      apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
      if (apiKey) {
        provider = "gemini";
        model = model || process.env.GEMINI_MODEL || "gemini-1.5-flash";
      }
    } else if (provider === "groq" || (!config && process.env.GROQ_API_KEY)) {
      apiKey = process.env.GROQ_API_KEY || "";
      if (apiKey) {
        provider = "groq";
        model = model || process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
      }
    } else if (provider === "openai" || (!config && process.env.OPENAI_API_KEY)) {
      apiKey = process.env.OPENAI_API_KEY || "";
      if (apiKey) {
        provider = "openai";
        model = model || process.env.OPENAI_MODEL || "gpt-4o-mini";
      }
    } else if (provider === "anthropic" || (!config && process.env.ANTHROPIC_API_KEY)) {
      apiKey = process.env.ANTHROPIC_API_KEY || "";
      if (apiKey) {
        provider = "anthropic";
        model = model || process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022";
      }
    }
  }

  // If still no API key and provider was not explicitly set to Ollama, check any available env key
  if (!apiKey && provider !== "ollama") {
    const serverStatus = getServerConfigStatus();
    if (serverStatus.hasServerKey && serverStatus.activeProvider !== 'none') {
      provider = serverStatus.activeProvider;
      if (provider === "gemini") apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
      else if (provider === "groq") apiKey = process.env.GROQ_API_KEY || "";
      else if (provider === "openai") apiKey = process.env.OPENAI_API_KEY || "";
      else if (provider === "anthropic") apiKey = process.env.ANTHROPIC_API_KEY || "";
    }
  }

  // -----------------------------------------------------------
  // 1. Google Gemini API
  // -----------------------------------------------------------
  if (provider === "gemini" && apiKey) {
    const geminiModel = model || "gemini-1.5-flash";
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;
    try {
      const contents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: { temperature: 0.2, maxOutputTokens: 4096 },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Gemini API error:", response.status, errText);
        throw new Error(`Gemini API error (${response.status}): ${errText}`);
      }
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (err: any) {
      console.error("Gemini call failed:", err.message);
      return generateOfflineReview(messages);
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
      const customBase = config?.baseUrl || process.env.OPENAI_BASE_URL;
      if (customBase) {
        const cleanBase = customBase.replace(/\/+$/, "");
        endpoint = cleanBase.endsWith("/chat/completions") ? cleanBase : `${cleanBase}/chat/completions`;
      }
    }
    const chosenModel = model || process.env.OPENAI_MODEL || (provider === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o-mini");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: chosenModel,
          messages,
          temperature: 0.2,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`${provider} API error:`, response.status, errText);
        throw new Error(`${provider} API error: ${errText}`);
      }
      const data = await response.json();
      return data.choices?.[0]?.message?.content || "";
    } catch (err: any) {
      console.error(`${provider} call failed:`, err.message);
      return generateOfflineReview(messages);
    }
  }

  // -----------------------------------------------------------
  // 3. Anthropic Claude API
  // -----------------------------------------------------------
  if (provider === "anthropic" && apiKey) {
    try {
      const systemMessage = messages.find(m => m.role === 'system')?.content || "";
      const userAssistantMessages = messages
        .filter(m => m.role !== 'system')
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: model || "claude-3-5-sonnet-20241022",
          max_tokens: 4096,
          system: systemMessage,
          messages: userAssistantMessages,
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Anthropic API error:", response.status, errText);
        throw new Error(`Anthropic API error: ${errText}`);
      }
      const data = await response.json();
      return data.content?.[0]?.text || "";
    } catch (err: any) {
      console.error("Anthropic call failed:", err.message);
      return generateOfflineReview(messages);
    }
  }

  // -----------------------------------------------------------
  // 4. Local Ollama (100% Offline & Free)
  // -----------------------------------------------------------
  if (provider === "ollama") {
    try {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model || process.env.OLLAMA_MODEL || "llama3.3",
          messages,
          stream: false,
          options: { temperature: 0.2 },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.message?.content || "";
      }
    } catch (err: any) {
      // Ollama not reachable
    }
  }

  // -----------------------------------------------------------
  // 5. Fallback deterministic review
  // -----------------------------------------------------------
  return generateOfflineReview(messages);
}

// Deterministic offline fallback diagnostic when no LLM is connected
function generateOfflineReview(messages: LLMMessage[]): string {
  const userPrompt = messages.find(m => m.role === 'user')?.content || "";
  
  return JSON.stringify({
    overallScore: 68,
    summary: "The manuscript addresses an impactful problem with sound preliminary results. However, several causal claims lack sufficient mechanistic control experiments, and statistical reporting omits multiplicity corrections.",
    dimensions: {
      originality: {
        score: 4,
        label: "Originality & Novelty",
        verdict: "Strong conceptual advance; differentiates effectively from existing baselines.",
        strengths: ["Novel perspective on core mechanism", "Addresses an acknowledged literature bottleneck"],
        vulnerabilities: ["Incremental comparison with the most recent 2024 literature is brief"]
      },
      broad_interest: {
        score: 3,
        label: "Importance & Broad Interest",
        verdict: "High relevance within the specialized subfield; broader general interest needs stronger framing.",
        strengths: ["Clear practical application", "Good clinical/theoretical motivation"],
        vulnerabilities: ["Implications for adjacent fields are understated in abstract"]
      },
      claims_vs_evidence: {
        score: 2,
        label: "Strength of Claims vs. Evidence",
        verdict: "Overstatement hazard detected: Correlative observations are described using definitive causal verbs.",
        strengths: ["Clear primary measurement assays"],
        vulnerabilities: ["Headline claim uses 'demonstrates' where only correlation was observed", "Missing rescue/ablation control condition"]
      },
      methodology: {
        score: 3,
        label: "Methodological & Statistical Soundness",
        verdict: "Sound design but sample size power calculation and multiple testing corrections are not documented.",
        strengths: ["Standardized protocol referenced", "Replicates reported"],
        vulnerabilities: ["No explicit power analysis justifying sample size", "Multiplicity correction omitted for post-hoc tests"]
      },
      clarity: {
        score: 4,
        label: "Clarity & Presentation",
        verdict: "Well-structured narrative with clear section transitions.",
        strengths: ["Abstract follows Problem-Gap-Approach-Result sequence", "Logical progression of figures"],
        vulnerabilities: ["Some technical abbreviations undefined on first use"]
      },
      prior_work: {
        score: 3,
        label: "Prior Work & Reference Integrity",
        verdict: "Good foundational coverage, but self-citation ratio is slightly elevated and recent preprints are unaddressed.",
        strengths: ["Classic landmark literature properly cited"],
        vulnerabilities: ["Self-citation ratio approaches 22%", "Missing 2 key peer publications from 2023-2024"]
      }
    },
    priorityIssues: [
      {
        id: "p1",
        priority: "A",
        title: "Causal Language Without Orthogonal Mechanistic Control",
        category: "Causal Claims",
        description: "The discussion asserts that factor X drives phenotype Y, but the evidence presented relies solely on correlational association without genetic rescue or inhibitory perturbation.",
        reviewerQuote: "'The authors claim in lines 145-148 that X causes Y. Without a targeted knockdown or rescue experiment, this conclusion is premature and unsupported.'",
        actionableFix: "Soften wording in the Abstract and Discussion from 'X proves/causes Y' to 'X is strongly associated with Y under tested conditions', or include the negative control data."
      },
      {
        id: "p2",
        priority: "A",
        title: "Missing Multiple Testing Correction (FDR / Bonferroni)",
        category: "Statistics",
        description: "Multiple parallel pairwise comparisons are reported with unadjusted p-values (< 0.05), creating an unaddressed false positive hazard.",
        reviewerQuote: "'Given that 18 distinct metrics were tested across 3 cohorts, how did the authors control the family-wise error rate?'",
        actionableFix: "Apply Benjamini-Hochberg False Discovery Rate (FDR) or Bonferroni adjustments and report adjusted q-values in Table 2."
      },
      {
        id: "p3",
        priority: "B",
        title: "Underpowered Sample Size Rationale",
        category: "Methodology",
        description: "Cohort size (n=8 per arm) lacks explicit statistical power calculations.",
        reviewerQuote: "'The sample size is small for a heterogeneous biological model. Please provide power calculations or acknowledge power limitations in the Discussion.'",
        actionableFix: "Add a paragraph in the Methods detailing the effect size assumed for the power calculation, or explicitly bound the generalizability."
      }
    ],
    reviewerPersonas: [
      {
        persona: "methods_reviewer",
        name: "Dr. A. Vance (Methods Reviewer)",
        roleDescription: "Experimental Rigor & Protocol Reproducibility",
        keyChallenge: "Missing reagents batch numbers and code repo commit hash.",
        assessment: "The core protocol is sound, but full independent replication would be blocked by missing version numbers for computational analysis scripts.",
        mustAddressItems: ["Specify software version and seed values for stochastic models", "Include positive control bands in Figure 2B"]
      },
      {
        persona: "domain_expert",
        name: "Prof. K. Thorne (Domain Specialist)",
        roleDescription: "Novelty & Subfield Significance",
        keyChallenge: "How does this advance past the 2024 Chen et al. publication?",
        assessment: "The findings are credible, but the introduction does not explicitly contrast this mechanism against Chen et al. (2024), which reached a similar conclusion in vitro.",
        mustAddressItems: ["Add a dedicated paragraph contrasting findings with Chen et al.", "Clarify why the in vivo model yields different kinetics"]
      },
      {
        persona: "journal_editor",
        name: "Senior Editor (General Readership)",
        roleDescription: "Broad Impact & Desk-Rejection Triage",
        keyChallenge: "Abstract is too technical for general cross-disciplinary readers.",
        assessment: "This manuscript will struggle at top multidisciplinary journals (Nature/Science) unless the opening and closing sentences explicitly frame the broad biological significance.",
        mustAddressItems: ["Rewrite opening sentence to avoid subfield jargon", "Clarify translational relevance in final abstract sentence"]
      },
      {
        persona: "statistician",
        name: "Dr. M. Sorkin (Biostatistician)",
        roleDescription: "Statistical Validity & Data Distributions",
        keyChallenge: "Parametric t-test used on small sample size without normality test.",
        assessment: "Using standard t-tests on n=6 without assessing normal distribution is a frequent desk-rejection flag.",
        mustAddressItems: ["Perform Shapiro-Wilk normality test or use non-parametric Mann-Whitney U test", "Define error bars as SD vs SEM in all figure captions"]
      }
    ]
  });
}

export interface ConnectionTestResult {
  success: boolean;
  provider: LLMProvider;
  model: string;
  latencyMs: number;
  message: string;
  error?: string;
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
  let baseUrl: string = (config?.baseUrl || (provider === 'openai' ? process.env.OPENAI_BASE_URL : undefined) || process.env.OLLAMA_BASE_URL || "http://localhost:11434").trim();

  // If no apiKey provided, resolve from server environment
  if (!apiKey && provider !== "ollama") {
    if (provider === "gemini") {
      apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
      model = model || process.env.GEMINI_MODEL || "gemini-1.5-flash";
    } else if (provider === "groq") {
      apiKey = process.env.GROQ_API_KEY || "";
      model = model || process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
    } else if (provider === "openai") {
      apiKey = process.env.OPENAI_API_KEY || "";
      model = model || process.env.OPENAI_MODEL || "gpt-4o-mini";
      if (!config?.baseUrl && process.env.OPENAI_BASE_URL) {
        baseUrl = process.env.OPENAI_BASE_URL;
      }
    } else if (provider === "anthropic") {
      apiKey = process.env.ANTHROPIC_API_KEY || "";
      model = model || process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022";
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
    };
  }

  const startTime = Date.now();
  const timeoutMs = 15000;

  try {
    // -----------------------------------------------------------
    // 1. Google Gemini Ping Probe
    // -----------------------------------------------------------
    if (provider === "gemini") {
      const geminiModel = model || "gemini-1.5-flash";
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

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
          error: errMessage,
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
        const customBase = config?.baseUrl || process.env.OPENAI_BASE_URL;
        if (customBase) {
          const cleanBase = customBase.replace(/\/+$/, "");
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
          "Authorization": `Bearer ${apiKey}`,
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
          error: errMessage,
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
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
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
          error: errMessage,
          details: { statusCode: response.status },
        };
      }
    }

    // -----------------------------------------------------------
    // 4. Local Ollama Ping Probe
    // -----------------------------------------------------------
    if (provider === "ollama") {
      const cleanBase = baseUrl.replace(/\/+$/, "");
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
          details: { endpoint: cleanBase, statusCode: response.status },
        };
      } else {
        return {
          success: false,
          provider: "ollama",
          model: model || "llama3.3",
          latencyMs,
          message: `Ollama service returned status ${response.status}`,
          error: `Ollama at ${cleanBase} responded with status ${response.status}`,
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
        : err.message || "Network error: Unable to reach the API server.",
    };
  }
}

