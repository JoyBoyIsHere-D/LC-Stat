# LC-Stat 🚀

[![Live Website](https://img.shields.io/badge/Demo-Live-brightgreen)](https://leetcode-stat.netlify.app/)


A modern full-stack web application for tracking and comparing LeetCode statistics with your friends. Built with React, Node.js, and Firebase for real-time data synchronization and seamless user experience.

## ✨ Features

- 🔐 **User Authentication**: Email/password and Google OAuth integration
- 👥 **Friend Management**: Add friends by LeetCode username and track their progress
- 📊 **Stats Comparison**: Compare your coding progress with friends
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive Design**: Mobile-first design that works on all devices
- ⚡ **Real-time Updates**: Live data synchronization with Firebase
- 🎯 **Modern UI/UX**: Clean, intuitive interface with smooth animations

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.1.0
- **Build Tool**: Vite 4.x
- **Routing**: React Router DOM 7.6.2
- **Styling**: Tailwind CSS 4.1.8
- **Authentication**: Firebase Auth 11.9.1
- **State Management**: React Context API
- **Code Quality**: ESLint, Prettier

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: Firebase Firestore
- **Authentication**: Firebase Admin SDK 13.4.0
- **CORS**: Enabled for cross-origin requests
- **Environment**: dotenv for configuration
- **Date Handling**: Luxon 3.6.1

### Infrastructure & Services
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Auth
- **Hosting**: Netlify (Frontend) + Render (Backend)
- **Version Control**: Git & GitHub

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** - [Download here](https://git-scm.com/)
- **Firebase Account** - [Create here](https://firebase.google.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/JoyBoyIsHere-D/LC-Stat.git
cd LC-Stat
```

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google providers)
3. Create a Firestore database
4. Generate service account key for backend
5. Get your Firebase config for frontend

### 3. Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your Firebase credentials
# Add your serviceAccountKey.json file (downloaded from Firebase Console)
```

**Backend Environment Variables** (`.env`):
```env
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
FIREBASE_MEASUREMENT_ID=your-measurement-id
PORT=3000
```

**Start the backend server:**
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### 4. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd Frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your Firebase and backend URLs
```

**Frontend Environment Variables** (`.env`):
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
VITE_BACKEND_URL=http://localhost:3000
```

**Start the frontend development server:**
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### 5. Access the Application

1. Open your browser and go to `http://localhost:5173`
2. Create an account or sign in with Google
3. Add your LeetCode username in your profile
4. Start adding friends and tracking stats! 🎉

## 📁 Project Structure

```
LC-Stat/
├── Frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React Context providers
│   │   ├── config/         # Firebase and service configurations
│   │   └── layouts/        # Layout components
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── Backend/                 # Express.js backend API
│   ├── routes/             # API route handlers
│   ├── utils/              # Utility functions
│   ├── index.js           # Main server file
│   └── package.json       # Backend dependencies
├── config/                 # Shared configuration
└── README.md              # Project documentation
```

## 🔧 Development

### Available Scripts

**Frontend:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

**Backend:**
```bash
npm start        # Start production server
npm run dev      # Start development server
```

## 🚀 Deployment

### Frontend (Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy with Node.js environment

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Jayanshu Jena**
- GitHub: [@JoyBoyIsHere-D](https://github.com/JoyBoyIsHere-D)
- LinkedIn: [Jayanshu Jena](https://www.linkedin.com/in/jayanshu-jena-289a77286/)

## 🙏 Acknowledgments

- [LeetCode](https://leetcode.com/) for providing the platform that inspired this project
- [Firebase](https://firebase.google.com/) for authentication and database services
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) for the amazing development experience
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

---

⭐ **Star this repository if you found it helpful!** ⭐
