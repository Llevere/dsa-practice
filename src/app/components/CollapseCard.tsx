'use client';

import { useState, ReactNode } from 'react';

type CollapseCardProps = {
    title: string;
    titleSize?: string,
    defaultOpen?: boolean;
    children: ReactNode;
};

export default function CollapseCard({
    title,
    titleSize = "text-md",
    defaultOpen = false,
    children,
}: CollapseCardProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-base-200 border border-base-300 rounded-lg transition-all duration-300 overflow-y-auto">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-lg font-semibold text-base-content focus:outline-none"
            >
                <span className={`${titleSize}`}>{title}</span>
                <span
                    className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                >
                    ▼
                </span>
            </button>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="p-4 text-sm opacity-90 leading-relaxed text-base-content">
                    {children}
                </div>
            </div>
        </div>
    );
}
