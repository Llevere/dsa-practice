import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import { SQLAttempt } from "@/app/types/AllTests";
type SQLQueryCheck = {
  expected: unknown[][];
  columns: string[];
};

type SQLTestCase = {
  queries: SQLQueryCheck[];
};

export async function POST(req: NextRequest) {
  try {
    const {
      code,
      schema,
      data,
      tests,
    }: {
      code: string;
      schema: string[];
      data: string[];
      tests: SQLTestCase[];
    } = await req.json();

    const db = new Database(":memory:");
    schema.forEach((sql) => db.prepare(sql).run());
    data.forEach((insert) => db.prepare(insert).run());

    const results = tests.map((testGroup) => {
      let pass = false;
      let actual: unknown[][] | null = null;
      let matchedQuery: SQLQueryCheck | null = null;
      const attempts: SQLAttempt[] = [];

      for (const query of testGroup.queries) {
        try {
          const stmt = db.prepare(code);
          const columnMeta = stmt.columns();
          console.warn("ColumnMeta: ", columnMeta);
          const actualColumns = columnMeta.map((c) => c.name.toLowerCase());
          const expectedColumns = query.columns.map((c) => c.toLowerCase());

          const sortedActual = [...actualColumns].sort();
          const sortedExpected = [...expectedColumns].sort();
          const columnMatch =
            JSON.stringify(sortedActual) === JSON.stringify(sortedExpected);

          const raw = stmt.all() as Record<string, unknown>[];
          const resultRows = raw.map((row) =>
            query.columns.map((col) => row[col])
          );

          const actualRawColumns = columnMeta.map((c) => c.name);
          const actualRawRows = raw.map((row) =>
            actualRawColumns.map((col) => row[col])
          );

          const valueMatch =
            JSON.stringify(resultRows) === JSON.stringify(query.expected);

          const match = columnMatch && valueMatch;

          const normalize = (type: string) =>
            type
              .toLowerCase()
              .replace(/\(.+?\)/, "")
              .trim();

          const acceptableTypes = {
            text: ["text", "varchar", "string"],
            number: ["int", "integer", "real", "float", "double", "numeric"],
          };

          const typeMismatches = columnMeta.filter((meta) => {
            const colName = meta.name.toLowerCase();
            const type = normalize(meta.type || "");

            return (
              expectedColumns.includes(colName) &&
              ![...acceptableTypes.text, ...acceptableTypes.number].includes(
                type
              )
            );
          });

          const typeError = typeMismatches.length
            ? `Type mismatch in columns: ${typeMismatches
                .map((m) => `${m.name} (${m.type})`)
                .join(", ")}`
            : null;

          attempts.push({
            expected: query.expected,
            actual: resultRows,
            columns: query.columns,
            actualRaw: actualRawRows,
            actualRawColumns: actualRawColumns,
            error: !columnMatch
              ? `Column mismatch. Expected [${query.columns.join(
                  ", "
                )}], got [${actualRawColumns.join(", ")}]`
              : typeError,
          });

          if (match && !typeError) {
            pass = true;
            actual = resultRows;
            matchedQuery = query;
            break;
          }
        } catch (err) {
          attempts.push({
            expected: query.expected,
            actual: null,
            columns: query.columns,
            error: (err as Error).message,
          });
        }
      }

      return {
        actual,
        expected: matchedQuery?.expected || [],
        columns: matchedQuery?.columns || [],
        pass,
        error: pass ? null : "No matching queries passed",
        attempts,
      };
    });

    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Unknown error" },
      { status: 500 }
    );
  }
}
