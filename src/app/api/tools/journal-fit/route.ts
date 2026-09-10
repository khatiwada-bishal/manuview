import { NextRequest, NextResponse } from "next/server";
import { findMatchingJournals } from "@/lib/journals";

export async function POST(req: NextRequest) {
  try {
    const { title, abstract } = await req.json();

    if (!title && !abstract) {
      return NextResponse.json(
        { error: "Please provide either manuscript title or abstract." },
        { status: 400 }
      );
    }

    const matches = findMatchingJournals(title || "", abstract || "");

    return NextResponse.json({
      success: true,
      data: matches,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to predict journal fit." },
      { status: 500 }
    );
  }
}
