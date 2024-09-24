import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QbdDirectAdvancedSettingsGet, QbdDirectAdvancedSettingsPost } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-advanced-settings.model';
import { ApiService } from '../../common/api.service';
import { QbdWorkspaceService } from '../../qbd/qbd-core/qbd-workspace.service';

@Injectable({
  providedIn: 'root'
})
export class QbdDirectAdvancedSettingsService {

  constructor(
    private apiService: ApiService,
    private workspaceService: QbdWorkspaceService
  ) { }

  getQbdAdvancedSettings(): Observable<QbdDirectAdvancedSettingsGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_settings/`, {});
  }

  postQbdAdvancedSettings(advancedSettingPayload:QbdDirectAdvancedSettingsPost): Observable<QbdDirectAdvancedSettingsGet> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_settings/`, advancedSettingPayload);
  }
}
