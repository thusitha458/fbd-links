import { Request, Response } from "express";

import { findOrAssignDeviceIdentifier } from "../helpers/deviceIdentifierHelper";
import { getIpFromRequest } from "../helpers/ipHelper";
import { isProviderCodeValid } from "../helpers/providerCodeHelper";
import { storageService } from "../services/storageService";

export const storeAndroidRecord = async (req: Request, res: Response) => {
  try {
    const providerCode = req.body.providerCode;
    const ip = getIpFromRequest(req);

    if (!isProviderCodeValid(providerCode)) {
      res.status(400).json({ error: "Invalid provider code" });
      return;
    }

    const deviceIdentifier = findOrAssignDeviceIdentifier(req, res);

    const record = {
      ip,
      providerCode,
      deviceIdentifier,
    };

    await storageService.storeAndroidRecord(record);
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const storeIOSRecord = (req: Request, res: Response): void => {
  try {
    const providerCode = req.body.providerCode;
    const ip = getIpFromRequest(req);

    if (!isProviderCodeValid(providerCode)) {
      res.status(400).json({ error: "Invalid provider code" });
      return;
    }

    const deviceIdentifier = findOrAssignDeviceIdentifier(req, res);

    const record = {
      ip,
      providerCode,
      deviceIdentifier,
    };

    storageService.storeIOSRecord(record);
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const retrieveAndroidRecord = async (req: Request, res: Response) => {
  try {
    const ip = getIpFromRequest(req);

    const record = await storageService.retrieveAndroidRecord(ip);

    if (!record) {
      res.status(404).json({
        error: "Not found",
      });
      return;
    }

    res.json({
      code: record.providerCode,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const retrieveIOSRecord = async (req: Request, res: Response) => {
  try {
    const ip = getIpFromRequest(req);

    const record = await storageService.retrieveIOSRecord(ip);

    if (!record) {
      res.status(404).json({
        error: "Not found",
      });
      return;
    }

    res.json({
      providerCode: record.providerCode,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
