import { NextRequest, NextResponse } from "next/server";
import { batchVerifyReferences } from "@/lib/crossref";
import { extractReferencesFromText } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { bibliography, references } = await req.json();

    let refList: string[] = [];
    if (Array.isArray(references) && references.length > 0) {
      refList = references;
    } else if (typeof bibliography === 'string') {
      refList = extractReferencesFromText(bibliography);
    }

    if (refList.length === 0) {
      return NextResponse.json(
        { error: "No references detected in input." },
        { status: 400 }
      );
    }

    const verified = await batchVerifyReferences(refList.slice(0, 30));
    const retractedCount = verified.filter(v => v.isRetracted).length;
    const unresolvableCount = verified.filter(v => v.status === 'unresolvable').length;
    const verifiedCount = verified.filter(v => v.status === 'valid').length;
    const uncheckedCount = verified.filter(v => v.status === 'unchecked').length;

    return NextResponse.json({
      success: true,
      total: verified.length,
      verifiedCount,
      uncheckedCount,
      retractedCount,
      unresolvableCount,
      verified,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to verify references." },
      { status: 500 }
    );
  }
}
