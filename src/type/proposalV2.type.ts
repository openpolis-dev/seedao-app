export enum ProposalState {
  PendingSubmit = 'pending_submit',
  Draft = 'draft',
  Approved = 'approved',
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
  category_name: string;
  state: ProposalState;
  create_ts: number;
}

export interface IContentBlock {
  title: string;
  content: string;
}

export interface IProposal extends ISimpleProposal {
  reviewer: string;
  proposal_category_id: number;
  content_block: IContentBlock[];
}