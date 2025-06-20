import React from 'react'
import StatsCard from './StatsCard'
import SubmissionItem from './SubmissionItem'

const UserCard = ({ user }) => {
  const totalSolved = user.totals ? user.totals.easy + user.totals.medium + user.totals.hard : 0

  if (user.error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-800 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <span className="text-red-600 dark:text-red-400 font-semibold">❌</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {user.username}
          </h2>
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
      <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-base sm:text-lg">👤</span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                {user.username}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">LeetCode Profile</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{totalSolved}</div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Solved</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
          Problem Statistics
        </h3>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <StatsCard label="Easy" value={user.totals?.easy || 0} color="green" />
          <StatsCard label="Medium" value={user.totals?.medium || 0} color="yellow" />
          <StatsCard label="Hard" value={user.totals?.hard || 0} color="red" />
        </div>
      </div>

      {/* Today's Submissions */}
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
            Today's Activity
          </h3>
          <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs font-medium px-2 sm:px-2.5 py-0.5 rounded-full">
            {user.todaySubs?.length || 0} submissions
          </span>
        </div>
        <div className="overflow-y-auto max-h-48 sm:max-h-64">
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

export default UserCard
