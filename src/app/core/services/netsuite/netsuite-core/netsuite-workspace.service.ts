import { Injectable } from '@angular/core';
import type { StorageService } from '../../common/storage.service';
import type { ApiService } from '../../common/api.service';
import { Cacheable } from 'ts-cacheable';
import { NetsuiteOnboardingState } from 'src/app/core/models/enum/enum.model';
import type { WorkspaceService } from '../../common/workspace.service';

@Injectable({
  providedIn: 'root'
})
export class NetsuiteWorkspaceService {

  constructor(
    private storageService: StorageService,
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) {
  }

  @Cacheable()
  syncFyleDimensions() {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/fyle/sync_dimensions/`, {});
  }

  @Cacheable()
  syncNetsuiteDimensions() {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/netsuite/sync_dimensions/`, {});
  }
}