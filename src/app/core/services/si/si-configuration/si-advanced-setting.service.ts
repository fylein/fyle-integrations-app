import { Injectable } from '@angular/core';
import type { SiWorkspaceService } from '../si-core/si-workspace.service';
import type { Observable } from 'rxjs';
import type { AdvancedSettingsGet, AdvancedSettingsPost, ConditionField, ExpenseFilterResponse, SkipExport } from 'src/app/core/models/intacct/intacct-configuration/advanced-settings.model';
import type { EmailOption } from 'src/app/core/models/bamboo-hr/bamboo-hr.model';
import type { StorageService } from '../../common/storage.service';
import type { ApiService } from '../../common/api.service';

@Injectable({
  providedIn: 'root'
})
export class SiAdvancedSettingService {

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    private workspaceService: SiWorkspaceService
  ) { }

  getFyleCustomFields(): Observable<ConditionField[]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/custom_fields/`, {});
  }

  postExpenseFilter(skipExport: SkipExport): Observable<SkipExport> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_filters/`, skipExport);
  }

  getExpenseFilter(): Observable<ExpenseFilterResponse> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_filters/`, {});
  }

  deleteExpenseFilter(rank: number): Observable<SkipExport> {
    return this.apiService.delete(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_filters/`, { rank });
  }

  getAdvancedSettings(): Observable<AdvancedSettingsGet>{
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_settings/`, {});
  }

  postAdvancedSettings(advancedSettingsPayload: AdvancedSettingsPost): Observable<AdvancedSettingsGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_settings/`, advancedSettingsPayload);
  }

  getAdditionalEmails(): Observable<EmailOption[]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/admins/`, {});
  }
}
