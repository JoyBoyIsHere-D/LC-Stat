import { db } from './firebase'
import { USERS_COLLECTION } from '../../../config/firebase-common.mjs'
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    collection,
    query,
    where,
    getDocs,
} from 'firebase/firestore'

// Backend API URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

/**
 * Creates or updates a user in Firestore
 * @param {string} uid - User ID from Firebase Auth
 * @param {Object} userData - User data to store
 * @returns {Promise<void>}
 */
export const createOrUpdateUser = async (uid, userData) => {
    try {
        const userRef = doc(db, USERS_COLLECTION, uid)

        // First check if the user exists
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
            // Get existing user data
            const existingData = userSnap.data();
            console.log('Existing user data:', existingData);

            // Prepare the update data
            const updateData = { ...userData };

            // If userData contains a friends array and the user already has friends,
            // keep the existing friends (unless explicitly instructed to replace)
            if ('friends' in userData && existingData.friends && existingData.friends.length > 0 && !userData.replaceFriends) {
                console.log('Preserving existing friends:', existingData.friends);
                delete updateData.friends; // Don't update friends field
            }

            console.log('Updating user with:', updateData);
            // Update existing user (only update provided fields)
            await updateDoc(userRef, updateData)
        } else {
            // Create new user with default empty friends array if not provided
            const newUserData = {
                ...userData,
                friends: userData.friends || [],
                createdAt: new Date(),
            }

            console.log('Creating new user:', newUserData);
            await setDoc(userRef, newUserData)
        }
    } catch (error) {
        console.error('Error creating/updating user:', error)
        throw error
    }
}

/**
 * Gets a user from Firestore by UID
 * @param {string} uid - User ID
 * @returns {Promise<Object|null>} User data or null if not found
 */
export const getUserByUid = async uid => {
    try {
        const userRef = doc(db, USERS_COLLECTION, uid)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
            return { id: userSnap.id, ...userSnap.data() }
        } else {
            return null
        }
    } catch (error) {
        console.error('Error getting user:', error)
        throw error
    }
}

/**
 * Finds a user by their LeetCode username
 * @param {string} leetcodeUsername
 * @returns {Promise<Object|null>} User data or null if not found
 */
export const getUserByLeetcodeUsername = async leetcodeUsername => {
    try {
        const usersRef = collection(db, USERS_COLLECTION)
        const q = query(usersRef, where('leetcodeUsername', '==', leetcodeUsername))

        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
            // Return the first matching user
            const userDoc = querySnapshot.docs[0]
            return { id: userDoc.id, ...userDoc.data() }
        } else {
            return null
        }
    } catch (error) {
        console.error('Error finding user by leetcode username:', error)
        throw error
    }
}

/**
 * Adds a friend (by LeetCode username) to a user's friends list
 * @param {string} uid - User ID
 * @param {string} friendLeetcodeUsername - Friend's LeetCode username to add
 * @returns {Promise<void>}
 */
export const addFriend = async (uid, friendLeetcodeUsername) => {
    try {
        const userRef = doc(db, USERS_COLLECTION, uid)

        await updateDoc(userRef, {
            friends: arrayUnion(friendLeetcodeUsername),
        })
    } catch (error) {
        console.error('Error adding friend:', error)
        throw error
    }
}

/**
 * Removes a friend (by LeetCode username) from a user's friends list
 * @param {string} uid - User ID
 * @param {string} friendLeetcodeUsername - Friend's LeetCode username to remove
 * @returns {Promise<void>}
 */
export const removeFriend = async (uid, friendLeetcodeUsername) => {
    try {
        const userRef = doc(db, USERS_COLLECTION, uid)

        await updateDoc(userRef, {
            friends: arrayRemove(friendLeetcodeUsername),
        })
    } catch (error) {
        console.error('Error removing friend:', error)
        throw error
    }
}

/**
 * Gets all friends' data for a user
 * @param {string} uid - User ID
 * @returns {Promise<Array>} Array of friends' data
 */
export const getUserFriends = async uid => {
    try {
        // First get the user to get their friends list
        const user = await getUserByUid(uid)
        console.log('User data in getUserFriends:', user)

        if (!user || !user.friends || user.friends.length === 0) {
            console.log('No friends found for user')
            return []
        }

        console.log('Found friends array:', user.friends)

        // Fetch data for each friend's LeetCode username
        const friendsData = []

        for (const friendLeetcodeUsername of user.friends) {
            console.log('Looking up friend:', friendLeetcodeUsername)
            const friend = await getUserByLeetcodeUsername(friendLeetcodeUsername)
            if (friend) {
                console.log('Found friend data:', friend)
                friendsData.push(friend)
            } else {
                console.log('Friend not found, adding basic info')
                // If the friend's user profile doesn't exist, still add their username
                friendsData.push({
                    leetcodeUsername: friendLeetcodeUsername,
                    // Add any default values you want to display
                })
            }
        }

        console.log('Returning friends data:', friendsData)
        return friendsData
    } catch (error) {
        console.error('Error getting user friends:', error)
        throw error
    }
}

/**
 * Fetches stats from the backend API
 * @param {string} uid - User ID for whom to fetch friends' stats
 * @returns {Promise<Array>} Array of friends with their LeetCode stats
 */
export const fetchFriendsStats = async uid => {
    try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
        console.log(`Fetching stats from: ${backendUrl}/api/stats?uid=${uid}`);

        const response = await fetch(`${backendUrl}/api/stats?uid=${uid}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Backend error (${response.status}):`, errorText);
            throw new Error(`Backend returned status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('Stats received:', data);

        // Ensure there's a data property, even if it's empty
        if (!data.data) {
            data.data = [];
        }

        return data;
    } catch (error) {
        console.error('Error fetching stats from backend:', error);
        throw error;
    }
}
