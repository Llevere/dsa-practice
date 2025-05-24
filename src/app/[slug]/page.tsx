import CodeBlock from "../components/CodeBlock";
import QuestionTitle from "../components/QuestionTitle";
import { redirect } from "next/navigation";
import { getTestsJson } from "@/lib/loadTests";
import { defaultSolutions } from "@/lib/solutions";

export type TestCase = { given: unknown; expected: unknown };
export type QuestionMap = Record<string, { tests: TestCase[] }>;

export default async function QuestionPage({ params }: { params: { slug: string } }) {
    const data = await getTestsJson();

    if (!data) {
        redirect(`/?toast=${encodeURIComponent("Test list is empty, something went wrong.")}`);
    }
    const question = data[params.slug];

    if (!question || !Array.isArray(question.tests)) {
        redirect(`/?toast=${encodeURIComponent("Invalid question. Redirected to home.")}`);
    }

    const tests = question.tests.slice(0, 3);

    if (!tests) {
        redirect(`/?toast=${encodeURIComponent("Invalid question. Redirected to home.")}`);
    }

    const solutions = defaultSolutions[params.slug] || [];

    return (
        <div className="">
            <QuestionTitle>{params?.slug}</QuestionTitle>
            <CodeBlock tests={tests} solutions={solutions} testId={params?.slug} />
        </div>
    );
}