import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import bcrypt from 'bcryptjs';

export interface UserAttributes {
  id?: number;
  nome: string;
  email: string;
  password: string;
  peso?: number;
  altura?: number;
  objetivo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public nome!: string;
  public email!: string;
  public password!: string;
  public peso?: number;
  public altura?: number;
  public objetivo?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  peso: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  altura: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  objetivo: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  hooks: {
    beforeCreate: async (user: User) => {
      user.password = await bcrypt.hash(user.password, 12);
    },
    beforeUpdate: async (user: User) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
});