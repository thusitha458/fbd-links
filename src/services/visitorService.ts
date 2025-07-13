export interface Visitor {
  ip: string;
  timestamp: Date;
  path?: string;
  code?: string;
}

class VisitorService {
  private visitors: Visitor[] = [];

  public addVisitor(visitor: Visitor): void {
    this.visitors.push(visitor);
  }

  public getVisitors(): Visitor[] {
    return this.visitors;
  }

  public clearVisitors(): void {
    this.visitors = [];
  }
}

export const visitorService = new VisitorService();

export default VisitorService;
