"use client";
import type { NextApiRequest, NextApiResponse } from "next";
import { NodeVM } from "vm2";
import { getTestsJson } from "@/lib/loadTests";

type TestCase = { given: unknown; expected: unknown };
type FailedTests = { given: unknown; expected: unknown; actual: unknown };
type QuestionResult = { pass: boolean; timeMs: number };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { code, testId }: { code: string; testId: string } = req.body;

  try {
    const allTests = await getTestsJson();

    const question = allTests[testId];
    if (!question || !Array.isArray(question.tests)) {
      return res.status(400).json({ error: `No tests found for ${testId}` });
    }

    const failedTests: FailedTests[] = [];
    const results: QuestionResult[] = question.tests.map((test: TestCase) => {
      const logs: string[] = [];
      const vm = new NodeVM({
        console: "redirect",
        sandbox: {},
        timeout: 1000,
        wrapper: "commonjs",
      });

      vm.on("console.log", (msg) => logs.push(String(msg)));

      try {
        const { given } = test;

        const argsJson = JSON.stringify(given);
        console.log(argsJson);

        const wrappedCode = `
          const _nonce = ${Math.random()};
          const args = ${argsJson};
          let solveFn;
          (function() {
            ${code}
            solveFn = typeof solve === 'function' ? solve : () => 'solve not defined';
          })();
        
          const result = Array.isArray(args[0])
            ? solveFn(...args)
            : solveFn(args);
        
          module.exports = result === undefined ? args : result;
        `;
        const start = performance.now();
        const result = vm.run(wrappedCode, "vm.js");
        const end = performance.now();
        const passed = JSON.stringify(result) === JSON.stringify(test.expected);
        if (!passed) {
          failedTests.push({
            given: test.given,
            expected: test.expected,
            actual: result,
          });
        }
        return {
          pass: passed,
          timeMs: end - start,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error(err);
        throw new Error(message);
        //return { pass: false, timeMs: 0 };
      }
    });

    return res.status(200).json({
      passed: results.filter((r) => r.pass).length,
      failed: failedTests,
      total: results.length,
      avgTime:
        results.reduce((sum, r) => sum + (r.timeMs || 0), 0) / results.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}
