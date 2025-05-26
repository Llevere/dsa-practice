'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Toast from './Toast';

type TestCase = { given: unknown; expected: unknown };

export default function HomeContent({
    initialQuestions,
}: {
    initialQuestions: { id: string; tests: TestCase[] }[];
}) {
    const [questions] = useState(initialQuestions);
    const [search, setSearch] = useState('');
    const [sortDesc, setSortDesc] = useState(false);

    const searchParams = useSearchParams();
    const toastMessage = searchParams?.get('toast');
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (toastMessage) {
            setShowToast(true);
        }
    }, [toastMessage]);

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
            <div className="min-h-screen bg-base-100 text-base-content px-6 py-10 flex flex-col items-center">
                <div className="w-full max-w-2xl space-y-8 container">
                    <h1 className="text-3xl font-bold text-center">📘 DSA Practice Questions</h1>

                    <div className="flex items-center gap-3 w-full">
                        <div className="w-full relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search questions..."
                                className="input input-bordered w-full pr-10"
                            />
                            {search.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-sm btn-circle btn-ghost pointer-events-auto z-10"
                                    aria-label="Clear search"
                                >
                                    ✕
                                </button>
                            )}
                        </div>


                        <button
                            onClick={() => setSortDesc(!sortDesc)}
                            className="btn btn-outline"
                        >
                            Sort {sortDesc ? '↓ Z-A' : '↑ A-Z'}
                        </button>

                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        {sortedQuestions.map(({ id }) => (
                            <li key={id}>
                                <Link href={`/${id}`} className="card bg-base-200 hover:shadow-lg transition p-4">
                                    <h3 className="text-lg font-semibold text-primary">{id}</h3>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
