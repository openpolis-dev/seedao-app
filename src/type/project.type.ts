export interface budgetObj {
  name: string;
  totalAmount: string | number;
}
export interface IBaseProject {
  logo: string;
  name: string;
  sponsors: string[];
  members: string[];
  proposals: string[];
  budgets: budgetObj[];
}
