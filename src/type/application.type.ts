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
  transaction_ids: string;
  detailed_type: string;
  comment: string;
  season_name: string;
  amount: string;
  asset_name: string;
  create_ts: number;
  update_ts: number;
  app_bundle_comment: string;
  // target_user
  target_user_wallet: string;
  target_user_avatar: string;
  // applicant
  apply_ts: number;
  applicant_wallet: string;
  applicant_avatar: string;
  // reviewer/auditor
  review_ts: number;
  reviewer_wallet: string;
  reviewer_avatar: string;
  process_ts: number;
  // issuer
  complete_ts: number;
  completer_wallet: string;
  completer_avatar: string;
  // TO BE REMOVED
  token_amount: number;
  credit_amount: number;
  submitter_name: string;
  reviewer_name: string;
  entity_id: string;
  entity_type: string;
}

export interface IApplicationDisplay extends IApplication {
  created_date: string;
  review_date?: string;
  process_date?: string;
  complete_date?: string;
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
  apply_ts: number;
  season_name: string;
  state: ApplicationStatus;
  applicant: string;
  entity: { id: number; name: string; type: string };
  assets: { name: string; amount: string }[];
}

export interface IApplicantBundleDisplay extends IApplicantBundle {
  created_date: string;
  submitter_name?: string;
  assets_display: string[];
}

export interface ISeason {
  id: number;
  name: string;
  start_date: string;
  end_at: string;
}
