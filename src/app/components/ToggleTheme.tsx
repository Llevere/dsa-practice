'use client';

import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function ToggleTheme() {
    const [theme, setTheme] = useState<'light' | 'business'>('light');
    const [mounted, setMounted] = useState(false);

    const isMobile = useIsMobile();

    useEffect(() => {
        const stored = localStorage.getItem('theme') as 'light' | 'business' | null;

        let initial: 'light' | 'business';

        if (stored) {
            initial = stored;
        } else {
            initial = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'business' : 'light';
            localStorage.setItem('theme', initial);
        }

        setTheme(initial);
        document.documentElement.setAttribute('data-theme', initial);
        setMounted(true);
    }, []);



    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'business' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    if (!mounted) return null;

    const isDark = theme === 'business';

    return (
        <button
            className={`btn font-medium btn-sm transition-colors duration-150 ${isDark ? 'btn-outline btn-warning' : 'btn-outline btn-neutral'
                }`}
            onClick={toggleTheme}
            aria-label="Toggle Theme"
        >
            {isMobile ?
                isDark ? '🌞' : '🌙' :
                isDark ? '🌞 Light' : '🌙 Dark'}
        </button>

    );
}
