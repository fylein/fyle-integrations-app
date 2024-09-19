import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import type { ApiService } from '../../common/api.service';
import type { WorkspaceService } from '../../common/workspace.service';
import type { IntegrationField } from 'src/app/core/models/db/mapping.model';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import type { CustomSegment, NetsuiteImportSettingGet, NetsuiteImportSettingPost } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-import-setting.model';


const netsuiteImportSettingGetCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class NetsuiteImportSettingsService {

  workspaceId: string = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  @Cacheable({
    cacheBusterObserver: netsuiteImportSettingGetCache$
  })
  getImportSettings(): Observable<NetsuiteImportSettingGet> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceId}/import_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: netsuiteImportSettingGetCache$
  })
  postImportSettings(importSettingsPayload: NetsuiteImportSettingPost): Observable<NetsuiteImportSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceId}/import_settings/`, importSettingsPayload);
  }

  getNetsuiteFields(): Observable<IntegrationField[]> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/netsuite/netsuite_fields/`, {});
  }

  postNetsuiteCustomSegments(customSegmentsPayload: CustomSegment): Observable<CustomSegment> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/netsuite/custom_segments/`, customSegmentsPayload);
  }
}
