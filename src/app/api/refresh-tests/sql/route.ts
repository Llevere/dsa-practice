import { NextResponse } from "next/server";
import { getSQLTestsJson } from "@/lib/loadTests";

export async function POST() {
  try {
    const tests = await getSQLTestsJson(true);
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
