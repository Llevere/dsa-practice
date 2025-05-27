import { promises as fs } from "fs";
import path from "path";
import redis from "./redis";

type TestCase = { given: unknown; expected: unknown };
export type AllTests = Record<
  string,
  { tests: TestCase[]; spreadable: boolean }
>;

const TESTS_REDIS_KEY = "tests-json-cache";
const TEST_NAMES_REDIS_KEY = "test-names-json-cache";

const TEST_NAME = "tests_spread.json";

export async function getTestsJson(forceRefresh = false): Promise<AllTests> {
  const filePath = path.join(process.cwd(), "public", "data", TEST_NAME);

  if (forceRefresh) {
    const json = await fs.readFile(filePath, "utf-8");
    const parsed: AllTests = JSON.parse(json);
    await redis.set(TESTS_REDIS_KEY, JSON.stringify(parsed), "EX", 3600);
    return parsed;
  }

  const cached = await redis.get(TESTS_REDIS_KEY);
  if (cached) {
    return JSON.parse(cached);
  }

  const json = await fs.readFile(filePath, "utf-8");
  const parsed: AllTests = JSON.parse(json);
  await redis.set(TESTS_REDIS_KEY, JSON.stringify(parsed), "EX", 3600);
  return parsed;
}

export async function getTestKeys(): Promise<string[]> {
  const cachedKeys = await redis.get(TEST_NAMES_REDIS_KEY);
  if (cachedKeys) {
    return JSON.parse(cachedKeys);
  }

  let parsed: AllTests;

  const cachedTests = await redis.get(TESTS_REDIS_KEY);
  if (cachedTests) {
    parsed = JSON.parse(cachedTests);
  } else {
    parsed = await getTestsJson();
  }

  const keys = Object.keys(parsed);
  await redis.set(TEST_NAMES_REDIS_KEY, JSON.stringify(keys), "EX", 3600);
  return keys;
}
