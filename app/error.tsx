"use client"
import Link from 'next/link';

export default function Error() {
    return (
        <div className="flex items-center justify-center mb-4 flex-col m-8 min-h-screen gap-4">
            <h1 className="text-2xl font-bold">Error</h1>
            <Link
                href="/"
                className="inline-flex items-center px-3 py-1.5 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
                Back To Home
            </Link>
        </div>
    );
}