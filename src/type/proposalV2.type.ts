export enum ProposalState {
  PendingSubmit = 'pending_submit',
  Draft = 'draft',
  Withdrawn = 'withdrawn',
  Approved = 'approved',
  Rejected = 'rejected',
  Voting = 'voting',
  VotingPassed = 'voting_passed',
  VotingFailed = 'voting_failed',
}

export interface IBaseCategory {
  id: number;
  parent_id: number;
  metaforo_id: number;
  name: string;
  has_perm?: boolean;
}

export interface ISimpleProposal {
  id: number;
  title: string;
  applicant: string;
  applicant_avatar: string;
  category_name: string;
  state: ProposalState;
  create_ts: number;
}

export interface IContentBlock {
  title: string;
  content: string;
}

export interface IProposalEditHistoy {
  create_ts: number;
  title: string;
  wallet: string;
  arweave: string;
}

export enum VoteType {
  Open = 'open',
  Closed = 'close',
  Waite = 'waite',
}

export type VoteOption = {
  html: string;
  percent: number;
  voters: number;
  id: number;
  is_vote: 0 | 1; // 0: not voted, 1: voted
};

export interface Poll {
  id: number;
  title: string;
  address: string;
  alias?: string;
  arweave?: string;
  token_id: number;
  status: VoteType;
  leftTime: string;
  options: VoteOption[];
  poll_start_at: string;
  totalVotes: number;
  is_vote: 0 | 1; // 0: not voted, 1: voted
}

export interface IComment {
  children: IComment[];
  content: string;
  metaforo_post_id: number;
  proposal_arweave_hash: string;
  proposal_title: string;
  reply_metaforo_post_id: number;
  wallet: string;
  created_ts: number;
  avatar: string;
}

export interface ICommentDisplay extends IComment {
  children: ICommentDisplay[];
  bindIdx: number;
  userName?: string;
}

export interface IProposal extends ISimpleProposal {
  reviewer: string;
  applicant_avatar: string;
  proposal_category_id: number;
  content_blocks: IContentBlock[];
  reject_metaforo_comment_id: number;
  reject_reason: string;
  is_rejected: string;
  template_id: number | string;
  reject_ts: number;
  arweave: string;
  comments: ICommentDisplay[];
  components: any;
  comment_count: number;
  votes: Poll[];
  histories: {
    total_count: number;
    lists: IProposalEditHistoy[];
  };
}

export interface IActivity {
  action_ts: number;
  metaforo_action: string;
  proposal_id: number;
  target_title: string;
  wallet: string;
  reply_to_wallet: string;
}
