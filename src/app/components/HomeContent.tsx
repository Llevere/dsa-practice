'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Toast from './Toast';
import { QuestionKey } from '../types/QuestionKey';

const LanguageBadge = ({ type }: { type: 'js' | 'sqlite' }) => {
    const base = 'badge border-none transition';
    return type === 'js' ? (
        <span className={`${base} bg-[#f7df1e] text-black hover:brightness-110`}>JS</span>
    ) : (
        <span className={`${base} bg-[#336791] text-white hover:brightness-110`}>SQLite</span>
    );
};

export default function HomeContent({ data }: { data: QuestionKey[] }) {
    const [questions] = useState(data);
    const [search, setSearch] = useState('');
    const [sortType, setSortType] = useState<'alphabetical' | 'type'>('alphabetical');
    const [sortDesc, setSortDesc] = useState(false);

    const searchParams = useSearchParams();
    const toastMessage = searchParams?.get('toast');
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (toastMessage) setShowToast(true);
    }, [toastMessage]);

    const sortedQuestions = useMemo(() => {
        const filtered = questions.filter(({ slug }) =>
            slug.toLowerCase().includes(search.toLowerCase())
        );

        return filtered.sort((a, b) => {
            const valA = sortType === 'alphabetical' ? a.slug : a.type;
            const valB = sortType === 'alphabetical' ? b.slug : b.type;
            return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
        });
    }, [questions, search, sortType, sortDesc]);

    return (
        <>
            {showToast && toastMessage && <Toast message={toastMessage} />}
            <div className="min-h-screen bg-base-100 text-base-content px-6 py-10 flex flex-col items-center">
                <div className="w-full max-w-2xl space-y-8 container">
                    <h1 className="text-3xl font-bold text-center">📘 DSA Practice Questions</h1>

                    <div className="bg-base-200 p-4 rounded-lg shadow-md space-y-4">
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search questions..."
                                className="input input-bordered w-full pr-10  outline-none ring-0 focus:outline-none focus:ring-0"
                            />
                            {search.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-sm btn-circle btn-ghost"
                                    aria-label="Clear search"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-3 items-center">
                            <select
                                className="select select-bordered outline-none ring-0 focus:outline-none focus:ring-0"
                                value={sortType}
                                onChange={(e) =>
                                    setSortType(e.target.value as 'alphabetical' | 'type')
                                }
                            >
                                <option value="alphabetical">Alphabetical</option>
                                <option value="type">Type</option>
                            </select>

                            <button
                                onClick={() => setSortDesc(!sortDesc)}
                                className="btn btn-outline"
                            >
                                Sort {sortDesc ? '↓ Desc' : '↑ Asc'}
                            </button>
                        </div>
                    </div>

                    <div className="pt-2 w-full flex justify-center flex-col">
                        <h2 className="text-base font-medium text-base-content text-center">Legend</h2>
                        <h3 className=" p-3 my-2 rounded-lg bg-base-200 text-sm text-base-content max-w-xl mx-auto text-center">
                            Leetcode problems were written in MySQL, but converted to SQLite for this websites testing purposes.
                        </h3>

                        <div className="flex gap-4 justify-center items-center">
                            <div className="flex items-center gap-2">
                                <LanguageBadge type="js" />
                                <span className="text-sm text-base-content/80">JavaScript</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <LanguageBadge type="sqlite" />
                                <span className="text-sm text-base-content/80">SQLite</span>
                            </div>
                        </div>
                    </div>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        {sortedQuestions.map(({ slug, type }) => (
                            <li key={slug}>
                                <Link
                                    href={`/${slug}`}
                                    className="card bg-base-200 hover:shadow-lg transition p-4 space-y-2"
                                >
                                    <h3 className="text-lg font-semibold text-primary">{slug}</h3>
                                    <LanguageBadge type={type} />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}