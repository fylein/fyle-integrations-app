import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { QBOCredential } from 'src/app/core/models/qbo/db/qbo-credential.model';
import { QBOConnectorPost } from 'src/app/core/models/qbo/qbo-configuration/qbo-connector.model';
import { CacheBuster, Cacheable, globalCacheBusterNotifier } from 'ts-cacheable';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { HelperService } from '../../common/helper.service';
import { AppUrl } from 'src/app/core/models/enum/enum.model';

const qboCredentialsCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class QboConnectorService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    private helperService: HelperService
  ) {
    helperService.setBaseApiURL(AppUrl.QBO);
  }

  @CacheBuster({
    cacheBusterNotifier: qboCredentialsCache$
  })
  connectQBO(qboConnector: QBOConnectorPost): Observable<QBOCredential> {
    globalCacheBusterNotifier.next();
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/connect_qbo/authorization_code/`, qboConnector);
  }

  @Cacheable({
    cacheBusterObserver: qboCredentialsCache$
  })
  getQBOCredentials(): Observable<QBOCredential> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/credentials/qbo/`, {});
  }

  @Cacheable()
  checkQBOTokenHealth(): Observable<{}> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/token_health/`, {});
  }

  @Cacheable({
    cacheBusterObserver: qboCredentialsCache$
  })
  disconnectQBOConnection(): Observable<QBOCredential> {
    globalCacheBusterNotifier.next();
    return this.apiService.patch(`/workspaces/${this.workspaceService.getWorkspaceId()}/credentials/qbo/`, {});
  }

  @Cacheable()
  getPreferences(): Observable<{}> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/qbo/preferences/`, {});
  }
}
