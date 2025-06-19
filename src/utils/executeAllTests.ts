import { runSingleTest, prepareExecutionEnv } from "./executeTestInVm";
import { deepEqual } from "./deepEqual";

type TestCase = { given: unknown; expected: unknown; type?: string };
type QuestionResult = {
  input: unknown;
  expected: unknown;
  actual?: unknown;
  error?: string | null;
  logs: string[];
  timeMs: number;
  pass: boolean;
};

export function runAllTests(
  code: string,
  tests: TestCase[],
  spreadable: boolean
): QuestionResult[] {
  const type = tests[0]?.type || "default";
  const { getResult } = prepareExecutionEnv(code, type, spreadable);

  return tests.map((test) => {
    const { result, logs, error, timeMs } = runSingleTest(
      getResult,
      test.given
    );
    const pass = !error && deepEqual(result, test.expected);
    return {
      input: test.given,
      expected: test.expected,
      actual: result,
      logs,
      error,
      timeMs,
      pass,
    };
  });
}
