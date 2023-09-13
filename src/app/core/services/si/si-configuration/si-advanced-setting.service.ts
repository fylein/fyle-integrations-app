import { Injectable } from '@angular/core';
import { SiApiService } from '../si-core/si-api.service';
import { SiWorkspaceService } from '../si-core/si-workspace.service';
import { Observable } from 'rxjs';
import { AdvancedSettingsGet, AdvancedSettingsPost, ExpenseFilterResponse, SkipExport } from 'src/app/core/models/si/si-configuration/advanced-settings.model';
import { EmailOption } from 'src/app/core/models/bamboo-hr/bamboo-hr.model';
import { StorageService } from '../../core/storage.service';

@Injectable({
  providedIn: 'root'
})
export class SiAdvancedSettingService {

  constructor(
    private apiService: SiApiService,
    private storageService: StorageService,
    private workspaceService: SiWorkspaceService
  ) { }

  postExpenseFilter(skipExport: SkipExport): Observable<SkipExport> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_filters/`, skipExport);
  }

  getExpenseFilter(): Observable<ExpenseFilterResponse> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_filters/`, {});
  }

  deleteExpenseFilter(expenseFilterId?: number): Observable<SkipExport> {
    return this.apiService.delete(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_filters/${expenseFilterId}/`);
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
