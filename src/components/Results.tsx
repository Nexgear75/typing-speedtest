import type { TestResult } from "./TypingTest"

interface ResultsProps {
  result: TestResult
  onReset: () => void
}

export default function Results({ result, onReset }: ResultsProps) {
  const { wpm, accuracy, wpmHistory, totalErrors, totalKeystrokes } = result
  const correctKeystrokes = totalKeystrokes - totalErrors

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 sm:gap-8 animate-fade-in">
      {/* Stats bar */}
      <div className="flex items-center justify-between gap-6 sm:gap-12 md:gap-16 rounded-2xl border border-primary/15 bg-background px-6 sm:px-10 py-6 sm:py-8">
        <div className="flex flex-col items-center justify-between">
          <span className="text-4xl sm:text-5xl md:text-6xl font-light text-primary tracking-tight" style={{ fontFamily: "'IBM Plex Mono'" }}>
            {wpm}
          </span>
          <span className="text-[10px] sm:text-xs text-sub mt-2 font-light tracking-widest uppercase" style={{ fontFamily: "'IBM Plex Mono'" }}>
            WPM
          </span>
        </div>

        <div className="w-px h-12 sm:h-16 bg-primary/10" />

        <div className="flex flex-col items-center">
          <span className="text-4xl sm:text-5xl md:text-6xl font-light text-primary tracking-tight" style={{ fontFamily: "'IBM Plex Mono'" }}>
            {accuracy}%
          </span>
          <span className="text-[10px] sm:text-xs text-sub mt-2 font-light tracking-wide" style={{ fontFamily: "'IBM Plex Mono'" }}>
            <span className="text-primary/50">+{correctKeystrokes}</span>
            {"  "}
            <span className="text-secondary/60">-{totalErrors}</span>
          </span>
        </div>

        <div className="w-px h-12 sm:h-16 bg-primary/10" />

        <button
          onClick={onReset}
          className="flex flex-col items-center gap-2 text-sub hover:text-secondary transition-colors cursor-pointer p-3"
          title="Restart (Esc)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          <span className="text-[10px] font-light tracking-widest uppercase" style={{ fontFamily: "'IBM Plex Mono'" }}>esc</span>
        </button>
      </div>

      {/* Chart */}
      <WpmChart history={wpmHistory} />
    </div>
  )
}

function WpmChart({ history }: { history: number[] }) {
  if (history.length < 2) {
    return (
      <div className="rounded-2xl border border-primary/15 bg-background p-8 text-center text-sub text-sm font-light" style={{ fontFamily: "'IBM Plex Mono'" }}>
        Not enough data for chart
      </div>
    )
  }

  const highest = Math.max(...history)
  const lowest = Math.min(...history)
  const highIdx = history.indexOf(highest)
  const lowIdx = history.indexOf(lowest)
  const last = history[history.length - 1]

  const padding = { top: 50, right: 60, bottom: 45, left: 50 }
  const viewW = 700
  const viewH = 300
  const chartW = viewW - padding.left - padding.right
  const chartH = viewH - padding.top - padding.bottom

  const minY = Math.max(0, lowest - 20)
  const maxY = highest + 20
  const rangeY = maxY - minY || 1

  const points = history.map((v, i) => ({
    x: padding.left + (i / (history.length - 1)) * chartW,
    y: padding.top + chartH - ((v - minY) / rangeY) * chartH,
    v,
  }))

  const linePath = points.length < 3
    ? points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
    : buildSmoothPath(points)

  const gridLines = 5
  const yTicks = Array.from({ length: gridLines }, (_, i) => {
    const val = minY + (rangeY / (gridLines - 1)) * i
    return {
      y: padding.top + chartH - ((val - minY) / rangeY) * chartH,
      label: Math.round(val),
    }
  })

  const xStep = Math.max(1, Math.floor(history.length / 5))
  const xTicks = history
    .map((_, i) => i)
    .filter((i) => i % xStep === 0 || i === history.length - 1)
    .map((i) => ({
      x: padding.left + (i / (history.length - 1)) * chartW,
      label: i,
    }))

  const highLabel = `Highest  ${highest}`
  const lowLabel = `Lowest  ${lowest}`
  const highLabelW = highLabel.length * 6.2 + 24
  const lowLabelW = lowLabel.length * 6.2 + 24
  const lastLabelW = String(last).length * 7.5 + 24

  return (
    <div className="rounded-2xl border border-primary/15 bg-background p-4 sm:p-6 md:p-8">
      <p className="text-xs text-sub mb-4 font-light tracking-widest uppercase" style={{ fontFamily: "'IBM Plex Mono'" }}>
        WPM history
      </p>
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid */}
        {yTicks.map((t, i) => (
          <g key={`y-${i}`}>
            <line
              x1={padding.left}
              x2={viewW - padding.right}
              y1={t.y}
              y2={t.y}
              stroke="var(--color-sub)"
              strokeOpacity={0.1}
              strokeDasharray="3 6"
            />
            <text
              x={padding.left - 12}
              y={t.y + 4}
              textAnchor="end"
              fill="var(--color-sub)"
              fontSize="10"
              fontFamily="IBM Plex Mono"
              fontWeight="300"
              opacity={0.6}
            >
              {t.label}
            </text>
          </g>
        ))}
        {xTicks.map((t, i) => (
          <text
            key={`x-${i}`}
            x={t.x}
            y={viewH - 10}
            textAnchor="middle"
            fill="var(--color-sub)"
            fontSize="10"
            fontFamily="IBM Plex Mono"
            fontWeight="300"
            opacity={0.6}
          >
            {t.label}s
          </text>
        ))}

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity={0.9}
        />

        {/* Highest */}
        <circle cx={points[highIdx].x} cy={points[highIdx].y} r="3.5" fill="var(--color-secondary)" />
        <rect
          x={points[highIdx].x - highLabelW / 2}
          y={points[highIdx].y - 32}
          width={highLabelW}
          height="24"
          rx="8"
          fill="var(--color-sub)"
          fillOpacity="0.25"
        />
        <text
          x={points[highIdx].x}
          y={points[highIdx].y - 16}
          textAnchor="middle"
          fill="var(--color-primary)"
          fontSize="10"
          fontFamily="Manrope"
          fontWeight="400"
          opacity={0.9}
        >
          Highest{"  "}
          <tspan fill="var(--color-secondary)" fontWeight="600">{highest}</tspan>
        </text>

        {/* Lowest */}
        <circle cx={points[lowIdx].x} cy={points[lowIdx].y} r="3.5" fill="var(--color-secondary)" />
        <rect
          x={points[lowIdx].x - lowLabelW / 2}
          y={points[lowIdx].y + 10}
          width={lowLabelW}
          height="24"
          rx="8"
          fill="var(--color-sub)"
          fillOpacity="0.25"
        />
        <text
          x={points[lowIdx].x}
          y={points[lowIdx].y + 26}
          textAnchor="middle"
          fill="var(--color-primary)"
          fontSize="10"
          fontFamily="Manrope"
          fontWeight="400"
          opacity={0.9}
        >
          Lowest{"  "}
          <tspan fill="#ef4444" fontWeight="600">{lowest}</tspan>
        </text>

        {/* Last point */}
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3.5" fill="var(--color-primary)" />
        <rect
          x={points[points.length - 1].x + 8}
          y={points[points.length - 1].y - 12}
          width={lastLabelW}
          height="24"
          rx="8"
          fill="var(--color-sub)"
          fillOpacity="0.25"
        />
        <text
          x={points[points.length - 1].x + 8 + lastLabelW / 2}
          y={points[points.length - 1].y + 4}
          textAnchor="middle"
          fill="var(--color-primary)"
          fontSize="11"
          fontFamily="Manrope"
          fontWeight="400"
        >
          {last}
        </text>
      </svg>
    </div>
  )
}

function buildSmoothPath(points: { x: number; y: number }[]) {
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]

    const tension = 0.3
    const cp1x = p1.x + (p2.x - p0.x) * tension
    const cp1y = p1.y + (p2.y - p0.y) * tension
    const cp2x = p2.x - (p3.x - p1.x) * tension
    const cp2y = p2.y - (p3.y - p1.y) * tension

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }
  return d
}
