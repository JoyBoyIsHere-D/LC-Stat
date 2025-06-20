import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Apply middleware
const frontendUrl = process.env.VITE_FRONTEND_URL || 'https://leetcode-stat.netlify.app/';
app.use(cors({
  origin: [
    frontendUrl,
    'https://leetcode-stat.netlify.app',
    'http://localhost:5173', // For local development
    'http://localhost:3000'  // For local development
  ],
  credentials: true
}));
app.use(express.json());

// Use PORT from .env file or default to 3000
const PORT = process.env.PORT || 3000;

// Apply routes
app.use(routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
