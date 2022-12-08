import { IsArray, IsNumber, IsString } from 'class-validator';
import { PaginateMetaDto } from './page-meta.dto';

export class PaginateDto<T> {
  @IsNumber()
  status_code: number = 200;

  @IsString()
  status_message: string = 'OK';

  @IsArray()
  readonly data: T[];

  readonly paginate_meta: PaginateMetaDto;

  constructor(
    data: T[],
    meta: PaginateMetaDto,
    status_code?: number,
    status_message?: string,
  ) {
    this.data = data;
    this.paginate_meta = meta;
    this.status_code = status_code || this.status_code;
    this.status_message = status_message || this.status_message;
  }
}
