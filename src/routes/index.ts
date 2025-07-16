import express from 'express';
import { getStatus, getHomePage, getAppleAppSiteAssociation, getAndroidAssetLinks } from '../controllers/homeController';
import { storeAndroidRecord, storeIOSRecord, getLatestVisit, retrieveAndroidRecord, retrieveIOSRecord } from '../controllers/visitorController';

const router = express.Router();

// API routes
router.get('/api/visits/latest', getLatestVisit);
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

export default router;
