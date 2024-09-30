import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WorkspaceService } from '../../common/workspace.service';
import { ApiService } from '../../common/api.service';
import { IntegrationField } from 'src/app/core/models/db/mapping.model';
import { QbdDirectImportSettingGet, QbdDirectImportSettingPost } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-import-settings.model copy';
import { Cacheable, CacheBuster } from 'ts-cacheable';

const qbdDirectImportSettingGetCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class QbdDirectImportSettingsService {

  workspaceId: string = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  @Cacheable({
    cacheBusterObserver: qbdDirectImportSettingGetCache$
  })
  getImportSettings(): Observable<QbdDirectImportSettingGet> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceId}/import_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: qbdDirectImportSettingGetCache$
  })
  postImportSettings(importSettingsPayload: QbdDirectImportSettingPost): Observable<QbdDirectImportSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceId}/import_settings/`, importSettingsPayload);
  }

  getQbdDirectFields(): Observable<IntegrationField[]> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/qbd_direct/fields/`, {});
  }

  getImportCodeFieldConfig() {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(`/v2/workspaces/${workspaceId}/import_settings/import_code_fields_config/`, {});
  }
}
