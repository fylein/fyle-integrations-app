import { TaskLogState, TaskLogType } from "../../enum/enum.model";


export type XeroError = {
  expense_group_id: number;
  short_description: string;
  long_description: string;
  type: string;
};

export type XeroTask = {
  bill: number;
  cheque: number;
  created_at: Date;
  credit_card_purchase: number;
  // Having any here is okay, didn't differentiate xero errors and fyle errors
  detail: any;
  xero_errors: XeroError[];
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

export type XeroTaskResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: XeroTask[];
};

export type TaskGetParams = {
  limit?: number;
  offset?: number;
  status__in?: string[];
  expense_group_id__in?: number[];
  type__in?: string[];
};
