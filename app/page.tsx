"use client"

import { useState, useRef, useEffect } from "react"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

export default function CounterPage() {
  const [count, setCount] = useState(0)
  const [bump, setBump] = useState<"up" | "down" | null>(null)
  const [animKey, setAnimKey] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const prevCountRef = useRef(0)

  const increment = () => setCount((prev) => prev + 1)
  const decrement = () => setCount((prev) => Math.max(0, prev - 1))
  const reset = () => {
    setCount(0)
    setMessage(null)
  }

  useEffect(() => {
    const prev = prevCountRef.current
    if (prev === count) return

    setBump(count > prev ? "up" : "down")
    setAnimKey((k) => k + 1)

    if (count >= 5 && prev < 5) {
      setMessage("Nice! Keep going")
    } else if (count < 5) {
      setMessage(null)
    }

    if (count >= 10 && prev < 10 && typeof window !== "undefined") {
      confetti({
        particleCount: 140,
        spread: 70,
        origin: { y: 0.6 },
      })
    }

    prevCountRef.current = count

    const t = setTimeout(() => setBump(null), 300)
    return () => clearTimeout(t)
  }, [count])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
      <Link
        href="/experiment"
        className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-50 transition-colors inline-flex items-center"
      >
        Try Dark Mode Version of the app
        <ArrowRightIcon className="w-4 h-4 ml-2" />
      </Link>
      <div className="flex flex-col items-center gap-6 mt-6">
        <span
          key={animKey}
          className={`inline-block text-5xl sm:text-7xl font-bold text-gray-900 dark:text-gray-100 tabular-nums ${
            bump === "up"
              ? "animate-count-bump-up"
              : bump === "down"
                ? "animate-count-bump-down"
                : ""
          }`}
        >
          {count}
        </span>

        {message && (
          <p className="text-lg font-medium text-green-600 dark:text-green-400">
            {message}
          </p>
        )}

        <div className="flex flex-col items-center gap-4 mt-2">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full">
            <Button
              onClick={increment}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg min-h-12 min-w-12 w-full sm:w-auto"
            >
              +1
            </Button>
            <Button
              onClick={decrement}
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg min-h-12 min-w-12 w-full sm:w-auto"
            >
              −1
            </Button>
          </div>
          {count > 0 && (
            <Button
              onClick={reset}
              size="lg"
              className="bg-gray-500 hover:bg-gray-700 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg min-h-12 min-w-12 w-full sm:w-auto"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}
