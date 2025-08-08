import { getAndroidAssetLinks, getAppleAppSiteAssociation, getHomePage, getStatus, redirectToNewHomePage } from '../controllers/homeController';
import { retrieveAndroidRecord, retrieveIOSRecord, storeAndroidRecord, storeIOSRecord } from '../controllers/storageController';

import express from 'express';

const router = express.Router();

// API routes
router.get('/api/status', getStatus);
router.post('/api/android/record-storage', storeAndroidRecord);
router.post('/api/ios/record-storage', storeIOSRecord);
router.post('/api/android/record-retrieval', retrieveAndroidRecord);
router.post('/api/ios/record-retrieval', retrieveIOSRecord);

// Apple App Site Association for Universal Links
router.get('/.well-known/apple-app-site-association', getAppleAppSiteAssociation);

// Android Asset Links for App Links
router.get('/.well-known/assetlinks.json', getAndroidAssetLinks);

// Page route
router.get('/providers/:code', getHomePage);

// Route for the old firebase dynamic links
router.get('/', redirectToNewHomePage);

export default router;
