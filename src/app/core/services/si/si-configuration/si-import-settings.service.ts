import { Injectable } from '@angular/core';
import { SiWorkspaceService } from '../si-core/si-workspace.service';
import { Observable } from 'rxjs';
import { ImportSettingGet, ImportSettingPost, IntacctImportFieldsAttributeCounts, MappingSetting } from 'src/app/core/models/intacct/intacct-configuration/import-settings.model';
import { ApiService } from '../../common/api.service';


@Injectable({
  providedIn: 'root'
})
export class SiImportSettingsService {

  constructor(
    private apiService: ApiService,
    private workspaceService: SiWorkspaceService
  ) { }

  getImportSettings(): Observable<ImportSettingGet>{
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, {});
  }

  postImportSettings(importSettingsPayload: ImportSettingPost): Observable<ImportSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, importSettingsPayload);
  }

  getImportCodeFieldConfig() {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(`/v2/workspaces/${workspaceId}/import_settings/import_code_fields_config/`, {});
  }

  getImportFieldsAttributeCounts(): Observable<IntacctImportFieldsAttributeCounts> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/sage_intacct/attributes_count/`, {});
  }
}