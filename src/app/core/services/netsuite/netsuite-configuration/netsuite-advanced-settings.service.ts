import { Injectable } from '@angular/core';
import type { ApiService } from '../../common/api.service';
import type { WorkspaceService } from '../../common/workspace.service';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import type { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import type { NetsuiteAdvancedSettingGet, NetsuiteAdvancedSettingPost } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-advanced-settings.model';

const advancedSettingsCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class NetsuiteAdvancedSettingsService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  @Cacheable({
    cacheBusterObserver: advancedSettingsCache$
  })
  getAdvancedSettings(): Observable<NetsuiteAdvancedSettingGet> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_configurations/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: advancedSettingsCache$
  })
  postAdvancedSettings(exportSettingsPayload: NetsuiteAdvancedSettingPost): Observable<NetsuiteAdvancedSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_configurations/`, exportSettingsPayload);
  }
}
