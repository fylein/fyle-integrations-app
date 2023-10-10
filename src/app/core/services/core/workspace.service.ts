import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import { Cacheable } from 'ts-cacheable';
import { Configuration } from '../../models/db/configuration.model';
import { IntacctOnboardingState, QBDOnboardingState } from '../../models/enum/enum.model';
import { IntacctWorkspace } from '../../models/si/db/workspaces.model';
import { ApiService } from './api.service';
import { QBDWorkspace } from '../../models/qbd/db/workspaces.model';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  constructor(
    private storageService: StorageService,
    private apiService: ApiService,
    private helper: HelperService
  ) {
    helper.callSetBaseApiURL();
   }

  @Cacheable()
  syncFyleDimensions() {
    return this.apiService.post(`/workspaces/${this.getWorkspaceId()}/fyle/sync_dimensions/`, {});
  }

  @Cacheable()
  getWorkspace(orgId: string): Observable<IntacctWorkspace[] | QBDWorkspace[]> {
    return this.apiService.get('/workspaces/', {org_id: orgId});
  }

  postWorkspace(): Observable<IntacctWorkspace | QBDWorkspace> {
    return this.apiService.post('/workspaces/', {});
  }

  getWorkspaceId(): string {
    return this.storageService.get('workspaceId');
  }

  setOnboardingState(onboardingState: IntacctOnboardingState | QBDOnboardingState): void {
    return this.storageService.set('onboardingState', onboardingState);
  }

  getOnboardingState(): QBDOnboardingState | IntacctOnboardingState {
    const appInitialOnboardingState: { [key: string]: string } = {
      'intacct': IntacctOnboardingState.CONNECTION,
      'qbd': QBDOnboardingState.EXPORT_SETTINGS
    };
    const onboardingState = this.storageService.get('OnboardingState');
    return onboardingState ? onboardingState : appInitialOnboardingState[this.helper.getAppName()];
  }

  getConfiguration(): Observable<Configuration> {
    return this.apiService.get(`/workspaces/${this.getWorkspaceId()}/configuration/`, {});
  }
}
