import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { CacheBuster, Cacheable, globalCacheBusterNotifier } from 'ts-cacheable';
import { XeroCredentials } from 'src/app/core/models/xero/db/xero-credential.model';
import { environment } from 'src/environments/environment';
import { TenantMapping, TenantMappingPost } from 'src/app/core/models/xero/db/xero-tenant-mapping.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';

const xeroCredentialsCache = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class XeroConnectorService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
  ) {}

  @CacheBuster({
    cacheBusterNotifier: xeroCredentialsCache,
  })
  connectXero(workspaceId: string, code: string): Observable<XeroCredentials> {
    globalCacheBusterNotifier.next();
    return this.apiService.post(`/workspaces/${workspaceId}/connect_xero/authorization_code/`, {
      code: code,
      redirect_uri: environment.xero_oauth_redirect_uri,
    });
  }

  @Cacheable({
    cacheBusterObserver: xeroCredentialsCache,
  })
  getXeroCredentials(workspaceId: string): Observable<XeroCredentials> {
    return this.apiService.get(`/workspaces/${workspaceId}/credentials/xero/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: xeroCredentialsCache,
  })
  revokeXeroConnection(workspaceId: string) {
    return this.apiService.post(`/workspaces/${workspaceId}/connection/xero/revoke/`, {});
  }

  @Cacheable()
  checkXeroTokenHealth(workspaceId: string): Observable<{}> {
    return this.apiService.get(`/workspaces/${workspaceId}/xero/token_health/`, {});
  }

  getXeroTenants(): Observable<DestinationAttribute[]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/xero/tenants/`, {
      attribute_type__exact: 'TENANT',
    });
  }

  postXeroTenants(): Observable<DestinationAttribute[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/xero/tenants/`, {});
  }

  getTenantMappings(): Observable<TenantMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/mappings/tenant/`, {});
  }

  postTenantMapping(tenantMappingPayload: TenantMappingPost): Observable<TenantMapping> {
    return this.apiService.post(
      `/workspaces/${this.workspaceService.getWorkspaceId()}/mappings/tenant/`,
      tenantMappingPayload,
    );
  }
}
