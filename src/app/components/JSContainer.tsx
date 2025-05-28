"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ThreeQuestionResults from "./ThreeQuestionResults";
import AllQuestionResults from "./AllQuestionResults";
import { TestCase } from "../types/AllTests";
import { SolutionObject, QuestionResult, SubmissionSummary } from "../types/TestResults";
import EditorCard from "./EditorCard";

interface Props {
    tests: TestCase[];
    spreadable: boolean;
    solutions: SolutionObject[];
    testId: string;
}

export default function JSContainer({ tests, spreadable, solutions, testId }: Props) {
    const [mounted, setMounted] = useState(false);
    const [results, setResults] = useState<Record<number, QuestionResult[]>>({});
    const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [solutionCodes, setSolutionCodes] = useState<string[]>(
        solutions.map((s) => s.code)
    );
    const [summaries, setSummaries] = useState<Record<number, SubmissionSummary>>({});

    useEffect(() => {
        setMounted(true);
    }, []);

    const runCode = async (code: string, index: number) => {
        setLoadingIndex(index);
        setError(null);
        setSummaries({});
        try {
            const res = await axios.post("/api/run", {
                code,
                tests,
                spreadable,
            });
            setResults((prev) => ({ ...prev, [index]: res.data.results }));
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            setError(msg);
        }
        setLoadingIndex(null);
    };

    const submitCode = async (code: string, index: number) => {
        setLoadingIndex(index);
        setError(null);
        setResults({});
        try {
            const res = await axios.post("/api/submit", {
                code,
                tests,
                testId,
            });
            const { passed, failed, total, avgTime } = res.data;
            setSummaries((prev) => ({
                ...prev,
                [index]: { passed, failed, total, avgTime },
            }));
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error";
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
                    language="javascript"
                    loading={loadingIndex === i}
                    onCodeChange={(val) =>
                        setSolutionCodes((prev) =>
                            prev.map((code, idx) => (idx === i ? val : code))
                        )
                    }
                    onRun={() => runCode(solutionCodes[i], i)}
                    onSubmit={() => submitCode(solutionCodes[i], i)}
                    summaryComponent={summaries[i] && <AllQuestionResults {...summaries[i]} />}
                    resultComponent={results[i] && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {results[i].map((r, j) => (
                                <ThreeQuestionResults key={j} index={j} data={r} />
                            ))}
                        </div>
                    )}
                />
            ))}
            {error && <p className="text-error">Error: {error}</p>}
        </div>
    );
}