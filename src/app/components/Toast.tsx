'use client';
import { useEffect, useState } from 'react';

export default function Toast({ message }: { message: string }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setVisible(false), 3000);
        return () => clearTimeout(timeout);
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded shadow-md z-50 animate-fade-in">
            {message}
        </div>
    );
}
