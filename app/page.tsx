"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

export default function CounterPage() {
  const [count, setCount] = useState(0)
  const [bump, setBump] = useState<"up" | "down" | null>(null)
  const [animKey, setAnimKey] = useState(0)
  const prevCountRef = useRef(0)

  const increment = () => setCount((prev) => prev + 1)
  const decrement = () => setCount((prev) => Math.max(0, prev - 1))
  const reset = () => setCount(0)

  useEffect(() => {
    if (prevCountRef.current === count) return
    setBump(count > prevCountRef.current ? "up" : "down")
    setAnimKey((k) => k + 1)
    prevCountRef.current = count
    const t = setTimeout(() => setBump(null), 300)
    return () => clearTimeout(t)
  }, [count])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Link href="/experiment">
        Try Dark Mode Version of the app
        <ArrowRightIcon className="w-4 h-4 ml-2" />
      </Link>
      <div className="flex flex-col items-center gap-8">
        <span
          key={animKey}
          className={`inline-block text-7xl font-bold text-gray-900 tabular-nums ${
            bump === "up"
              ? "animate-count-bump-up"
              : bump === "down"
                ? "animate-count-bump-down"
                : ""
          }`}
        >
          {count}
        </span>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={increment}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white text-lg font-semibold px-8 py-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
            >
              +1
            </Button>
            <Button
              onClick={decrement}
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white text-lg font-semibold px-8 py-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
            >
              −1
            </Button>
          </div>
          {count > 0 && (
            <Button
              onClick={reset}
              size="lg"
              className="bg-gray-500 hover:bg-gray-700 text-white text-lg font-semibold px-8 py-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}
