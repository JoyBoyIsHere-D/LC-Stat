# LC-Stat

A React application for tracking and comparing LeetCode stats with your friends.

## Project Structure

The project is divided into two main parts:

- **Frontend**: React application built with Vite
- **Backend**: Express.js API server

## Environment Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Frontend

1. Navigate to the Frontend directory:
   ```
   cd Frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the Frontend directory with the following variables:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   VITE_BACKEND_URL=http://localhost:3000
   ```

4. Start the development server:
   ```
   npm run dev
   ```

### Backend

1. Navigate to the Backend directory:
   ```
   cd Backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the Backend directory with the following variables:
   ```
   FIREBASE_API_KEY=your-api-key
   FIREBASE_AUTH_DOMAIN=your-auth-domain
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-storage-bucket
   FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   FIREBASE_APP_ID=your-app-id
   FIREBASE_MEASUREMENT_ID=your-measurement-id
   PORT=3000
   ```

4. For Firebase Admin SDK, you'll need to either:
   - Set up Application Default Credentials
   - Create a service account key file named `serviceAccountKey.json` in the Backend directory

5. Start the backend server:
   ```
   npm run dev
   ```

## Features

- User authentication (email/password and Google)
- Dark mode
- Track your LeetCode stats
- Add friends and track their stats
- Compare progress with friends

## Firebase Configuration

This project uses Firebase for:
- Authentication
- Firestore database for storing user data and friend relationships

The Firebase configuration is set up to use environment variables for security.

## Shared Configuration

Common configuration values are stored in the `config/firebase-common.js` file to avoid duplication between frontend and backend.
