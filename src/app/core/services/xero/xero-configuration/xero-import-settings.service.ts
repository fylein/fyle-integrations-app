import { Injectable } from '@angular/core';
import type { ApiService } from '../../common/api.service';
import type { WorkspaceService } from '../../common/workspace.service';
import type { XeroImportSettingGet, XeroImportSettingPost } from 'src/app/core/models/xero/xero-configuration/xero-import-settings.model';
import type { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import type { IntegrationField } from 'src/app/core/models/db/mapping.model';

const xeroImportSettingGetCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class XeroImportSettingsService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  @Cacheable({
    cacheBusterObserver: xeroImportSettingGetCache$
  })
  getImportSettings(): Observable<XeroImportSettingGet> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: xeroImportSettingGetCache$
  })
  postImportSettings(exportSettingsPayload: XeroImportSettingPost): Observable<XeroImportSettingGet>{
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, exportSettingsPayload);
  }

  getXeroField(): Observable<IntegrationField[]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/xero/xero_fields/`, {});
  }
}
