import { Injectable } from '@angular/core';
import { CacheBuster, Cacheable, globalCacheBusterNotifier } from 'ts-cacheable';
import type { ApiService } from '../../common/api.service';
import type { StorageService } from '../../common/storage.service';
import { NetsuiteCredential } from 'src/app/core/models/netsuite/db/netsuite-credentials.model';
import type { SubsidiaryMapping } from 'src/app/core/models/netsuite/db/subsidiary-mapping.model';
import type { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import type { NetsuiteConnectorGet, NetsuiteConnectorPost, NetsuiteSubsidiaryMappingPost } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-connector.model';
import type { WorkspaceService } from '../../common/workspace.service';


const netsuiteCredentialCache = new Subject<void>();


@Injectable({
  providedIn: 'root'
})
export class NetsuiteConnectorService {

  workspaceId: number;

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    private storageService: StorageService
  ) { }

  @Cacheable({
    cacheBusterObserver: netsuiteCredentialCache
  })
  getNetsuiteCredentials(): Observable<NetsuiteConnectorGet> {
    this.workspaceId = this.storageService.get('workspaceId');
    return this.apiService.get(`/workspaces/${this.workspaceId}/credentials/netsuite/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: netsuiteCredentialCache
  })
  connectNetsuite(data: NetsuiteConnectorPost): Observable<NetsuiteConnectorGet> {
    this.workspaceId = this.storageService.get('workspaceId');
    globalCacheBusterNotifier.next();
    return this.apiService.post(`/workspaces/${this.workspaceId}/credentials/netsuite/`, data);
  }

  postSubsdiaryMapping(subsdiaryMappingPayload: NetsuiteSubsidiaryMappingPost): Observable<SubsidiaryMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/mappings/subsidiaries/`, subsdiaryMappingPayload);
  }

  getSubsidiaryMapping(): Observable<SubsidiaryMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(`/workspaces/${workspaceId}/mappings/subsidiaries/`, {});
  }
}
