import { Injectable } from '@angular/core';
import { NetsuiteWorkspaceService } from './netsuite-workspace.service';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';

@Injectable({
  providedIn: 'root'
})
export class NetsuiteMappingsService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  refreshNetsuiteDimensions(dimensionsToSync: string[] = []) {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/netsuite/refresh_dimensions/`, {
      dimensions_to_sync: dimensionsToSync
    });
  }
}
