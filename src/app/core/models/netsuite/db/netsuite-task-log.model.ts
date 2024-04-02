import { PaginatedResponse } from '../../db/paginated-response.model';
import { TaskLog } from '../../db/task-log.model';

export type NetsuiteMappingError = {
  expense_group_id: number;
  message: string;
  row: number;
  type: string;
  value: string;
};

export interface NetsuiteTaskLog extends TaskLog {
  task_id: string;
  type: string;
  bill: number;
  expense_report: number;
  journal_entry: number;
  vendor_payment: number;
}

export interface NetsuiteTaskResponse extends PaginatedResponse {
  results: NetsuiteTaskLog[];
}
