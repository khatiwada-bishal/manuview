import { NextRequest, NextResponse } from "next/server";
import { callLLM } from "@/lib/llm";

export async function POST(req: NextRequest) {
  try {
    const { 
      title, 
      targetJournal, 
      abstract, 
      keywords, 
      mainFindings, 
      broadSignificance, 
      suggestedReviewers, 
      providerConfig 
    } = await req.json();

    if (!title?.trim() || !targetJournal?.trim() || !abstract?.trim() || !keywords?.trim()) {
      return NextResponse.json(
        { error: "Target Journal, Manuscript Title, Abstract, and Keywords are all required." },
        { status: 400 }
      );
    }

    const prompt = `You are an expert Senior Academic Editor. Write a formal, compelling, high-impact journal submission cover letter addressed to the Senior Editor-in-Chief of "${targetJournal}".

MANUSCRIPT METADATA:
- Target Journal: ${targetJournal}
- Manuscript Title: ${title}
- Abstract:
${abstract}

- Keywords: ${keywords}

ADDITIONAL CONTEXT (IF PROVIDED):
- Primary Findings & Evidence: ${mainFindings?.trim() || "Synthesize the primary findings, experimental models, and quantitative evidence directly from the Abstract."}
- Broader Impact & Readership Fit: ${broadSignificance?.trim() || `Articulate why this discovery provides a major conceptual advance that appeals directly to the readership and editorial scope of "${targetJournal}".`}
${suggestedReviewers?.trim() ? `- Suggested Reviewers / Non-Preferred: ${suggestedReviewers.trim()}` : ""}

LETTER COMPOSITION REQUIREMENTS:
1. Formally introduce the submission of "${title}" for publication consideration in "${targetJournal}".
2. Articulate the critical scientific bottleneck or unresolved question in the field.
3. Highlight the core methodological advance and empirical findings with precise terminology drawn from the abstract.
4. Detail exactly why the paper is of direct relevance and broad interest to "${targetJournal}"'s readership.
5. Standard mandatory editorial confirmations: confirming originality, that the work has not been published or simultaneously submitted elsewhere, adherence to ethical guidelines/approvals, and that all co-authors have approved the submission.
6. Clear sign-off with placeholders: [Corresponding Author Name, Ph.D.], [Academic Title & Department], [Affiliated University / Research Institution], [Official Institutional Email], [ORCID ID].
7. Tone: Rigorous, articulate, respectful, and free of superficial marketing superlatives.`;

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
