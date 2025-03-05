import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { WorkspaceService } from '../../common/workspace.service';
import { ApiService } from '../../common/api.service';
import { IntegrationField } from 'src/app/core/models/db/mapping.model';
import { QbdDirectImportSettingGet, QbdDirectImportSettingPost } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-import-settings.model';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { ImportCodeFieldConfigType } from 'src/app/core/models/common/import-settings.model';

const qbdDirectImportSettingGetCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class QbdDirectImportSettingsService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  @Cacheable({
    cacheBusterObserver: qbdDirectImportSettingGetCache$
  })
  getImportSettings(): Observable<QbdDirectImportSettingGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: qbdDirectImportSettingGetCache$
  })
  postImportSettings(importSettingsPayload: QbdDirectImportSettingPost): Observable<QbdDirectImportSettingGet> {
    return this.apiService.put(`/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, importSettingsPayload);
  }

  getQbdDirectFields(): Observable<IntegrationField[]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/qbd/fields/`, {});
  }

  getImportCodeFieldConfig(): Observable<ImportCodeFieldConfigType>{
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(`/workspaces/${workspaceId}/import_code_fields_config/`, {});
  }
}
