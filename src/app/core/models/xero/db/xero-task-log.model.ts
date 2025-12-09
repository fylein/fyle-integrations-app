import { PaginatedResponse } from '../../db/paginated-response.model';
import { TaskLog } from '../../db/task-log.model';
import { TaskLogState, TaskLogType } from '../../enum/enum.model';

export type XeroError = {
  expense_group_id: number;
  short_description: string;
  long_description: string;
  type: string;
};

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

export type TaskGetParams = {
  limit?: number;
  offset?: number;
  status__in?: string[];
  expense_group_id__in?: number[];
  type__in?: string[];
};
