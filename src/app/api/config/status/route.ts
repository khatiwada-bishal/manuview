import { NextResponse } from "next/server";
import { getServerConfigStatus } from "@/lib/llm";

export async function GET() {
  const status = getServerConfigStatus();
  return NextResponse.json(status);
}
