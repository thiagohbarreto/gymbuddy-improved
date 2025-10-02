import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';
import { Treino } from './Treino';

export interface HistoricoTreinoAttributes {
  id?: number;
  user_id: number;
  treino_id: number;
  data_execucao: Date;
  tempo_total?: number;
  observacoes?: string;
  volume_total?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class HistoricoTreino extends Model<HistoricoTreinoAttributes> implements HistoricoTreinoAttributes {
  public id!: number;
  public user_id!: number;
  public treino_id!: number;
  public data_execucao!: Date;
  public tempo_total?: number;
  public observacoes?: string;
  public volume_total?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

HistoricoTreino.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  treino_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Treino,
      key: 'id'
    }
  },
  data_execucao: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  tempo_total: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  volume_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'HistoricoTreino',
  tableName: 'historico_treinos'
});

User.hasMany(HistoricoTreino, { foreignKey: 'user_id' });
HistoricoTreino.belongsTo(User, { foreignKey: 'user_id' });
Treino.hasMany(HistoricoTreino, { foreignKey: 'treino_id' });
HistoricoTreino.belongsTo(Treino, { foreignKey: 'treino_id' });