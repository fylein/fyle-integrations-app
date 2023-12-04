import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { QBOCredential } from 'src/app/core/models/qbo/db/qbo-credential.model';
import { QBOConnectorPost } from 'src/app/core/models/qbo/qbo-configuration/qbo-connector.model';
import { CacheBuster, Cacheable, globalCacheBusterNotifier } from 'ts-cacheable';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';

const qboCredentialsCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class QboConnectorService {

  private readonly workspaceId = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  @CacheBuster({
    cacheBusterNotifier: qboCredentialsCache$
  })
  connectQBO(qboConnector: QBOConnectorPost): Observable<QBOCredential> {
    globalCacheBusterNotifier.next();
    return this.apiService.post(`/workspaces/${this.workspaceId}/connect_qbo/authorization_code/`, qboConnector);
  }

  @Cacheable({
    cacheBusterObserver: qboCredentialsCache$
  })
  getQBOCredentials(): Observable<QBOCredential> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/credentials/qbo/`, {});
  }

  @Cacheable({
    cacheBusterObserver: qboCredentialsCache$
  })
  disconnectQBOConnection(): Observable<QBOCredential> {
    globalCacheBusterNotifier.next();
    return this.apiService.patch(`/workspaces/${this.workspaceId}/credentials/qbo/`, {});
  }

  @Cacheable()
  getPreferences(): Observable<{}> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/qbo/preferences/`, {});
  }
}
