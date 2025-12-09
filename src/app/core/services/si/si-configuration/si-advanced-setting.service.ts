import { Injectable } from '@angular/core';
import { SiWorkspaceService } from '../si-core/si-workspace.service';
import { Observable } from 'rxjs';
import {
  AdvancedSettingsGet,
  AdvancedSettingsPost,
  ConditionField,
  ExpenseFilterResponse,
  SkipExport,
} from 'src/app/core/models/intacct/intacct-configuration/advanced-settings.model';
import { EmailOption } from 'src/app/core/models/bamboo-hr/bamboo-hr.model';
import { StorageService } from '../../common/storage.service';
import { ApiService } from '../../common/api.service';

@Injectable({
  providedIn: 'root',
})
export class SiAdvancedSettingsService {
  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    private workspaceService: SiWorkspaceService,
  ) {}

  getFyleCustomFields(): Observable<ConditionField[]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/custom_fields/`, {});
  }

  postExpenseFilter(skipExport: SkipExport): Observable<SkipExport> {
    return this.apiService.post(
      `/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_filters/`,
      skipExport,
    );
  }

  getExpenseFilter(): Observable<ExpenseFilterResponse> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_filters/`, {});
  }

  deleteExpenseFilter(rank: number): Observable<SkipExport> {
    return this.apiService.delete(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/expense_filters/`, {
      rank,
    });
  }

  getAdvancedSettings(): Observable<AdvancedSettingsGet> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_settings/`, {});
  }

  postAdvancedSettings(advancedSettingsPayload: AdvancedSettingsPost): Observable<AdvancedSettingsGet> {
    return this.apiService.put(
      `/v2/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_settings/`,
      advancedSettingsPayload,
    );
  }

  getAdditionalEmails(): Observable<EmailOption[]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/admins/`, {});
  }
}
