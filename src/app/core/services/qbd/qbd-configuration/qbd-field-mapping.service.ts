import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { QBDFieldMappingGet, QBDFieldMappingPost } from 'src/app/core/models/qbd/qbd-configuration/qbd-field-mapping.model';
import type { QbdWorkspaceService } from '../qbd-core/qbd-workspace.service';
import type { ApiService } from '../../common/api.service';
import { QBDExportSettingFormOption } from 'src/app/core/models/qbd/qbd-configuration/qbd-export-setting.model';

@Injectable({
  providedIn: 'root'
})
export class QbdFieldMappingService {

  constructor(
    private apiService: ApiService,
    private workspaceService: QbdWorkspaceService
  ) { }

  getQbdFieldMapping(): Observable<QBDFieldMappingGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/field_mappings/`, {});
  }

  postQbdFieldMapping(fieldMappingPayload: QBDFieldMappingPost): Observable<QBDFieldMappingGet> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/field_mappings/`, fieldMappingPayload);
  }
}
