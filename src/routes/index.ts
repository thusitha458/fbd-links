import express from 'express';
import { recordVisit, getStatus, getVisitors, getHomePage, getLatestVisit } from '../controllers/indexController';

const router = express.Router();

// Define routes
router.get('/', getHomePage);
router.post('/api/visits', recordVisit);
router.get('/api/visits/latest', getLatestVisit);
router.get('/api/status', getStatus);
router.get('/api/visitors', getVisitors);

export default router;
