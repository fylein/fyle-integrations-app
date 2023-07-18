import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { SiWorkspaceService } from './si-workspace.service';

@Injectable({
  providedIn: 'root'
})
export class SiMappingsService {

  constructor(
    private apiService: ApiService,
    private workspaceService: SiWorkspaceService
  ) { }

  refreshSageIntacctDimensions(dimensionsToSync: string[] = []) {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/sage_intacct/refresh_dimensions/`, {
      dimensions_to_sync: dimensionsToSync
    });
  }
}
