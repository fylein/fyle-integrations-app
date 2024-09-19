import { Injectable } from '@angular/core';
import type { SiWorkspaceService } from '../si-core/si-workspace.service';
import type { Observable } from 'rxjs';
import type { ImportSettingGet, ImportSettingPost } from 'src/app/core/models/intacct/intacct-configuration/import-settings.model';
import { MappingSetting } from 'src/app/core/models/intacct/intacct-configuration/import-settings.model';
import type { ApiService } from '../../common/api.service';


@Injectable({
  providedIn: 'root'
})
export class SiImportSettingService {

  constructor(
    private apiService: ApiService,
    private workspaceService: SiWorkspaceService
  ) { }

  getImportSettings(): Observable<ImportSettingGet>{
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, {});
  }

  postImportSettings(importSettingsPayload: ImportSettingPost): Observable<ImportSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, importSettingsPayload);
  }
}
