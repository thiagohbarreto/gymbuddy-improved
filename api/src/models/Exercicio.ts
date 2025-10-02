import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Treino } from './Treino';

export interface ExercicioAttributes {
  id?: number;
  nome: string;
  series: number;
  repeticoes: string;
  peso?: number;
  descanso?: number;
  observacoes?: string;
  treino_id: number;
  ordem: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Exercicio extends Model<ExercicioAttributes> implements ExercicioAttributes {
  public id!: number;
  public nome!: string;
  public series!: number;
  public repeticoes!: string;
  public peso?: number;
  public descanso?: number;
  public observacoes?: string;
  public treino_id!: number;
  public ordem!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Exercicio.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  series: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  repeticoes: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  peso: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true
  },
  descanso: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  treino_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Treino,
      key: 'id'
    }
  },
  ordem: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  sequelize,
  modelName: 'Exercicio',
  tableName: 'exercicios'
});

Treino.hasMany(Exercicio, { foreignKey: 'treino_id', as: 'exercicios' });
Exercicio.belongsTo(Treino, { foreignKey: 'treino_id' });