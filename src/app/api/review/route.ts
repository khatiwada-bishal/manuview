import { NextRequest, NextResponse } from "next/server";
import { parseManuscriptText, parseDocxBuffer } from "@/lib/parser";
import { runManuscriptDiagnostic } from "@/lib/diagnostic-engine";
import { ProviderConfig } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let manuscriptText = "";
    let targetJournal = "";
    let providerConfig: ProviderConfig | undefined;

    let fileName: string | undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const textInput = formData.get("text") as string | null;
      targetJournal = (formData.get("targetJournal") as string) || "";
      const configStr = formData.get("providerConfig") as string | null;

      if (configStr) {
        try {
          providerConfig = JSON.parse(configStr);
        } catch {}
      }

      if (file && file.size > 0) {
        fileName = file.name;
        const buffer = Buffer.from(await file.arrayBuffer());
        if (file.name.endsWith(".docx")) {
          manuscriptText = await parseDocxBuffer(buffer);
        } else {
          // If plain text or pdf
          manuscriptText = buffer.toString("utf-8");
        }
      } else if (textInput) {
        manuscriptText = textInput;
      }
    } else {
      const body = await req.json();
      manuscriptText = body.text || "";
      targetJournal = body.targetJournal || "";
      providerConfig = body.providerConfig;
      fileName = body.fileName;
    }

    if (!manuscriptText.trim()) {
      return NextResponse.json(
        { error: "No manuscript content or file provided." },
        { status: 400 }
      );
    }

    // Parse sections with filename-aware classification
    const parsed = parseManuscriptText(manuscriptText, fileName);

    // Run multi-stage diagnostic engine
    const report = await runManuscriptDiagnostic(parsed, providerConfig, targetJournal);

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error("API /api/review error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process manuscript review." },
      { status: 500 }
    );
  }
}
