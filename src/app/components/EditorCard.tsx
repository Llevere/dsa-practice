"use client";

import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface SharedEditorCardProps {
    label: string;
    code: string;
    language: string;
    loading: boolean;
    onCodeChange: (value: string) => void;
    onRun: () => void;
    onSubmit?: () => void;
    resultComponent?: React.ReactNode;
    summaryComponent?: React.ReactNode;
}

export default function SharedEditorCard({
    label,
    code,
    language,
    loading,
    onCodeChange,
    onRun,
    onSubmit,
    resultComponent,
    summaryComponent,
}: SharedEditorCardProps) {
    return (
        <div className="card bg-base-200 shadow-md p-6 space-y-5 border border-base-300">
            <h3 className="text-lg font-semibold text-primary">{label}</h3>
            <div className="rounded border border-base-300 overflow-x-auto">
                <MonacoEditor
                    className="w-full min-w-[500px] max-h-[35vh] h-[250px]"
                    defaultLanguage={language}
                    value={code}
                    onChange={(value) => onCodeChange(value ?? "")}
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
                <button className="btn btn-primary" onClick={onRun} disabled={loading}>
                    {loading ? "Running..." : "Run"}
                </button>
                {onSubmit && (
                    <button className="btn btn-success" onClick={onSubmit} disabled={loading}>
                        {loading ? "Running..." : "Submit"}
                    </button>
                )}
            </div>
            {summaryComponent}
            {resultComponent}
        </div>
    );
}