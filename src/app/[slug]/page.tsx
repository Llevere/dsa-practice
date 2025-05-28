import JSContainer from "../components/JSContainer";
import SQLContainer from "../components/SQLContainer";
import { getJSTestsJson, getSQLTestsJson, getTypedTestKeys } from "@/lib/loadTests";
import { redirect } from "next/navigation";
import { defaultSolutions } from "@/lib/solutions";
import { defaultSqlSolutions } from "@/lib/sql_solutions";
export default async function QuestionPage({
    params,
}: {
    params: { slug: string };
}) {
    const slug = params.slug;

    const allKeys = await getTypedTestKeys();
    const matched = allKeys.find((entry) => entry.slug === slug);

    if (!matched) {
        redirect(`/?toast=${encodeURIComponent("Question not found. Redirected to home.")}`);
    }

    const { type } = matched;

    const data = type === "js" ? await getJSTestsJson() : await getSQLTestsJson();
    const question = data?.[slug];

    if (!question || !Array.isArray(question.tests)) {
        redirect(`/?toast=${encodeURIComponent("Test data missing or invalid.")}`);
    }

    return (
        <div className="min-h-screen bg-base-100 px-4 sm:px-6 md:px-8 py-10">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="bg-base-200 border border-base-300 rounded-lg p-6 shadow-md text-center mt-5 text-base-content">
                    <h1 className="text-2xl font-bold text-base-content">Test</h1>
                    <p className="mt-2 opacity-80">{slug}</p>
                </div>

                <div className="max-w-6xl mx-auto space-y-6">
                    {type === "js" && "spreadable" in question && (
                        <JSContainer
                            tests={question.tests.slice(0, 3)}
                            spreadable={question.spreadable}
                            solutions={defaultSolutions[slug] || []}
                            testId={slug}
                        />
                    )}

                    {type === "sql" && "schema" in question && "data" in question && (
                        <SQLContainer
                            tests={question.tests.slice(0, 3)}
                            schema={question.schema}
                            data={question.data}
                            solutions={defaultSqlSolutions[slug] || []}
                            testId={slug}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
    const data = await getTypedTestKeys();
    return data.map(({ slug }) => ({ slug }));
}
