import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { QBDAdvancedSettingsGet, QBDAdvancedSettingsPost } from 'src/app/core/models/qbd/qbd-configuration/qbd-advanced-setting.model';
import type { QbdWorkspaceService } from '../qbd-core/qbd-workspace.service';
import type { ApiService } from '../../common/api.service';

@Injectable({
  providedIn: 'root'
})
export class QbdAdvancedSettingService {

  constructor(
    private apiService: ApiService,
    private workspaceService: QbdWorkspaceService
  ) { }

  getQbdAdvancedSettings(): Observable<QBDAdvancedSettingsGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_settings/`, {});
  }

  postQbdAdvancedSettings(advancedSettingPayload:QBDAdvancedSettingsPost): Observable<QBDAdvancedSettingsGet> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_settings/`, advancedSettingPayload);
  }
}
