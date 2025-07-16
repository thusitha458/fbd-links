import { Request, Response } from "express";
import { storageService, Record } from "../services/storageService";
import { appService } from "../services/appService";
import config from "../config";
import { getIpFromRequest } from "../helpers/ipHelper";
import { findOrAssignDeviceIdentifier } from "../helpers/deviceIdentifierHelper";

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
export const getHomePage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const code = req.params.code || "";

  // Check if user is on Android device (mobile or tablet)
  const userAgent = req.headers["user-agent"] || "";
  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

  const playStoreUrl = `${config.playStoreUrl}&referrer=utm_source%3Dtest%26utm_medium%3Dchat%26utm_campaign%3D${code}`;

  if (isAndroid) {
    // Redirect to Play Store using configurable URL
    res.render("android-home-page", {
      playStoreUrl,
      providerCode: code,
    });
    return;
  }

  const appInfo = await appService.getAppInfoFromProviderCode(code);

  if (!appInfo) {
    res.status(404).send("Not found.");
    return;
  }

  if (isIOS) {
    res.render("ios-home-page", {
      providerCode: code,
      appstoreUrl: config.appStoreUrl,
      ...appInfo,
    });
    return;
  }

  res.render("home-page", {
    providerCode: code,
    // appstoreUrl: config.appStoreUrl,
    // playStoreUrl,
    ...appInfo,
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
