"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import ThreeQuestionResults from "./ThreeQuestionResults";
import AllQuestionResults from "./AllQuestionResults";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
});
type TestCase = { given: unknown; expected: unknown };
type FailedTests = { given: unknown; expected: unknown; actual: unknown };
type SolutionObject = {
    label: string;
    code: string;
};

type QuestionResult = {
    input: Array<number>;
    expected: number;
    actual?: number;
    pass: boolean;
    logs: Array<string>;
    timeMs: number;
    error?: string;
};
type SubmissionSummary = {
    passed: number;
    failed: FailedTests[];
    total: number;
    avgTime: number;
};

type Props = {
    tests: TestCase[];
    spreadable: boolean,
    solutions: SolutionObject[];
    testId: string;
};

export default function CodeContainer({ tests, spreadable, solutions, testId }: Props) {
    const [mounted, setMounted] = useState(false);
    const [results, setResults] = useState<Record<number, QuestionResult[]>>({});
    const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [solutionCodes, setSolutionCodes] = useState<string[]>(
        solutions.map((s) => s.code)
    );

    const [summaries, setSummaries] = useState<Record<number, SubmissionSummary>>(
        {}
    );

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
                spreadable
            });
            setResults((prev) => ({ ...prev, [index]: res.data.results }));
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            setError(msg);
            console.error(err);
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
            //setResults((prev) => ({ ...prev, [index]: fullResults }));
            setSummaries((prev) => ({
                ...prev,
                [index]: { passed, failed, total, avgTime },
            }));
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            setError(msg);
            console.error(err);
        }
        setLoadingIndex(null);
    };

    if (!mounted) return null;

    return (
        <div className="space-y-8">
            {solutions.map((solution, i) => (
                <div key={i} className="card bg-base-200 shadow-md p-6 space-y-5 border border-base-300">
                    <h3 className="text-lg font-semibold text-primary">{solution.label}</h3>
                    <div className="rounded border border-base-300 overflow-hidden">
                        <MonacoEditor
                            className="max-h-[35vh] h-[250px]"
                            defaultLanguage="javascript"
                            value={solutionCodes[i]}
                            onChange={(value) =>
                                setSolutionCodes((prev) =>
                                    prev.map((code, idx) => (idx === i ? value ?? "" : code))
                                )
                            }
                            options={{
                                readOnly: false,
                                automaticLayout: true,
                                minimap: { enabled: false },
                                tabSize: 2,
                                insertSpaces: true,

                            }}
                            theme="vs-dark"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            className="btn btn-primary"
                            onClick={() => runCode(solutionCodes[i], i)}
                            disabled={loadingIndex === i}
                        >
                            {loadingIndex === i ? 'Running...' : 'Run'}
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={() => submitCode(solutionCodes[i], i)}
                            disabled={loadingIndex === i}
                        >
                            {loadingIndex === i ? 'Running...' : 'Submit'}
                        </button>
                    </div>

                    {summaries[i] && <AllQuestionResults {...summaries[i]} />}
                    {results[i] && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {results[i].map((r, j) => (
                                <ThreeQuestionResults key={j} index={j} data={r} />
                            ))}
                        </div>
                    )}
                </div>
            ))}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </div>
    );
}
