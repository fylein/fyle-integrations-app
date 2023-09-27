import { Injectable } from '@angular/core';
import { firstValueFrom, from, Observable } from 'rxjs';
import { Cacheable } from 'ts-cacheable';
import { SiApiService } from './si-api.service';
import { SiWorkspaceService } from './si-workspace.service';
import { LastExport } from 'src/app/core/models/si/db/last-export.model';
import { TaskLogState, TaskLogType } from 'src/app/core/models/enum/enum.model';
import { TaskGetParams, TaskResponse } from 'src/app/core/models/si/db/task-log.model';
import { Error } from 'src/app/core/models/si/db/error.model';
import { ExportableExpenseGroup } from 'src/app/core/models/si/db/expense-group.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  workspaceId: string = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: SiApiService,
    private workspaceService: SiWorkspaceService
  ) { }

  // TODO: cleanup all methods once dashboard impl is done

  getExportableGroupsIds(): Observable<ExportableExpenseGroup> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/exportable_expense_groups/`, {});
  }

  getExportErrors(): Observable<Error[]> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceId}/errors/`, {is_resolved: false});
  }

  syncExpensesFromFyle(): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/fyle/expense_groups/sync/`, {});
  }

  @Cacheable()
  importExpenseGroups(): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/fyle/expense_groups/sync/`, {});
  }

  exportExpenseGroups(): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/exports/trigger/`, {});
  }

  getLastExport(): Observable<LastExport> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/export_detail/`, {});
  }

  getAllTasks(status: TaskLogState[], expenseGroupIds: number[] = [], taskType: TaskLogType[] = []): Observable<TaskResponse> {
    const limit = 500;
    const allTasks: TaskResponse = {
      count: 0,
      next: null,
      previous: null,
      results: []
    };

    return from(this.getAllTasksInternal(limit, status, expenseGroupIds, taskType, allTasks));
  }

  private async getAllTasksInternal(limit: number, status: string[], expenseGroupIds: number[], taskType: string[], allTasks: TaskResponse): Promise<TaskResponse> {
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

  getTasks(limit: number, status: string[], expenseGroupIds: number[], taskType: string[], next: string | null): Observable<TaskResponse> {
    const offset = 0;
    const apiParams: TaskGetParams = {
      limit: limit,
      offset: offset
    };
    if (status.length) {
      const statusKey = 'status';
      apiParams[statusKey] = status;
    }

    if (expenseGroupIds.length) {
      const expenseKey = 'expense_group_id';
      apiParams[expenseKey] = expenseGroupIds;
    }

    if (taskType) {
      const typeKey = 'type';
      apiParams[typeKey] = taskType;
    }

    if (next) {
      return this.apiService.get(next.split('/api')[1], {});
    }

    return this.apiService.get(
      `/workspaces/${this.workspaceId}/tasks/v2/all/`, apiParams
    );
  }

}
