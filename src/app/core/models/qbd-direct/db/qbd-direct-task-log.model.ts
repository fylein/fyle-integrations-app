import { PaginatedResponse } from '../../db/paginated-response.model';
import { TaskLog } from '../../db/task-log.model';
import { QbdDirectTaskLogType } from '../../enum/enum.model';

export type QuickbooksError = {
  expense_group_id: number;
  short_description: string;
  long_description: string;
  type: string;
};

export interface QbdDirectTaskLog extends TaskLog {
  quickbooks_errors: QuickbooksError[];
  type: QbdDirectTaskLogType;
}

export interface QbdDirectTaskResponse extends PaginatedResponse {
  results: QbdDirectTaskLog[];
}
