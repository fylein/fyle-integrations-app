import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkspaceService } from '../../common/workspace.service';
import { UserService } from '../../misc/user.service';
import { ApiService } from '../../common/api.service';
import { AccountingExportStatus } from 'src/app/core/models/enum/enum.model';
import { SelectedDateFilter } from 'src/app/core/models/qbd/misc/date-filter.model';
import { AccountingExportResponse } from 'src/app/core/models/sage300/db/sage300-accounting-export.model';


@Injectable({
  providedIn: 'root'
})
export class Sage300ExportLogService {

  workspaceId: string = this.workspaceService.getWorkspaceId();

  private org_id: string = this.userService.getUserProfile('user').org_id;

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private workspaceService: WorkspaceService
  ) { }

  getAccountingExports(state: AccountingExportStatus | AccountingExportStatus.COMPLETE, limit: number, offset: number, selectedDateFilter: SelectedDateFilter | null, exportedAt: Date | void | null): Observable<AccountingExportResponse> {
    const params: any = {
      limit,
      offset
    };
    params.state = state;

    if (selectedDateFilter) {
      const startDate = selectedDateFilter.startDate.toLocaleDateString().split('/');
      const endDate = selectedDateFilter.endDate.toLocaleDateString().split('/');
      params.start_date = `${startDate[2]}-${startDate[1]}-${startDate[0]}T00:00:00`;
      params.end_date = `${endDate[2]}-${endDate[1]}-${endDate[0]}T23:59:59`;
    }

    if (exportedAt) {
      params.exported_at = exportedAt;
    }

    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/expense_groups/`, params);
  }

  // new function for generateFyleURL
  // move to common, accountingExport
}
