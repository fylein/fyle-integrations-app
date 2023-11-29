import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountingExportStatus, AccountingExportType } from '../../models/enum/enum.model';
import { AccountingExportSummary } from '../../models/db/accounting-export-summary.model';
import { ApiService } from './api.service';
import { WorkspaceService } from './workspace.service';
import { HelperService } from './helper.service';
import { AccountingExportCount, AccountingExportGetParam } from '../../models/db/accounting-export.model';
import { AccountingExportResponse } from '../../models/sage300/db/sage300-accounting-export.model';

@Injectable({
  providedIn: 'root'
})
export class AccountingExportService {

  workspaceId: string = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    private helper: HelperService
  ) {
    helper.setBaseApiURL();
  }

  getAccountingExportSummary(): Observable<AccountingExportSummary> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/accounting_exports/summary`, {});
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

  importExpensesFromFyle(): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/fyle/accounting_exports/sync/`, {});
  }
}
