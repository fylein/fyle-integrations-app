import { Injectable } from '@angular/core';
import { Observable, from, mergeMap, of, reduce, takeWhile } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cacheable } from 'ts-cacheable';
import { SiApiService } from '../si-core/si-api.service';
import { UserService } from '../../misc/user.service';
import { SiWorkspaceService } from '../si-core/si-workspace.service';
import { FyleReferenceType, TaskLogState } from 'src/app/core/models/enum/enum.model';
import { SelectedDateFilter } from 'src/app/core/models/qbd/misc/date-filter.model';
import { ExpenseGroup, ExpenseGroupDescription, ExpenseGroupResponse, SkipExportLogResponse } from 'src/app/core/models/si/db/expense-group.model';
import { ExpenseGroupSetting } from 'src/app/core/models/si/db/expense-group-setting.model';
import { Expense } from 'src/app/core/models/si/db/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExportLogService {

  workspaceId: string = this.workspaceService.getWorkspaceId();

  private org_id: string = this.userService.getUserProfile().org_id;

  constructor(
    private apiService: SiApiService,
    private userService: UserService,
    private workspaceService: SiWorkspaceService
  ) { }

  getExpenseGroups(state: TaskLogState | TaskLogState.COMPLETE, limit: number, offset: number, selectedDateFilter: SelectedDateFilter | null, exportedAt: string | void): Observable<ExpenseGroupResponse> {
    const params: any = {
      limit,
      offset
    };
    params.state = state;

    if (selectedDateFilter) {
      const startDate = selectedDateFilter.startDate.toLocaleDateString().split('/');
      const endDate = selectedDateFilter.endDate.toLocaleDateString().split('/');
      params.start_date = `${startDate[2]}-${startDate[1]}-${startDate[0]}T00:00:00`;
      params.end_date = `${endDate[2]}-${endDate[1]}-${endDate[0]}T23:59:59`;
    }

    if (exportedAt) {
      params.start_date = exportedAt;
    }

    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/expense_groups/`, params);
  }

  getReferenceType(description: Partial<ExpenseGroupDescription>): FyleReferenceType {
    let referenceType = FyleReferenceType.EXPENSE_REPORT;

    if (FyleReferenceType.EXPENSE in description) {
      referenceType = FyleReferenceType.EXPENSE;
    } else if (FyleReferenceType.EXPENSE_REPORT in description) {
      referenceType = FyleReferenceType.EXPENSE_REPORT;
    } else if (FyleReferenceType.PAYMENT in description) {
      referenceType = FyleReferenceType.PAYMENT;
    }

    return referenceType;
  }

  getSkipExportLogs(limit: number, offset: number): Observable<SkipExportLogResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expenses/`, {limit, offset});
  }

  getExpenseGroupSettings(): Observable<ExpenseGroupSetting> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expense_group_settings/`, {});
  }
}
