'use client';

import { parseSchemaStatements } from '@/utils/parseSchema';
import { QuestionUnion } from '../types/AllTests';
import CollapseCard from './CollapseCard';
import SchemaDisplay from './SchemaDisplay';

type Props = {
    question: QuestionUnion
};

export default function DescriptionSection({ question }: Props) {
    return (
        <div className="lg:col-span-1 space-y-4 text-base-content">
            <CollapseCard title="Problem Description" defaultOpen={true}>
                <div className="max-h-[60vh] overflow-y-auto pr-2">
                    <p className="text-sm opacity-90 leading-relaxed whitespace-pre-line mb-3">
                        {question.description ?? "No description available"}
                    </p>

                    {"schema" in question && question.schema?.length > 0 && (
                        <div className="border border-white rounded-lg">
                            <CollapseCard title="Schema" defaultOpen={true} titleSize="text-sm">
                                <SchemaDisplay
                                    tables={parseSchemaStatements(question.schema)}
                                    rawSchema={question.schema}
                                />
                            </CollapseCard>
                        </div>
                    )}
                </div>
            </CollapseCard>
        </div>
    );
}
