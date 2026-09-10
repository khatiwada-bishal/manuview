import { NextRequest, NextResponse } from "next/server";
import { fetchAvailableModels, CURATED_MODELS } from "@/lib/llm";
import { ProviderConfig, LLMProvider } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {}

    const config: ProviderConfig | undefined = body?.config || body;
    const models = await fetchAvailableModels(config);

    return NextResponse.json({
      success: true,
      provider: config?.provider || "gemini",
      models,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      models: [],
      error: err?.message || "Failed to load models",
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const provider = (searchParams.get("provider") || "gemini") as LLMProvider;
    const models = await fetchAvailableModels({ provider, model: "" });

    return NextResponse.json({
      success: true,
      provider,
      models: models && models.length > 0 ? models : CURATED_MODELS[provider] || CURATED_MODELS.gemini,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      models: [],
      error: err?.message || "Failed to load models",
    });
  }
}
