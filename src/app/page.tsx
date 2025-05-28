import { Suspense } from 'react';
import { getTypedTestKeys } from "@/lib/loadTests";
import HomeContent from './components/HomeContent';

export default async function Home() {

  const data = await getTypedTestKeys();
  return (
    <Suspense fallback={<div>Loading questions...</div>}>
      <HomeContent data={data} />
    </Suspense>
  );
}
