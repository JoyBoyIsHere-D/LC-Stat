import { db, isAdminSDK } from './firebase.js';
import { USERS_COLLECTION } from '../config/firebase-common.mjs';

// Import Firestore client SDK functions conditionally
let firestoreClient;
if (!isAdminSDK) {
    // Only import if we're using client SDK
    const importFirestore = async () => {
        const {
            collection,
            query,
            where,
            getDocs,
            doc,
            getDoc,
            limit
        } = await import('firebase/firestore');
        return {
            collection,
            query,
            where,
            getDocs,
            doc,
            getDoc,
            limit
        };
    };
    // Start the import (will be awaited in the functions)
    firestoreClient = importFirestore();
}

// Firestore helper to handle both Admin SDK and Client SDK
const firestoreHelper = {
    async getCollection(collectionName) {
        if (isAdminSDK) {
            // Admin SDK
            return db.collection(collectionName);
        } else {
            // Client SDK
            const { collection } = await firestoreClient;
            return collection(db, collectionName);
        }
    }, async getDocument(collectionName, docId) {
        if (isAdminSDK) {
            // Admin SDK
            return db.collection(collectionName).doc(docId);
        } else {
            // Client SDK
            const { doc } = await firestoreClient;
            return doc(db, collectionName, docId);
        }
    },

    async getDocumentData(collectionName, docId) {
        if (isAdminSDK) {
            // Admin SDK
            const docRef = db.collection(collectionName).doc(docId);
            const docSnap = await docRef.get();
            if (docSnap.exists) {
                return { id: docSnap.id, ...docSnap.data() };
            }
            return null;
        } else {
            // Client SDK
            const { doc, getDoc } = await firestoreClient;
            const docRef = doc(db, collectionName, docId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            }
            return null;
        }
    }, async queryCollection(collectionName, conditions) {
        if (isAdminSDK) {
            // Admin SDK
            let query = db.collection(collectionName);

            // Apply conditions
            conditions.forEach(condition => {
                query = query.where(condition.field, condition.operator, condition.value);
            });

            const snapshot = await query.get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } else {
            // Client SDK
            const { collection, query, where, getDocs } = await firestoreClient;
            const collectionRef = collection(db, collectionName);

            // Create query constraints
            const constraints = conditions.map(condition =>
                where(condition.field, condition.operator, condition.value)
            );

            const q = query(collectionRef, ...constraints);
            const snapshot = await getDocs(q);

            const results = [];
            snapshot.forEach(doc => {
                results.push({ id: doc.id, ...doc.data() });
            });

            return results;
        }
    }
};

/**
 * Get all users from Firestore
 * @returns {Promise<Array>} Array of all users
 */
export const getAllUsers = async () => {
    try {
        if (isAdminSDK) {
            const usersCollection = await db.collection(USERS_COLLECTION).get();
            return usersCollection.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } else {
            const { collection, getDocs } = await firestoreClient;
            const usersCollectionRef = collection(db, USERS_COLLECTION);
            const snapshot = await getDocs(usersCollectionRef);

            const results = [];
            snapshot.forEach(doc => {
                results.push({ id: doc.id, ...doc.data() });
            });

            return results;
        }
    } catch (error) {
        console.error('Error getting all users:', error);
        throw error;
    }
};

/**
 * Get a user by their Firebase UID
 * @param {string} uid - User ID
 * @returns {Promise<Object|null>} User data or null if not found
 */
export const getUserByUid = async (uid) => {
    try {
        console.log(`[getUserByUid] Fetching user with UID: ${uid}`);

        // Make sure uid is a string
        if (!uid || typeof uid !== 'string') {
            console.error(`[getUserByUid] Invalid UID:`, uid);
            return null;
        }

        const userData = await firestoreHelper.getDocumentData(USERS_COLLECTION, uid);

        if (userData) {
            console.log(`[getUserByUid] User data retrieved:`, {
                id: userData.id,
                hasFriends: Boolean(userData.friends && userData.friends.length > 0),
                friendsCount: userData.friends ? userData.friends.length : 0
            });
            return userData;
        } else {
            console.log(`[getUserByUid] No user found with UID: ${uid}`);
            return null;
        }
    } catch (error) {
        console.error(`[getUserByUid] Error getting user by UID ${uid}:`, error);
        throw error;
    }
};

/**
 * Get a user by their LeetCode username
 * @param {string} leetcodeUsername - LeetCode username
 * @returns {Promise<Object|null>} User data or null if not found
 */
export const getUserByLeetcodeUsername = async (leetcodeUsername) => {
    try {
        const users = await firestoreHelper.queryCollection(USERS_COLLECTION, [
            { field: 'leetcodeUsername', operator: '==', value: leetcodeUsername }
        ]);

        if (users.length > 0) {
            // Return the first matching user
            return users[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting user by LeetCode username:', error);
        throw error;
    }
};

/**
 * Get friends' LeetCode usernames for a given user
 * @param {string} uid - User ID
 * @returns {Promise<Array<string>>} Array of friends' LeetCode usernames
 */
export const getFriendsLeetcodeUsernames = async (uid) => {
    try {
        console.log(`[getFriendsLeetcodeUsernames] Getting friends for UID: ${uid}`);

        const user = await getUserByUid(uid);
        console.log(`[getFriendsLeetcodeUsernames] User data retrieved:`, {
            found: Boolean(user),
            hasFriends: Boolean(user && user.friends && user.friends.length > 0),
            friendsCount: user && user.friends ? user.friends.length : 0
        });

        if (!user) {
            console.warn(`[getFriendsLeetcodeUsernames] No user found with UID: ${uid}`);
            return [];
        }

        if (!user.friends) {
            console.warn(`[getFriendsLeetcodeUsernames] User ${uid} has no friends array`);
            return [];
        }

        if (user.friends.length === 0) {
            console.warn(`[getFriendsLeetcodeUsernames] User ${uid} has empty friends array`);
            return [];
        }

        console.log(`[getFriendsLeetcodeUsernames] Returning ${user.friends.length} friends:`, user.friends);
        return user.friends;
    } catch (error) {
        console.error(`[getFriendsLeetcodeUsernames] Error getting friends for ${uid}:`, error);
        throw error;
    }
};
