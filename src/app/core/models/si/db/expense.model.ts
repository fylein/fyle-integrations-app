export type Expense = {
  amount: number;
  approved_at: Date;
  category: string;
  claim_number: string;
  cost_center: string;
  created_at: Date;
  currency: string;
  employee_email: string;
  expense_created_at: Date;
  expense_id: string;
  expense_number: string;
  expense_updated_at: Date;
  exported: boolean;
  foreign_amount: number;
  foreign_currency: string;
  fund_source: string;
  org_id: string;
  id: number;
  project: string;
  purpose: string;
  reimbursable: boolean;
  report_id: string;
  settlement_id: string;
  payment_number: string;
  spent_at: Date;
  state: string;
  sub_category: string;
  updated_at: Date;
  vendor: string;
  billable: boolean;
  verified_at: Date;
  paid_on_qbo: boolean;
  // Having any here is ok, since different expense have different properties
  custom_properties: any[];
};

export interface ExpenseList {
  expenseID: string;
  amount?: [number, string];
  merchant?: string;
  category?: string;
  fyleUrl: string;
  expenseType?: 'Credit Card' | 'Reimbursable';
  name?: [string, string];
  fundSource?: string;
}
