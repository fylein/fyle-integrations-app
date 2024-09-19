import { Injectable } from '@angular/core';
import type { ApiService } from '../../common/api.service';
import type { WorkspaceService } from '../../common/workspace.service';
import type { HelperService } from '../../common/helper.service';
import type { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import type { BusinessCentralImportSettingsGet, BusinessCentralImportSettingsPost } from 'src/app/core/models/business-central/business-central-configuration/business-central-import-settings.model';
import { Cacheable, CacheBuster } from 'ts-cacheable';

const businessCentralImportSettingGetCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class BusinessCentralImportSettingsService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    private helper: HelperService
  ) {
    helper.setBaseApiURL();
  }

  workspaceId: string = this.workspaceService.getWorkspaceId();

  @Cacheable({
    cacheBusterObserver: businessCentralImportSettingGetCache$
  })
  getBusinessCentralImportSettings(): Observable<BusinessCentralImportSettingsGet> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/import_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: businessCentralImportSettingGetCache$
  })
  postBusinessCentralImportSettings(importSettingsPayload: BusinessCentralImportSettingsPost): Observable<BusinessCentralImportSettingsGet> {
    return this.apiService.put(`/workspaces/${this.workspaceId}/import_settings/`, importSettingsPayload);
  }

}
