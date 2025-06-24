import { Request, Response } from 'express';
import { visitorService, Visitor } from '../services/visitorService';
import { configService } from '../services/configService';

/**
 * Get all visitors
 */
export const getVisitors = (req: Request, res: Response): void => {
  const visitors = visitorService.getVisitors();
  res.json({ visitors });
};

/**
 * Record visit 
 */
export const recordVisit = (req: Request, res: Response): void => {
  // Extract IP address from request
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  // Express may include IPv6 prefix "::ffff:" which we can remove for cleaner logs
  const cleanIp = ip.replace(/^::ffff:/, '');
  
  // Extract code from request body if provided
  const code = req.body?.code;
  
  // Record the visitor
  const visitorData: Visitor = {
    ip: cleanIp,
    timestamp: new Date(),
    path: req.path
  };
  
  // Add code if provided
  if (code && typeof code === 'string') {
    visitorData.code = code;
  }
  
  visitorService.addVisitor(visitorData);
  
  res.send('Recorded your visit!');
};

/**
 * API status controller
 */
export const getStatus = (req: Request, res: Response): void => {
  const visitorCount = visitorService.getVisitors().length;
  const uniqueVisitors = visitorService.getUniqueVisitorCount();
  
  res.json({
    status: 'online',
    timestamp: new Date(),
    env: process.env.NODE_ENV || 'development',
    stats: {
      totalVisitors: visitorCount,
      uniqueVisitors: uniqueVisitors
    }
  });
};

/**
 * Serve the main HTML page
 */
export const getHomePage = (req: Request, res: Response): void => {
  // Check if user is on Android device (mobile or tablet)
  const userAgent = req.headers['user-agent'] || '';
  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  
  if (isAndroid) {
    // Record the visit before redirecting
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const cleanIp = ip.replace(/^::ffff:/, '');
    
    // Generate a random code for Android redirects
    const generateRandomCode = (): string => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };
    
    const visitorData: Visitor = {
      ip: cleanIp,
      timestamp: new Date(),
      path: req.path,
      code: generateRandomCode()
    };
    
    visitorService.addVisitor(visitorData);
    
    // Redirect to Play Store using configurable URL
    const playstoreUrl = configService.getPlaystoreUrl();
    res.redirect(playstoreUrl);
    return;
  }
  
  if (isIOS) {
    // Record the visit before redirecting
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const cleanIp = ip.replace(/^::ffff:/, '');
    
    // Generate a random code for iOS redirects
    const generateRandomCode = (): string => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };
    
    const visitorData: Visitor = {
      ip: cleanIp,
      timestamp: new Date(),
      path: req.path,
      code: generateRandomCode()
    };
    
    visitorService.addVisitor(visitorData);
    
    // Serve iOS install page with configurable clipboard value
    const clipboardValue = configService.getClipboardValue();
    res.render('ios-install', {
      clipboardValue: clipboardValue
    });
    return;
  }
  
  // For non-mobile devices (desktop/other), serve the HTML page
  res.render('homepage');
};

/**
 * Get the latest visit for the current user (identified by IP address)
 */
export const getLatestVisit = (req: Request, res: Response): void => {
  // Extract IP address from request
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const cleanIp = ip.replace(/^::ffff:/, '');

  // Get all visitors and find the latest one for this user
  const visitors = visitorService.getVisitors();
  const userVisits = visitors.filter(visitor => 
    visitor.ip === cleanIp
  );

  if (userVisits.length === 0) {
    res.status(404).json({
      error: 'No visits found',
      message: 'No visit records found for this user',
      user: {
        ip: cleanIp
      }
    });
    return;
  }

  // Sort by timestamp (most recent first) and get the latest
  const latestVisit = userVisits.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];

  res.json({
    success: true,
    latestVisit: latestVisit,
    totalVisits: userVisits.length,
    user: {
      ip: cleanIp
    }
  });
};
