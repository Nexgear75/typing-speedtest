import { useState, useEffect, useCallback } from "react"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import TypingTest from "./components/TypingTest"
import data from "../src/datas/data.json"

const allTexts = Object.values(data).flat()

function getRandomText() {
  return allTexts[Math.floor(Math.random() * allTexts.length)].text
}

export default function App() {
  const [text, setText] = useState(getRandomText)
  const [key, setKey] = useState(0)

  const reset = useCallback(() => {
    setText(getRandomText())
    setKey((k) => k + 1)
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
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-8">
        <TypingTest key={key} text={text} />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}

