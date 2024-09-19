import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ApiService } from './api.service';
import type { WorkspaceService } from './workspace.service';
import type { CloneSettingExist } from '../../models/common/clone-setting.model';
import type { QBOCloneSettingPost } from '../../models/qbo/qbo-configuration/qbo-clone-setting.model';
import { QBOCloneSetting } from '../../models/qbo/qbo-configuration/qbo-clone-setting.model';
import type { XeroCloneSettingPost } from '../../models/xero/xero-configuration/clone-setting.model';
import { XeroCloneSetting } from '../../models/xero/xero-configuration/clone-setting.model';

@Injectable({
  providedIn: 'root'
})

export class CloneSettingService {

  workspaceId = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  checkCloneSettingsExists(): Observable<CloneSettingExist> {
    return this.apiService.get(`/user/clone_settings/exists/`, {});
  }

  getCloneSettings(): Observable<any> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceId}/clone_settings/`, {});
  }

  postCloneSettings(cloneSettingsPayload: QBOCloneSettingPost | XeroCloneSettingPost): Observable<any> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceId}/clone_settings/`, cloneSettingsPayload);
  }
}
