import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { FIREBASE_CONFIG, USERS_COLLECTION } from '../config/firebase-common.mjs';

// Load environment variables
dotenv.config();

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to service account key
const serviceAccountPath = join(__dirname, 'serviceAccountKey.json');

// Initialize Firestore database
let db;
let adminApp;
let isAdminSDK = false; // Track if we're using Admin SDK

try {
    console.log('[Firebase] Attempting to initialize with service account');
    // Try to initialize with the service account file
    adminApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
        projectId: FIREBASE_CONFIG.projectId,
    });

    console.log('[Firebase] Admin SDK initialized successfully');

    // Get Firestore database from Admin SDK
    db = admin.firestore();
    isAdminSDK = true;
    console.log('[Firebase] Firestore database initialized with Admin SDK');
} catch (error) {
    console.warn('[Firebase] Error initializing with service account:', error.message);
    console.warn('[Firebase] Using Firebase client SDK instead (not recommended for production)');

    // Import Firebase client SDK modules
    const { initializeApp } = await import('firebase/app');
    const { getFirestore } = await import('firebase/firestore');

    // Initialize with client SDK (not recommended for production)
    const clientApp = initializeApp({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: FIREBASE_CONFIG.projectId,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
    });

    console.log('[Firebase] Client SDK initialized successfully');

    // Get Firestore instance from client SDK
    db = getFirestore(clientApp);
    isAdminSDK = false;
    console.log('[Firebase] Firestore database initialized with Client SDK');
}

export { db, isAdminSDK };

// Verify connection is working
let connectionTest;
if (isAdminSDK) {
    // Admin SDK connection test
    connectionTest = db.collection(USERS_COLLECTION).limit(1).get();
} else {
    // Client SDK connection test
    const { collection, query, limit, getDocs } = await import('firebase/firestore');
    const q = query(collection(db, USERS_COLLECTION), limit(1));
    connectionTest = getDocs(q);
}

connectionTest
    .then(snapshot => {
        const size = snapshot.size || snapshot.docs?.length || 0;
        console.log(`[Firebase] Connection test successful! Found ${size} document(s).`);
    })
    .catch(error => {
        console.error('[Firebase] Connection test failed:', error);
    });
