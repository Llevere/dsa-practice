'use client';

import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function ToggleTheme() {
    const [theme, setTheme] = useState<'light' | 'business' | null>(null);
    const isMobile = useIsMobile();

    useEffect(() => {
        const stored = localStorage.getItem('theme') as 'light' | 'business' | null;
        const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'business' : 'light';
        const initial = stored ?? preferred;

        localStorage.setItem('theme', initial);
        document.documentElement.setAttribute('data-theme', initial);
        setTheme(initial);
    }, []);

    if (theme === null) return null;

    const isDark = theme === 'business';

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'business' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        isMobile ? null :
            <button
                className={`btn font-medium btn-sm transition-colors duration-150 ${isDark ? 'btn-outline btn-warning' : 'btn-outline btn-neutral'}`}
                onClick={toggleTheme}
                aria-label="Toggle Theme"
            >
                {isMobile
                    ? isDark ? '🌞' : '🌙'
                    : isDark ? '🌞 Light' : '🌙 Dark'}
            </button>
    );
}
