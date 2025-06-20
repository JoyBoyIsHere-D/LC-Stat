import express from 'express';
import statsRoutes from './stats.js';
import debugRoutes from './debug.js';

const router = express.Router();

// Apply routes
router.use('/api', statsRoutes);
router.use('/api', debugRoutes);

export default router;
