'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import ToggleTheme from './ToggleTheme';
import { useIsMobile } from "@/hooks/useIsMobile"
export default function Navbar() {
    const [refreshing, setRefreshing] = useState(false);
    const isLocal = process.env.NODE_ENV !== 'production';
    const [isOpen, setIsOpen] = useState(false);
    const [questions, setQuestions] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const pathname = usePathname();
    const isHome = pathname === '/';

    const isMobile = useIsMobile();

    useEffect(() => {
        const fetchKeys = async () => {
            const res = await fetch('/api/test-keys');
            const data = await res.json();
            setQuestions(data);
        };
        fetchKeys();
    }, []);

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

    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const refreshTests = async () => {
        if (debounceRef.current) return;
        debounceRef.current = setTimeout(() => {
            debounceRef.current = null;
        }, 1000);

        setRefreshing(true);
        try {
            const res = await fetch('/api/refresh-tests', { method: 'POST' });
            const data = await res.json();
            alert(data.success ? '✅ Test cache refreshed.' : `❌ Failed: ${data.error}`);
        } catch (err) {
            alert('❌ Error: ' + err);
        }
        setRefreshing(false);
    };

    const filtered = questions
        .filter((q) => q.toLowerCase().includes(search.toLowerCase()) && `/${q}` !== pathname)
        .sort((a, b) => a.localeCompare(b));

    return (
        <div className="navbar bg-base-100 shadow gap-2 sm:gap-4 px-2 sm:px-4">
            <div className="flex-1">
                <Link
                    href="/"
                    className="btn btn-primary btn-outline text-lg sm:text-xl px-2 sm:px-4 border-none"
                >
                    <span className="hidden sm:inline">DSA Visualizer</span>
                    <span className="inline sm:hidden">DSA</span>
                </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <ToggleTheme />

                {isLocal && (
                    isMobile ? (
                        <button
                            onClick={refreshTests}
                            className="btn btn-sm btn-outline btn-accent"
                            data-tip="Refresh"
                            disabled={refreshing}
                        >
                            {refreshing ? (
                                <span className="loading loading-spinner loading-sm" />
                            ) : (
                                "R"
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={refreshTests}
                            className="btn btn-outline btn-accent btn-sm"
                            disabled={refreshing}
                        >
                            {refreshing ? "Refreshing..." : "Force Refresh"}
                        </button>
                    )
                )}
            </div>

            {!isHome && (
                <div className="flex-none relative" ref={dropdownRef}>
                    <button
                        className={`btn btn-primary btn-sm btn-outline`}
                        onClick={() => setIsOpen(prev => !prev)}
                        aria-haspopup="true"
                        aria-expanded={isOpen}
                    >
                        {isMobile ? 'Tests' : 'Browse Tests'}
                    </button>

                    <div
                        className={`absolute right-0 mt-2 w-80 bg-base-100 border border-base-300 text-base-content rounded-lg shadow-lg z-[100] transition-all duration-200 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                            }`}
                    >
                        <div className="sticky top-0 z-10 bg-base-100 p-3 border-b ">
                            <div className="relative w-full">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search tests..."
                                    className="input input-sm w-full pr-10 text-base-content placeholder:text-base-content border-base-300"
                                />
                                {search.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch('')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-sm btn-circle btn-ghost z-10"
                                        aria-label="Clear search"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>

                        <ul className="max-h-64 overflow-y-auto p-3 space-y-1">
                            {filtered.map((q) => (
                                <li key={q}>
                                    <Link
                                        href={`/${q}`}
                                        className="block px-3 py-2 rounded hover:bg-base-300 hover:text-base-content transition-colors duration-200"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {q}
                                    </Link>
                                </li>
                            ))}
                            {filtered.length === 0 && (
                                <li className="text-base-content/60 px-3 py-2 text-sm">
                                    No matches found
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
