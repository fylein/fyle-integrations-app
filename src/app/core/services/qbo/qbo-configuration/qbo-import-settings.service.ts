import { Injectable } from '@angular/core';
import { WorkspaceService } from '../../common/workspace.service';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import { Observable, Subject } from 'rxjs';
import { QBOImportSettingGet, QBOImportSettingPost } from 'src/app/core/models/qbo/qbo-configuration/qbo-import-setting.model';
import { ApiService } from '../../common/api.service';
import { IntegrationField } from 'src/app/core/models/db/mapping.model';

const qboImportSettingGetCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class QboImportSettingsService {

  workspaceId: string = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  @Cacheable({
    cacheBusterObserver: qboImportSettingGetCache$
  })
  getImportSettings(): Observable<QBOImportSettingGet> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceId}/import_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: qboImportSettingGetCache$
  })
  postImportSettings(importSettingsPayload: QBOImportSettingPost): Observable<QBOImportSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceId}/import_settings/`, importSettingsPayload);
  }

  getQBOFields(): Observable<IntegrationField[]> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/qbo/fields/`, {});
  }

  getImportCodeFieldConfig() {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(`/v2/workspaces/${workspaceId}/import_settings/import_code_fields_config/`, {});
  }
}
