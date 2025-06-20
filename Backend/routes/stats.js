import express from 'express';
import { DateTime } from 'luxon';
import { fetchTodayAcSubmissions, fetchTotalSolvedCounts, DEFAULT_USERNAMES } from '../utils/leetcode-api.js';

const router = express.Router();

/**
 * GET /api/stats
 * Get stats for a user's friends or default users
 */
router.get('/stats', async (req, res) => {
	try {
		const { uid } = req.query;
		let usernames = [];

		// If a user ID is provided, get their friends from Firestore
		if (uid) {
			// Dynamic import to avoid circular dependencies
			const { getFriendsLeetcodeUsernames } = await import('../firebase-utils.js');

			try {
				// Get friends' LeetCode usernames from Firestore
				console.log(`Attempting to get friends for user: ${uid}`);
				const friendUsernames = await getFriendsLeetcodeUsernames(uid);
				console.log(`Found ${friendUsernames.length} friends for user ${uid}:`, friendUsernames);

				// If we have friends, use them; otherwise use default usernames to show something
				if (friendUsernames && friendUsernames.length > 0) {
					usernames = friendUsernames;
					console.log('Using friend usernames:', usernames);
				} else {
					// Use DEFAULT_USERNAMES as fallback to ensure user sees some data
					usernames = DEFAULT_USERNAMES;
					console.log('No friends found, using default usernames:', usernames);
				}
			} catch (error) {
				console.error(`Error getting friends for user ${uid}:`, error);
				// Use DEFAULT_USERNAMES as fallback when error occurs
				usernames = DEFAULT_USERNAMES;
				console.log('Error occurred, using default usernames:', usernames);
			}
		} else {
			// No UID provided, use default usernames
			usernames = DEFAULT_USERNAMES;
			console.log('No UID provided, using default usernames:', usernames);
		}

		// Fetch data for all the usernames
		const result = [];

		for (const username of usernames) {
			try {
				console.log(`Fetching data for username: ${username}`);

				// Add a small delay to avoid rate limiting
				await new Promise(resolve => setTimeout(resolve, 100));

				let todaySubs;
				let totals;

				try {
					todaySubs = await fetchTodayAcSubmissions(username);
					console.log(`Successfully fetched submissions for ${username}`);
				} catch (subError) {
					console.error(`Error fetching submissions for ${username}:`, subError);
					todaySubs = []; // Use empty array as fallback
				}

				try {
					totals = await fetchTotalSolvedCounts(username);
					console.log(`Successfully fetched solved counts for ${username}`);
				} catch (totalError) {
					console.error(`Error fetching solved counts for ${username}:`, totalError);
					totals = { // Create dummy data as fallback
						easy: 0,
						medium: 0,
						hard: 0,
						total: 0
					};
				}

				result.push({
					username,
					todaySubs,
					totals
				});
			} catch (error) {
				console.error(`Error processing data for ${username}:`, error);
				// Still add the username to the result with error info
				result.push({
					username,
					error: error.toString(),
					todaySubs: [],
					totals: { easy: 0, medium: 0, hard: 0, total: 0 }
				});
			}
		}

		res.json({
			reportGeneratedAt: DateTime.utc().toISO(),
			data: result,
			source: uid ? 'user-friends' : 'default'
		});
	} catch (error) {
		console.error('Error generating stats:', error);
		res.status(500).json({ error: 'Failed to generate stats' });
	}
});

/**
 * POST /api/user-report
 * Get report for a specific user and their friends
 */
router.post('/user-report', async (req, res) => {
	try {
		const { userId, leetcodeUsername } = req.body;

		if (!userId && !leetcodeUsername) {
			return res.status(400).json({
				error: 'Either userId or leetcodeUsername is required'
			});
		}

		let usernames = [];

		// Dynamic import to avoid circular dependencies
		const { getFriendsLeetcodeUsernames, getUserByLeetcodeUsername } = await import('../firebase-utils.js');

		// If userId is provided, get the user's friends from Firebase
		if (userId) {
			try {
				const friendUsernames = await getFriendsLeetcodeUsernames(userId);

				if (friendUsernames.length > 0) {
					usernames = friendUsernames;
				} else {
					// If user has no friends, fall back to their own username if available
					const user = await getUserByLeetcodeUsername(leetcodeUsername);
					if (user && user.leetcodeUsername) {
						usernames = [user.leetcodeUsername];
					} else {
						// Fall back to default usernames
						usernames = DEFAULT_USERNAMES;
					}
				}
			} catch (error) {
				console.error('Error fetching friends:', error);
				// Fall back to provided username or defaults
				usernames = leetcodeUsername ? [leetcodeUsername] : DEFAULT_USERNAMES;
			}
		} else if (leetcodeUsername) {
			// If only leetcodeUsername is provided
			usernames = [leetcodeUsername];
		} else {
			// Fall back to default usernames
			usernames = DEFAULT_USERNAMES;
		}

		// Fetch data for each username
		const result = [];
		for (const username of usernames) {
			try {
				// Add a small delay to avoid rate limiting
				await new Promise(resolve => setTimeout(resolve, 100));

				const todaySubs = await fetchTodayAcSubmissions(username);
				const totals = await fetchTotalSolvedCounts(username);

				result.push({
					username,
					todaySubs,
					totals
				});
			} catch (error) {
				result.push({
					username,
					error: error.toString(),
				});
			}
		}

		res.json({ reportGeneratedAt: DateTime.utc().toISO(), data: result });
	} catch (error) {
		console.error('Error in user-report endpoint:', error);
		res.status(500).json({ error: 'Failed to generate report' });
	}
});

export default router;
