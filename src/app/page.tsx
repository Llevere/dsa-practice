'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Toast from './components/Toast';

type TestCase = { given: unknown; expected: unknown };
type QuestionMap = Record<string, { tests: TestCase[] }>;

export default function Home() {
  const [questions, setQuestions] = useState<{ id: string; tests: TestCase[] }[]>([]);
  const [search, setSearch] = useState('');
  const [sortDesc, setSortDesc] = useState(false);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const toastMessage = searchParams?.get('toast');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (toastMessage) {
      setShowToast(true);
    }
  }, [toastMessage]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('/data/tests.json');
        const data: QuestionMap = await res.json();
        const entries = Object.entries(data).map(([id, { tests }]) => ({
          id,
          tests: tests.slice(0, 3),
        }));
        setQuestions(entries);
      } catch (err) {
        console.error("Failed to load questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const sortedQuestions = useMemo(() => {
    return [...questions]
      .filter(({ id }) => id.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) =>
        sortDesc ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id)
      );
  }, [questions, search, sortDesc]);

  return (
    <>
      {showToast && toastMessage && <Toast message={toastMessage} />}
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white text-gray-800 px-6 py-10 flex flex-col items-center animate-fade-in">
        <div className="w-full max-w-2xl space-y-8 container">
          <h1 className="text-3xl font-bold text-center">📘 DSA Practice Questions</h1>

          <div className="flex items-center gap-3 w-full">
            <div className="flex items-center w-full border border-gray-300 rounded-md px-3 py-2 bg-white h-12">
              <div className="relative w-full">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full bg-transparent text-gray-800 placeholder:text-gray-400 outline-none"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => setSortDesc(!sortDesc)}
              className="h-12 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Sort {sortDesc ? '↓ Z-A' : '↑ A-Z'}
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <ul className="flex flex-col gap-4 pt-4">
              {sortedQuestions.map(({ id }, index) => (
                <li
                  key={id}
                  className={`transition text-lg font-medium shadow-sm hover:shadow-md 
                    ${index % 2 === 0 ? 'bg-white' : ''}
                    p-5
                  `}
                >
                  <Link href={`/${id}`} className="block questionLink">
                    {id}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
