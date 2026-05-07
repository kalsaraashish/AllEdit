import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import ThemeToggle from './ThemeToggle'
import logo from '../assets/logo.png'

export default function Navbar() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden ring-1 ring-gray-200 dark:ring-gray-800 group-hover:scale-105 transition-transform">
            <img src={logo} alt="AllEdit logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white text-base tracking-tight">
            AllEdit
          </span>

        </Link>

        <div className="flex items-center gap-3">
          {!isHome && (
            <Link
              to="/"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:block"
            >
              ← All Tools
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
