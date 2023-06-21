declare interface IPageParams {
  page: number;
  size: number;
  sort_order: string;
  sort_field: string;
  status?: string;
}

declare interface IPageResponse<T> {
  page: number;
  size: number;
  total: number;
  rows: T[];
}
