import { Injectable } from '@angular/core';
import { CacheBuster, Cacheable, globalCacheBusterNotifier } from 'ts-cacheable';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { Observable, Subject } from 'rxjs';
import { BusinessCentralCredential } from 'src/app/core/models/business-central/db/business-central-credentials.model';
import { BusinessCentralConnectorPost } from 'src/app/core/models/business-central/business-central-configuration/business-central-connector.model';

const businessCentralCredentialsCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class BusinessCentralConnectorService {

  private readonly workspaceId = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  @CacheBuster({
    cacheBusterNotifier: businessCentralCredentialsCache$
  })
  connectBusinessCentral(businessCentralConnector: BusinessCentralConnectorPost): Observable<BusinessCentralCredential> {
    globalCacheBusterNotifier.next();
    return this.apiService.post(`/workspaces/${this.workspaceId}/business_central/credentials/`, businessCentralConnector);
  }

  @Cacheable({
    cacheBusterObserver: businessCentralCredentialsCache$
  })
  getBusinessCentralCredentials(): Observable<BusinessCentralCredential> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/credentials/business_central/`, {});
  }

  @Cacheable({
    cacheBusterObserver: businessCentralCredentialsCache$
  })
  disconnectBusinessCentralConnection(): Observable<BusinessCentralCredential> {
    globalCacheBusterNotifier.next();
    return this.apiService.patch(`/workspaces/${this.workspaceId}/credentials/business_central/`, {});
  }

}
