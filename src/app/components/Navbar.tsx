'use client';

import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="max-w-6xl mx-auto flex justify-between">
                <Link href="/" className="font-bold text-xl hover:underline">
                    DSA Visualizer
                </Link>
                <div className="space-x-4">
                    <Link href="/about" className="hover:underline">About</Link>
                    <Link href="/contact" className="hover:underline">Contact</Link>
                </div>
            </div>
        </nav>
    );
}
