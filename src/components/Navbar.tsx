
interface NavbarProps {
  isDark: boolean
  onToggleTheme: () => void
}

export default function Navbar({ isDark, onToggleTheme }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 py-5 px-8 sm:px-12 md:px-20">
      <nav className="flex justify-between items-center">
        <div className="font-extrabold">
          Typing Speedtest
        </div>
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
      </nav>
    </header>
  )
}
