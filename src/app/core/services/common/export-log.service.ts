import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UserService } from '../misc/user.service';
import { WorkspaceService } from './workspace.service';
import { environment } from 'src/environments/environment';
import { ExpenseGroupDescription, SkipExportLogResponse } from '../../models/si/db/expense-group.model';
import { AccountingExportStatus, FyleReferenceType } from '../../models/enum/enum.model';
import { Observable } from 'rxjs';
import { AccountingExportResponse, Sage300AccountingExport } from '../../models/sage300/db/sage300-accounting-export.model';
import { AccountingExport } from '../../models/db/accounting-export.model';
import { SelectedDateFilter } from '../../models/qbd/misc/date-filter.model';

@Injectable({
  providedIn: 'root'
})
export class ExportLogService {

  workspaceId: string = this.workspaceService.getWorkspaceId();

  private org_id: string = this.userService.getUserProfile('user').org_id;

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private workspaceService: WorkspaceService
  ) { }

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

  getSkippedExpenses(limit: number, offset: number): Observable<SkipExportLogResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expenses/`, {limit, offset});
  }

  generateFyleUrl(accountingExport: AccountingExport, referenceType: FyleReferenceType) : string {
    let url = `${environment.fyle_app_url}/app/`;
    if (referenceType === FyleReferenceType.EXPENSE) {
      url += `main/#/view_expense/${accountingExport.expenses[0].expense_id}`;
    } else if (referenceType === FyleReferenceType.EXPENSE_REPORT) {
      url += `admin/#/reports/${accountingExport.expenses[0].report_id}`;
    } else if (referenceType === FyleReferenceType.PAYMENT) {
      url += `admin/#/settlements/${accountingExport.expenses[0].settlement_id}`;
    }

    return `${url}?org_id=${this.org_id}`;
  }


  getAccountingExports(state: AccountingExportStatus | AccountingExportStatus.COMPLETE, limit: number, offset: number, selectedDateFilter: SelectedDateFilter | null, exportedAt?: Date | null): Observable<AccountingExportResponse> {
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

    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/accounting_export/`, params);
  }

}
