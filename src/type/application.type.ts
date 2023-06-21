export enum ApplicationType {
  CloseProject = 'close_project',
  NewReward = 'new_reward',
}

export enum ApplicationEntity {
  Project = 'project',
  Guild = 'guild',
}

export enum ApplicationStatus {
  Open = 'open',
  Approved = 'approved',
  Rejected = 'rejected',
  Processing = 'processing',
  Completed = 'completed',
}

export interface IApplicationLog {
  id: string;
  timestamp: number;
  operation: 'approve' | 'reject' | 'complete' | 'process';
  operator: string;
  pre_state: ApplicationStatus;
  post_state: ApplicationStatus;
  extra_data: string;
}

export interface IApplication {
  application_id: number;
  entity_name: ApplicationEntity;
  target_user_wallet: string;
  token_amount: number;
  creadit_amount: number;
  budget_source: string;
  status: ApplicationStatus;
  submitter_wallet: string;
  submitter_name: string;
  reviewer_wallet: string;
  reviewer_name: string;
  transaction_ids: string;
  created_at: number;
  // detailed_data?: string;
  // logs: IApplicationLog[];
}

export interface IApplicationDisplay extends IApplication {
  created_date: string;
}
