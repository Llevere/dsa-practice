import JSContainer from "../components/JSContainer";
import SQLContainer from "../components/SQLContainer";
import { getJSTestsJson, getSQLTestsJson, getTypedTestKeys } from "@/lib/loadTests";
import { redirect } from "next/navigation";
import { defaultSolutions } from "@/lib/solutions";
import { defaultSqlSolutions } from "@/lib/sql_solutions";
import DescriptionSection from "../components/DescriptionSection";
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
        <div className="min-h-screen bg-base-100 flex flex-col">
            <div className="flex flex-col my-2 flex-1">
                <div className="w-[90%] mx-auto flex flex-col lg:flex-row gap-6 flex-1">
                    <div className="lg:w-1/3 overflow-y-auto max-h-[60vh] lg:max-h-none">
                        <div className="flex-1">
                            <DescriptionSection question={question} />
                        </div>
                    </div>

                    <div className="lg:w-2/3 h-full">
                        {type === "js" && "spreadable" in question && (
                            <JSContainer
                                tests={question.tests.slice(0, 3)}
                                spreadable={question.spreadable}
                                solutions={defaultSolutions[slug] || []}
                                testId={slug}
                            />
                        )}
                        {type === "sqlite" && "schema" in question && "data" in question && (
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

        </div>
    );
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
    const data = await getTypedTestKeys();
    return data.map(({ slug }) => ({ slug }));
}
