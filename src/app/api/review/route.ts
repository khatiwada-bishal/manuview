import { NextRequest, NextResponse } from "next/server";
import { parseManuscriptText, parseDocxBuffer, parsePdfBuffer } from "@/lib/parser";
import { runManuscriptDiagnostic, runBriefJournalFitAnalysis } from "@/lib/diagnostic-engine";
import { ProviderConfig } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let manuscriptText = "";
    let targetJournal = "";
    let providerConfig: ProviderConfig | undefined;
    let fileName: string | undefined;
    let mode: string | undefined;
    let title = "";
    let abstract = "";
    let keywords = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const textInput = formData.get("text") as string | null;
      targetJournal = (formData.get("targetJournal") as string) || "";
      const configStr = formData.get("providerConfig") as string | null;
      mode = (formData.get("mode") as string) || "";
      title = (formData.get("title") as string) || "";
      abstract = (formData.get("abstract") as string) || "";
      keywords = (formData.get("keywords") as string) || "";

      if (configStr) {
        try {
          providerConfig = JSON.parse(configStr);
        } catch {}
      }

      if (file && file.size > 0) {
        fileName = file.name;
        const buffer = Buffer.from(await file.arrayBuffer());
        const lowerName = file.name.toLowerCase();
        if (lowerName.endsWith(".docx")) {
          manuscriptText = await parseDocxBuffer(buffer);
        } else if (lowerName.endsWith(".pdf") || file.type === "application/pdf") {
          manuscriptText = await parsePdfBuffer(buffer);
        } else {
          // Plain text or other document formats
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
      mode = body.mode;
      title = body.title || "";
      abstract = body.abstract || "";
      keywords = body.keywords || "";
    }

    // If in brief journal fit mode (or title + abstract provided without uploaded full file)
    if (mode === "brief_fit" || (title.trim() && abstract.trim() && !manuscriptText.trim())) {
      const report = await runBriefJournalFitAnalysis({
        title,
        abstract,
        keywords,
        targetJournal: targetJournal || "Target Journal",
        providerConfig,
      });
      return NextResponse.json({ success: true, report });
    }

    if (!manuscriptText.trim()) {
      return NextResponse.json(
        { error: "No manuscript content or document provided." },
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
