import { Link, useLocation } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'
import { useAppState } from '../contexts/AppStateContext'

const Navigation = () => {
  const location = useLocation()
  const { authUser } = useAppState()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Don't show navigation on auth pages
  if (isAuthPage) return null

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="font-bold text-xl text-blue-600 dark:text-blue-400">
                LC-Stat
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === '/'
                    ? 'border-blue-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                Dashboard
              </Link>
              {authUser && (
                <Link
                  to="/profile"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/profile'
                      ? 'border-blue-500 text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  Profile
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative flex space-x-4">
              {!authUser ? (
                // If user is not logged in, show these links
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                // If user is logged in, show user info and logout
                <>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Log Out
                  </button>
                  <div className="ml-3 relative">
                    <Link to="/profile">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-90">
                        {authUser.email ? authUser.email.charAt(0).toUpperCase() : 'U'}
                      </div>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
