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
        <div className="h-screen bg-base-100 flex flex-col">
            <div className="flex-1 overflow-hidden">
                <div className="w-[90%] mx-auto h-full grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-1 overflow-y-auto  h-full">
                        <DescriptionSection question={question} />
                    </div>

                    <div className="lg:col-span-2 overflow-y-auto h-full space-y-6">
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
