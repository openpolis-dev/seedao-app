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
  name: 'USDT' | 'SCR';
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
}

export interface IBaseProject {
  logo: string;
  name: string;
  sponsors: string[];
  members: string[];
  proposals: string[];
  budgets: IBaseBudgetItem[];
}

export interface ReTurnProject {
  created_at: string;
  id: number;
  logo: string;
  desc: string;
  members: string[];
  name: string;
  proposals: string[];
  sponsors: string[];
  status: ProjectStatus;
  updated_at: string;
  budgets: IBudgetItem[];
}

export interface InfoObj {
  logo: string;
  name: string;
}

export interface ExcelObj {
  address: string;
  points: string;
  token: string;
  content: string;
  note: string;
}
