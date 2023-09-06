import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cacheable } from 'ts-cacheable';
import { SiApiService } from '../si-core/si-api.service';
import { UserService } from '../../misc/user.service';
import { SiWorkspaceService } from '../si-core/si-workspace.service';
import { FyleReferenceType, TaskLogState } from 'src/app/core/models/enum/enum.model';
import { SelectedDateFilter } from 'src/app/core/models/qbd/misc/date-filter.model';
import { ExpenseGroup, ExpenseGroupDescription, ExpenseGroupResponse, SkipExportLogResponse } from 'src/app/core/models/si/db/expense-group.model';
import { ExpenseGroupSetting } from 'src/app/core/models/si/db/expense-group-setting.model';

@Injectable({
  providedIn: 'root'
})
export class ExportLogService {

  workspaceId: string = this.workspaceService.getWorkspaceId();

  private org_id: string = this.userService.getUserProfile().org_id;

  constructor(
    private apiService: SiApiService,
    private userService: UserService,
    private workspaceService: SiWorkspaceService
  ) { }

  getExpenseGroups(state: TaskLogState, limit: number, offset: number, selectedDateFilter: SelectedDateFilter | null, exportedAt: string | void): Observable<ExpenseGroupResponse> {
    const params: any = {
      limit,
      offset
    };
    params.tasklog__status = state;
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

  @Cacheable()
  getExpenseGroupSettings(): Observable<ExpenseGroupSetting> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/expense_group_settings/`, {});
  }

  @Cacheable()
  getSkippedExpenses(limit: number, offset: number, selectedDateFilter: SelectedDateFilter | null): Observable<SkipExportLogResponse> {
    const params: any = {
      limit,
      offset,
      is_skipped: 'true',
      org_id: this.org_id
    };

    if (selectedDateFilter) {
      const startDate = selectedDateFilter.startDate.toLocaleDateString().split('/');
      const endDate = selectedDateFilter.endDate.toLocaleDateString().split('/');
      params.start_date = `${startDate[2]}-${startDate[1]}-${startDate[0]}T00:00:00`;
      params.end_date = `${endDate[2]}-${endDate[1]}-${endDate[0]}T23:59:59`;
    }
    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/expenses/`, params);
  }
}
