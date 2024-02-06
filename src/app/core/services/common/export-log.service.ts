import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UserService } from '../misc/user.service';
import { WorkspaceService } from './workspace.service';
import { environment } from 'src/environments/environment';
import { SkipExportLogResponse } from '../../models/intacct/db/expense-group.model';
import { FyleReferenceType, TaskLogState } from '../../models/enum/enum.model';
import { Observable } from 'rxjs';
import { AccountingExport } from '../../models/db/accounting-export.model';
import { SelectedDateFilter } from '../../models/qbd/misc/date-filter.model';
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

  getSkippedExpenses(limit: number, offset: number, selectedDateFilter: SelectedDateFilter | null): Observable<SkipExportLogResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    const params: SkipExportParam = {
      limit,
      offset,
      org_id: this.userService.getUserProfile().org_id,
      is_skipped: true
    };
    params.org_id = this.userService.getUserProfile().org_id;

    if (selectedDateFilter) {
      const startDate = selectedDateFilter.startDate.toLocaleDateString().split('/');
      const endDate = selectedDateFilter.endDate.toLocaleDateString().split('/');
      params.updated_at__gte = `${startDate[2]}-${startDate[1]}-${startDate[0]}T00:00:00`;
      params.updated_at__lte = `${endDate[2]}-${endDate[1]}-${endDate[0]}T23:59:59`;
    }
    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expenses/`, params);
  }

  getExpenseGroups(state: TaskLogState, limit: number, offset: number, selectedDateFilter: SelectedDateFilter | null, exportedAt?: string | null): Observable<ExpenseGroupResponse> {
    const params: ExpenseGroupParam = {
      limit,
      offset,
      tasklog__status: state
    };

    if (selectedDateFilter) {
      const startDate = selectedDateFilter.startDate.toLocaleDateString().split('/');
      const endDate = selectedDateFilter.endDate.toLocaleDateString().split('/');
      params.exported_at__gte = `${startDate[2]}-${startDate[1]}-${startDate[0]}T00:00:00`;
      params.exported_at__lte = `${endDate[2]}-${endDate[1]}-${endDate[0]}T23:59:59`;
    }

    if (exportedAt) {
      params.exported_at__gte = exportedAt;
    }

    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/expense_groups/`, params);
  }
}
