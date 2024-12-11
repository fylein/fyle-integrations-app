import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UserService } from '../misc/user.service';
import { WorkspaceService } from './workspace.service';
import { SkipExportLogResponse } from '../../models/intacct/db/expense-group.model';
import { AccountingExportStatus, AppName, TaskLogState } from '../../models/enum/enum.model';
import { Observable } from 'rxjs';
import { SelectedDateFilter } from '../../models/qbd/misc/qbd-date-filter.model';
import { ExpenseGroupParam, ExpenseGroupResponse, SkipExportParam } from '../../models/db/expense-group.model';

@Injectable({
  providedIn: 'root'
})
export class ExportLogService {

  workspaceId: string = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private workspaceService: WorkspaceService
  ) { }

  getSkippedExpenses(limit: number, offset: number, selectedDateFilter?: SelectedDateFilter | null, query?: string | null, appName?:string): Observable<SkipExportLogResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    const params: SkipExportParam = {
      limit,
      offset,
      org_id: this.userService.getUserProfile().org_id,
      is_skipped: true
    };

    if (query){
      params.expense_number = query;
      params.employee_email = query;
      params.employee_name = query;
      params.claim_number = query;
    }

    params.org_id = this.userService.getUserProfile().org_id;

    if (selectedDateFilter) {
      const startDate = selectedDateFilter.startDate.toLocaleDateString().split('/');
      const endDate = selectedDateFilter.endDate.toLocaleDateString().split('/');
      params.updated_at__gte = `${startDate[2]}-${startDate[1]}-${startDate[0]}T00:00:00`;
      params.updated_at__lte = `${endDate[2]}-${endDate[1]}-${endDate[0]}T23:59:59`;
    }
    if (appName === AppName.NETSUITE) {
      return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/expenses/v2/`, params);
    }
      return this.apiService.get(`/workspaces/${workspaceId}/fyle/expenses/`, params);

  }

  getExpenseGroups(state: TaskLogState, limit: number, offset: number, selectedDateFilter?: SelectedDateFilter | null, exportedAt?: string | null, query?: string | null, appName?: string): Observable<ExpenseGroupResponse> {
    const params: ExpenseGroupParam = {
      limit,
      offset
    };

    if (appName === AppName.QBD_DIRECT) {
      params.status__in = state;
    } else {
      params.tasklog__status = state;
    }

    if (query) {
      params.expenses__expense_number = query;
      params.expenses__employee_name = query;
      params.expenses__employee_email = query;
      params.expenses__claim_number = query;
    }

    if (selectedDateFilter) {
      const startDate = selectedDateFilter.startDate.toLocaleDateString().split('/');
      const endDate = selectedDateFilter.endDate.toLocaleDateString().split('/');
        params.exported_at__gte = `${startDate[2]}-${startDate[1]}-${startDate[0]}T00:00:00`;
        params.exported_at__lte = `${endDate[2]}-${endDate[1]}-${endDate[0]}T23:59:59`;
    }

    if (exportedAt) {
      params.exported_at__gte = exportedAt;
    }

    if (appName === AppName.NETSUITE) {
      return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/expense_groups/v2/`, params);
    } else if (appName === AppName.QBD_DIRECT) {
      if (params.status__in?.includes(AccountingExportStatus.FAILED)) {
        params.status__in = [AccountingExportStatus.ERROR, AccountingExportStatus.FATAL];
      }

      return this.apiService.get(`/workspaces/${this.workspaceId}/export_logs/`, params);
    }
      return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/expense_groups/`, params);

  }
}
