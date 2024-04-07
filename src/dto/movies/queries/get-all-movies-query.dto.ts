import { IsIn, IsOptional, Min } from 'class-validator';
import { Expose } from 'class-transformer';
import { TransformToIntQueryParam } from '../../../utils/validator.utils';

export class GetAllMoviesQueryDto {
  @IsOptional()
  @Expose()
  actor: string;

  @IsOptional()
  @Expose()
  title: string;

  @IsOptional()
  @Expose()
  search: string;

  @IsOptional()
  @IsIn(['id', 'title', 'year'])
  @Expose()
  sort: 'id' | 'title' | 'year' = 'id';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  @Expose()
  order: 'ASC' | 'DESC' = 'ASC';

  @Min(0)
  @TransformToIntQueryParam()
  @IsOptional()
  @Expose()
  limit: number = 20;

  @Min(0)
  @TransformToIntQueryParam()
  @IsOptional()
  @Expose()
  offset: number = 0;
}
