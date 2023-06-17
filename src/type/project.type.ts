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
export interface IBaseProject {
  logo: string;
  name: string;
  sponsors: string[];
  members: string[];
  proposals: string[];
  budgets: budgetObj[];
}

export interface ReTurnProject {
  created_at: string;
  id: number;
  logo: string;
  members: string[];
  name: string;
  proposals: string[];
  sponsors: string[];
  status: string;
  updated_at: string;
  budgets?: budgetObj[];
}

export interface BudgetObj {
  id: number;
  totalAmount: number;
}
export interface InfoObj {
  logo: string;
  name: string;
}
