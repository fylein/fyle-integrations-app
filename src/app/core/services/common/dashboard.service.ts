import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { WorkspaceService } from './workspace.service';
import { Observable, from } from 'rxjs';
import { Error, ErrorResponse } from '../../models/db/error.model';
import { HelperService } from './helper.service';
import { ExportableAccountingExport } from '../../models/db/accounting-export.model';
import { AppName, TaskLogState } from '../../models/enum/enum.model';
import { TaskLogGetParams, TaskResponse } from '../../models/db/task-log.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  workspaceId: string = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    private helper: HelperService
  ) {
    helper.setBaseApiURL();
  }

  getExportableAccountingExportIds(version?: 'v1' | 'v2'): Observable<any> {
    // Dedicated to qbd direct
    if (version === 'v2') {
      return this.apiService.get(`/workspaces/${this.workspaceId}/export_logs/ready_to_export/`, {});
    }
    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/${version === 'v1' ? 'exportable_expense_groups' : 'exportable_accounting_exports'}/`, {});
  }

  triggerAccountingExport(version?: 'v1'): Observable<{}> {
    const url = version === 'v1' ? `/workspaces/${this.workspaceId}/qbd/export/` : `/workspaces/${this.workspaceId}/exports/trigger/`;
    return this.apiService.post(url, {});
  }

  getExportErrors(version?: string | 'v1'): Observable<any> {
    if (version === 'v1') {
      return this.apiService.get(`/v2/workspaces/${this.workspaceId}/errors/`, {is_resolved: false});
    } else if (version ===  AppName.QBD_DIRECT) {
      return this.apiService.get(`/workspaces/${this.workspaceId}/export_logs/errors/`, {is_resolved: false});
    }

    return this.apiService.get(`/workspaces/${this.workspaceId}/accounting_exports/errors/`, {is_resolved: false});
  }

  private getTasks(limit: number, status: string[], expenseGroupIds: number[], taskType: string[], next: string | null, appName?: AppName): Observable<any> {
    const offset = 0;
    const apiParams: TaskLogGetParams = {
      limit: limit,
      offset: offset
    };
    if (status.length) {
      const statusKey = 'status__in';
      apiParams[statusKey] = status;
    }

    if (expenseGroupIds.length) {
      const expenseKey = appName === AppName.INTACCT ? 'expense_group_ids' : appName === AppName.QBD_DIRECT ? 'export_log__id__in' : 'expense_group_id__in';
      apiParams[expenseKey] = expenseGroupIds;
    }

    if (taskType) {
      const typeKey = appName===AppName.INTACCT ? 'task_type' : 'type__in';
      apiParams[typeKey] = taskType;
    }

    if (next) {
      return this.apiService.get(next.split('/api')[1], {});
    }

    let url = '';

    if (appName === AppName.INTACCT || appName === AppName.NETSUITE) {
      url = `/workspaces/${this.workspaceId}/tasks/v2/all/`;
    } else if (appName === AppName.QBD_DIRECT) {
      url = `/workspaces/${this.workspaceId}/export_logs/`;
    } else {
      url = `/workspaces/${this.workspaceId}/tasks/all/`;
    }

    return this.apiService.get(url, apiParams);
  }

  private getAllTasksInternal(limit: number, status: string[], expenseGroupIds: number[], taskType: string[], allTasks: TaskResponse, appName?: AppName): Promise<TaskResponse> {
    const that = this;
    return that.getTasks(limit, status, expenseGroupIds, taskType, allTasks.next, appName).toPromise().then((taskResponse) => {

      if (allTasks.count === 0) {
        allTasks = taskResponse;
      } else {
        allTasks.count = taskResponse.count;
        allTasks.next = taskResponse.next;
        allTasks.previous = taskResponse.previous;
        allTasks.results = allTasks.results.concat(taskResponse.results);
      }

      if (taskResponse.next) {
        return that.getAllTasksInternal(limit, status, expenseGroupIds, taskType, allTasks);
      }

      return allTasks;
    });
  }

  getAllTasks(status: TaskLogState[], expenseGroupIds: number[] = [], taskType: string[] = [], appName: AppName|undefined = undefined): Observable<any> {
    const limit = 500;
    const allTasks = {
      count: 0,
      next: null,
      previous: null,
      results: []
    };

    return from(this.getAllTasksInternal(limit, status, expenseGroupIds, taskType, allTasks, appName));
  }
}
