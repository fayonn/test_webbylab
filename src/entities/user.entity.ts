import { AllowNull, Column, CreatedAt, DataType, Index, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table({
  tableName: 'users',
  modelName: 'User',
})
export class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  declare id: number;

  @Index
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  declare email: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  declare password: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  declare confirmPassword: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;
}
