import { NextResponse } from "next/server";
import { getSQLTestsJson, getTypedTestKeys } from "@/lib/loadTests";

export async function POST() {
  try {
    const tests = await getSQLTestsJson(true);
    await getTypedTestKeys(true);
    return NextResponse.json({
      success: true,
      message: "Tests refreshed + merged keys refreshed",
      count: Object.keys(tests).length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
