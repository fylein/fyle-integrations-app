import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UserService } from '../misc/user.service';
import { WorkspaceService } from './workspace.service';
import { environment } from 'src/environments/environment';
import { ExpenseGroupDescription, SkipExportLogResponse } from '../../models/si/db/expense-group.model';
import { AccountingExportStatus, FyleReferenceType } from '../../models/enum/enum.model';
import { Observable } from 'rxjs';
import { AccountingExportResponse, Sage300AccountingExport } from '../../models/sage300/db/sage300-accounting-export.model';
import { AccountingExport, AccountingExportList } from '../../models/db/accounting-export.model';
import { DateFilter, SelectedDateFilter } from '../../models/qbd/misc/date-filter.model';
import { Paginator, Params } from '../../models/misc/paginator.model';

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

  static getDateOptions(): DateFilter[] {
    const dateOptions: DateFilter[] = [
      {
        dateRange: 'This Month',
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date()
      },
      {
        dateRange: 'This Week',
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - new Date().getDay()),
        endDate: new Date()
      },
      {
        dateRange: 'Today',
        startDate: new Date(),
        endDate: new Date()
      },
      {
        dateRange: new Date().toLocaleDateString(),
        startDate: new Date(),
        endDate: new Date()
      }
    ];

    return dateOptions;
  }

  static getFyleExpenseUrl(expense_id: string): string {
    const url = `${environment.fyle_app_url}/app/main/#/view_expense/${expense_id}`;
    return url;
  }

  static getfilteredAccountingExports(query: any, group: AccountingExportList) {
    const employeeName = group.employee ? group.employee[0] : '';
    const employeeID = group.employee ? group.employee[1] : '';
    const expenseType = group.expenseType ? group.expenseType : '';
    const referenceNumber = group.referenceNumber ? group.referenceNumber : '';

    return (
      employeeName.toLowerCase().includes(query) ||
      employeeID.toLowerCase().includes(query) ||
      expenseType.toLowerCase().includes(query) ||
      referenceNumber.toLowerCase().includes(query)
    );
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


  // GetAccountingExports(state: AccountingExportStatus | AccountingExportStatus.COMPLETE, limit: number, offset: number, selectedDateFilter: SelectedDateFilter | null, exportedAt?: Date | null): Observable<AccountingExportResponse> {
  //   Const params: Params = {
  //     Limit,
  //     Offset
  //   };
  //   Params.state = state;

  //   If (selectedDateFilter) {
  //     Const startDate = selectedDateFilter.startDate.toLocaleDateString().split('/');
  //     Const endDate = selectedDateFilter.endDate.toLocaleDateString().split('/');
  //     Params.start_date = `${startDate[2]}-${startDate[1]}-${startDate[0]}T00:00:00`;
  //     Params.end_date = `${endDate[2]}-${endDate[1]}-${endDate[0]}T23:59:59`;
  //   }

  //   If (exportedAt) {
  //     Params.exported_at = exportedAt;
  //   }

  //   Return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/accounting_export/`, params);
  // }

}
