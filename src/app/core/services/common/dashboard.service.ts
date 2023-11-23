import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { WorkspaceService } from './workspace.service';
import { AccountingExportCount, AccountingExportGetParam } from '../../models/db/accounting-export.model';
import { Observable } from 'rxjs';
import { AccountingExportStatus, AccountingExportType } from '../../models/enum/enum.model';
import { Error } from '../../models/db/error.model';
import { AccountingExportSummary } from '../../models/db/accounting-export-summary.model';
import { ExportableExpenseGroup } from '../../models/si/db/expense-group.model';
import { AccountingExportResponse } from '../../models/sage300/db/sage300-accounting-export.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  workspaceId: string = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  getAccountingExportSummary(): Observable<AccountingExportSummary> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/accounting_exports/summary`, {});
  }

  getExportableAccountingExportIds(): Observable<ExportableExpenseGroup> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/exportable_accounting_groups/`, {});
  }

  getExportableAccountingExportCount(): Observable<AccountingExportCount> {
    const apiParams = {
      status__in: [AccountingExportStatus.READY, AccountingExportStatus.FAILED, AccountingExportStatus.FATAL]
    };
    return this.apiService.get(`/workspaces/${this.workspaceId}/accounting_exports/count`, apiParams);
  }

  getAccountingExports(status: AccountingExportStatus[], exportableAccountingExportIds: number[]): Observable<AccountingExportResponse> {
    const apiParams: AccountingExportGetParam = {
      type__in: [AccountingExportType.DIRECT_COSTS, AccountingExportType.PURCHASE_INVOICE],
      status__in: status
    };

    if (exportableAccountingExportIds.length) {
      apiParams.id__in = exportableAccountingExportIds;
    }

    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/accounting_exports/`, apiParams);
  }

  triggerAccountingExport(): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/exports/trigger/`, {});
  }

  getExportErrors(): Observable<Error[]> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/errors/`, {is_resolved: false});
  }

  importExpensesFromFyle(): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/fyle/accounting_exports/sync/`, {});
  }
}
