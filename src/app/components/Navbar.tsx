'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
export default function Navbar() {
    const [refreshing, setRefreshing] = useState(false);
    const isLocal = process.env.NODE_ENV !== "production";
    const [isOpen, setIsOpen] = useState(false);
    const [questions, setQuestions] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const pathname = usePathname();

    // Fetch cached question names
    useEffect(() => {
        const fetchKeys = async () => {
            const res = await fetch('/api/test-keys');
            const data = await res.json();
            setQuestions(data);
        };
        fetchKeys();
    }, []);

    // Close dropdown on outside click or Escape key
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpen &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [isOpen]);

    const refreshTests = async () => {
        setRefreshing(true);
        try {
            const res = await fetch('/api/refresh-tests', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                alert("✅ Test cache refreshed.");
            } else {
                alert("❌ Failed to refresh: " + data.error);
            }
        } catch (err) {
            alert("❌ Error refreshing tests: " + err);
        }
        setRefreshing(false);
    };

    const filtered = questions
        .filter(q =>
            q.toLowerCase().includes(search.toLowerCase()) &&
            `/${q}` !== pathname
        )
        .sort((a, b) => a.localeCompare(b));

    return (
        <div className="navbar bg-base-100 shadow">
            <div className="flex-1">
                <Link href="/" className="btn btn-ghost text-xl">
                    DSA Visualizer
                </Link>
            </div>
            {isLocal && (
                <button
                    onClick={refreshTests}
                    className="btn btn-outline btn-accent mr-5"
                    disabled={refreshing}
                >
                    {refreshing ? "Refreshing..." : "Force Refresh"}
                </button>
            )}
            <div className="flex-none relative" ref={dropdownRef}>
                <button
                    className="btn btn-outline btn-primary"
                    onClick={() => setIsOpen(prev => !prev)}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                >
                    Browse Questions
                </button>

                <div
                    className={`absolute right-0 mt-2 w-80 bg-base-100 border border-base-300 rounded-lg shadow-lg z-[100] transition-all duration-200 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                        }`}
                >
                    <div className="sticky top-0 z-10 bg-base-100 p-3 border-b border-base-300">
                        <input
                            ref={inputRef}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="input input-bordered w-full"
                        />
                    </div>

                    <ul className="max-h-64 overflow-y-auto p-3 space-y-1">
                        {filtered.map((q) => (
                            <li key={q}>
                                <Link
                                    href={`/${q}`}
                                    className="block px-3 py-2 rounded hover:bg-base-200"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {q}
                                </Link>
                            </li>
                        ))}
                        {filtered.length === 0 && (
                            <li className="text-gray-400 px-3 py-2 text-sm">
                                No matches found
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
