import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';

class Device extends Model {
  declare id: number;
  declare name: string | null;
  declare phone: string | null;
  declare class: string | null;
  declare os: string;
  declare ip: string;
  declare mac: string | null;
  declare isConnected: boolean;
}

Device.init(
  {
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    class: DataTypes.STRING,
    os: DataTypes.STRING,
    ip: {
      type: DataTypes.STRING,
      unique: true,
    },
    mac: DataTypes.STRING,
    isConnected: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Device',
    timestamps: true,
  }
);

export default Device;