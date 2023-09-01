import { Injectable } from '@angular/core';
import { SiApiService } from '../si-core/si-api.service';
import { SiWorkspaceService } from '../si-core/si-workspace.service';
import { Observable } from 'rxjs';
import { ImportSettingGet, ImportSettingPost, MappingSetting } from 'src/app/core/models/si/si-configuration/import-settings.model';


@Injectable({
  providedIn: 'root'
})
export class SiImportSettingService {

  constructor(
    private apiService: SiApiService,
    private workspaceService: SiWorkspaceService
  ) { }

  getImportSettings(): Observable<ImportSettingGet>{
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, {});
  }

  postImportSettings(importSettingsPayload: ImportSettingPost): Observable<ImportSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, importSettingsPayload);
  }
}
