import express from 'express';
import { getStatus, getVisitors, getHomePage, getLatestVisit } from '../controllers/indexController';

const router = express.Router();

// API routes
router.get('/api/visits/latest', getLatestVisit);
router.get('/api/status', getStatus);
router.get('/api/visitors', getVisitors);

// Page route
router.get('/:code', getHomePage);

export default router;
