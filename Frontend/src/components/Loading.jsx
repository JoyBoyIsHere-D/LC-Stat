import React from 'react'

const Loading = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      <span className="ml-3 text-gray-600 dark:text-gray-300">Loading report...</span>
    </div>
  )
}

export default Loading
