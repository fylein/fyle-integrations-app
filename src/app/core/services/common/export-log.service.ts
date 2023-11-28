import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UserService } from '../misc/user.service';
import { WorkspaceService } from './workspace.service';
import { environment } from 'src/environments/environment';
import { ExpenseGroupDescription, SkipExportLogResponse } from '../../models/si/db/expense-group.model';
import { FyleReferenceType } from '../../models/enum/enum.model';
import { Observable } from 'rxjs';
import { Sage300AccountingExport } from '../../models/sage300/db/sage300-accounting-export.model';

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

  getSkipExportLogs(limit: number, offset: number): Observable<SkipExportLogResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expenses/`, {limit, offset});
  }

  generateFyleUrl(accountingExport: Sage300AccountingExport, referenceType: FyleReferenceType) : string {
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

}
