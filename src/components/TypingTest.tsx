import { useState, useEffect, useCallback, useRef } from "react"

export interface TestResult {
  wpm: number
  accuracy: number
  wpmHistory: number[]
  correctChars: number
  totalChars: number
  totalErrors: number
  totalKeystrokes: number
}

interface TypingTestProps {
  text: string
  onComplete: (result: TestResult) => void
}

export default function TypingTest({ text, onComplete }: TypingTestProps) {
  const [typed, setTyped] = useState("")
  const containerRef = useRef<HTMLParagraphElement>(null)
  const charsRef = useRef<(HTMLSpanElement | null)[]>([])
  const [cursorPos, setCursorPos] = useState({ left: 0, top: 0 })

  const startTimeRef = useRef<number | null>(null)
  const wpmHistoryRef = useRef<number[]>([])
  const lastSnapshotRef = useRef<number>(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const typedRef = useRef("")
  const completedRef = useRef(false)
  const totalErrorsRef = useRef(0)
  const totalKeystrokesRef = useRef(0)

  typedRef.current = typed

  const computeCorrect = useCallback(
    (t: string) => {
      let correct = 0
      for (let i = 0; i < t.length; i++) {
        if (t[i] === text[i]) correct++
      }
      return correct
    },
    [text]
  )

  // Snapshot WPM every second
  useEffect(() => {
    if (startTimeRef.current === null) return

    intervalRef.current = setInterval(() => {
      const now = Date.now()
      const elapsed = (now - startTimeRef.current!) / 1000
      if (elapsed < 1) return

      const correct = computeCorrect(typedRef.current)
      const wpm = Math.round((correct / 5) / (elapsed / 60))
      wpmHistoryRef.current.push(wpm)
      lastSnapshotRef.current = now
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [startTimeRef.current !== null, computeCorrect])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (completedRef.current) return
      if (e.key === "Backspace") {
        setTyped((prev) => prev.slice(0, -1))
      } else if (e.key.length === 1 && typed.length < text.length) {
        if (startTimeRef.current === null) {
          startTimeRef.current = Date.now()
        }

        totalKeystrokesRef.current++
        if (e.key !== text[typed.length]) {
          totalErrorsRef.current++
        }

        const newTyped = typed + e.key
        setTyped(newTyped)

        if (newTyped.length === text.length) {
          completedRef.current = true
          if (intervalRef.current) clearInterval(intervalRef.current)

          const elapsed = (Date.now() - startTimeRef.current!) / 1000
          const correct = computeCorrect(newTyped)
          const wpm = Math.round((correct / 5) / (elapsed / 60))
          const errors = totalErrorsRef.current
          const keystrokes = totalKeystrokesRef.current
          const accuracy = parseFloat((((keystrokes - errors) / keystrokes) * 100).toFixed(2))

          // Add final snapshot
          wpmHistoryRef.current.push(wpm)

          onComplete({
            wpm,
            accuracy,
            wpmHistory: [...wpmHistoryRef.current],
            correctChars: correct,
            totalChars: text.length,
            totalErrors: errors,
            totalKeystrokes: keystrokes,
          })
        }
      }
    },
    [typed, text, computeCorrect, onComplete]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    const container = containerRef.current
    const targetSpan = charsRef.current[typed.length]
    if (!container || !targetSpan) return

    const containerRect = container.getBoundingClientRect()
    const spanRect = targetSpan.getBoundingClientRect()

    setCursorPos({
      left: spanRect.left - containerRect.left,
      top: spanRect.top - containerRect.top,
    })
  }, [typed.length])

  return (
    <p ref={containerRef} className="relative w-full max-w-5xl mx-auto text-lg sm:text-xl md:text-2xl font-mono leading-loose text-justify">
      <span
        className="cursor"
        style={{ left: cursorPos.left, top: cursorPos.top }}
      />
      {text.split("").map((char, i) => {
        let colorClass = "text-sub"
        if (i < typed.length) {
          colorClass = typed[i] === char ? "text-primary" : "text-secondary underline"
        }

        return (
          <span
            key={i}
            ref={(el) => { charsRef.current[i] = el }}
            className={colorClass}
          >
            {char}
          </span>
        )
      })}
    </p>
  )
}
