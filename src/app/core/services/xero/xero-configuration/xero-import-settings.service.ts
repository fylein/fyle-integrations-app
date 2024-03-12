import { Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { XeroImportSettingGet, XeroImportSettingPost } from 'src/app/core/models/xero/xero-configuration/xero-import-settings.model';
import { Observable, Subject } from 'rxjs';
import { CacheBuster, Cacheable } from 'ts-cacheable';

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
}
