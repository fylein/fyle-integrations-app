import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { WorkspaceService } from './workspace.service';
import { AccountingExportCount, AccountingExportResponse, AccountingExportSummary } from '../../models/db/accounting-exports.model';
import { Observable } from 'rxjs';
import { AccountingExportStatus, AccountingExportType } from '../../models/enum/enum.model';
import { AccountingError } from '../../models/db/accounting-errors.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // WorkspaceId: string = this.workspaceService.getWorkspaceId();
  workspaceId: string = '1';

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  getAccountingExportSummary(): Observable<AccountingExportSummary> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/accounting_exports/summary`, {});
  }

  getExportableAccountingExportCount(): Observable<AccountingExportCount> {
    const apiParams = {
      status__in: [AccountingExportStatus.READY, AccountingExportStatus.FAILED, AccountingExportStatus.FATAL]
    };
    return this.apiService.get(`/workspaces/${this.workspaceId}/accounting_exports/count`, apiParams);
  }

  getAccountingExports(status: AccountingExportStatus[]): Observable<AccountingExportResponse> {
    const apiParams = {
      type__in: [AccountingExportType.DIRECT_COSTS, AccountingExportType.PURCHASE_INVOICE],
      status__in: [status]
    };
    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/accounting_exports/`, apiParams);
  }

  exportAccountingExports(): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/exports/trigger/`, {});
  }

  getExportErrors(): Observable<AccountingError[]> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/errors/`, {is_resolved: false});
  }

  importAccountingExport(): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/fyle/accounting_exports/sync/`, {});
  }
}
