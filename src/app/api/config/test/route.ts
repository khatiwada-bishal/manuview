import { NextRequest, NextResponse } from "next/server";
import { testLLMConnection } from "@/lib/llm";
import { ProviderConfig } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {}

    const config: ProviderConfig | undefined = body?.config || body;
    const result = await testLLMConnection(config);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal connection test error",
        error: err.message || "Unknown error",
        latencyMs: 0,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await testLLMConnection();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal connection test error",
        error: err.message || "Unknown error",
        latencyMs: 0,
      },
      { status: 500 }
    );
  }
}
