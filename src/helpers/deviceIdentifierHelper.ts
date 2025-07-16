import { randomBytes } from "crypto";
import { Request, Response } from "express";

const DEVICE_IDENTIFIER_LENGTH = 10; // make this even
const DEVICE_IDENTIFIER_COOKIE_NAME = "brp-device-identifier";

export const findOrAssignDeviceIdentifier = (req: Request, res: Response) => {
  let deviceIdentifier = getDeviceIdentifierFromRequest(req);
  if (!deviceIdentifier) {
    deviceIdentifier = setNewDeviceIdentifierInResponse(res);
  }
  return deviceIdentifier;
};

export const getDeviceIdentifierFromRequest = (req: Request) => {
  return req.cookies?.[DEVICE_IDENTIFIER_COOKIE_NAME] ?? null;
};

export const setNewDeviceIdentifierInResponse = (res: Response) => {
  const deviceIdentifier = generateNewDeviceIdentifier();
  res.cookie(DEVICE_IDENTIFIER_COOKIE_NAME, deviceIdentifier, {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
  });
  return deviceIdentifier;
};

const generateNewDeviceIdentifier = () => {
  return randomBytes(DEVICE_IDENTIFIER_LENGTH / 2).toString("hex");
};
