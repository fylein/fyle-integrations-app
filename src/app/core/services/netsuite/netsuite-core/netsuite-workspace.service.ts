import { Injectable } from '@angular/core';
import { StorageService } from '../../common/storage.service';
import { ApiService } from '../../common/api.service';
import { Cacheable } from 'ts-cacheable';
import { Observable } from 'rxjs';
import { NetsuiteOnboardingState } from 'src/app/core/models/enum/enum.model';
import { Configuration } from 'src/app/core/models/intacct/intacct-configuration/import-settings.model';
import { IntacctWorkspace } from 'src/app/core/models/intacct/db/workspaces.model';

@Injectable({
  providedIn: 'root'
})
export class NetsuiteWorkspaceService {

  constructor(
    private storageService: StorageService,
    private apiService: ApiService
  ) {
  }

  @Cacheable()
  syncFyleDimensions() {
    return this.apiService.post(`/workspaces/${this.getWorkspaceId()}/fyle/sync_dimensions/`, {});
  }

  @Cacheable()
  syncNetsuiteDimensions() {
    return this.apiService.post(`/workspaces/${this.getWorkspaceId()}/sage_intacct/sync_dimensions/`, {});
  }

  @Cacheable()
  getWorkspace(orgId: string): Observable<IntacctWorkspace[]> {
    return this.apiService.get('/workspaces/', {org_id: orgId});
  }

  postWorkspace(): Observable<IntacctWorkspace> {
    return this.apiService.post('/workspaces/', {});
  }

  getWorkspaceId(): string {
    return this.storageService.get('netsuite.workspaceId');
  }

  setNetsuiteOnboardingState(onboardingState: NetsuiteOnboardingState): void {
    return this.storageService.set('onboarding-state', onboardingState);
  }

  getNetsuiteOnboardingState(): NetsuiteOnboardingState {
    const onboardingState = this.storageService.get('onboarding-state');
    return onboardingState ? onboardingState : NetsuiteOnboardingState.CONNECTION;
  }

  getConfiguration(): Observable<Configuration> {
    return this.apiService.get(`/workspaces/${this.getWorkspaceId()}/configuration/`, {});
  }
}