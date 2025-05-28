import { NextRequest, NextResponse } from "next/server";
import { getJSTestsJson } from "@/lib/loadTests";
import { runAllTests } from "@/utils/executeAllTests";

export async function POST(req: NextRequest) {
  try {
    const { code, testId } = await req.json();

    const allTests = await getJSTestsJson();
    const question = allTests[testId];

    if (!question || !Array.isArray(question.tests)) {
      return NextResponse.json(
        { error: `No tests found for ${testId}` },
        { status: 400 }
      );
    }

    const results = runAllTests(code, question.tests, question.spreadable);
    const passed = results.filter((r) => r.pass).length;
    const failed = results
      .filter((r) => !r.pass)
      .map((r) => ({
        given: r.input,
        expected: r.expected,
        actual: r.actual,
      }));
    const avgTime =
      results.reduce((acc, r) => acc + r.timeMs, 0) / results.length;

    return NextResponse.json({
      passed,
      failed,
      total: results.length,
      avgTime,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
