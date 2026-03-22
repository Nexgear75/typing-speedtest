import { useState, useEffect, useCallback, useRef } from "react"

interface TypingTestProps {
  text: string
}

export default function TypingTest({ text }: TypingTestProps) {
  const [typed, setTyped] = useState("")
  const containerRef = useRef<HTMLParagraphElement>(null)
  const charsRef = useRef<(HTMLSpanElement | null)[]>([])
  const [cursorPos, setCursorPos] = useState({ left: 0, top: 0 })

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Backspace") {
        setTyped((prev) => prev.slice(0, -1))
      } else if (e.key.length === 1 && typed.length < text.length) {
        setTyped((prev) => prev + e.key)
      }
    },
    [typed.length, text.length]
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
    <p ref={containerRef} className="relative max-w-3xl text-2xl font-mono leading-relaxed">
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
