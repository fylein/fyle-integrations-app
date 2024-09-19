import type { TaskLogState } from "../enum/enum.model";
import type { PaginatedResponse } from "./paginated-response.model";

export interface TaskLog {
  created_at: Date;
  detail: any;
  expense_group: number;
  id: number;
  status: TaskLogState;
  updated_at: Date;
  workspace: number;
}

export interface TaskResponse extends PaginatedResponse {
  results: TaskLog[];
}

export interface TaskLogGetParams {
  limit?: number;
  offset?: number;
  status__in?: string[];
  expense_group_id__in?: number[];
  type__in?: string[];
  expense_group_ids?: number[];
  task_type?: string[];
}
