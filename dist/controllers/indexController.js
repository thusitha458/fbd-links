"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatus = exports.home = exports.getVisitors = void 0;
const visitorService_1 = require("../services/visitorService");
/**
 * Get all visitors
 */
const getVisitors = (req, res) => {
    const visitors = visitorService_1.visitorService.getVisitors();
    res.json({ visitors });
};
exports.getVisitors = getVisitors;
/**
 * Home page controller
 */
const home = (req, res) => {
    // Extract IP address and port from request
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    // Express may include IPv6 prefix "::ffff:" which we can remove for cleaner logs
    const cleanIp = ip.replace(/^::ffff:/, '');
    const port = req.socket.remotePort || 0;
    // Record the visitor
    visitorService_1.visitorService.addVisitor({
        ip: cleanIp,
        port: port,
        timestamp: new Date(),
        path: req.path
    });
    res.send('Hello World!');
};
exports.home = home;
/**
 * API status controller
 */
const getStatus = (req, res) => {
    const visitorCount = visitorService_1.visitorService.getVisitors().length;
    const uniqueVisitors = visitorService_1.visitorService.getUniqueVisitorCount();
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
exports.getStatus = getStatus;
//# sourceMappingURL=indexController.js.map