import { Injectable } from '@angular/core';
import { StorageService } from '../../common/storage.service';
import { ApiService } from '../../common/api.service';
import { Cacheable } from 'ts-cacheable';
import { Observable } from 'rxjs';
import { NetsuiteOnboardingState } from 'src/app/core/models/enum/enum.model';
import { Configuration } from 'src/app/core/models/intacct/intacct-configuration/import-settings.model';
import { IntacctWorkspace } from 'src/app/core/models/intacct/db/workspaces.model';
import { WorkspaceService } from '../../common/workspace.service';

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

  setNetsuiteOnboardingState(onboardingState: NetsuiteOnboardingState): void {
    return this.storageService.set('onboarding-state', onboardingState);
  }

  getNetsuiteOnboardingState(): NetsuiteOnboardingState {
    const onboardingState = this.storageService.get('onboarding-state');
    return onboardingState ? onboardingState : NetsuiteOnboardingState.CONNECTION;
  }
}