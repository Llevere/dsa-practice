import { FailedTests } from "./AllTests";

export type SolutionObject = {
  label: string;
  code: string;
};

export type QuestionResult = {
  input: Array<number>;
  expected: number;
  actual?: number;
  pass: boolean;
  logs: Array<string>;
  timeMs: number;
  error?: string;
};
export type SubmissionSummary = {
  passed: number;
  failed: FailedTests[];
  total: number;
  avgTime: number;
};
