import { promises as fs } from "fs";
import path from "path";

type TestCase = { given: unknown; expected: unknown };
let cachedTests: Record<string, { tests: TestCase[] }> | null = null;

export async function getTestsJson() {
  if (cachedTests) return cachedTests;

  const filePath = path.join(process.cwd(), "public", "data", "tests.json");
  const json = await fs.readFile(filePath, "utf-8");
  cachedTests = JSON.parse(json);
  return cachedTests;
}
