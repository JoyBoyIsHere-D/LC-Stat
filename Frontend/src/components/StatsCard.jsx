import React from 'react'

const StatsCard = ({ label, value, color = 'blue' }) => {
  const colorClasses = {
    green:
      'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300',
    yellow:
      'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300',
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300',
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
  }

  return (
    <div className={`px-2 sm:px-4 py-2 sm:py-3 rounded-lg border ${colorClasses[color]}`}>
      <div className="text-xs sm:text-sm font-medium opacity-75">{label}</div>
      <div className="text-lg sm:text-2xl font-bold">{value}</div>
    </div>
  )
}

export default StatsCard
