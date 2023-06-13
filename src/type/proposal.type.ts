interface IBaseCategory {
  category_id: number;
  id: number;
  group_id: number;
  name: string;
  thread_count: number;
  post_count: number;
  can_see: 1 | 0;
}

export interface ICategory extends IBaseCategory {
  children: IBaseCategory[];
}

export interface IBaseProposal {
  category_name: string;
  id: string;
  title: string;
  is_pin: string;
  is_delete: string;
  first_post: {
    id: number;
    content: string;
  };
  likes_count: number;
  posts_count: number;
  user: {
    photo_url: string;
    user_title: {
      name: string;
      background: '#2ecc71';
    };
    username: string;
  };
}
