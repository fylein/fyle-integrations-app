import { Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { HelperService } from '../../common/helper.service';
import { WorkspaceService } from '../../common/workspace.service';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs';
import { Sage300ImportSettingGet, Sage300ImportSettingPost } from 'src/app/core/models/sage300/sage300-configuration/sage300-import-settings.model';

const sage300ImportSettingGetCache = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class Sage300ImportSettingsService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    helper: HelperService
  ) {
    helper.setBaseApiURL();
  }

  @Cacheable({
    cacheBusterObserver: sage300ImportSettingGetCache
  })
  getSage300ImportSettings(): Observable<Sage300ImportSettingGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, {});
  }


  @CacheBuster({
    cacheBusterNotifier: sage300ImportSettingGetCache
  })
  postImportSettings(importSettingsPayload: Sage300ImportSettingPost): Observable<Sage300ImportSettingGet> {
    return this.apiService.put(`/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, importSettingsPayload);
  }

  getImportCodeFieldConfig() {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(`/workspaces/${workspaceId}/import_settings/import_code_fields_config/`, {});
  }
}
