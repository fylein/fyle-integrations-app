import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountingExportStatus, AccountingExportType, AppName } from '../../models/enum/enum.model';
import { AccountingExportSummary } from '../../models/db/accounting-export-summary.model';
import { ApiService } from './api.service';
import { WorkspaceService } from './workspace.service';
import { HelperService } from './helper.service';
import { AccountingExportCount, AccountingExportGetParam } from '../../models/db/accounting-export.model';
import { SelectedDateFilter } from '../../models/qbd/misc/qbd-date-filter.model';
import { Cacheable } from 'ts-cacheable';

@Injectable({
  providedIn: 'root'
})
export class AccountingExportService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    private helper: HelperService
  ) {
    helper.setBaseApiURL();
  }

  getAccountingExportSummary(version?: string | 'v1', useRepurposedExportSummary?: boolean, appName?: AppName): Observable<AccountingExportSummary> {
    const apiParams: { start_date?: string } = {};
    if (useRepurposedExportSummary && appName && [AppName.XERO, AppName.QBO, AppName.NETSUITE, AppName.INTACCT, AppName.QBD_DIRECT, AppName.SAGE300].includes(appName)) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      apiParams.start_date = today.toISOString();
    }
    if (version === 'v1') {
      // Temporary hack to enable repurposed export summary only for allowed apps - #q2_real_time_exports_integrations
      return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_detail/`, apiParams);
    } else if (version === AppName.QBD_DIRECT) {
      return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_logs/summary/`, apiParams);
    }

    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/accounting_exports/summary/`, apiParams);
  }

  getExportableAccountingExportCount(): Observable<AccountingExportCount> {
    const apiParams = {
      status__in: [AccountingExportStatus.READY, AccountingExportStatus.FAILED, AccountingExportStatus.FATAL]
    };
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/accounting_exports/count/`, apiParams);
  }

  getAccountingExports(type: string[], status: string[], exportableAccountingExportIds: number[] | null, limit: number, offset: number, selectedDateFilter? : SelectedDateFilter | null, exportedAt?: string | null, searchQuery?: string | null, appName?: string): Observable<any> {
    const apiParams: AccountingExportGetParam = {
      type__in: type,
      status__in: status,
      limit: limit,
      offset: offset
    };

    if (searchQuery){
      apiParams.expenses__claim_number = searchQuery;
      apiParams.expenses__employee_email = searchQuery;
      apiParams.expenses__employee_name = searchQuery;
      apiParams.expenses__expense_number = searchQuery;
    }

    if (exportableAccountingExportIds?.length) {
      apiParams.id__in = exportableAccountingExportIds;
    }

    if (selectedDateFilter) {
      const exportedAtLte = selectedDateFilter.startDate.toLocaleDateString().split('/');
      const exportedAtGte = selectedDateFilter.endDate.toLocaleDateString().split('/');
      apiParams.exported_at__gte = `${exportedAtLte[2]}-${exportedAtLte[1]}-${exportedAtLte[0]}T00:00:00`;
      apiParams.exported_at__lte = `${exportedAtGte[2]}-${exportedAtGte[1]}-${exportedAtGte[0]}T23:59:59`;
    }

    if (exportedAt) {
      apiParams.exported_at__gte = exportedAt;
    }

    if (appName === AppName.QBD_DIRECT) {
      if (apiParams.status__in?.includes(AccountingExportStatus.FAILED)) {
        apiParams.status__in = [AccountingExportStatus.ERROR, AccountingExportStatus.FATAL];
      }
      delete apiParams.type__in;
      return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_logs/`, apiParams);
    }
      return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/accounting_exports/`, apiParams);

  }

  @Cacheable()
  importExpensesFromFyle(version?: 'v1' | 'v2'): Observable<{}> {
    // Dedicated to qbd direct
    if (version === 'v2') {
      return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_logs/sync/`, {});
    }
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/${version === 'v1' ? 'expense_groups' : 'accounting_exports'}/sync/`, {});
  }
}
