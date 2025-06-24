import express from 'express';
import { recordVisit, getStatus, getVisitors, getHomePage, getLatestVisit } from '../controllers/indexController';
import { getAdminPage, getConfig, updateProviderCode, resetProviderCode } from '../controllers/adminController';

const router = express.Router();

// Define routes
router.get('/', getHomePage);
router.post('/api/visit', recordVisit);
router.get('/api/visits/latest', getLatestVisit);
router.get('/api/status', getStatus);
router.get('/api/visitors', getVisitors);

// Admin routes
router.get('/admin', getAdminPage);
router.get('/admin/config', getConfig);
router.post('/admin/config/provider', updateProviderCode);
router.post('/admin/config/provider/reset', resetProviderCode);

export default router;
