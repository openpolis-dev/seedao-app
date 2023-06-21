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
  id: string;
  action: ApplicationType;
  requester: string;
  state: ApplicationStatus;
  rejected_reason: string;
  created_at: number;
  updated_at: number;
  detailed_data?: string;
  logs: IApplicationLog[];
}
