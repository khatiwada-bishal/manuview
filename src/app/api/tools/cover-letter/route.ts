import { NextRequest, NextResponse } from "next/server";
import { callLLM } from "@/lib/llm";

export async function POST(req: NextRequest) {
  try {
    const { title, targetJournal, mainFindings, broadSignificance, suggestedReviewers, providerConfig } = await req.json();

    if (!title || !targetJournal) {
      return NextResponse.json(
        { error: "Manuscript title and target journal are required." },
        { status: 400 }
      );
    }

    const prompt = `Write a formal, high-impact journal submission cover letter addressed to the Senior Editor of ${targetJournal}.

Manuscript Details:
- Title: ${title}
- Key Findings: ${mainFindings || "Advances the field with novel mechanistic and empirical insights"}
- Broader Significance: ${broadSignificance || "Provides transformative implications for cross-disciplinary research"}
- Suggested Reviewers / Context: ${suggestedReviewers || "Independent domain experts without competing interests"}

Guidelines:
- Professional, restrained, editor-grade academic prose.
- Clearly states: (1) Submission intention, (2) The specific scientific bottleneck addressed, (3) Key breakthroughs, (4) Why this strictly aligns with ${targetJournal}'s readership and scope, (5) Confirmation of originality, non-simultaneous submission, and ethics compliance.
- Keep author sign-off placeholders clearly visible (e.g. [Corresponding Author Name], [Institution], [Contact Email]).`;

    const letter = await callLLM(
      [{ role: 'user', content: prompt }],
      providerConfig
    );

    return NextResponse.json({
      success: true,
      letter,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to generate cover letter." },
      { status: 500 }
    );
  }
}
