import type { PaginatedResponse } from "../../db/paginated-response.model";
import type { TaskLog } from "../../db/task-log.model";
import type { TaskLogType } from "../../enum/enum.model";
import { TaskLogState } from "../../enum/enum.model";


export interface XeroError {
  expense_group_id: number;
  short_description: string;
  long_description: string;
  type: string;
}

export interface XeroTaskLog extends TaskLog {
  bill: number;
  cheque: number;
  credit_card_purchase: number;
  xero_errors: XeroError[];
  journal_entry: number;
  bill_payment: number;
  task_id: string;
  type: TaskLogType;
}

export interface XeroTaskResponse extends PaginatedResponse {
  results: XeroTaskLog[];
}

export interface TaskGetParams {
  limit?: number;
  offset?: number;
  status__in?: string[];
  expense_group_id__in?: number[];
  type__in?: string[];
}
