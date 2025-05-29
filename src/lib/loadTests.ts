import { promises as fs } from "fs";
import path from "path";
import redis from "./redis";
import { SQLTests, JSTests } from "@/app/types/AllTests";
import {
  jsKey,
  sqlKey,
  mergedNamesKey,
  jsTestFileName,
  sqlTestFileName,
} from "../../config";

export async function getJSTestsJson(forceRefresh = false): Promise<JSTests> {
  const filePath = path.join(process.cwd(), "public", "data", jsTestFileName);

  if (forceRefresh) {
    const json = await fs.readFile(filePath, "utf-8");
    const parsed: JSTests = JSON.parse(json);
    await redis.set(jsKey, JSON.stringify(parsed), "EX", 3600);
    return parsed;
  }

  const cached = await redis.get(jsKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const json = await fs.readFile(filePath, "utf-8");
  const parsed: JSTests = JSON.parse(json);
  await redis.set(jsKey, JSON.stringify(parsed), "EX", 3600);
  return parsed;
}

export async function getSQLTestsJson(forceRefresh = false): Promise<SQLTests> {
  const filePath = path.join(process.cwd(), "public", "data", sqlTestFileName);

  if (forceRefresh) {
    const json = await fs.readFile(filePath, "utf-8");
    const parsed: SQLTests = JSON.parse(json);
    await redis.set(sqlKey, JSON.stringify(parsed), "EX", 3600);
    return parsed;
  }

  const cached = await redis.get(sqlKey);
  if (cached) return JSON.parse(cached);

  const json = await fs.readFile(filePath, "utf-8");
  const parsed: SQLTests = JSON.parse(json);
  await redis.set(sqlKey, JSON.stringify(parsed), "EX", 3600);
  return parsed;
}

export async function getTypedTestKeys(
  forceRefresh = false
): Promise<{ slug: string; type: "js" | "sqlite" }[]> {
  if (forceRefresh) {
    const js = await getJSTestsJson();
    const sql = await getSQLTestsJson();

    const keys = [
      ...Object.keys(js).map((slug) => ({ slug, type: "js" as const })),
      ...Object.keys(sql).map((slug) => ({ slug, type: "sqlite" as const })),
    ];

    await redis.set(mergedNamesKey, JSON.stringify(keys), "EX", 3600);
    return keys;
  }
  const cached = await redis.get(mergedNamesKey);
  if (cached) return JSON.parse(cached);

  const js = await getJSTestsJson();
  const sql = await getSQLTestsJson();

  const keys = [
    ...Object.keys(js).map((slug) => ({ slug, type: "js" as const })),
    ...Object.keys(sql).map((slug) => ({ slug, type: "sqlite" as const })),
  ];

  await redis.set(mergedNamesKey, JSON.stringify(keys), "EX", 3600);
  return keys;
}
