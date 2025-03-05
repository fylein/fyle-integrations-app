import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { WorkspaceService } from './workspace.service';
import { CloneSettingExist } from '../../models/common/clone-setting.model';
import { QBOCloneSetting, QBOCloneSettingPost } from '../../models/qbo/qbo-configuration/qbo-clone-setting.model';
import { XeroCloneSetting, XeroCloneSettingPost } from '../../models/xero/xero-configuration/clone-setting.model';

@Injectable({
  providedIn: 'root'
})

export class CloneSettingService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  checkCloneSettingsExists(): Observable<CloneSettingExist> {
    return this.apiService.get(`/user/clone_settings/exists/`, {});
  }

  getCloneSettings(): Observable<any> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/clone_settings/`, {});
  }

  postCloneSettings(cloneSettingsPayload: QBOCloneSettingPost | XeroCloneSettingPost): Observable<any> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/clone_settings/`, cloneSettingsPayload);
  }
}
