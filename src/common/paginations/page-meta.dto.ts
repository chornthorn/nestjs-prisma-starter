import { PageMetaDtoParameters } from './page-meta-dto-parameters.interface';

export class PaginateMetaDto {
  readonly current_page: number;
  readonly item_per_page: number;
  readonly item_count: number;
  readonly page_count: number;
  readonly has_previous_page: boolean;
  readonly has_next_page: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.current_page = Number(pageOptionsDto.page);
    this.item_per_page = Number(pageOptionsDto.take);
    this.item_count = itemCount;
    this.page_count = Math.ceil(this.item_count / this.item_per_page);
    this.has_previous_page = this.current_page > 1;
    this.has_next_page = this.current_page < this.page_count;
  }
}
