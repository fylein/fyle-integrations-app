import { Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { Observable, Subject } from 'rxjs';
import { QbdConnectorPost, QbdConnectorGet, SyncDataType } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-connector.model';
import { Cacheable, CacheBuster } from 'ts-cacheable';

const qbdDirectConnectorGetCacheBuster$ = new Subject<void>();


@Injectable({
  providedIn: 'root'
})
export class QbdDirectConnectorService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  @CacheBuster({
    cacheBusterNotifier: qbdDirectConnectorGetCacheBuster$
  })
  postQbdConnectorSettings(payload: QbdConnectorPost): Observable<QbdConnectorGet> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/connector_settings/`, payload);
  }

  @Cacheable({
    cacheBusterObserver: qbdDirectConnectorGetCacheBuster$
  })
  getQBDConnectorSettings(): Observable<QbdConnectorGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/connector_settings/`, {});
  }

  syncAttribuites(): Observable<SyncDataType[]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/qbd/attribute_stats/`, {});
  }
}
