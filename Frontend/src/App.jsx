"use client"

import { useEffect, useState } from "react"

// Dark Mode Toggle Component
const DarkModeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <button
      onClick={toggleDarkMode}
      className="fixed top-4 right-4 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 z-50"
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  )
}

// Stats Card Component
const StatsCard = ({ label, value, color = "blue" }) => {
  const colorClasses = {
    green: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300",
    yellow:
      "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300",
    red: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300",
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300",
  }

  return (
    <div className={`px-4 py-3 rounded-lg border ${colorClasses[color]}`}>
      <div className="text-sm font-medium opacity-75">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}

// Submission Item Component
const SubmissionItem = ({ submission, username }) => {
  const handleViewSubmission = () => {
    const submissionUrl = `https://leetcode.com/submissions/detail/${submission.submissionId}`
    window.open(submissionUrl, "_blank")
  }

  const handleViewQuestion = () => {
    const questionUrl = `https://leetcode.com/problems/${submission.titleSlug}`
    window.open(questionUrl, "_blank")
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="font-medium text-gray-900 dark:text-gray-100">{submission.title}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-md border dark:border-gray-700">
          {submission.time}
        </span>
        <button
          onClick={handleViewSubmission}
          className="px-2 py-1 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
        >
          Stalk Harder
        </button>
        <button
          onClick={handleViewQuestion}
          className="px-2 py-1 text-sm font-medium text-lime-600 dark:text-lime-400 bg-lime-50 dark:bg-lime-900/20 rounded-md hover:bg-lime-100 dark:hover:bg-lime-900/30 transition-colors cursor-pointer"
        >
          Solve This
        </button>
      </div>
    </div>
  )
}

// User Card Component
const UserCard = ({ user }) => {
  const totalSolved = user.totals ? user.totals.easy + user.totals.medium + user.totals.hard : 0

  if (user.error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-800 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <span className="text-red-600 dark:text-red-400 font-semibold">❌</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{user.username}</h2>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-400 font-medium">Error fetching data</p>
          <p className="text-red-600 dark:text-red-500 text-sm mt-1">{user.error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">👤</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{user.username}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">LeetCode Profile</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalSolved}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Solved</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Problem Statistics</h3>
        <div className="grid grid-cols-3 gap-4">
          <StatsCard label="Easy" value={user.totals?.easy || 0} color="green" />
          <StatsCard label="Medium" value={user.totals?.medium || 0} color="yellow" />
          <StatsCard label="Hard" value={user.totals?.hard || 0} color="red" />
        </div>
      </div>

      {/* Today's Submissions */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Today's Activity</h3>
          <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {user.todaySubs?.length || 0} submissions
          </span>
        </div>
        <div className="overflow-y-auto max-h-64">
          {!user.todaySubs || user.todaySubs.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-gray-400 dark:text-gray-500 text-2xl">📝</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No submissions today</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">Keep up the practice!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {user.todaySubs.map((sub, i) => (
                <SubmissionItem key={i} submission={sub} username={user.username} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Loading Component
const Loading = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      <span className="ml-3 text-gray-600 dark:text-gray-300">Loading report...</span>
    </div>
  )
}

// Main App Component
function App() {
  const [report, setReport] = useState([])
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  // Initialize dark mode on mount
  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem("leetcode-darkMode")
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches

    // Use saved preference if available, otherwise use system preference
    const initialDarkMode = savedTheme !== null ? JSON.parse(savedTheme) : prefersDark

    setDarkMode(initialDarkMode)
  }, [])

  // Apply dark mode class to document and save preference
  useEffect(() => {
    const htmlElement = document.documentElement

    if (darkMode) {
      htmlElement.classList.add("dark")
    } else {
      htmlElement.classList.remove("dark")
    }

    localStorage.setItem("leetcode-darkMode", JSON.stringify(darkMode))
  }, [darkMode])

  // Toggle function
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev)
  }

  useEffect(() => {
    fetch("https://lc-stat-backend.onrender.com/api/report")
      .then((res) => res.json())
      .then((data) => {
        setReport(data.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex justify-center transition-colors duration-200">
      {/* <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> */}

      <div className="mx-7 px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">LeetCode Daily Report</h1>
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
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Data Available</h3>
            <p className="text-gray-500 dark:text-gray-400">Unable to fetch report data. Please try again later.</p>
          </div>
        ) : (
          <div className="space-y-6 grid md:grid-cols-2 grid-cols-1 gap-x-8 gap-y-3">
            {report.map((user) => (
              <UserCard key={user.username} user={user} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

export default App
