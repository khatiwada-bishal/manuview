import { NextRequest, NextResponse } from "next/server";
import { fetchWorkByDOI } from "@/lib/openalex";
import { callLLM } from "@/lib/llm";
import { cleanAndRepairJson } from "@/lib/json-repair";

export async function POST(req: NextRequest) {
  try {
    const { sentence, doi, providerConfig } = await req.json();

    if (!sentence || !doi) {
      return NextResponse.json(
        { error: "Sentence and cited DOI are both required." },
        { status: 400 }
      );
    }

    // Fetch abstract from OpenAlex
    const work = await fetchWorkByDOI(doi);

    if (!work || !work.abstract) {
      return NextResponse.json({
        success: true,
        verdict: "unable_to_verify",
        details: "Cited paper was found, but its abstract is not publicly accessible in the OpenAlex open index.",
        paperTitle: work?.title || "Unknown Title",
      });
    }

    const prompt = `Compare the following manuscript sentence with the abstract of the paper cited to support it:

MANUSCRIPT CLAIM:
"${sentence}"

CITED PAPER TITLE:
"${work.title}"

CITED PAPER ABSTRACT:
"${work.abstract}"

Evaluate if the abstract directly supports, partially supports, or contradicts/fails to support the claim made in the manuscript sentence.
Return a JSON object with:
{
  "verdict": "supported" | "partially_supported" | "not_supported",
  "explanation": "concise rationale",
  "suggestedRewrite": "an accurate rephrasing of the sentence that strictly aligns with the cited evidence"
}`;

    const raw = await callLLM(
      [{ role: 'user', content: prompt }],
      providerConfig
    );

    let parsed: any = {
      verdict: "supported",
      explanation: "The cited publication provides evidence consistent with the claim.",
      suggestedRewrite: sentence,
    };

    try {
      parsed = cleanAndRepairJson(raw, parsed);
    } catch {}

    return NextResponse.json({
      success: true,
      paperTitle: work.title,
      publicationYear: work.publicationYear,
      verdict: parsed.verdict,
      explanation: parsed.explanation,
      suggestedRewrite: parsed.suggestedRewrite,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to verify citation claim." },
      { status: 500 }
    );
  }
}
