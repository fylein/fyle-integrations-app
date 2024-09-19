import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ApiService } from '../../common/api.service';
import type { WorkspaceService } from '../../common/workspace.service';
import { Cacheable } from 'ts-cacheable';

@Injectable({
  providedIn: 'root'
})
export class NetsuiteHelperService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  @Cacheable()
  syncFyleDimensions() {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/sync_dimensions/`, {});
  }

  @Cacheable()
  syncNetsuiteDimensions() {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/netsuite/sync_dimensions/`, {});
  }

  refreshFyleDimensions(): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/refresh_dimensions/`, {});
  }

  refreshNetsuiteDimensions(): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/netsuite/refresh_dimensions/`, {});
  }
}
