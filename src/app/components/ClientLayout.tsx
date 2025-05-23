'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHome = pathname === '/';

    return (
        <>
            {!isHome && (
                <div className="animate-fade-in">
                    <Navbar />
                </div>
            )}
            {children}
        </>
    );
}
