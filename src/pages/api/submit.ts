import type { NextApiRequest, NextApiResponse } from "next";
import { getTestsJson } from "@/lib/loadTests";
import { runAllTests } from "@/utils/executeAllTests";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { code, testId } = req.body;

  try {
    const allTests = await getTestsJson();
    const question = allTests[testId];

    if (!question || !Array.isArray(question.tests)) {
      return res.status(400).json({ error: `No tests found for ${testId}` });
    }

    const results = runAllTests(code, question.tests);
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

    res.status(200).json({
      passed,
      failed,
      total: results.length,
      avgTime,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
}
