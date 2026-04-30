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
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-accent-700 transition-colors">
            {/* <svg className="w-4.5 h-4.5 text-white" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg> */}
            <img src={logo} alt="" className='w-full h-full object-cover' />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white text-sm tracking-tight">
            PDF & Image <span className="text-accent-600">Tool</span>
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
