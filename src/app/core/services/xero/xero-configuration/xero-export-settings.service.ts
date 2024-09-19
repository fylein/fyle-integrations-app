import { Injectable } from '@angular/core';
import type { ApiService } from '../../common/api.service';
import type { WorkspaceService } from '../../common/workspace.service';
import type { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import type { XeroExportSettingGet, XeroExportSettingPost } from 'src/app/core/models/xero/xero-configuration/xero-export-settings.model';
import { CacheBuster, Cacheable } from 'ts-cacheable';

const xeroExportSettingCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class XeroExportSettingsService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  @Cacheable({
    cacheBusterObserver: xeroExportSettingCache$
  })
  getExportSettings(): Observable<XeroExportSettingGet>{
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: xeroExportSettingCache$
  })
  postExportSettings(exportSettingsPayload: XeroExportSettingPost): Observable<XeroExportSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, exportSettingsPayload);
  }
}
