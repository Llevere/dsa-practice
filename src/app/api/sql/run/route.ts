import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";

type SQLTestCase = {
  query: string;
  expected: unknown[][];
};

// type SqlRunRequestBody = {
//   code: string; // Optional - user-submitted code if not per test
//   schema: string[];
//   data: string[];
//   tests: SQLTestCase[];
// };

export async function POST(req: NextRequest) {
  try {
    const { code, schema, data, tests } = await req.json();

    const db = new Database(":memory:");

    schema.forEach((sql: string) => db.prepare(sql).run());
    data.forEach((insert: string) => db.prepare(insert).run());

    const results = tests.map((test: SQLTestCase) => {
      try {
        const raw = db.prepare(code).all() as Record<string, unknown>[];
        const actual = raw.map((r) => Object.values(r));
        const pass = JSON.stringify(actual) === JSON.stringify(test.expected);
        return { actual, expected: test.expected, pass, error: null };
      } catch (err) {
        return {
          actual: null,
          expected: test.expected,
          pass: false,
          error: (err as Error).message,
        };
      }
    });

    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Unknown error" },
      { status: 500 }
    );
  }
}
