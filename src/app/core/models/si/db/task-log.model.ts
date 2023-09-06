import { TaskLogState, TaskLogType } from "../../enum/enum.model";

export type SageIntacctError = {
  expense_group_id: number;
  short_description: string;
  long_description: string;
  type: string;
};

export type Task = {
  bill: number;
  cheque: number;
  created_at: Date;
  credit_card_purchase: number;
  detail: any;
  quickbooks_errors: SageIntacctError[];
  expense_group: number;
  id: number;
  journal_entry: number;
  bill_payment: number;
  status: TaskLogState;
  task_id: string;
  type: TaskLogType;
  updated_at: Date;
  workspace: number;
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
  type__in?: string[];
};