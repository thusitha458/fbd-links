import { Request, Response } from "express";
import { storageService } from "../services/storageService";
import { getIpFromRequest } from "../helpers/ipHelper";
import { isProviderCodeValid } from "../helpers/providerCodeHelper";
import { findOrAssignDeviceIdentifier } from "../helpers/deviceIdentifierHelper";

export const storeAndroidRecord = (req: Request, res: Response): void => {
  const providerCode = req.body.providerCode;
  const ip = getIpFromRequest(req);

  if (!isProviderCodeValid(providerCode)) {
    res.status(400).json({error: 'Invalid provider code'});
    return;
  }

  const deviceIdentifier = findOrAssignDeviceIdentifier(req, res);

  const record = {
    ip,
    timestamp: new Date(),
    providerCode,
    deviceIdentifier,
  };

  storageService.storeAndroidRecord(record);
  res.json(record);
};

export const storeIOSRecord = (req: Request, res: Response): void => {
  const providerCode = req.body.providerCode;
  const ip = getIpFromRequest(req);

  if (!isProviderCodeValid(providerCode)) {
    res.status(400).json({error: 'Invalid provider code'});
    return;
  }

  const deviceIdentifier = findOrAssignDeviceIdentifier(req, res);

  const record = {
    ip,
    timestamp: new Date(),
    providerCode,
    deviceIdentifier,
  };

  storageService.storeIOSRecord(record);
  res.json(record);
};

export const retrieveAndroidRecord = (req: Request, res: Response): void => {
  const ip = getIpFromRequest(req);

  const record = storageService.retrieveAndroidRecord(ip);

  if (!record) {
    res.status(404).json({
      error: "Not found",
    });
    return;
  }

  res.json({
    code: record.providerCode,
  });
};

export const retrieveIOSRecord = (req: Request, res: Response): void => {
  const ip = getIpFromRequest(req);

  const record = storageService.retrieveIOSRecord(ip);

  if (!record) {
    res.status(404).json({
      error: "Not found",
    });
    return;
  }

  res.json({
    providerCode: record.providerCode,
  });
};

/**
 * Get the latest visit for the current user (identified by IP address)
 */
export const getLatestVisit = (req: Request, res: Response): void => {
  // Extract IP address from request
  const ip = getIpFromRequest(req);

  // Get all visitors and find the latest one for this user
  const visitors = storageService.getVisitors();
  const userVisits = visitors.filter((visitor) => visitor.ip === ip);

  if (userVisits.length === 0) {
    res.status(404).json({
      error: "No visits found",
      message: "No visit records found for this user",
      user: {
        ip,
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
      ip,
    },
  });
};