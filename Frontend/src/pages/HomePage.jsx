import { useEffect, useState } from 'react'
import DarkModeToggle from '../components/DarkModeToggle'
import UserCard from '../components/UserCard'
import Loading from '../components/Loading'

function HomePage() {
  const [report, setReport] = useState([])
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  // Initialize dark mode on mount
  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('leetcode-darkMode')
    const prefersDark =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

    // Use saved preference if available, otherwise use system preference
    const initialDarkMode = savedTheme !== null ? JSON.parse(savedTheme) : prefersDark

    setDarkMode(initialDarkMode)
  }, [])

  // Apply dark mode class to document and save preference
  useEffect(() => {
    const htmlElement = document.documentElement

    if (darkMode) {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }

    localStorage.setItem('leetcode-darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  // Toggle function
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  useEffect(() => {
    fetch('http://localhost:3001/api/report')
      .then(res => res.json())
      .then(data => {
        setReport(data.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex justify-center transition-colors duration-200">
      <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <div className="mx-7 px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            LeetCode Daily Report
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">LeetCode Paglu log</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Content */}
        {loading ? (
          <Loading />
        ) : report.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 dark:text-gray-500 text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Data Available
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Unable to fetch report data. Please try again later.
            </p>
          </div>
        ) : (
          <div className="space-y-6 grid md:grid-cols-2 grid-cols-1 gap-x-8 gap-y-3">
            {report.map(user => (
              <UserCard key={user.username} user={user} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
