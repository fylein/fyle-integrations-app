import { Injectable } from '@angular/core';
import { WorkspaceService } from '../../common/workspace.service';
import { ApiService } from '../../common/api.service';
import { Cacheable, globalCacheBusterNotifier } from 'ts-cacheable';

@Injectable({
  providedIn: 'root',
})
export class XeroHelperService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
  ) {}

  @Cacheable()
  syncXeroDimensions() {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/xero/sync_dimensions/`, {});
  }

  @Cacheable()
  syncFyleDimensions() {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/sync_dimensions/`, {});
  }

  refreshXeroDimensions() {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/xero/refresh_dimensions/`, {});
  }

  refreshFyleDimensions() {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/refresh_dimensions/`, {});
  }

  disconnect() {
    globalCacheBusterNotifier.next();
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/connection/xero/revoke/`, {});
  }
}
