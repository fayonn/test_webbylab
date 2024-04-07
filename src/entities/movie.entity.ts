import {
  AllowNull,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Index,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { MovieActor } from './associations/movie-actor.entity';
import { Actor } from './actor.entity';

export enum MovieFormat {
  VHS = 'VHS',
  DVD = 'DVD',
  BluRay = 'Blu-ray',
}

@Table({
  tableName: 'movies',
  modelName: 'Movie',
})
export class Movie extends Model {
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
  declare title: string;

  @AllowNull(false)
  @Column({ type: DataType.SMALLINT })
  declare year: number;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(MovieFormat)) })
  declare format: MovieFormat;

  @BelongsToMany(() => Actor, () => MovieActor)
  declare actors: Actor[];

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt?: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt?: Date;
}
