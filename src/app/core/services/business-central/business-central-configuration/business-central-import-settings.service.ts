import { Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { HelperService } from '../../common/helper.service';
import { Subject, Observable } from 'rxjs';
import { BusinessCentralImportSettingsGet, BusinessCentralImportSettingsPost } from 'src/app/core/models/business-central/business-central-configuration/business-central-import-settings.model';
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

  @Cacheable({
    cacheBusterObserver: businessCentralImportSettingGetCache$
  })
  getBusinessCentralImportSettings(): Observable<BusinessCentralImportSettingsGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: businessCentralImportSettingGetCache$
  })
  postBusinessCentralImportSettings(importSettingsPayload: BusinessCentralImportSettingsPost): Observable<BusinessCentralImportSettingsGet> {
    return this.apiService.put(`/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, importSettingsPayload);
  }

}
