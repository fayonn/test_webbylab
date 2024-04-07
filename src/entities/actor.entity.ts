import { AllowNull, BelongsToMany, Column, CreatedAt, DataType, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { Movie } from './movie.entity';
import { MovieActor } from './associations/movie-actor.entity';

@Table({
  tableName: 'actors',
  modelName: 'Actor',
  indexes: [
    {
      fields: ['full_name'],
    },
  ],
})
export class Actor extends Model {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  declare id: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    field: 'full_name',
    unique: true,
  })
  declare fullName: string;

  @BelongsToMany(() => Movie, () => MovieActor)
  declare movies: Movie[];

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;
}
