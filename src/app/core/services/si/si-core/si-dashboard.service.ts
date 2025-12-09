import { Injectable } from '@angular/core';
import { firstValueFrom, from, Observable } from 'rxjs';
import { Cacheable } from 'ts-cacheable';
import { SiWorkspaceService } from './si-workspace.service';
import { LastExport } from 'src/app/core/models/intacct/db/last-export.model';
import { TaskLogState, TaskLogType } from 'src/app/core/models/enum/enum.model';
import { TaskGetParams, IntacctTaskResponse } from 'src/app/core/models/intacct/db/task-log.model';
import { Error } from 'src/app/core/models/intacct/db/error.model';
import { ExportableExpenseGroup } from 'src/app/core/models/intacct/db/expense-group.model';
import { ApiService } from '../../common/api.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private apiService: ApiService,
    private workspaceService: SiWorkspaceService,
  ) {}

  // TODO: cleanup all methods once dashboard impl is done

  getExportableGroupsIds(): Observable<ExportableExpenseGroup> {
    return this.apiService.get(
      `/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/exportable_expense_groups/`,
      {},
    );
  }

  getExportErrors(): Observable<Error[]> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/errors/`, {
      is_resolved: false,
    });
  }

  syncExpensesFromFyle(): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_groups/sync/`, {});
  }

  @Cacheable()
  importExpenseGroups(): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_groups/sync/`, {});
  }

  exportExpenseGroups(): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/exports/trigger/`, {});
  }

  getLastExport(): Observable<LastExport> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_detail/`, {});
  }

  getAllTasks(
    status: TaskLogState[],
    expenseGroupIds: number[] = [],
    taskType: TaskLogType[] = [],
  ): Observable<IntacctTaskResponse> {
    const limit = 500;
    const allTasks: IntacctTaskResponse = {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };

    return from(this.getAllTasksInternal(limit, status, expenseGroupIds, taskType, allTasks));
  }

  private async getAllTasksInternal(
    limit: number,
    status: string[],
    expenseGroupIds: number[],
    taskType: string[],
    allTasks: IntacctTaskResponse,
  ): Promise<IntacctTaskResponse> {
    const taskResponse = await firstValueFrom(this.getTasks(limit, status, expenseGroupIds, taskType, allTasks.next));

    if (allTasks.count === 0) {
      allTasks = taskResponse;
    } else {
      allTasks.count = taskResponse.count;
      allTasks.next = taskResponse.next;
      allTasks.previous = taskResponse.previous;
      allTasks.results = allTasks.results.concat(taskResponse.results);
    }

    if (taskResponse.next) {
      return this.getAllTasksInternal(limit, status, expenseGroupIds, taskType, allTasks);
    }

    return allTasks;
  }

  getTasks(
    limit: number,
    status: string[],
    expenseGroupIds: number[],
    taskType: string[],
    next: string | null,
  ): Observable<IntacctTaskResponse> {
    const offset = 0;
    const apiParams: TaskGetParams = {
      limit: limit,
      offset: offset,
    };
    if (status.length) {
      const statusKey = 'status';
      apiParams[statusKey] = status;
    }

    if (expenseGroupIds.length) {
      const expenseKey = 'expense_group_ids';
      apiParams[expenseKey] = expenseGroupIds;
    }

    if (taskType) {
      const typeKey = 'task_type';
      apiParams[typeKey] = taskType;
    }

    if (next) {
      return this.apiService.get(next.split('/api')[1], {});
    }

    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/tasks/v2/all/`, apiParams);
  }
}
