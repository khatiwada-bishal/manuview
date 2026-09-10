import { NextRequest, NextResponse } from "next/server";
import { callLLM } from "@/lib/llm";

export async function POST(req: NextRequest) {
  try {
    const { decisionLetterText, providerConfig } = await req.json();

    if (!decisionLetterText) {
      return NextResponse.json(
        { error: "Decision letter text is required." },
        { status: 400 }
      );
    }

    const prompt = `Parse the following journal peer-review decision letter into structured, numbered critique points and generate an itemized revision response matrix:

DECISION LETTER & REVIEWER COMMENTS:
${decisionLetterText}

Return a JSON array of parsed reviewer comments with the following format:
[
  {
    "reviewer": "Reviewer 1" | "Reviewer 2" | "Editor",
    "itemNumber": 1,
    "category": "Methodology" | "Statistics" | "Additional Experiments" | "Clarification/Text" | "Citations",
    "rawComment": "The direct quote of the reviewer's concern",
    "actionRequired": "Concrete revision needed in the manuscript or rebuttal",
    "draftResponse": "Polite, rigorous, academic point-by-point rebuttal text acknowledging the point and detailing changes made (with [Line X-Y] placeholders)."
  }
]`;

    const raw = await callLLM(
      [{ role: 'user', content: prompt }],
      providerConfig
    );

    let parsed = [];
    const match = raw.match(/\[[\s\S]*\]/);
    if (match) {
      try { parsed = JSON.parse(match[0]); } catch {}
    }

    return NextResponse.json({
      success: true,
      items: parsed,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to generate response matrix." },
      { status: 500 }
    );
  }
}
