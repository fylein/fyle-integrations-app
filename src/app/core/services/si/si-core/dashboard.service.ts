import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Cacheable } from 'ts-cacheable';
import { SiApiService } from './si-api.service';
import { SiWorkspaceService } from './si-workspace.service';
import { ExportableExpenseGroup } from 'src/app/core/models/si/db/expense-field.model';
import { LastExport } from 'src/app/core/models/si/db/last-export.model';
import { TaskLogState, TaskLogType } from 'src/app/core/models/enum/enum.model';
import { TaskGetParams, TaskResponse } from 'src/app/core/models/si/db/task-log.model';

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

  getTasks(limit: number, status: string[], expenseGroupIds: number[], taskType: string[], next: string | null): Observable<TaskResponse> {
    const offset = 0;
    const apiParams: TaskGetParams = {
      limit: limit,
      offset: offset
    };
    if (status.length) {
      const statusKey = 'status__in';
      apiParams[statusKey] = status;
    }

    if (expenseGroupIds.length) {
      const expenseKey = 'expense_group_id__in';
      apiParams[expenseKey] = expenseGroupIds;
    }

    if (taskType) {
      const typeKey = 'type__in';
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
