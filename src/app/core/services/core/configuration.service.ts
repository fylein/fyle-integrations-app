import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { AdvancedSettingsGet } from '../../models/si/si-configuration/advanced-settings.model';
import { ExportSettingGet } from '../../models/si/si-configuration/export-settings.model';
import { ImportSettingGet } from '../../models/si/si-configuration/import-settings.model';
import { WorkspaceService } from './workspace.service';
import { HelperService } from './helper.service';
import { UrlName } from '../../models/enum/enum.model';
import { QBDAdvancedSettingsGet } from '../../models/qbd/qbd-configuration/advanced-setting.model';
import { QBDExportSettingGet } from '../../models/qbd/qbd-configuration/export-setting.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  appName: string = this.helper.getAppName();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    private helper: HelperService
  ) {
    helper.callSetBaseApiURL();
  }

  getBaseurl() {
    return this.appName !== UrlName.QBD ? '/v2/workspaces' : '/workspaces';
  }

  getAdvancedSettings(): Observable<AdvancedSettingsGet | QBDAdvancedSettingsGet> {
    return this.apiService.get(`${this.getBaseurl()}/${this.workspaceService.getWorkspaceId()}/advanced_settings/`, {});
  }

  getExportSettings(): Observable<ExportSettingGet | QBDExportSettingGet>{
    return this.apiService.get(`${this.getBaseurl()}/${this.workspaceService.getWorkspaceId()}/export_settings/`, {});
  }

  getImportSettings(): Observable<ImportSettingGet>{
    return this.apiService.get(`${this.getBaseurl()}/${this.workspaceService.getWorkspaceId()}/import_settings/`, {});
  }

}
