import { Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { HelperService } from '../../common/helper.service';
import { Observable, Subject } from 'rxjs';
import { WorkspaceService } from '../../common/workspace.service';
import { Cacheable } from 'ts-cacheable/dist/cjs/cacheable.decorator';
import { CacheBuster } from 'ts-cacheable/dist/cjs/cache-buster.decorator';
import { Sage300AdvancedSettingGet, Sage300AdvancedSettingPost } from 'src/app/core/models/sage300/sage300-configuration/sage300-advanced-settings.mode';
import { ConditionField, EmailOption, ExpenseFilter, ExpenseFilterGetResponse, ExpenseFilterResponse } from 'src/app/core/models/common/advanced-settings.model';

const sage300AdvancedSettingGetCache = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class Sage300AdvancedSettingsService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    helper: HelperService
  ) {
    helper.setBaseApiURL();
  }

  @Cacheable({
    cacheBusterObserver: sage300AdvancedSettingGetCache
  })
  getAdvancedSettings(): Observable<Sage300AdvancedSettingGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: sage300AdvancedSettingGetCache
  })
  postExportSettings(exportSettingsPayload: Sage300AdvancedSettingPost): Observable<Sage300AdvancedSettingGet> {
    return this.apiService.put(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, exportSettingsPayload);
  }

  getExpenseFilelds(): Observable<ConditionField[]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_fields/`, {});
  }

  getAdminEmail(): Observable<EmailOption[]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/admin`, {});
  }

  getExpenseFilter(): Observable<ExpenseFilterGetResponse> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_filters/`, {});
  }

  postExpenseFilter(expenseFilter: ExpenseFilter): Observable<ExpenseFilterResponse> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_filters/`, expenseFilter);
  }

  deleteExpenseFilter(rank: number): Observable<{}> {
    return this.apiService.delete(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_filters/`, { rank });
  }
}
