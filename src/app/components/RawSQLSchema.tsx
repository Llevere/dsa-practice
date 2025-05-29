import React, { useState } from "react";
import CollapseCard from "./CollapseCard";
import { highlightSQL } from "@/utils/highlightSQLKeywords";

export default function RawSQLSchema({ schema }: { schema: string[] }) {
    const rawText = schema.join("\n\n");
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(rawText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="border-white border rounded-lg">
            <CollapseCard title="Raw SQL Schema" titleSize="text-sm">
                <div className="relative">
                    <button
                        onClick={handleCopy}
                        className="absolute right-2 top-2 btn btn-xs btn-ghost text-xs text-base-content border border-base-300"
                    >
                        {copied ? "✅ Copied" : "📋 Copy"}
                    </button>
                    <div className="overflow-x-auto bg-base-300 p-4 rounded-lg text-sm font-mono">
                        <pre
                            className="whitespace-pre-wrap break-words"
                            dangerouslySetInnerHTML={{ __html: highlightSQL(rawText) }}
                        />
                    </div>
                </div>
            </CollapseCard>
        </div>

    );
}
