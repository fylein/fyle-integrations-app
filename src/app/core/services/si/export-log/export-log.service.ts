import { Injectable } from '@angular/core';
import { Observable, from, mergeMap, of, reduce, takeWhile } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cacheable } from 'ts-cacheable';
import { UserService } from '../../misc/user.service';
import { SiWorkspaceService } from '../si-core/si-workspace.service';
import { FyleReferenceType, TaskLogState } from 'src/app/core/models/enum/enum.model';
import { SelectedDateFilter } from 'src/app/core/models/qbd/misc/qbd-date-filter.model';
import { ExpenseGroup, ExpenseGroupDescription, ExpenseGroupResponse, SkipExportLogResponse } from 'src/app/core/models/intacct/db/expense-group.model';
import { ExpenseGroupSetting } from 'src/app/core/models/db/expense-group-setting.model';
import { Expense } from 'src/app/core/models/intacct/db/expense.model';
import { ApiService } from '../../common/api.service';

@Injectable({
  providedIn: 'root'
})
export class ExportLogService {

  workspaceId: string = this.workspaceService.getWorkspaceId();

  private org_id: string = this.userService.getUserProfile().org_id;

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private workspaceService: SiWorkspaceService
  ) { }

  getExpenseGroups(state: TaskLogState | TaskLogState.COMPLETE, limit: number, offset: number, selectedDateFilter: SelectedDateFilter | null, exportedAt: Date | void | null): Observable<ExpenseGroupResponse> {
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
      params.exported_at = exportedAt;
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

  generateFyleUrl(expenseGroup: ExpenseGroup, referenceType: FyleReferenceType) : string {
    let url = `${environment.fyle_app_url}/app/`;
    if (referenceType === FyleReferenceType.EXPENSE) {
      url += `admin/#/view_expense/${expenseGroup.expenses[0].expense_id}`;
    } else if (referenceType === FyleReferenceType.EXPENSE_REPORT) {
      url += `admin/#/reports/${expenseGroup.expenses[0].report_id}`;
    } else if (referenceType === FyleReferenceType.PAYMENT) {
      url += `admin/#/settlements/${expenseGroup.expenses[0].settlement_id}`;
    }

    return `${url}?org_id=${this.org_id}`;
  }
}
