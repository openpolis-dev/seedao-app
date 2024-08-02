export enum ProposalState {
  PendingSubmit = 'pending_submit',
  Draft = 'draft',
  Withdrawn = 'withdrawn',
  Approved = 'approved',
  Rejected = 'rejected',
  Voting = 'voting',
  VotingPassed = 'vote_passed',
  VotingFailed = 'vote_failed',
  PendingExecution = 'pending_execution',
  Executed = 'executed',
  ExecutionFailed = 'execution_failed',
  Vetoed = 'vetoed',
}

export interface IBaseCategory {
  id: number;
  parent_id: number;
  metaforo_id: number;
  name: string;
  has_perm?: boolean;
}

export interface ICategory {
  category_id: number;
  category_name: string;
}

export interface ICategoryWithTemplates extends ICategory {
  category_display_index: number;
  templates: ITemplate[];
}

export interface ISimpleProposal {
  id: number;
  title: string;
  applicant: string;
  applicant_avatar: string;
  category_name: string;
  state: ProposalState;
  create_ts: number;
  sip?: number;
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
  close_at: string;
  totalVotes: number;
  show_type?:number;
  is_vote: 0 | 1; // 0: not voted, 1: voted
}

export interface IComment {
  children: IComment[];
  content: string;
  metaforo_post_id: number;
  proposal_arweave_hash: string;
  proposal_title: string;
  proposal_ts: number;
  reply_metaforo_post_id: number;
  wallet: string;
  created_ts: number;
  avatar: string;
  is_rejected?: boolean;
}

export interface ICommentDisplay extends IComment {
  children: ICommentDisplay[];
  bindIdx: number;
  userName?: string;
  deleted?: 1 | 0;
}

export type VoteGateType = {
  name: string;
  contract_addr: string;
  token_id: number;
};

// 0: no vote
// 1: endorsement opposition
// 2: predefined percentage
// 98: custom vote options
// 99: custom vote options
export type VoteOptionType = 0 | 1 | 2 | 99 | 98;

export interface IProposal extends ISimpleProposal {
  reviewer: string;
  applicant_avatar: string;
  proposal_category_id: number | undefined;
  vote_type?: VoteOptionType;
  content_blocks: IContentBlock[];
  reject_metaforo_comment_id: number;
  reject_reason: string;
  is_rejected: string;
  is_based_on_custom_template: boolean | undefined;
  template_id: number | string;
  reject_ts: number;
  vetoed?: any;
  arweave: string;
  comments: ICommentDisplay[];
  components: any;
  comment_count: number;
  votes: Poll[];
  os_vote_options?: any[];
  vote_gate: VoteGateType;
  histories: {
    total_count: number;
    lists: IProposalEditHistoy[];
  };
  template_name?: string;
  execution_ts?: number;
  publicity_ts?: number;
  associated_project_budgets?: any[];
}

export interface IActivity {
  action_ts: number;
  metaforo_action: string;
  proposal_id: number;
  target_title: string;
  wallet: string;
  reply_to_wallet: string;
}

export interface ITemplate {
  id: number;
  vote_type?: number;
  name?: string;
  schema?: string;
  rule_description?: string;
  screenshot_uri?: string;
  components?: any[];
  has_perm_to_use?: boolean;
  is_instant_vote?: boolean;
  is_closing_project?: boolean;
  display_index?: number;
}
