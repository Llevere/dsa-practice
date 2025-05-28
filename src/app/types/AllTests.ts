export type JSTestCase = { given: unknown; expected: unknown };
export type SQLTestCase = { query: string; expected: unknown[][] };

export type JSTests = Record<
  string,
  { type: "js"; spreadable: boolean; tests: JSTestCase[] }
>;
export type SQLTests = Record<
  string,
  { type: "sql"; schema: string[]; data: string[]; tests: SQLTestCase[] }
>;

export type AllTests = JSTests & SQLTests;

export type TestCase = { given: unknown; expected: unknown };
export type FailedTests = {
  given: unknown;
  expected: unknown;
  actual: unknown;
};
