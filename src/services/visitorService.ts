/**
 * Interface representing a visitor to the website
 */
export interface Visitor {
  ip: string;
  port: number;
  timestamp: Date;
  path?: string;
  code?: string;
}

/**
 * Service for tracking website visitors
 */
class VisitorService {
  private visitors: Visitor[] = [];

  /**
   * Add a new visitor to the tracking system
   * @param visitor The visitor information to add
   */
  public addVisitor(visitor: Visitor): void {
    this.visitors.push(visitor);
    const codeInfo = visitor.code ? ` with code: ${visitor.code}` : '';
    console.log(`Visitor recorded: ${visitor.ip}:${visitor.port} at ${visitor.timestamp}${codeInfo}`);
  }

  /**
   * Get all recorded visitors
   * @returns Array of all visitors
   */
  public getVisitors(): Visitor[] {
    return this.visitors;
  }

  /**
   * Get count of unique visitors (by IP address)
   * @returns Number of unique visitors
   */
  public getUniqueVisitorCount(): number {
    const uniqueIps = new Set(this.visitors.map(v => v.ip));
    return uniqueIps.size;
  }

  /**
   * Clear all visitor records
   */
  public clearVisitors(): void {
    this.visitors = [];
  }
}

// Export a singleton instance
export const visitorService = new VisitorService();

// Export the service class itself in case it needs to be extended
export default VisitorService;
