// app/stats/page.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { hydrateMaxFromStorage, useCounterStore } from "@/store/counterStore";

export default function StatsPage() {
  const { maxCount } = useCounterStore();

  useEffect(() => {
    hydrateMaxFromStorage();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-8">
      <h1 className="text-5xl font-bold mb-8">Your Counter Stats</h1>

      <div className="text-2xl mb-6">
        Highest count ever reached:{" "}
        <span className="font-bold text-green-600 dark:text-green-400">
          {maxCount}
        </span>
      </div>

      <p className="text-lg mb-12 max-w-md text-center">
        Keep clicking on the home page to increase this number! It persists even after closing the browser.
      </p>

      <Link
        href="/"
        className="text-xl px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all"
      >
        ← Back to Counter
      </Link>
    </main>
  );
}