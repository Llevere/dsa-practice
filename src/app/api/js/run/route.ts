import { NextRequest, NextResponse } from "next/server";
import { runAllTests } from "@/utils/executeAllTests";

export async function POST(req: NextRequest) {
  try {
    const { code, tests, spreadable } = await req.json();
    const results = runAllTests(code, tests, spreadable);
    return NextResponse.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
