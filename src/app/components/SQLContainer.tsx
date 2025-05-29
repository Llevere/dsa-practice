"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { SolutionObject } from "../types/TestResults";
import { SQLTestCase, SqlTestResult } from "../types/AllTests";
import EditorCard from "./EditorCard";
import SQLTable from "./SQLTable";

interface Props {
    tests: SQLTestCase[];
    schema: string[];
    data: string[];
    solutions: SolutionObject[];
    testId: string;
}

export default function SQLContainer({ tests, schema, data, solutions }: Props) {
    const [mounted, setMounted] = useState(false);
    const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<Record<number, SqlTestResult[]>>({});
    const [solutionCodes, setSolutionCodes] = useState<string[]>(
        solutions.map((s) => s.code)
    );

    useEffect(() => {
        setMounted(true);
    }, []);

    const runSQL = async (code: string, index: number) => {
        setLoadingIndex(index);
        setError(null);
        try {
            const res = await axios.post("/api/sql/run", {
                code,
                schema,
                data,
                tests,
            });
            setResults((prev) => ({ ...prev, [index]: res.data.results }));
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            setError(msg);
        }
        setLoadingIndex(null);
    };

    if (!mounted) return null;

    function showDiff(expected: unknown[][], actual: unknown[][]): string[] {
        const toLines = (rows: unknown[][]) => rows.map(row => row.join(" | "));
        const eLines = toLines(expected);
        const aLines = toLines(actual);

        const diff = [];
        const maxLen = Math.max(eLines.length, aLines.length);

        for (let i = 0; i < maxLen; i++) {
            if (eLines[i] !== aLines[i]) {
                diff.push(`- ${eLines[i] || ""}`);
                diff.push(`+ ${aLines[i] || ""}`);
            }
        }

        return diff;
    }


    return (
        <div className="space-y-8">
            {solutions.map((solution, i) => (
                <EditorCard
                    key={i}
                    label={solution.label}
                    code={solutionCodes[i]}
                    language="sql"
                    loading={loadingIndex === i}
                    onCodeChange={(val) =>
                        setSolutionCodes((prev) =>
                            prev.map((code, idx) => (idx === i ? val : code))
                        )
                    }
                    onRun={() => runSQL(solutionCodes[i], i)}
                    resultComponent={
                        results[i] &&
                        Array.isArray(results[i]) &&
                        results[i].map((result, j) => (
                            <div
                                key={j}
                                className={`card p-4 border ${result.pass ? "border-success" : "border-error"
                                    }`}
                            >
                                <p className="font-semibold">Results: {j + 1}</p>

                                {result.pass ? (
                                    <>
                                        <p className="font-semibold mt-2">Output</p>
                                        <SQLTable rows={result.actual} columns={result.columns} />
                                        <p className="font-semibold mt-4">Expected</p>
                                        <SQLTable rows={result.expected} columns={result.columns} />
                                    </>
                                ) : (
                                    <>
                                        <p className="font-semibold mt-2 text-error">
                                            No matching query passed. See attempts below:
                                        </p>
                                        {result.attempts.map((attempt, k) => (
                                            <div
                                                key={k}
                                                className="border rounded p-2 my-2 bg-base-200"
                                            >
                                                <p className="text-sm font-medium">Attempt {k + 1}</p>
                                                <p className="font-semibold mt-2">Output</p>
                                                <SQLTable
                                                    rows={attempt.actualRaw || attempt.actual}
                                                    columns={attempt.actualRawColumns || attempt.columns}
                                                />

                                                <p className="font-semibold mt-4">Expected</p>
                                                <SQLTable rows={attempt.expected} columns={attempt.columns} />
                                                {attempt.error && (
                                                    <p className="text-error mt-2 text-sm">
                                                        Error: {attempt.error}
                                                    </p>
                                                )}
                                                {!result.pass && result.actual && JSON.stringify(result.actual) !== JSON.stringify(result.expected) && (
                                                    <div className="mt-4 text-sm font-mono text-warning bg-warning/10 p-2 rounded">
                                                        <p className="font-bold mb-2">Differences:</p>
                                                        {showDiff(result.expected, result.actual).map((line, i) => (
                                                            <pre key={i} className={line.startsWith('-') ? "text-error" : "text-success"}>
                                                                {line}
                                                            </pre>
                                                        ))}
                                                    </div>
                                                )}

                                            </div>
                                        ))}
                                    </>
                                )}
                                {result.error && (
                                    <p className="text-error mt-2">Error: {result.error}</p>
                                )}
                            </div>
                        ))
                    }
                />
            ))}
            {error && <p className="text-error">Error: {error}</p>}
        </div>
    );
}
