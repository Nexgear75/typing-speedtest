import { motion } from "motion/react"

type Lang = "en" | "fr"

interface NavbarProps {
  isDark: boolean
  onToggleTheme: () => void
  lang: Lang
  onSwitchLang: (lang: Lang) => void
}

export default function Navbar({ isDark, onToggleTheme, lang, onSwitchLang }: NavbarProps) {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 py-5 px-8 sm:px-12 md:px-20 z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <nav className="flex justify-between items-center">
        <div className="font-extrabold">
          Typing Speedtest
        </div>
        <div className="flex items-center gap-4">
          {/* Language selector */}
          <div className="flex items-center gap-1 text-sm font-mono">
            <button
              onClick={() => onSwitchLang("en")}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${lang === "en" ? "text-primary" : "text-sub hover:text-primary/60"}`}
            >
              EN
            </button>
            <span className="text-sub/30">|</span>
            <button
              onClick={() => onSwitchLang("fr")}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${lang === "fr" ? "text-primary" : "text-sub hover:text-primary/60"}`}
            >
              FR
            </button>
          </div>

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className="relative w-11 h-6 rounded-full border border-primary/20 bg-sub/20 cursor-pointer transition-colors"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary transition-all duration-300 ease-in-out flex items-center justify-center text-background"
              style={{ left: isDark ? "3px" : "calc(100% - 19px)" }}
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" /><path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" /><path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
                </svg>
              )}
            </span>
          </button>
        </div>
      </nav>
    </motion.header>
  )
}
