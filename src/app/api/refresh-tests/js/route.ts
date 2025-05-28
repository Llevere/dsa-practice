import { NextResponse } from "next/server";
import { getJSTestsJson } from "@/lib/loadTests";

export async function POST() {
  try {
    const tests = await getJSTestsJson(true);
    return NextResponse.json({
      success: true,
      message: "Tests refreshed",
      count: Object.keys(tests).length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
