const ONE_HOUR_IN_MS = 60 * 60 * 1000;

export interface Record {
  ip: string;
  timestamp: Date;
  providerCode: string;
  deviceIdentifier: string;
}

class StorageService {
  private androidRecords: Record[] = [];
  private iosRecords: Record[] = [];

  constructor() {
    setInterval(() => this.cleanUpOldRecords(), ONE_HOUR_IN_MS);
  }

  public storeAndroidRecord(record: Record) {
    this.androidRecords = this.androidRecords.filter(it => it.deviceIdentifier !== record.deviceIdentifier);
    this.androidRecords.push(record);
  }

  public retrieveAndroidRecord(ip: string) {
    return this.retrieveRecord(ip, this.androidRecords);
  }

  public storeIOSRecord(record: Record) {
    this.iosRecords = this.iosRecords.filter(it => it.deviceIdentifier !== record.deviceIdentifier);
    this.iosRecords.push(record);
  }

  public retrieveIOSRecord(ip: string) {
    return this.retrieveRecord(ip, this.iosRecords);
  }

  private retrieveRecord(ip: string, records: Record[]) {
    const indexesOfSameIp = records.map((it, index) => it.ip === ip ? index : -1).filter(index => index !== -1);

    if (indexesOfSameIp.length > 0) {
      const indexOfLatestRecord = indexesOfSameIp.reduce((latest, current) => {
        return records[current].timestamp > records[latest].timestamp ? current : latest;
      }, indexesOfSameIp[0]);

      const record = records[indexOfLatestRecord];
      records.splice(indexOfLatestRecord, 1);
      return record;
    }

    return null;
  }

  private cleanUpOldRecords() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    this.androidRecords = this.androidRecords.filter(it => it.timestamp >= oneDayAgo);
    this.iosRecords = this.iosRecords.filter(it => it.timestamp >= oneDayAgo);
  }

  public getVisitors() {
    // Only to support older versions of the app, will remove in future
    return [...this.androidRecords, ...this.iosRecords];
  }
}

export const storageService = new StorageService();

export default StorageService;
