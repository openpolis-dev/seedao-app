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

type ProposalTag = {
  id: number;
  name: string;
};

export interface IBaseProposal {
  category_name: string;
  category_index_id: number;
  id: string;
  thread_id: number; // Primary key
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
      background: string;
    };
    username: string;
  };
  updated_at: string;
  tags: ProposalTag[];
  user_title?: {
    name: string;
    background: string;
  };
}
