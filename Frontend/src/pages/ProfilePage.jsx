import { useState, useEffect } from 'react'
import { createOrUpdateUser } from '../config/userService'
import FriendsManager from '../components/FriendsManager'
import { Navigate } from 'react-router-dom'
import { useAppState } from '../contexts/AppStateContext'

const ProfilePage = () => {
  const { authLoading, authUser, userData } = useAppState()
  const [formData, setFormData] = useState({
    username: '',
    leetcodeUsername: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Update form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || '',
        leetcodeUsername: userData.leetcodeUsername || '',
      })
    }
  }, [userData])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!authUser) {
      setError('You must be logged in to update your profile')
      return
    }

    try {
      setSaving(true)

      // Update user data in Firestore
      await createOrUpdateUser(authUser.uid, {
        username: formData.username,
        leetcodeUsername: formData.leetcodeUsername,
      })

      setSuccess('Profile updated successfully')
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated (only after auth state is determined)
  if (!authUser) {
    return <Navigate to="/login" />
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Form */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Update Profile
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Display Name
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="leetcodeUsername"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  LeetCode Username
                </label>
                <input
                  type="text"
                  id="leetcodeUsername"
                  name="leetcodeUsername"
                  value={formData.leetcodeUsername}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your LeetCode username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-not-allowed"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Email cannot be changed
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className={`w-full py-3 px-4 rounded-md font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${saving ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Friends Manager */}
          <FriendsManager />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
