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
import { downloadCSVFile } from '../../util/downloadFile';
import { HttpClient } from '@angular/common/http';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class ExportLogService {

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private workspaceService: WorkspaceService,
    private http: HttpClient,
    private helper: HelperService
  ) { }

  getSkippedExpenses(limit: number, offset: number, selectedDateFilter?: SelectedDateFilter | null, query?: string | null, appName?:string): Observable<SkipExportLogResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    const params: SkipExportParam = {
      limit,
      offset,
      org_id: this.userService.getUserProfile().org_id,
      is_skipped: true
    };

    if (query){
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

  getExpenseGroups(state: TaskLogState, limit: number, offset: number, selectedDateFilter?: SelectedDateFilter | null, exportedAt?: string | null, query?: string | null, appName?: AppName): Observable<ExpenseGroupResponse> {
    const params: ExpenseGroupParam = {
      limit,
      offset
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
      } else if (appName && [AppName.XERO, AppName.QBO, AppName.NETSUITE, AppName.INTACCT, AppName.QBD_DIRECT, AppName.SAGE300].includes(appName)) {
        // Temporary hack to enable repurposed export summary only for allowed apps - #q2_real_time_exports_integrations
        params.updated_at__gte = dateRangeInAPIFormat.start;
        params.updated_at__lte = dateRangeInAPIFormat.end;
      }
    }

    if (exportedAt) {
      params.exported_at__gte = exportedAt;
    }

    if (appName === AppName.NETSUITE) {
      return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_groups/v2/`, params);
    } else if (appName === AppName.QBD_DIRECT) {
      if (params.status__in?.includes(AccountingExportStatus.FAILED)) {
        params.status__in = [AccountingExportStatus.ERROR, AccountingExportStatus.FATAL];
      }

      return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_logs/`, params);
    }
      return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_groups/`, params);

  }

  getDownloadUrl(fileId: string): Observable<{ download_url: string }> {
    return this.apiService.post(`/${this.workspaceService.getWorkspaceId()}/export_logs/download_url/`, {
      file_id: fileId
    });
  }

  renameAndDownloadFile(fileUrl: string, newFileName: string): void {
    this.http.get(fileUrl, { responseType: 'text' }).subscribe((fileContent: string) => {
      downloadCSVFile(fileContent, newFileName);
    });
  }
}
