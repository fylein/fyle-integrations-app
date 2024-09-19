import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { AccountingExportStatus, AccountingExportType } from '../../models/enum/enum.model';
import type { AccountingExportSummary } from '../../models/db/accounting-export-summary.model';
import type { ApiService } from './api.service';
import type { WorkspaceService } from './workspace.service';
import type { HelperService } from './helper.service';
import type { AccountingExportCount, AccountingExportGetParam } from '../../models/db/accounting-export.model';
import type { SelectedDateFilter } from '../../models/qbd/misc/qbd-date-filter.model';
import { Cacheable } from 'ts-cacheable';

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

  getAccountingExportSummary(version?: 'v1'): Observable<AccountingExportSummary> {
    if (version === 'v1') {
      return this.apiService.get(`/workspaces/${this.workspaceId}/export_detail/`, {});
    }

    return this.apiService.get(`/workspaces/${this.workspaceId}/accounting_exports/summary/`, {});
  }

  getExportableAccountingExportCount(): Observable<AccountingExportCount> {
    const apiParams = {
      status__in: [AccountingExportStatus.READY, AccountingExportStatus.FAILED, AccountingExportStatus.FATAL]
    };
    return this.apiService.get(`/workspaces/${this.workspaceId}/accounting_exports/count/`, apiParams);
  }

  getAccountingExports(type: string[], status: string[], exportableAccountingExportIds: number[] | null, limit: number, offset: number, selectedDateFilter? : SelectedDateFilter | null, exportedAt?: string | null, searchQuery?: string | null): Observable<any> {
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

    return this.apiService.get(`/workspaces/${this.workspaceId}/accounting_exports/`, apiParams);
  }

  @Cacheable()
  importExpensesFromFyle(version?: 'v1'): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/fyle/${version === 'v1' ? 'expense_groups' : 'accounting_exports'}/sync/`, {});
  }
}
