import { Request, Response } from "express";
import { visitorService, Visitor } from "../services/visitorService";
import { appService } from "../services/appService";

/**
 * Get all visitors
 */
export const getVisitors = (req: Request, res: Response): void => {
  const visitors = visitorService.getVisitors();
  res.json({ visitors });
};

/**
 * API status controller
 */
export const getStatus = (_req: Request, res: Response): void => {
  res.json({
    status: "online",
    timestamp: new Date(),
    env: process.env.NODE_ENV || "development",
  });
};

/**
 * Serve the main HTML page
 */
export const getHomePage = async (req: Request, res: Response): Promise<void> => {
  const code = req.params.code || "";

  // Check if user is on Android device (mobile or tablet)
  const userAgent = req.headers["user-agent"] || "";
  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

  // Record the visit before redirecting
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const cleanIp = ip.replace(/^::ffff:/, "");

  const visitorData: Visitor = {
    ip: cleanIp,
    timestamp: new Date(),
    path: req.path,
    code,
  };

  if (isAndroid) {
    visitorService.addVisitor(visitorData);

    // Redirect to Play Store using configurable URL
    const playstoreUrl = `https://play.google.com/store/apps/details?id=com.brplinks&referrer=utm_source%3Dtest%26utm_medium%3Dchat%26utm_campaign%3D${code}`;
    res.redirect(playstoreUrl);
    return;
  }

  const appInfo = await appService.getAppInfoFromProviderCode(code);

  if (!appInfo) {
    res.status(404).send("Not found.");
    return;
  }

  if (isIOS) {
    visitorService.addVisitor(visitorData);

    res.render("home-page", {
      providerCode: code,
      showInstallButton: true,
      ...appInfo,
    });
    return;
  }

  res.render("home-page", {
    providerCode: code,
    showInstallButton: false,
    ...appInfo,
  });
};

/**
 * Get the latest visit for the current user (identified by IP address)
 */
export const getLatestVisit = (req: Request, res: Response): void => {
  // Extract IP address from request
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const cleanIp = ip.replace(/^::ffff:/, "");

  // Get all visitors and find the latest one for this user
  const visitors = visitorService.getVisitors();
  const userVisits = visitors.filter((visitor) => visitor.ip === cleanIp);

  if (userVisits.length === 0) {
    res.status(404).json({
      error: "No visits found",
      message: "No visit records found for this user",
      user: {
        ip: cleanIp,
      },
    });
    return;
  }

  // Sort by timestamp (most recent first) and get the latest
  const latestVisit = userVisits.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];

  res.json({
    success: true,
    latestVisit: latestVisit,
    totalVisits: userVisits.length,
    user: {
      ip: cleanIp,
    },
  });
};

/**
 * Serve Apple App Site Association file for Universal Links
 */
export const getAppleAppSiteAssociation = (
  req: Request,
  res: Response
): void => {
  const aasaContent = {
    applinks: {
      details: [
        {
          appIDs: ["XAR3N4K5N8.se.brpsystems.brplinks"],
          components: [
            {
              "/": "/providers/*",
              comment: "Matches all provider paths for Universal Links",
            },
          ],
        },
      ],
    },
    appclips: {
      apps: ["XAR3N4K5N8.se.brpsystems.brplinks.Clip"],
    },
  };

  // Set the correct content type for Apple App Site Association
  res.setHeader("Content-Type", "application/json");
  res.json(aasaContent);
};

/**
 * Serve Android Asset Links JSON file for App Links
 */
export const getAndroidAssetLinks = (req: Request, res: Response): void => {
  const assetLinksContent = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "com.brplinks",
        sha256_cert_fingerprints: [
          "24:A0:21:B4:AB:D1:D8:B7:AF:0E:25:02:A1:A4:BA:B2:3B:BB:31:6A:C6:75:81:42:92:CB:87:89:5F:8A:2E:3A",
        ],
      },
    },
  ];

  // Set the correct content type for Android Asset Links
  res.setHeader("Content-Type", "application/json");
  res.json(assetLinksContent);
};
