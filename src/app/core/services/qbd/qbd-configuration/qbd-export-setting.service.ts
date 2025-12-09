import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  QBDExportSettingGet,
  QBDExportSettingPost,
} from 'src/app/core/models/qbd/qbd-configuration/qbd-export-setting.model';
import { QbdWorkspaceService } from '../qbd-core/qbd-workspace.service';
import { ApiService } from '../../common/api.service';
import { HelperService } from '../../common/helper.service';

@Injectable({
  providedIn: 'root',
})
export class QbdExportSettingsService {
  constructor(
    private apiService: ApiService,
    private workspaceService: QbdWorkspaceService,
    private helper: HelperService,
  ) {
    helper.setBaseApiURL();
  }

  getQbdExportSettings(): Observable<QBDExportSettingGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, {});
  }

  postQbdExportSettings(exportSettingsPayload: QBDExportSettingPost): Observable<QBDExportSettingGet> {
    return this.apiService.post(
      `/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`,
      exportSettingsPayload,
    );
  }
}
