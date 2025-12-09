import { Injectable } from '@angular/core';
import { CacheBuster, Cacheable, globalCacheBusterNotifier } from 'ts-cacheable';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { Observable, Subject } from 'rxjs';
import { BusinessCentralCredential } from 'src/app/core/models/business-central/db/business-central-credentials.model';
import { BusinessCentralConnectorPost } from 'src/app/core/models/business-central/business-central-configuration/business-central-connector.model';
import {
  BusinessCentralCompanyPost,
  BusinessCentralWorkspace,
} from 'src/app/core/models/business-central/db/business-central-workspace.model';

const businessCentralCredentialsCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class BusinessCentralConnectorService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
  ) {}

  @CacheBuster({
    cacheBusterNotifier: businessCentralCredentialsCache$,
  })
  connectBusinessCentral(
    businessCentralConnector: BusinessCentralConnectorPost,
  ): Observable<BusinessCentralCredential> {
    globalCacheBusterNotifier.next();
    return this.apiService.post(
      `/workspaces/${this.workspaceService.getWorkspaceId()}/connect_business_central/authorization_code/`,
      businessCentralConnector,
    );
  }

  @Cacheable({
    cacheBusterObserver: businessCentralCredentialsCache$,
  })
  getBusinessCentralCredentials(): Observable<BusinessCentralCredential> {
    return this.apiService.get(
      `/workspaces/${this.workspaceService.getWorkspaceId()}/credentials/business_central/`,
      {},
    );
  }

  postBusinessCentralCompany(companyPayload: BusinessCentralCompanyPost): Observable<BusinessCentralWorkspace> {
    return this.apiService.post(
      `/workspaces/${this.workspaceService.getWorkspaceId()}/business_central/company/`,
      companyPayload,
    );
  }

  @Cacheable({
    cacheBusterObserver: businessCentralCredentialsCache$,
  })
  getBusinessCentralConnection() {
    return this.apiService.get(
      `/workspaces/${this.workspaceService.getWorkspaceId()}/business_central/connection/`,
      {},
    );
  }
}
