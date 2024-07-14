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

interface CommentUser {
  id: number;
  photo_url: string;
  username: string;
  is_nft: number;
}

export type UserTitleType = {
  name: string;
  color: string;
  background: string;
};

export enum VoteType {
  Open = 'open',
  Closed = 'close',
}
type VoteOption = {
  html: string;
  percent: number;
  voters: number;
  id: number;
  weights?:number;
};

export interface Poll {
  title: string;
  address: string;
  alias?: string;
  arweave?: string;
  token_id: number;
  status: VoteType;
  leftTime: string;
  options: VoteOption[];
  totalVotes: number;
  is_vote: 0 | 1; // 0: not voted, 1: voted
}

type ProposalTag = {
  id: number;
  name: string;
};

export type EditHistoryType = {
  username: string;
  created_at: string;
  arweave: string;
  post_type: 0 | 1;
};

export interface IBaseProposal {
  category_name: string;
  category_index_id: number;
  id: string;
  thread_id: number; // Primary key
  title: string;
  is_pin: string;
  is_delete: string;
  slug: string;
  first_post: {
    id: number;
    content: string;
  };
  likes_count: number;
  posts_count: number;
  user: {
    photo_url: string;
    user_title: UserTitleType;
    username: string;
  };
  updated_at: string;
  tags: ProposalTag[];
  user_title?: UserTitleType;
  polls: Poll[];
  posts: any[];
  edit_history: {
    count: number;
    lists: EditHistoryType[];
  };
}

export enum ProposalStatus {
  Draft = 'draft',
  Rejected = 'rejected',
  WithDrawn = 'withdrawn',
  Approved = 'approved',
  Voting = 'voting',
  End = 'end',
}

export type ProposalType = {
  id: string;
  name: string;
};

export const PROPOSAL_TYPES: ProposalType[] = [
  {
    id: '',
    name: 'Proposal.ThreeLayerType',
  },
  {
    id: '',
    name: 'Proposal.TwoLayerType',
  },
  {
    id: '',
    name: 'Proposal.OneLayerType',
  },
  {
    id: '',
    name: 'Proposal.CityhallType',
  },
  {
    id: '',
    name: 'Proposal.NodesType',
  },
];

export enum PROPOSAL_TIME {
  LATEST = 'latest',
  OLDEST = 'oldest',
}

export type ProposalTemplateType = {
  id: number;
  name?: string;
  schema?: string;
  vote_type?: number;
  screenshot_uri?: string;
  components?: any[];
};

export interface PostDataType {
  id: number;
  created_at: string;
  updated_at: string;
  content: string;
  parent_id: number;
  deleted: number;
  reply_pid: number;
  reply_user: CommentUser | null;
  user: CommentUser;
  user_title: UserTitleType;
  children: { posts: PostDataType[] };
}
