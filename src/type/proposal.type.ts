interface IBaseCategory {
  category_id: number;
  id: number;
  group_id: number;
  name: string;
  thread_count: number;
  post_count: number;
  can_see: 1 | 0;
}

export interface ISubCategory extends IBaseCategory {}

export interface ICategory extends IBaseCategory {
  children: ISubCategory[];
}
