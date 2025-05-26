import CodeContainer from "../components/CodeContainer";
import { getTestsJson } from '@/lib/loadTests';
import { redirect } from "next/navigation";
import { defaultSolutions } from "@/lib/solutions";
export default async function QuestionPage({
    params,
}: {
    params: { slug: string };
}) {
    const slug = params.slug;

    const data = await getTestsJson();
    const question = data?.[slug];

    if (!question || !Array.isArray(question.tests)) {
        redirect(`/?toast=${encodeURIComponent("Question not found. Redirected to home.")}`);
    }

    const tests = question.tests.slice(0, 3);
    const solutions = defaultSolutions[slug] || [];

    return (
        <div className="min-h-screen bg-base-100 px-4 sm:px-6 md:px-8 py-10">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col items-center justify-center text-center border border-base-300 rounded-lg p-6 shadow-md bg-base-200">
                    <h1 className="text-3xl font-bold">Question</h1>
                    <p className="text-base-content mt-2">{slug}</p>
                </div>

                <div className="min-h-screen bg-base-100 px-4 sm:px-6 md:px-8 py-10">
                    <div className="max-w-6xl mx-auto space-y-6">
                        <CodeContainer tests={tests} solutions={solutions} testId={slug} />
                    </div>
                </div>
            </div>
        </div>
    );

}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
    const data = await getTestsJson();
    return Object.keys(data).map((slug) => ({ slug }));
}