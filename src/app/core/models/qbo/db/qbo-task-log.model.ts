import type { PaginatedResponse } from "../../db/paginated-response.model";
import type { TaskLog } from "../../db/task-log.model";
import type { QBOTaskLogType } from "../../enum/enum.model";

export interface QuickbooksError {
  expense_group_id: number;
  short_description: string;
  long_description: string;
  type: string;
}

export interface QBOTaskLog extends TaskLog {
  quickbooks_errors: QuickbooksError[];
  type: QBOTaskLogType;
}

export interface QBOTaskResponse extends PaginatedResponse {
  results: QBOTaskLog[];
}
