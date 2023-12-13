import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountingExportStatus, AccountingExportType } from '../../models/enum/enum.model';
import { AccountingExportSummary } from '../../models/db/accounting-export-summary.model';
import { ApiService } from './api.service';
import { WorkspaceService } from './workspace.service';
import { HelperService } from './helper.service';
import { AccountingExportCount, AccountingExportGetParam } from '../../models/db/accounting-export.model';
import { SelectedDateFilter } from '../../models/qbd/misc/date-filter.model';

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
    return this.apiService.get(`/workspaces/${this.workspaceId}/accounting_exports/summary/`, {});
  }

  getExportableAccountingExportCount(): Observable<AccountingExportCount> {
    const apiParams = {
      status__in: [AccountingExportStatus.READY, AccountingExportStatus.FAILED, AccountingExportStatus.FATAL]
    };
    return this.apiService.get(`/workspaces/${this.workspaceId}/accounting_exports/count/`, apiParams);
  }

  getAccountingExports(status: AccountingExportStatus[], exportableAccountingExportIds: number[] | null, limit: number, offset: number, selectedDateFilter? : SelectedDateFilter | null): Observable<any> {
    const apiParams: AccountingExportGetParam = {
      type__in: [AccountingExportType.DIRECT_COSTS, AccountingExportType.PURCHASE_INVOICE],
      status__in: status,
      limit: limit,
      offset: offset
    };

    if (exportableAccountingExportIds?.length) {
      apiParams.id__in = exportableAccountingExportIds;
    }

    if (selectedDateFilter) {
      const exportedAtLte = selectedDateFilter.startDate.toLocaleDateString().split('/');
      const exportedAtGte = selectedDateFilter.endDate.toLocaleDateString().split('/');
      apiParams.exported_at__lte = `${exportedAtLte[2]}-${exportedAtLte[1]}-${exportedAtLte[0]}T00:00:00`;
      apiParams.exported_at__gte = `${exportedAtGte[2]}-${exportedAtGte[1]}-${exportedAtGte[0]}T23:59:59`;
    }

    return this.apiService.get(`/workspaces/${this.workspaceId}/accounting_exports/`, apiParams);
  }

  importExpensesFromFyle(): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/fyle/accounting_exports/sync/`, {});
  }
}
