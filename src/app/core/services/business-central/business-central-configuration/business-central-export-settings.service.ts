import { Injectable } from '@angular/core';
import type { ApiService } from '../../common/api.service';
import type { WorkspaceService } from '../../common/workspace.service';
import type { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import type { BusinessCentralExportSettingGet, BusinessCentralExportSettingPost } from 'src/app/core/models/business-central/business-central-configuration/business-central-export-setting.model';
import type { HelperService } from '../../common/helper.service';
import { CacheBuster, Cacheable } from 'ts-cacheable';

const businessCentralExportSettingCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class BusinessCentralExportSettingsService {

  private readonly workspaceId = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    helper: HelperService
  ) {
    helper.setBaseApiURL();
  }

  @Cacheable({
    cacheBusterObserver: businessCentralExportSettingCache$
  })
  getExportSettings(): Observable<BusinessCentralExportSettingGet> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/export_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: businessCentralExportSettingCache$
  })
  postExportSettings(exportSettingsPayload: BusinessCentralExportSettingPost): Observable<BusinessCentralExportSettingGet> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/export_settings/`, exportSettingsPayload);
  }
}
