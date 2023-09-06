import { TaskLogState, TaskLogType } from "../../enum/enum.model";

export type SageIntacctError = {
  expense_group_id: number;
  short_description: string;
  long_description: string;
  type: string;
};

export type Task = {
  id: number;
  workspace: number;
  type: TaskLogType;
  task_id: string;
  expense_group: number;
  bill: number;
  expense_report: number;
  charge_card_transaction: number;
  journal_entry: number;
  ap_payment: number;
  sage_intacct_reimbursement: number;
  status: TaskLogState;
  detail: any;
  sage_intacct_errors: SageIntacctError[];
  created_at: Date;
  updated_at: Date;
};

export type TaskResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Task[];
};

export type TaskGetParams = {
  limit?: number;
  offset?: number;
  status?: string[];
  expense_group_id?: number[];
  type?: string[];
};