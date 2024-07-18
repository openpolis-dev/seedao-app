export interface budgetObj {
  name: string;
  totalAmount?: string | number;
  total_amount?: string | number;
  remain_amount?: string | number;
  created_at?: string;
  updated_at?: string;
  id?: number;
  project_id?: number;
}

export enum BudgetType {
  Credit = 'credit',
  Token = 'token',
}

export interface IBaseBudgetItem {
  name: 'USDC' | 'SCR' | 'ETH';
  total_amount: number;
  budget_type: BudgetType;
}

export interface IBudgetItem extends IBaseBudgetItem {
  id: number;
  remain_amount: number;
  used_amount: number;
  created_at: number;
  updated_at: number;
  type: BudgetType;
}

export enum ProjectStatus {
  Open = 'open',
  Pending = 'pending_close',
  Closed = 'closed',
  Closing = 'closing',
  CloseFailed = 'close_failed',
}

export interface IBaseProject {
  logo: string;
  name: string;
  sponsors: string[];
  members: string[];
  proposals: string[];
  budgets?: IBaseBudgetItem[];
  desc: string;
  intro: string;
}

export interface IProject {
  logo: string;
  desc: string;
  name: string;
  ApprovalLink: string;
  OverLink: string;
  Category: string;
  ContantWay: string;
  Deliverable: string;
  OfficialLink: string;
  PlanTime: string;
  SIP: string;
  sponsors: string[];
  budgets?: [{ name: string; total_amount: number }];
  scr_budget?:string|number;
  usdc_budget?:string|number;
}

export interface IProjectDisplay extends IProject {
  id: number;
  create_ts: number;
  update_ts: number;
}

export interface IGuild {
  logo: string;
  desc: string;
  name: string;
  ContantWay: string;
  OfficialLink: string;
  sponsors: string[];
}

export interface IGuildDisplay extends IGuild {
  id: number;
  create_ts: number;
  update_ts: number;
}

export interface ReturnBudget {
  id: number;
  name: string;
  created_ts: string;
  updated_ts: string;
}

export interface ReTurnProject {
  create_ts: number;
  id: number;
  logo: string;
  desc: string;
  members: string[];
  name: string;
  proposals: string[];
  sponsors: string[];
  status: ProjectStatus;
  updated_at: string;
  user?: any;
  budgets: IBudgetItem[];
  intro: string;
}

export interface InfoObj {
  logo: string;
  name: string;
  desc: string;
  intro: string;
}

export interface ExcelObj {
  address: string;
  points: string;
  token: string;
  content: string;
  note: string;
}

export interface IExcelObj {
  address: string;
  amount: string;
  assetType: string;
  content: string;
  note: string;
}
