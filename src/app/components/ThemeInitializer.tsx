'use client';

import { useEffect } from 'react';

export default function ThemeInitializer() {
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as 'light' | 'business' | null;
        const preferred =
            storedTheme ??
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'business' : 'light');
        document.documentElement.setAttribute('data-theme', preferred);
        localStorage.setItem('theme', preferred);

        document.documentElement.classList.add('transition-none');
        setTimeout(() => document.documentElement.classList.remove('transition-none'), 50);

    }, []);

    return null;
}
