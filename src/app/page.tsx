'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTestsStore } from '@/store/useTestsStore';

export default function Home() {
  const fetchTests = useTestsStore((s) => s.fetchTests);
  const getTestKeys = useTestsStore((s) => s.getTestKeys);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<{ id: string; tests: unknown[] }[]>([]);

  const [search, setSearch] = useState('');
  const [sortDesc, setSortDesc] = useState(false);

  const filteredQuestions = questions
    .filter(({ id }) => id.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortDesc ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id)
    );

  useEffect(() => {
    const load = async () => {
      await fetchTests();
      const keys = getTestKeys();
      setQuestions(keys);
      setLoading(false);
    };
    load();
  }, [fetchTests, getTestKeys]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white text-gray-800 px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-8 container">
        <h1 className="text-3xl font-bold text-center">📘 DSA Practice Questions</h1>

        <div className="flex gap-3 items-center px-10 py-6 searchContainer">
          <div className="relative w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full bg-transparent text-gray-800 placeholder:text-gray-400 outline-none border-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          <button
            onClick={() => setSortDesc(!sortDesc)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 hover:cursor-pointer"
          >
            Sort {sortDesc ? '↓ Z-A' : '↑ A-Z'}
          </button>
        </div>


        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <ul className="flex flex-col gap-4 pt-4">
            {filteredQuestions.map(({ id }, index) => (
              <li
                key={id}
                className={`transition text-lg font-medium shadow-sm hover:shadow-md 
                                    ${index % 2 === 0 ? 'bg-white' : ''}
                                    p-5
                                `}
              >
                <Link
                  href={`/${id}`}
                  className="block questionLink"
                >
                  {id}
                </Link>
              </li>
            ))}
          </ul>


        )}
      </div>
    </div>
  );
}
