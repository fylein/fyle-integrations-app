import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { Cacheable, globalCacheBusterNotifier } from 'ts-cacheable';

@Injectable({
  providedIn: 'root',
})
export class QboHelperService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
  ) {}

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
    globalCacheBusterNotifier.next();
    return this.apiService.patch(`/workspaces/${this.workspaceService.getWorkspaceId()}/credentials/qbo/`, {});
  }
}
