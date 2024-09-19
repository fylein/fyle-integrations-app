import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { QBDExportSettingGet, QBDExportSettingPost } from 'src/app/core/models/qbd/qbd-configuration/qbd-export-setting.model';
import type { QbdWorkspaceService } from '../qbd-core/qbd-workspace.service';
import type { ApiService } from '../../common/api.service';

@Injectable({
  providedIn: 'root'
})
export class QbdExportSettingService {

  constructor(
    private apiService: ApiService,
    private workspaceService: QbdWorkspaceService
  ) { }

  getQbdExportSettings(): Observable<QBDExportSettingGet>{
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, {});
  }

  postQbdExportSettings(exportSettingsPayload: QBDExportSettingPost): Observable<QBDExportSettingGet> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, exportSettingsPayload);
  }
}
