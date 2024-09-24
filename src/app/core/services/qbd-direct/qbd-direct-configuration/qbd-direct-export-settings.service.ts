import { Injectable } from '@angular/core';
import { WorkspaceService } from '../../common/workspace.service';
import { Observable } from 'rxjs';
import { QbdDirectExportSettingGet, QbdDirectExportSettingsPost } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.model';
import { ApiService } from '../../common/api.service';
import { HelperService } from '../../common/helper.service';

@Injectable({
  providedIn: 'root'
})
export class QbdDirectExportSettingsService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    private helper: HelperService
  ) {
    helper.setBaseApiURL();
  }

  getQbdExportSettings(): Observable<QbdDirectExportSettingGet>{
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, {});
  }

  postQbdExportSettings(exportSettingsPayload: QbdDirectExportSettingsPost): Observable<QbdDirectExportSettingGet> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, exportSettingsPayload);
  }
}
