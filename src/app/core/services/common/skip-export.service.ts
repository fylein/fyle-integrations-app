import { Injectable } from '@angular/core';
import { WorkspaceService } from './workspace.service';
import { ApiService } from './api.service';
import { HelperService } from './helper.service';
import { Observable } from 'rxjs';
import { ConditionField, EmailOption, ExpenseFilterResponse, ExpenseFilterPost, ExpenseFilter } from '../../models/common/advanced-settings.model';

@Injectable({
  providedIn: 'root'
})
export class SkipExportService {

  constructor(
    private workspaceService: WorkspaceService,
    private apiService: ApiService,
    private helper: HelperService
  ) {
    helper.setBaseApiURL();
  }

  getExpenseFields(version?: 'v1'): Observable<ConditionField[]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/${version === 'v1' ? 'custom_fields': 'expense_fields'}/`, {});
  }

  getAdminEmail(): Observable<EmailOption[]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/admin`, {});
  }

  getExpenseFilter(): Observable<ExpenseFilterResponse> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_filters/`, {});
  }

  postExpenseFilter(expenseFilter: ExpenseFilterPost): Observable<ExpenseFilter> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_filters/`, expenseFilter);
  }

  deleteExpenseFilter(rank: number): Observable<{}> {
    return this.apiService.delete(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_filters/`, { rank });
  }

}
