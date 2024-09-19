import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import type { QBOCredential } from 'src/app/core/models/qbo/db/qbo-credential.model';
import type { QBOConnectorPost } from 'src/app/core/models/qbo/qbo-configuration/qbo-connector.model';
import { CacheBuster, Cacheable, globalCacheBusterNotifier } from 'ts-cacheable';
import type { ApiService } from '../../common/api.service';
import type { WorkspaceService } from '../../common/workspace.service';
import type { HelperService } from '../../common/helper.service';
import { AppUrl } from 'src/app/core/models/enum/enum.model';

const qboCredentialsCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class QboConnectorService {

  private readonly workspaceId = this.workspaceService.getWorkspaceId();

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
