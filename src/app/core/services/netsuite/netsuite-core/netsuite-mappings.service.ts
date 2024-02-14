import { Injectable } from '@angular/core';
import { NetsuiteWorkspaceService } from './netsuite-workspace.service';
import { ApiService } from '../../common/api.service';

@Injectable({
  providedIn: 'root'
})
export class NetsuiteMappingsService {

  constructor(
    private apiService: ApiService,
    private workspaceService: NetsuiteWorkspaceService
  ) { }
  
  refreshNetsuiteDimensions(dimensionsToSync: string[] = []) {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/1/netsuite/refresh_dimensions/`, {
      dimensions_to_sync: dimensionsToSync
    });
  }
}
