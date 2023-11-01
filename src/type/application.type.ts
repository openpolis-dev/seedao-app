export enum ApplicationType {
  CloseProject = 'close_project',
  NewReward = 'new_reward',
}

export enum ApplicationEntity {
  Project = 'project',
  Guild = 'guild',
}

export enum ApplicationStatus {
  All = '',
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
  budget_source: string;
  status: ApplicationStatus;
  submitter_wallet: string;
  target_user_wallet: string;
  reviewer_wallet: string;
  transaction_ids: string;
  created_at: number;
  detailed_type: string;
  comment: string;
  // NEW FIELDS
  season_name: string;
  amount: string;
  asset_name: string;
  // TO BE REMOVED
  token_amount: number;
  credit_amount: number;
  submitter_name: string;
  reviewer_name: string;
}

export interface IApplicationDisplay extends IApplication {
  created_date: string;
  transactions?: string[];
  // NEW FIELDS
  asset_display?: string;
  submitter_name: string;
  reviewer_name: string;
  receiver_name?: string;
}

export interface IApplicationBundleRecord {
  wallet: string;
  asset_name: string;
  asset_amount: number;
}

export interface IApplicantBundle {
  id: number;
  comment: string;
  records: IApplicationDisplay[];
  submit_date: number;
  season_name: string;
  status: ApplicationStatus;
  submitter: string;
  entity: { id: number; name: string; type: string };
  assets: { name: string; amount: string }[];
}

export interface IApplicantBundleDisplay extends IApplicantBundle {
  created_date: string;
  submitter_name: string;
  assets_display: string[];
}

export interface ISeason {
  id: number;
  name: string;
  start_date: string;
  end_at: string;
}
