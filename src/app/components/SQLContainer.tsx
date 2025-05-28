"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { SolutionObject, SqlTestResult } from "../types/TestResults"
import { SQLTestCase } from "../types/AllTests";
import EditorCard from "./EditorCard";

interface Props {
    tests: SQLTestCase[];
    schema: string[];
    data: string[];
    solutions: SolutionObject[];
    testId: string
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
            console.error("Error: " + error)
            setError(msg);
        }
        setLoadingIndex(null);
    };

    if (!mounted) return null;

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
                    resultComponent={results[i] && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {results[i].map((result, j) => (
                                <div
                                    key={j}
                                    className={`card p-4 border ${result.pass ? "border-success" : "border-error"}`}
                                >
                                    <p className="font-semibold">Query {j + 1}</p>
                                    <p><strong>Expected:</strong> {JSON.stringify(result.expected)}</p>
                                    <p><strong>Actual:</strong> {JSON.stringify(result.actual)}</p>
                                    {result.error && <p className="text-error">Error: {result.error}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                />
            ))}
            {error && <p className="text-error">Error: {error}</p>}
        </div>
    );
}
