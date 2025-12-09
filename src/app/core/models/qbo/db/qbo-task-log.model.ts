import { PaginatedResponse } from '../../db/paginated-response.model';
import { TaskLog } from '../../db/task-log.model';
import { QBOTaskLogType } from '../../enum/enum.model';

export type QuickbooksError = {
  expense_group_id: number;
  short_description: string;
  long_description: string;
  type: string;
};

export interface QBOTaskLog extends TaskLog {
  quickbooks_errors: QuickbooksError[];
  type: QBOTaskLogType;
}

export interface QBOTaskResponse extends PaginatedResponse {
  results: QBOTaskLog[];
}
