import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UserService } from '../misc/user.service';
import { WorkspaceService } from './workspace.service';
import { SkipExportLogResponse } from '../../models/intacct/db/expense-group.model';
import { AccountingExportStatus, AppName, TaskLogState } from '../../models/enum/enum.model';
import { Observable } from 'rxjs';
import { SelectedDateFilter } from '../../models/qbd/misc/qbd-date-filter.model';
import { ExpenseGroupParam, ExpenseGroupResponse, SkipExportParam } from '../../models/db/expense-group.model';
import { convertDateRangeToAPIFormat } from '../../util/dateRangeConverter';
import { HelperService } from './helper.service';
import { CsvExportLogItem } from '../../models/db/csv-export-log.model';
import { TranslocoService } from '@jsverse/transloco';
import { CsvJsonTranslatorService } from './csv-json-translator.service';
import { downloadCSVFile } from '../../util/downloadFile';

@Injectable({
  providedIn: 'root',
})
export class ExportLogService {
  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private workspaceService: WorkspaceService,
    private helper: HelperService,
    private translocoService: TranslocoService,
    private csvJsonTranslatorService: CsvJsonTranslatorService,
  ) {}

  getSkippedExpenses(
    limit: number,
    offset: number,
    selectedDateFilter?: SelectedDateFilter | null,
    query?: string | null,
    appName?: string,
  ): Observable<SkipExportLogResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    const params: SkipExportParam = {
      limit,
      offset,
      org_id: this.userService.getUserProfile().org_id,
      is_skipped: true,
    };

    if (query) {
      params.expense_number = query;
      params.employee_email = query;
      params.employee_name = query;
      params.claim_number = query;
    }

    params.org_id = this.userService.getUserProfile().org_id;

    if (selectedDateFilter) {
      const dateRangeInAPIFormat = convertDateRangeToAPIFormat(selectedDateFilter);

      params.updated_at__gte = dateRangeInAPIFormat.start;
      params.updated_at__lte = dateRangeInAPIFormat.end;
    }
    if (appName === AppName.NETSUITE) {
      return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expenses/v2/`, params);
    }

    return this.apiService.get(this.helper.buildEndpointPath(`${workspaceId}/fyle/expenses/`), params);
  }

  getExpenseGroups(
    state: TaskLogState,
    limit: number,
    offset: number,
    selectedDateFilter?: SelectedDateFilter | null,
    exportedAt?: string | null,
    query?: string | null,
    appName?: AppName,
  ): Observable<ExpenseGroupResponse> {
    const params: ExpenseGroupParam = {
      limit,
      offset,
    };

    if (appName === AppName.QBD_DIRECT) {
      params.status__in = state;
    } else {
      params.tasklog__status = state;
    }

    if (query) {
      params.expenses__expense_number = query;
      params.expenses__employee_name = query;
      params.expenses__employee_email = query;
      params.expenses__claim_number = query;
    }

    if (selectedDateFilter) {
      const dateRangeInAPIFormat = convertDateRangeToAPIFormat(selectedDateFilter);

      if (state === TaskLogState.COMPLETE) {
        params.exported_at__gte = dateRangeInAPIFormat.start;
        params.exported_at__lte = dateRangeInAPIFormat.end;
      } else if (
        appName &&
        [AppName.XERO, AppName.QBO, AppName.NETSUITE, AppName.INTACCT, AppName.QBD_DIRECT, AppName.SAGE300].includes(
          appName,
        )
      ) {
        // Temporary hack to enable repurposed export summary only for allowed apps - #q2_real_time_exports_integrations
        params.updated_at__gte = dateRangeInAPIFormat.start;
        params.updated_at__lte = dateRangeInAPIFormat.end;
      }
    }

    if (exportedAt) {
      params.exported_at__gte = exportedAt;
    }

    if (appName === AppName.NETSUITE) {
      return this.apiService.get(
        `/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_groups/v2/`,
        params,
      );
    } else if (appName === AppName.QBD_DIRECT) {
      if (params.status__in?.includes(AccountingExportStatus.FAILED)) {
        params.status__in = [AccountingExportStatus.ERROR, AccountingExportStatus.FATAL];
      }

      return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_logs/`, params);
    }
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_groups/`, params);
  }

  getExportData(fileId: string): Observable<any[]> {
    return this.apiService.post(`/${this.workspaceService.getWorkspaceId()}/export_logs/export_data/`, {
      file_id: fileId,
    });
  }

  getExpenseType(exportLog: CsvExportLogItem): string {
    let isReimbursable = false;
    let isCCC = false;

    for (const expense of exportLog.expenses) {
      if (expense.fund_source === 'PERSONAL') {
        isReimbursable = true;
      } else if (expense.fund_source === 'CCC') {
        isCCC = true;
      }
    }

    const reimbursableString = this.translocoService.translate('services.exportLog.reimbursableType');
    const cccString = this.translocoService.translate('services.exportLog.cccType');

    const types: string[] = [];
    if (isReimbursable) {
      types.push(reimbursableString);
    }
    if (isCCC) {
      types.push(cccString);
    }

    return types.join(', ');
  }

  constructFileName(exportLog: CsvExportLogItem): string {
    if (!exportLog.exported_at || !exportLog.type) {
      return '';
    }

    const exportedDate = new Date(exportLog.exported_at);
    if (!exportedDate.getTime()) {
      console.error('Invalid date in exported_at field:', exportLog.exported_at);
      return '';
    }

    const exportTypeDisplayNames: Record<typeof exportLog.type, string> = {
      GENERAL_JOURNAL_ENTRY: this.translocoService.translate('services.exportLog.generalJournalEntryDisplayName'),
      PURCHASES_RECEIVE_INVENTORY: this.translocoService.translate('services.exportLog.purchasesDisplayName'),
      PAYMENTS_JOURNAL: this.translocoService.translate('services.exportLog.paymentsDisplayName'),
    };

    const year = exportedDate.getFullYear().toString().padStart(4, '0');
    const month = (exportedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = exportedDate.getDate().toString().padStart(2, '0');
    return `${year}_${month}_${day}_${exportTypeDisplayNames[exportLog.type]}.CSV`;
  }

  downloadFile(exportLog: CsvExportLogItem): void {
    if (!exportLog.file_id || !exportLog.type || !exportLog.exported_at) {
      return;
    }
    const fileName = this.constructFileName(exportLog);
    this.getExportData(exportLog.file_id).subscribe((exportData) => {
      const csvData = this.csvJsonTranslatorService.jsonToCsv(exportData);
      downloadCSVFile(csvData, fileName);
    });
  }
}
