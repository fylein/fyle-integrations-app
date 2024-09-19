import type { PaginatedResponse } from "../../db/paginated-response.model";
import type { TaskLog } from "../../db/task-log.model";
import type { TaskLogType } from "../../enum/enum.model";
import { TaskLogState } from "../../enum/enum.model";

export interface SageIntacctError {
  expense_group_id: number;
  short_description: string;
  long_description: string;
  type: string;
}

export interface IntacctTaskLog extends TaskLog {
  type: TaskLogType;
  task_id: string;
  bill: number;
  expense_report: number;
  charge_card_transaction: number;
  journal_entry: number;
  ap_payment: number;
  sage_intacct_reimbursement: number;
  sage_intacct_errors: SageIntacctError[];
}

export interface IntacctTaskResponse extends PaginatedResponse {
  results: IntacctTaskLog[];
}


export interface TaskGetParams {
  limit?: number;
  offset?: number;
  status?: string[];
  expense_group_ids?: number[];
  task_type?: string[];
}