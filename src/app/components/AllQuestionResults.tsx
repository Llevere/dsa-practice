'use client';

import { useState } from "react";

type FailedTests = { given: unknown; expected: unknown; actual: unknown };
type SubmissionSummary = {
    passed: number;
    failed: FailedTests[];
    total: number;
    avgTime: number;
};

export default function AllQuestionResults({
    passed,
    failed,
    total,
    avgTime,
}: SubmissionSummary) {
    const [showFailed, setShowFailed] = useState(true);

    return (
        <div className="w-full mt-4 space-y-4">
            {/* Summary Header */}
            <div className="w-full px-4 py-2 rounded-md border border-green-400 bg-green-50 text-sm text-green-700 shadow-sm flex justify-between items-center">
                <div>
                    ✅ {passed}/{total} passed
                    <span className="ml-4 text-gray-500">
                        Avg time: <strong>{avgTime.toFixed(2)} ms</strong>
                    </span>
                </div>

                {failed.length > 0 && (
                    <button
                        onClick={() => setShowFailed((prev) => !prev)}
                        className="text-red-600 underline text-xs hover:text-red-700 transition"
                    >
                        {showFailed ? "Hide failed tests" : "Show failed tests"}
                    </button>
                )}
            </div>

            {/* Failures */}
            {failed.length > 0 && showFailed && (
                <div className="w-full border border-red-300 bg-red-50 p-4 rounded-md shadow-sm">
                    <p className="text-red-600 font-semibold mb-4">
                        ❌ {failed.length} test{failed.length > 1 ? "s" : ""} failed
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {failed.map(({ given, expected, actual }, i) => (
                            <div
                                key={i}
                                className="bg-white border border-red-200 p-3 rounded shadow-sm text-sm text-red-700"
                            >
                                <p><strong>Given:</strong> {JSON.stringify(given)}</p>
                                <p><strong>Expected:</strong> {JSON.stringify(expected)}</p>
                                <p><strong>Actual:</strong> {JSON.stringify(actual)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
