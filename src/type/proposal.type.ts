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

export enum VoteType {
  Open = 'open',
  Closed = 'close',
}
type VoteOption = {
  html: string;
  percent: number;
  voters: number;
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
  slug: string;
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
  polls: Poll[];
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
  name: string;
};
