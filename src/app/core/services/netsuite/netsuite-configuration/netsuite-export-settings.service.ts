import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { NetSuiteExportSettingGet, NetSuiteExportSettingPost } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-export-setting.model';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';


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