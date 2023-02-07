import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QBDFieldMappingGet, QBDFieldMappingPost } from 'src/app/core/models/qbd/qbd-configuration/field-mapping.model';
import { QbdApiService } from '../qbd-core/qbd-api.service';
import { QbdWorkspaceService } from '../qbd-core/qbd-workspace.service';

@Injectable({
  providedIn: 'root'
})
export class QbdFieldMappingService {

  constructor(
    private apiService: QbdApiService,
    private workspaceService: QbdWorkspaceService
  ) { }

  getQbdFieldMapping(): Observable<QBDFieldMappingGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/field_mappings/`, {});
  }

  postQbdFieldMapping(fieldMappingPayload: QBDFieldMappingPost): Observable<QBDFieldMappingGet> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/field_mappings/`, fieldMappingPayload);
  }

}
