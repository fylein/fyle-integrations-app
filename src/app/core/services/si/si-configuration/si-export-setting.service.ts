import { Injectable } from '@angular/core';
import { SiWorkspaceService } from '../si-core/si-workspace.service';
import { SiApiService } from '../si-core/si-api.service';
import { Observable } from 'rxjs';
import { ExportSettingGet, ExportSettingPost } from 'src/app/core/models/si/si-configuration/export-settings.model';

@Injectable({
  providedIn: 'root'
})
export class SiExportSettingService {

  constructor(
    private apiService: SiApiService,
    private workspaceService: SiWorkspaceService
  ) { }

  getExportSettings(): Observable<ExportSettingGet>{
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, {});
  }

  postExportSettings(exportSettingsPayload: ExportSettingPost): Observable<ExportSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, exportSettingsPayload);
  }
}
