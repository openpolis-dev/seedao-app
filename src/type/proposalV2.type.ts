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
  username: string;
  created_at: string;
  arweave: string;
  post_type: 0 | 1;
  post_id: number;
  id: number;
}

export interface IProposal extends ISimpleProposal {
  reviewer: string;
  applicant_avatar: string;
  proposal_category_id: number;
  content_blocks: IContentBlock[];
  reject_reason: string;
  is_rejected: string;
  reject_ts: number;
  arweave: string;
  comments: any[];
  comment_count: number;
  histories: {
    count: number;
    lists: IProposalEditHistoy[];
  };
}
