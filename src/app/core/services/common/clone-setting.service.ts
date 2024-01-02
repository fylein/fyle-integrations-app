import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { WorkspaceService } from './workspace.service';
import { CloneSettingExist } from '../../models/common/clone-setting.model';
import { QBOCloneSetting, QBOCloneSettingPost } from '../../models/qbo/qbo-configuration/qbo-clone-setting.model';

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

  getCloneSettings(): Observable<QBOCloneSetting> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceId}/clone_settings/`, {});
  }

  postCloneSettings(cloneSettingsPayload: QBOCloneSettingPost): Observable<QBOCloneSetting> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceId}/clone_settings/`, cloneSettingsPayload);
  }
}
