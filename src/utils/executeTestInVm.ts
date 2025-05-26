import { NodeVM } from "vm2";

type TestCase = { given: unknown; expected: unknown };

export function runSingleTest(code: string, test: TestCase) {
  const logs: string[] = [];

  const vm = new NodeVM({
    console: "redirect",
    sandbox: {},
    timeout: 1000,
    wrapper: "commonjs",
  });

  vm.on("console.log", (msg) => logs.push(String(msg)));

  const argsJson = JSON.stringify(test.given); // this is an array or value

  const wrappedCode = `
    const _nonce = ${Math.random()};
    const args = ${argsJson};
    let solveFn;
    (function() {
      ${code}
      solveFn = typeof solve === 'function' ? solve : () => 'solve not defined';
    })();

    let result;
    try {
      result = Array.isArray(args) ? solveFn(...args) : solveFn(args);
    } catch (err) {
      result = '__ERROR__:' + (err?.message || 'Unknown error');
    }

    module.exports = result;
  `;

  console.log("==== Injected Code ====");
  console.log(wrappedCode);
  console.log("=======================");

  const start = performance.now();
  try {
    const result = vm.run(wrappedCode, "vm.js");
    const end = performance.now();

    // unwrap caught runtime error
    if (typeof result === "string" && result.startsWith("__ERROR__:")) {
      return {
        result: undefined,
        logs,
        error: result.slice("__ERROR__:".length),
        timeMs: 0,
      };
    }

    return {
      result,
      logs,
      error: null,
      timeMs: end - start,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      result: undefined,
      logs,
      error: message,
      timeMs: 0,
    };
  }
}
