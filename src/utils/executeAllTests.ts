import { runSingleTest } from "./executeTestInVm";

type TestCase = { given: unknown; expected: unknown };
type QuestionResult = {
  input: unknown;
  expected: unknown;
  actual?: unknown;
  error?: string | null;
  logs: string[];
  timeMs: number;
  pass: boolean;
};

export function runAllTests(code: string, tests: TestCase[]): QuestionResult[] {
  return tests.map((test) => {
    const { result, logs, error, timeMs } = runSingleTest(code, test);
    const pass =
      !error && JSON.stringify(result) === JSON.stringify(test.expected);
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
