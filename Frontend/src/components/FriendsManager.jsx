import { useState, useEffect } from 'react'
import { addFriend, removeFriend, getUserFriends } from '../config/userService'
import { useAppState } from '../contexts/AppStateContext'

const FriendsManager = () => {
  const { authUser, userData } = useAppState()
  const [friends, setFriends] = useState([])
  const [newFriendUsername, setNewFriendUsername] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load friends when userData is available
  useEffect(() => {
    const loadFriends = async () => {
      if (userData?.id) {
        try {
          const friendsData = await getUserFriends(authUser.uid)
          setFriends(friendsData)
        } catch (err) {
          console.error('Error loading friends:', err)
          setError('Failed to load friends')
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    loadFriends()
  }, [userData?.id, authUser?.uid])

  // Handle adding a new friend
  const handleAddFriend = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!newFriendUsername.trim()) {
      setError('Please enter a LeetCode username')
      return
    }

    if (!authUser) {
      setError('You must be logged in to add friends')
      return
    }

    try {
      setLoading(true)
      await addFriend(authUser.uid, newFriendUsername.trim())

      // Refresh friends list
      const friendsData = await getUserFriends(authUser.uid)
      console.log('Retrieved friends data:', friendsData)
      setFriends(friendsData)

      setNewFriendUsername('')
      setSuccess(`Added ${newFriendUsername.trim()} to your friends`)
    } catch (err) {
      console.error('Error adding friend:', err)
      setError('Failed to add friend. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle removing a friend
  const handleRemoveFriend = async friendLeetcodeUsername => {
    if (!authUser) {
      setError('You must be logged in to remove friends')
      return
    }

    try {
      setLoading(true)
      await removeFriend(authUser.uid, friendLeetcodeUsername)

      // Refresh friends list
      const friendsData = await getUserFriends(authUser.uid)
      console.log('Retrieved friends data after removal:', friendsData)
      setFriends(friendsData)

      setSuccess(`Removed ${friendLeetcodeUsername} from your friends`)
    } catch (err) {
      console.error('Error removing friend:', err)
      setError('Failed to remove friend. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const refreshFriendsList = async () => {
    if (!authUser) return;

    try {
      setLoading(true);

      // Refresh friends list
      const friendsData = await getUserFriends(authUser.uid);
      console.log('Manually refreshed friends data:', friendsData);
      setFriends(friendsData);

    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
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
    )
  }

  if (!userData) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <p className="text-gray-700 dark:text-gray-300">Please log in to manage your friends.</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your LeetCode Friends
        </h2>
        <button
          onClick={refreshFriendsList}
          disabled={loading}
          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Refreshing...
            </span>
          ) : (
            <span className="flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh
            </span>
          )}
        </button>
      </div>

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

      <form onSubmit={handleAddFriend} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={newFriendUsername}
            onChange={e => setNewFriendUsername(e.target.value)}
            placeholder="Enter friend's LeetCode username"
            className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Add Friend
          </button>
        </div>
      </form>

      <div className='overflow-y-auto max-h-56'>
        {friends.length === 0 ? (
          <div className="text-center p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/20">
            <div className="mb-4">
              <span className="text-4xl">👥</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Friends Added Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Add your friends' LeetCode usernames to see their stats and compare your progress!
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Use the form above to add your first friend
            </p>
          </div>
        ) : (
          <ul className="space-y-2 ">
            {friends.map(friend => (
              <li
                key={friend.leetcodeUsername}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <span className="text-gray-800 dark:text-gray-200">{friend.leetcodeUsername}</span>
                <button
                  onClick={() => handleRemoveFriend(friend.leetcodeUsername)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

        )}
      </div>
    </div>
  )
}

export default FriendsManager
