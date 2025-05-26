type QuestionResult = {
    input: Array<number>,
    expected: number,
    actual?: number,
    pass: boolean,
    logs: Array<string>,
    timeMs: number,
    error?: string
}

interface Props {
    index: number,
    data: QuestionResult
}
export default function ThreeQuestionResults({ index, data }: Props) {
    return (
        <div className="bg-base-300 border border-base-content rounded p-4 text-sm space-y-1">
            <div className="font-semibold">Test {index + 1}: {data.pass ? '✅ Passed' : '❌ Failed'}</div>
            <div><strong>Input:</strong> {JSON.stringify(data.input)}</div>
            <div><strong>Expected:</strong> {JSON.stringify(data.expected)}</div>
            <div><strong>Actual:</strong> {JSON.stringify(data.actual)}</div>
            <div><strong>Time:</strong> {data.timeMs?.toFixed(2)} ms</div>
            {data.logs.length > 0 && (
                <div><strong>Logs:</strong> {data.logs.join(', ')}</div>
            )}
            {data.error && <div className="text-error">Error: {data.error}</div>}
        </div>
    )
}