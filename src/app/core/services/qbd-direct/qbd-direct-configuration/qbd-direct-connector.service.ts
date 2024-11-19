import { Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { Observable } from 'rxjs';
import { QbdConnectorPost, QbdConnectorGet, SyncDataType } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-connector.model';

@Injectable({
  providedIn: 'root'
})
export class QbdDirectConnectorService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  postQbdDirectConntion(payload: QbdConnectorPost): Observable<QbdConnectorGet> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/connector_settings/`, payload);
  }

  getQbdDirectConntion(): Observable<QbdConnectorGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/connector_settings/`, {});
  }

  syncAttribuites(): Observable<SyncDataType[]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/qbd/attribute_stats/`, {});
  }
}
