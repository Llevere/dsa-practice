export type JSTestCase = { given: unknown; expected: unknown };
export type SQLQuery = { columns: string[]; expected: unknown[][] };
export type SQLTestCase = { expected: unknown[][]; queries: SQLQuery[] };

export type JSTests = Record<
  string,
  { spreadable: boolean; tests: JSTestCase[]; description: string }
>;
export type SQLTests = Record<
  string,
  {
    description: string;
    schema: string[];
    data: string[];
    tests: SQLTestCase[];
  }
>;

export type AllTests = JSTests & SQLTests;

export type TestCase = { given: unknown; expected: unknown };
export type FailedTests = {
  given: unknown;
  expected: unknown;
  actual: unknown;
};
export type SQLAttempt = {
  expected: unknown[][];
  actual: unknown[][] | null;
  columns: string[];
  actualRaw?: unknown[][];
  actualRawColumns?: string[];
  error: string | null;
};
export type SqlTestResult = {
  actual: unknown[][] | null;
  expected: unknown[][];
  columns: string[];
  pass: boolean;
  error: string | null;
  attempts: SQLAttempt[];
};

export type JSQuestion = {
  spreadable: boolean;
  tests: JSTestCase[];
  description: string;
};

export type SQLQuestion = {
  description: string;
  schema: string[];
  data: string[];
  tests: SQLTestCase[];
};

export type QuestionUnion = JSQuestion | SQLQuestion;
