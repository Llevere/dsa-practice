import type { NextApiRequest, NextApiResponse } from "next";
import { NodeVM } from "vm2";

type TestCase = {
  given: unknown;
  expected: unknown;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { code, tests }: { code: string; tests: TestCase[] } = req.body;

  try {
    const results = tests.map((test) => {
      console.log("Test", test);
      const logs: string[] = [];

      const vm = new NodeVM({
        console: "redirect",
        sandbox: {},
        timeout: 1000,
        wrapper: "commonjs",
      });

      vm.on("console.log", (msg) => logs.push(String(msg)));

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

      try {
        const start = performance.now();
        const result = vm.run(wrappedCode, "vm.ts");
        const end = performance.now();

        return {
          input: test.given,
          expected: test.expected,
          actual: result,
          pass: JSON.stringify(result) === JSON.stringify(test.expected),
          logs,
          timeMs: end - start,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        //  console.error("Error in run.ts tests", err);
        return {
          input: test.given,
          expected: test.expected,
          error: message,
          pass: false,
          logs,
        };
      }
    });

    res.status(200).json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(err);
    res.status(500).json({ error: message });
  }
}
