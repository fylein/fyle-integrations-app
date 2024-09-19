import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ApiService } from '../../common/api.service';
import type { WorkspaceService } from '../../common/workspace.service';
import { Cacheable } from 'ts-cacheable';

@Injectable({
  providedIn: 'root'
})
export class QboHelperService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  @Cacheable()
  syncFyleDimensions() {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/sync_dimensions/`, {});
  }

  @Cacheable()
  syncQBODimensions() {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/qbo/sync_dimensions/`, {});
  }

  refreshFyleDimensions(): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/refresh_dimensions/`, {});
  }

  refreshQBODimensions(): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/qbo/refresh_dimensions/`, {});
  }

  disconnect(): Observable<{}> {
    return this.apiService.patch(`/workspaces/${this.workspaceService.getWorkspaceId()}/credentials/qbo/`, {});
  }
}
