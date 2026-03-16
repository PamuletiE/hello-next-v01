"use client"

import { useState, useRef, useEffect } from "react"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

export default function CounterPage() {
  const [count, setCount] = useState(0)
  const [bump, setBump] = useState<"up" | "down" | null>(null)
  const [animKey, setAnimKey] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const [history, setHistory] = useState<number[]>([])
  const prevCountRef = useRef(0)
  const hasInteractedRef = useRef(false)
  const prefersReducedMotionRef = useRef(false)
  const audioCtxRef = useRef<AudioContext | null>(null)

  const canPlaySound = () =>
    hasInteractedRef.current && !prefersReducedMotionRef.current

  const getOrCreateAudioContext = () => {
    if (typeof window === "undefined") return null
    const AnyAudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (!AnyAudioContext) return null
    if (!audioCtxRef.current) audioCtxRef.current = new AnyAudioContext()
    return audioCtxRef.current
  }

  const playTick = () => {
    if (!canPlaySound()) return
    const ctx = getOrCreateAudioContext()
    if (!ctx) return
    if (ctx.state === "suspended") void ctx.resume()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const now = ctx.currentTime

    osc.type = "triangle"
    osc.frequency.setValueAtTime(820, now)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.05)
  }

  const playDing = () => {
    if (!canPlaySound()) return
    const ctx = getOrCreateAudioContext()
    if (!ctx) return
    if (ctx.state === "suspended") void ctx.resume()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const now = ctx.currentTime

    osc.type = "sine"
    osc.frequency.setValueAtTime(1320, now)
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.14)

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.25)
  }

  const increment = () => {
    playTick()
    setCount((prev) => prev + 1)
  }
  const decrement = () =>
    setCount((prev) => {
      const next = Math.max(0, prev - 1)
      if (next !== prev) playTick()
      return next
    })
  const reset = () => {
    playDing()
    setCount(0)
    setMessage(null)
    setHistory([])
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    const mql = window.matchMedia?.("(prefers-reduced-motion: reduce)")
    const updateReducedMotion = () => {
      prefersReducedMotionRef.current = Boolean(mql?.matches)
    }
    updateReducedMotion()

    const onFirstUserGesture = () => {
      if (hasInteractedRef.current) return
      hasInteractedRef.current = true
      const ctx = getOrCreateAudioContext()
      if (ctx?.state === "suspended") void ctx.resume()
    }

    window.addEventListener("pointerdown", onFirstUserGesture, { once: true })
    window.addEventListener("keydown", onFirstUserGesture, { once: true })
    mql?.addEventListener?.("change", updateReducedMotion)

    return () => {
      window.removeEventListener("pointerdown", onFirstUserGesture)
      window.removeEventListener("keydown", onFirstUserGesture)
      mql?.removeEventListener?.("change", updateReducedMotion)
    }
  }, [])

  useEffect(() => {
    const prev = prevCountRef.current
    if (prev === count) return

    setBump(count > prev ? "up" : "down")
    setAnimKey((k) => k + 1)
    setHistory((h) => [count, ...h].slice(0, 5))

    if (count >= 5 && prev < 5) {
      setMessage("Nice! Keep going")
    } else if (count < 5) {
      setMessage(null)
    }

    if (count >= 10 && prev < 10 && typeof window !== "undefined") {
      playDing()
      confetti({
        particleCount: 140,
        spread: 70,
        origin: { y: 0.6 },
      })
    }

    if (count >= 20 && prev < 20) {
      playDing()
    }

    prevCountRef.current = count

    const t = setTimeout(() => setBump(null), 300)
    return () => clearTimeout(t)
  }, [count])

  const level = count >= 30 ? 4 : count >= 20 ? 3 : count >= 10 ? 2 : 1
  const levelVariant =
    level === 4 ? "level4" : level === 3 ? "level3" : level === 2 ? "level2" : "level1"

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
        <Badge
          key={level}
          variant={levelVariant}
          className={`shadow-sm ${
            prefersReducedMotionRef.current ? "" : "animate-in fade-in duration-300"
          }`}
        >
          Level {level}
        </Badge>
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

        <section className="w-full max-w-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/40 backdrop-blur px-5 py-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              History
            </h2>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              last 5
            </span>
          </div>

          {history.length === 0 ? (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              No history yet.
            </p>
          ) : (
            <ol className="mt-3 space-y-1 text-sm">
              {history.map((v, i) => (
                <li
                  key={`${v}-${i}`}
                  className="flex items-center justify-between rounded-lg px-2 py-1 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900"
                >
                  <span className="tabular-nums font-medium">{v}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {i === 0 ? "latest" : `#${i + 1}`}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </main>
  )
}
