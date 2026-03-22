import { useState, useEffect, useCallback } from "react"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import TypingTest from "./components/TypingTest"
import Results from "./components/Results"
import type { TestResult } from "./components/TypingTest"
import englishData from "../src/datas/english.json"
import frenchData from "../src/datas/french.json"

type Lang = "en" | "fr"

const quotes = {
  en: englishData.quotes,
  fr: frenchData.quotes,
}

function getRandomQuote(lang: Lang) {
  const list = quotes[lang]
  const q = list[Math.floor(Math.random() * list.length)]
  return { text: q.text, source: q.source }
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

function getInitialLang(): Lang {
  const stored = localStorage.getItem("lang")
  if (stored === "en" || stored === "fr") return stored
  return "en"
}

export default function App() {
  const [lang, setLang] = useState<Lang>(getInitialLang)
  const [quote, setQuote] = useState(() => getRandomQuote(getInitialLang()))
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

  const switchLang = useCallback((newLang: Lang) => {
    setLang(newLang)
    localStorage.setItem("lang", newLang)
    setQuote(getRandomQuote(newLang))
    setKey((k) => k + 1)
    setResult(null)
  }, [])

  const reset = useCallback(() => {
    setQuote(getRandomQuote(lang))
    setKey((k) => k + 1)
    setResult(null)
  }, [lang])

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
      <Navbar isDark={isDark} onToggleTheme={toggleTheme} lang={lang} onSwitchLang={switchLang} />
      <main className="flex-1 flex justify-center items-center px-8 sm:px-12 md:px-20">
        {result ? (
          <Results result={result} onReset={reset} />
        ) : (
          <TypingTest key={key} text={quote.text} source={quote.source} onComplete={handleComplete} />
        )}
      </main>
      <footer>
        <Footer bestWpm={bestWpm} />
      </footer>
    </div>
  )
}
