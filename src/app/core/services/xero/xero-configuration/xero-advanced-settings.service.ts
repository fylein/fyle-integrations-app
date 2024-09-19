import { Injectable } from '@angular/core';
import type { ApiService } from '../../common/api.service';
import type { WorkspaceService } from '../../common/workspace.service';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import type { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import type { XeroAdvancedSettingGet, XeroAdvancedSettingPost } from 'src/app/core/models/xero/xero-configuration/xero-advanced-settings.model';
import type { QBDEmailOptions } from 'src/app/core/models/qbd/qbd-configuration/qbd-advanced-setting.model';

const advancedSettingsCache$ = new Subject<void>();
@Injectable({
  providedIn: 'root'
})
export class XeroAdvancedSettingsService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  @Cacheable({
    cacheBusterObserver: advancedSettingsCache$
  })
  getAdvancedSettings(): Observable<XeroAdvancedSettingGet> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: advancedSettingsCache$
  })
  postAdvancedSettings(advancedSettingPayload: XeroAdvancedSettingPost): Observable<XeroAdvancedSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_settings/`, advancedSettingPayload);
  }

  getWorkspaceAdmins(): Observable<[QBDEmailOptions]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/admins/`, {});
  }

}
