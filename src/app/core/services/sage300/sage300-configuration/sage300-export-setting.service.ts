import { Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { HelperService } from '../../common/helper.service';
import { WorkspaceService } from '../../common/workspace.service';
import { Observable } from 'rxjs/internal/Observable';
import { sage300ExportSettingGet, sage300ExportSettingPost } from 'src/app/core/models/sage300/sage300-configuration/sage300-export-setting.model';

@Injectable({
  providedIn: 'root'
})
export class Sage300ExportSettingService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    helper: HelperService
  ) {
    helper.setBaseApiURL();
  }

  getSage300ExportSettings(): Observable<sage300ExportSettingGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, {});
  }

  postExportSettings(exportSettingsPayload: sage300ExportSettingPost): Observable<sage300ExportSettingGet> {
    return this.apiService.put(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, exportSettingsPayload);
  }
}
