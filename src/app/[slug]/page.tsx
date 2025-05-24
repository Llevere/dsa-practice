import CodeBlock from "../components/codeBlock";
import QuestionTitle from "../components/QuestionTitle";
import { redirect } from "next/navigation";
import { getTestsJson } from "@/lib/loadTests";
import { defaultSolutions } from "@/lib/solutions";

type TestCase = { given: unknown; expected: unknown };
export type QuestionMap = Record<string, { tests: TestCase[] }>;
interface Props {
    params: { slug: string };
}


export default async function QuestionPage({ params }: Props) {
    const data = await getTestsJson();

    const question = data?.[params.slug];

    if (!question || !Array.isArray(question.tests)) {
        redirect(`/?toast=${encodeURIComponent("Invalid question. Redirected to home.")}`);
    }

    const tests = question.tests.slice(0, 3);
    const solutions = defaultSolutions[params.slug] || [];

    return (
        <div className="">
            <QuestionTitle>{params.slug}</QuestionTitle>
            <CodeBlock tests={tests} solutions={solutions} testId={params.slug} />
        </div>
    );
}