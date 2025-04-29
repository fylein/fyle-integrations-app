import { TaskLogState } from "../enum/enum.model";
import { PaginatedResponse } from "./paginated-response.model";

export type TaskLog = {
  created_at: Date;
  detail: any;
  expense_group: number;
  id: number;
  status: TaskLogState;
  updated_at: Date;
  workspace: number;
};

export interface TaskResponse extends PaginatedResponse {
  results: TaskLog[];
}

export type TaskLogGetParams = {
  limit?: number;
  offset?: number;
  status__in?: string[];
  status?: string[];
  expense_group_id__in?: number[];
  type__in?: string[];
  expense_group_ids?: number[];
  task_type?: string[];
  id__in?: number[];
};
