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
  source: string
  onComplete: (result: TestResult) => void
}

export default function TypingTest({ text, source, onComplete }: TypingTestProps) {
  const [typed, setTyped] = useState("")
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLParagraphElement>(null)
  const charsRef = useRef<(HTMLSpanElement | null)[]>([])
  const [cursorPos, setCursorPos] = useState({ left: 0, top: 0 })
  const [needsScroll, setNeedsScroll] = useState(false)

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

  // Check if text overflows the 7-line limit
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    setNeedsScroll(wrapper.scrollHeight > wrapper.clientHeight)
  }, [text])

  useEffect(() => {
    const container = containerRef.current
    const wrapper = wrapperRef.current
    const targetSpan = charsRef.current[typed.length]
    if (!container || !targetSpan) return

    const containerRect = container.getBoundingClientRect()
    const spanRect = targetSpan.getBoundingClientRect()

    setCursorPos({
      left: spanRect.left - containerRect.left,
      top: spanRect.top - containerRect.top,
    })

    // Auto-scroll: keep the active line in the top half of the visible area
    if (wrapper && needsScroll) {
      const wrapperRect = wrapper.getBoundingClientRect()
      const cursorRelativeToWrapper = spanRect.top - wrapperRect.top
      const lineHeight = spanRect.height * 2

      if (cursorRelativeToWrapper > wrapperRect.height - lineHeight) {
        wrapper.scrollTop += lineHeight
      } else if (cursorRelativeToWrapper < 0) {
        wrapper.scrollTop = Math.max(0, wrapper.scrollTop - lineHeight)
      }
    }
  }, [typed.length, needsScroll])

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div
        ref={wrapperRef}
        className="overflow-hidden scroll-smooth max-h-[21em]"
      >
        <p
          ref={containerRef}
          className="relative text-lg sm:text-xl md:text-2xl font-mono leading-loose text-justify"
        >
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
      </div>
      <p className="mt-6 text-sm text-sub font-light" style={{ fontFamily: "Manrope" }}>
        {source}
      </p>
    </div>
  )
}
