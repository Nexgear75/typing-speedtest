import { useState, useEffect, useCallback } from "react"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import TypingTest from "./components/TypingTest"
import Results from "./components/Results"
import type { TestResult } from "./components/TypingTest"
import data from "../src/datas/data.json"

const allTexts = Object.values(data).flat()

function getRandomText() {
  return allTexts[Math.floor(Math.random() * allTexts.length)].text
}

function getBestWpm(): number {
  return parseInt(localStorage.getItem("bestWpm") || "0", 10)
}

function saveBestWpm(wpm: number) {
  const current = getBestWpm()
  if (wpm > current) {
    localStorage.setItem("bestWpm", String(wpm))
  }
}

function getInitialTheme(): boolean {
  const stored = localStorage.getItem("theme")
  if (stored) return stored === "dark"
  return true
}

export default function App() {
  const [text, setText] = useState(getRandomText)
  const [key, setKey] = useState(0)
  const [result, setResult] = useState<TestResult | null>(null)
  const [bestWpm, setBestWpm] = useState(getBestWpm)
  const [isDark, setIsDark] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle("light", !isDark)
    localStorage.setItem("theme", isDark ? "dark" : "light")
  }, [isDark])

  const toggleTheme = useCallback(() => {
    setIsDark((d) => !d)
  }, [])

  const reset = useCallback(() => {
    setText(getRandomText())
    setKey((k) => k + 1)
    setResult(null)
  }, [])

  const handleComplete = useCallback((r: TestResult) => {
    setResult(r)
    saveBestWpm(r.wpm)
    setBestWpm(getBestWpm())
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") reset()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [reset])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isDark={isDark} onToggleTheme={toggleTheme} />
      <main className="flex-1 flex justify-center items-center px-8 sm:px-12 md:px-20">
        {result ? (
          <Results result={result} onReset={reset} />
        ) : (
          <TypingTest key={key} text={text} onComplete={handleComplete} />
        )}
      </main>
      <footer>
        <Footer bestWpm={bestWpm} />
      </footer>
    </div>
  )
}
