import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QBDAdvancedSettingsGet, QBDAdvancedSettingsPost } from 'src/app/core/models/qbd/qbd-configuration/qbd-advanced-setting.model';
import { QbdWorkspaceService } from '../qbd-core/qbd-workspace.service';
import { ApiService } from '../../common/api.service';
import { HelperService } from '../../common/helper.service';

@Injectable({
  providedIn: 'root'
})
export class QbdAdvancedSettingsService {

  constructor(
    private apiService: ApiService,
    private workspaceService: QbdWorkspaceService,
    helper: HelperService
  ) {
    helper.setBaseApiURL();
  }

  getQbdAdvancedSettings(): Observable<QBDAdvancedSettingsGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_settings/`, {});
  }

  postQbdAdvancedSettings(advancedSettingPayload:QBDAdvancedSettingsPost): Observable<QBDAdvancedSettingsGet> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_settings/`, advancedSettingPayload);
  }
}
