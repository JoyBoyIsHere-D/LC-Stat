import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { auth, googleProvider } from '../config/firebase'
import {
	createUserWithEmailAndPassword,
	signInWithPopup,
	updateProfile,
	fetchSignInMethodsForEmail,
	signInWithEmailAndPassword
} from 'firebase/auth'
import { createOrUpdateUser, getUserByUid } from '../config/userService'

const SignupPage = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		leetcodeUsername: '',
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const navigate = useNavigate()
	const location = useLocation()

	// Get the page the user was trying to visit, default to home
	const from = location.state?.from?.pathname || '/'

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value,
		}))
	}

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		setError('')

		// Validation
		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match')
			setLoading(false)
			return
		}

		try {
			// Check if email is already in use
			const methods = await fetchSignInMethodsForEmail(auth, formData.email)

			if (methods.length > 0) {
				// Email exists
				setError('An account with this email already exists. Please sign in instead.')
				setLoading(false)
				return
			}

			// Create the user in Firebase Auth
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				formData.email,
				formData.password
			)
			const user = userCredential.user

			// Update the user profile with display name
			await updateProfile(user, {
				displayName: formData.name,
			})

			// Save user data to Firestore
			await createOrUpdateUser(user.uid, {
				username: formData.name,
				email: formData.email,
				leetcodeUsername: formData.leetcodeUsername,
				friends: [], // For a new account, this will create an empty friends array
			})

			// Redirect to the page they were trying to visit, or home
			navigate(from, { replace: true })
		} catch (err) {
			// Handle specific error codes
			if (err.code === 'auth/email-already-in-use') {
				setError('An account with this email already exists. Please sign in instead.')
			} else {
				setError('Failed to create account. Please try again.')
				console.error(err)
			}
		} finally {
			setLoading(false)
		}
	}

	// Google Sign-in handler
	const handleGoogleSignIn = async () => {
		setLoading(true)
		setError('')

		// Validate that a LeetCode username was provided
		if (!formData.leetcodeUsername) {
			setError('Please enter your LeetCode username before signing up with Google')
			setLoading(false)
			return
		}

		try {
			// First, try to sign in with Google to see if the user exists
			const result = await signInWithPopup(auth, googleProvider)
			const user = result.user

			// Check if the user already has a profile in Firestore
			const existingUserData = await getUserByUid(user.uid)

			if (existingUserData) {
				// User already exists, preserve their existing data and redirect to intended page
				console.log('User already exists, signing in:', existingUserData)
				navigate(from, { replace: true })
				return
			}

			// This is a new user, save their data to Firestore
			console.log('New user, creating profile')
			await createOrUpdateUser(user.uid, {
				username: user.displayName || 'User',
				email: user.email,
				leetcodeUsername: formData.leetcodeUsername,
				friends: [], // For a new account, this will create an empty friends array
			})

			// Redirect to the page they were trying to visit, or home
			navigate(from, { replace: true })
		} catch (err) {
			setError('Google sign-in failed. Please try again.')
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
			<div className="w-full max-w-md">
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Create Account</h1>
						<p className="text-gray-600 dark:text-gray-400 mt-2">
							Join LC-Stat to track your LeetCode progress
						</p>
					</div>

					{error && (
						<div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Full Name
							</label>
							<input
								id="name"
								name="name"
								type="text"
								required
								value={formData.name}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="John Doe"
							/>
						</div>

						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Email Address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								required
								value={formData.email}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="you@example.com"
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
								id="leetcodeUsername"
								name="leetcodeUsername"
								type="text"
								required
								value={formData.leetcodeUsername}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Your LeetCode username"
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								required
								value={formData.password}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="••••••••"
							/>
						</div>

						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Confirm Password
							</label>
							<input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								required
								value={formData.confirmPassword}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="••••••••"
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className={`w-full py-3 px-4 rounded-md font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all mt-6 ${loading ? 'opacity-70 cursor-not-allowed' : ''
								}`}
						>
							{loading ? (
								<span className="flex items-center justify-center">
									<svg
										className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Creating account...
								</span>
							) : (
								'Create Account'
							)}
						</button>
					</form>

					<div className="mt-4 relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
								Or continue with
							</span>
						</div>
					</div>

					<div className="mt-4">
						<button
							type="button"
							onClick={handleGoogleSignIn}
							className="w-full flex justify-center items-center py-3 px-4 rounded-md font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
						>
							<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
									fill="#EA4335"
								/>
								<path
									d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
									fill="#4285F4"
								/>
								<path
									d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
									fill="#FBBC05"
								/>
								<path
									d="M12.0004 24C15.2404 24 18.0004 22.94 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.241 12.0004 19.241C8.8704 19.241 6.21537 17.131 5.2654 14.291L1.27539 17.386C3.25539 21.306 7.3104 24 12.0004 24Z"
									fill="#34A853"
								/>
							</svg>
							Sign up with Google
						</button>
					</div>

					<div className="mt-6 text-center">
						<p className="text-gray-600 dark:text-gray-400">
							Already have an account?{' '}
							<Link
								to="/login"
								className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
							>
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SignupPage
