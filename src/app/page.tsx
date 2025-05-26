import { Suspense } from 'react';
import { getTestsJson } from "@/lib/loadTests";
import HomeContent from './components/HomeContent';

export default async function Home() {

  const data = await getTestsJson();
  const entries = Object.entries(data).map(([id, { tests }]) => ({
    id,
    tests: tests.slice(0, 3),
  }));

  return (
    <Suspense fallback={<div>Loading questions...</div>}>
      <HomeContent initialQuestions={entries} />
    </Suspense>
  );
}
