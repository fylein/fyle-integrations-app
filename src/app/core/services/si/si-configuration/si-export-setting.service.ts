import { Injectable } from '@angular/core';
import type { SiWorkspaceService } from '../si-core/si-workspace.service';
import type { Observable } from 'rxjs';
import type { ExportSettingGet, ExportSettingPost } from 'src/app/core/models/intacct/intacct-configuration/export-settings.model';
import type { ApiService } from '../../common/api.service';

@Injectable({
  providedIn: 'root'
})
export class SiExportSettingService {

  constructor(
    private apiService: ApiService,
    private workspaceService: SiWorkspaceService
  ) { }

  getExportSettings(): Observable<ExportSettingGet>{
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, {});
  }

  postExportSettings(exportSettingsPayload: ExportSettingPost): Observable<ExportSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, exportSettingsPayload);
  }
}
