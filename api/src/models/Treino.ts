import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';

export interface TreinoAttributes {
  id?: number;
  titulo: string;
  divisao: string;
  identificador: string;
  user_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Treino extends Model<TreinoAttributes> implements TreinoAttributes {
  public id!: number;
  public titulo!: string;
  public divisao!: string;
  public identificador!: string;
  public user_id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Treino.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  divisao: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  identificador: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Treino',
  tableName: 'treinos'
});

User.hasMany(Treino, { foreignKey: 'user_id' });
Treino.belongsTo(User, { foreignKey: 'user_id' });