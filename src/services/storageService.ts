import AndroidRecord from "../models/AndroidRecord";
import IOSRecord from "../models/IOSRecord";
import { Op } from "sequelize";

const ONE_HOUR_IN_MS = 60 * 60 * 1000;

export interface RecordDto {
  ip: string;
  providerCode: string;
  deviceIdentifier: string;
}

class StorageService {
  constructor() {
    setInterval(() => this.cleanUpOldRecords(), ONE_HOUR_IN_MS);
  }

  public async storeAndroidRecord(record: RecordDto) {
    await AndroidRecord.destroy({
      where: { deviceIdentifier: record.deviceIdentifier },
    });

    await AndroidRecord.create({
      ip: record.ip,
      providerCode: record.providerCode,
      deviceIdentifier: record.deviceIdentifier,
      createdAt: new Date().getTime(),
    });
  }

  public async retrieveAndroidRecord(ip: string) {
    const records = await AndroidRecord.findAll({
      where: { ip, createdAt: { [Op.gte]: this.getOneDayAgo() } },
      order: [["createdAt", "DESC"]],
      limit: 1,
    });

    return records.length > 0 ? recordToDto(records[0]) : null;
  }

  public async storeIOSRecord(record: RecordDto) {
    await IOSRecord.destroy({
      where: { deviceIdentifier: record.deviceIdentifier },
    });

    await IOSRecord.create({
      ip: record.ip,
      providerCode: record.providerCode,
      deviceIdentifier: record.deviceIdentifier,
      createdAt: new Date().getTime(),
    });
  }

  public async retrieveIOSRecord(ip: string) {
    const records = await IOSRecord.findAll({
      where: { ip, createdAt: { [Op.gte]: this.getOneDayAgo() } },
      order: [["createdAt", "DESC"]],
      limit: 1,
    });

    return records.length > 0 ? recordToDto(records[0]) : null;
  }

  private cleanUpOldRecords() {
    const oneDayAgo = this.getOneDayAgo();

    AndroidRecord.destroy({
      where: {
        createdAt: {
          [Op.lt]: oneDayAgo,
        },
      },
    }).catch(() => console.warn("Error cleaning up old Android records"));

    IOSRecord.destroy({
      where: {
        createdAt: {
          [Op.lt]: oneDayAgo,
        },
      },
    }).catch(() => console.warn("Error cleaning up old iOS records"));
  }

  private getOneDayAgo() {
    const now = new Date();
    return now.getTime() - 24 * 60 * 60 * 1000;
  }
}

export const storageService = new StorageService();

export default StorageService;

const recordToDto = (record: AndroidRecord | IOSRecord): RecordDto => {
  return {
    ip: record.getDataValue("ip"),
    providerCode: record.getDataValue("providerCode"),
    deviceIdentifier: record.getDataValue("deviceIdentifier"),
  };
};
