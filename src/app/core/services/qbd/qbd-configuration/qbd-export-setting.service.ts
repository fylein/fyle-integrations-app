import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QBDExportSettingGet, QBDExportSettingPost } from 'src/app/core/models/qbd/qbd-configuration/export-setting.model';
import { QbdApiService } from '../qbd-core/qbd-api.service';
import { QbdWorkspaceService } from '../qbd-core/qbd-workspace.service';

@Injectable({
  providedIn: 'root'
})
export class QbdExportSettingService {

  constructor(
    private apiService: QbdApiService,
    private workspaceService: QbdWorkspaceService
  ) { }

  getQbdExportSettings(): Observable<QBDExportSettingGet>{
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, {});
  }

  postQbdExportSettings(exportSettingsPayload: QBDExportSettingPost): Observable<QBDExportSettingGet> {
    return this.apiService.put(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, exportSettingsPayload);
  }
}
