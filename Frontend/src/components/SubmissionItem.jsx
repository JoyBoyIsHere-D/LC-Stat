import React from 'react'

const SubmissionItem = ({ submission, username }) => {
  const handleViewSubmission = () => {
    const submissionUrl = `https://leetcode.com/submissions/detail/${submission.submissionId}`
    window.open(submissionUrl, '_blank')
  }

  const handleViewQuestion = () => {
    const questionUrl = `https://leetcode.com/problems/${submission.titleSlug}`
    window.open(questionUrl, '_blank')
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

export default SubmissionItem
