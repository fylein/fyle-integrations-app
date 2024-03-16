import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { NetSuiteExportSettingGet, NetSuiteExportSettingModel, NetSuiteExportSettingPost } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-export-setting.model';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { ExportModuleRule } from 'src/app/core/models/common/export-settings.model';
import { FormGroup } from '@angular/forms';
import { HelperUtility } from 'src/app/core/models/common/helper.model';

@Injectable({
  providedIn: 'root'
})
export class NetsuiteExportSettingsService {


  @Output() creditCardExportTypeChange: EventEmitter<string> = new EventEmitter();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  getExportSettings(): Observable<NetSuiteExportSettingGet>{
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, {});
  }

  postExportSettings(exportSettingsPayload: NetSuiteExportSettingPost): Observable<NetSuiteExportSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, exportSettingsPayload);
  }

}
