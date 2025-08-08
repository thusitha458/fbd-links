import { DataTypes, Model } from "sequelize";

import { sequelize } from "../config/database";

class AndroidRecord extends Model {}

AndroidRecord.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ip: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    providerCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    deviceIdentifier: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "android_records",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: false,
    indexes: [
      {
        fields: ["deviceIdentifier"],
      },
      {
        fields: ["ip", "createdAt"],
      }
    ],
  }
);

export default AndroidRecord;