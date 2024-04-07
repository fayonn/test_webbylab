import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Movie } from '../movie.entity';
import { Actor } from '../actor.entity';

@Table({
  tableName: 'movies_actors',
  modelName: 'MovieActor',
  timestamps: false,
})
export class MovieActor extends Model {
  @ForeignKey(() => Movie)
  @Column({ field: 'movie_id' })
  declare movieId: number;

  @ForeignKey(() => Actor)
  @Column({ field: 'actor_id' })
  declare actorId: number;
}
