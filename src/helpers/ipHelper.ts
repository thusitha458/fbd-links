import { Request } from "express";

export const getIpFromRequest = (req: Request) => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const cleanIp = ip.replace(/^::ffff:/, "");

  return cleanIp;
};
