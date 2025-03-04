import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { IntegrationField } from 'src/app/core/models/db/mapping.model';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import { CustomSegment, NetsuiteImportSettingGet, NetsuiteImportSettingPost } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-import-setting.model';


const netsuiteImportSettingGetCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class NetsuiteImportSettingsService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  @Cacheable({
    cacheBusterObserver: netsuiteImportSettingGetCache$
  })
  getImportSettings(): Observable<NetsuiteImportSettingGet> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: netsuiteImportSettingGetCache$
  })
  postImportSettings(importSettingsPayload: NetsuiteImportSettingPost): Observable<NetsuiteImportSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, importSettingsPayload);
  }

  getNetsuiteFields(): Observable<IntegrationField[]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/netsuite/netsuite_fields/`, {});
  }

  postNetsuiteCustomSegments(customSegmentsPayload: CustomSegment): Observable<CustomSegment> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/netsuite/custom_segments/`, customSegmentsPayload);
  }
}
