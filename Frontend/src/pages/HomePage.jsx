import { useEffect, useState } from 'react'
import DarkModeToggle from '../components/DarkModeToggle'
import UserCard from '../components/UserCard'
import Loading from '../components/Loading'
import { useAppState, useDashboardData } from '../contexts/AppStateContext'

function HomePage() {
	const { authUser, userData } = useAppState()
	const {
		dashboardData,
		dashboardLoading,
		dashboardError,
		fetchDashboardData,
		refreshDashboardData,
		isCacheValid
	} = useDashboardData()

	const [darkMode, setDarkMode] = useState(false)
	const [reportSource, setReportSource] = useState('default')

	// Extract report data from dashboard data
	const report = dashboardData?.data || []
	const loading = dashboardLoading
	const error = dashboardError

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

	// Fetch dashboard data when user is available
	useEffect(() => {
		if (userData?.id) {
			fetchDashboardData().then(data => {
				if (data) {
					setReportSource(data.source || 'user-friends')
				}
			}).catch(err => {
				console.error('Failed to fetch dashboard data:', err)
			})
		}
	}, [userData?.id]) // Only depend on user ID, not the entire user object

	// Debug function to check user data directly
	const debugUserData = async () => {
		if (!userData || !userData.id) {
			console.error('No user logged in');
			return;
		}

		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
			console.log(`Fetching debug data from: ${backendUrl}/api/debug-user?uid=${userData.id}`);

			const response = await fetch(`${backendUrl}/api/debug-user?uid=${userData.id}`);

			if (!response.ok) {
				const errorText = await response.text();
				console.error(`Debug endpoint error (${response.status}):`, errorText);
				alert(`Error checking user data: ${response.status} - ${errorText}`);
				return;
			}

			const data = await response.json();
			console.log('Debug data received:', data);
			alert(`User has ${data.friendsCount} friends: ${JSON.stringify(data.friends)}`);
		} catch (error) {
			console.error('Error in debug function:', error);
			alert(`Error: ${error.message}`);
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex justify-center transition-colors duration-200">
			<DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

			<div className="mx-7 px-4 py-8">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
						LeetCode Daily Report
					</h1>
					<p className="text-gray-600 dark:text-gray-300 text-lg">
						{userData
							? `Welcome ${userData.username || authUser?.email}`
							: "LeetCode Paglu log"}
					</p>
					{reportSource === 'user-friends' && report.length > 0 && (
						<div className="text-blue-600 dark:text-blue-400 text-sm mt-2 flex items-center justify-center gap-2">
							<span>Showing stats for your friends</span>
							{isCacheValid && (
								<span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
									Cached
								</span>
							)}
						</div>
					)}
					{reportSource === 'user-friends' && report.length === 0 && (
						<p className="text-amber-600 dark:text-amber-400 text-sm mt-2">
							You don't have any friends added yet
							<button
								onClick={debugUserData}
								className="ml-2 text-xs text-blue-500 hover:underline"
								title="Check your user data in the database"
							>
								(Debug)
							</button>
						</p>
					)}

					{/* Refresh Button */}
					{userData && (
						<div className="mt-4 flex gap-2 justify-center">
							<button
								onClick={() => refreshDashboardData()}
								disabled={loading}
								className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
							>
								{loading ? 'Refreshing...' : 'Refresh Data'}
							</button>
						</div>
					)}
					<div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mt-4"></div>
				</div>

				{/* Content */}
				{loading ? (
					<Loading />
				) : error ? (
					<div className="text-center py-12">
						<div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
							<span className="text-gray-400 dark:text-gray-500 text-3xl">❌</span>
						</div>
						<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
							Error Loading Data
						</h3>
						<p className="text-gray-500 dark:text-gray-400">
							{error}
						</p>
					</div>
				) : report.length === 0 ? (
					<div className="text-center py-12">
						<div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
							<span className="text-gray-400 dark:text-gray-500 text-3xl">📊</span>
						</div>
						<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
							{userData ? "No Friends Added" : "No Data Available"}
						</h3>
						<p className="text-gray-500 dark:text-gray-400">
							{userData ? "You haven't added any friends yet. Add some friends to see their LeetCode stats." : "Unable to fetch report data. Please try again later."}
						</p>
						{userData && (
							<button
								onClick={() => window.location.href = '/profile'}
								className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
							>
								Add Friends
							</button>
						)}
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
					{!authUser && (
						<p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
							<a href="/login" className="text-blue-500 hover:underline">Sign in</a> to see stats for yourself and your friends!
						</p>
					)}
				</div>
			</div>
		</div>
	)
}

export default HomePage
