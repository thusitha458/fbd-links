import { Request, Response } from "express";

import { appService } from "../services/appService";
import config from "../config/appConfig";

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

  const playStoreUrl = `${config.playStoreUrl}&referrer=utm_source%3Ddeeplink%26utm_medium%3Dlink%26utm_campaign%3D${code}`;

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
    ...appInfo,
  });
};

export const redirectToNewHomePage = (req: Request, res: Response): void => {
  const link = req.query.link as string;

  if (!link) {
    res.status(400).send("Invalid link");
    return;
  }

  const url = new URL(link);
  const providerCode =
    url.searchParams?.get("providerCode") || url.searchParams?.get("facility");

  if (!providerCode) {
    res.status(400).send("Invalid link");
    return;
  }

  res.redirect(`/providers/${providerCode}`);
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
          appIDs: ["46TM43B7XL.se.brpsystems.mobility"],
          components: [
            {
              "/": "/providers/*",
              comment: "Matches all provider paths",
            },
            {
              "/": "/*",
              "?": {
                link: "?*",
              },
              comment: "Matches any URL with a 'link' query parameter",
            },
          ],
        },
      ],
    },
    appclips: {
      apps: ["46TM43B7XL.se.brpsystems.mobility.Clip"],
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
        package_name: "se.brpsystems.mobility",
        sha256_cert_fingerprints: [
          "84:7C:E5:8F:CF:98:12:EF:08:05:C3:B0:86:9E:F3:29:C9:5E:7E:BA:0E:60:67:3F:93:E7:9B:F2:E0:1A:9D:9A",
        ],
      },
    },
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "se.brpsystems.mobility",
        sha256_cert_fingerprints: [
          "72:89:D1:4D:EB:94:E6:2A:41:B6:0C:DA:4B:46:74:4B:EE:C8:3B:82:EB:E6:20:42:0A:39:9A:25:AA:AB:85:C3",
        ],
      },
    },
  ];

  // Set the correct content type for Android Asset Links
  res.setHeader("Content-Type", "application/json");
  res.json(assetLinksContent);
};
