"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitorService = void 0;
/**
 * Service for tracking website visitors
 */
class VisitorService {
    constructor() {
        this.visitors = [];
    }
    /**
     * Add a new visitor to the tracking system
     * @param visitor The visitor information to add
     */
    addVisitor(visitor) {
        this.visitors.push(visitor);
        console.log(`Visitor recorded: ${visitor.ip}:${visitor.port} at ${visitor.timestamp}`);
    }
    /**
     * Get all recorded visitors
     * @returns Array of all visitors
     */
    getVisitors() {
        return this.visitors;
    }
    /**
     * Get count of unique visitors (by IP address)
     * @returns Number of unique visitors
     */
    getUniqueVisitorCount() {
        const uniqueIps = new Set(this.visitors.map(v => v.ip));
        return uniqueIps.size;
    }
    /**
     * Clear all visitor records
     */
    clearVisitors() {
        this.visitors = [];
    }
}
// Export a singleton instance
exports.visitorService = new VisitorService();
// Export the service class itself in case it needs to be extended
exports.default = VisitorService;
//# sourceMappingURL=visitorService.js.map