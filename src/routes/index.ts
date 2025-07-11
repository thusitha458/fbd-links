import express from 'express';
import { getStatus, getVisitors, getHomePage, getLatestVisit, getAppleAppSiteAssociation, getAndroidAssetLinks } from '../controllers/indexController';

const router = express.Router();

// API routes
router.get('/api/visits/latest', getLatestVisit);
router.get('/api/status', getStatus);
router.get('/api/visitors', getVisitors);

// Apple App Site Association for Universal Links
router.get('/.well-known/apple-app-site-association', getAppleAppSiteAssociation);

// Android Asset Links for App Links
router.get('/.well-known/assetlinks.json', getAndroidAssetLinks);

// Page route
router.get('/providers/:code', getHomePage);

export default router;
