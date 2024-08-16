import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IntacctOnboardingState } from 'src/app/core/models/enum/enum.model';
import { IntacctWorkspace } from 'src/app/core/models/intacct/db/workspaces.model';
import { Cacheable } from 'ts-cacheable';
import { StorageService } from '../../common/storage.service';
import { Configuration } from 'src/app/core/models/intacct/db/configuration.model';
import { HelperService } from '../../common/helper.service';
import { ApiService } from '../../common/api.service';

@Injectable({
  providedIn: 'root'
})
export class SiWorkspaceService {

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
  syncIntacctDimensions() {
    return this.apiService.post(`/workspaces/${this.getWorkspaceId()}/sage_intacct/sync_dimensions/`, {});
  }

  @Cacheable()
  getWorkspace(orgId: string): Observable<IntacctWorkspace[]> {
    return this.apiService.get('/workspaces/', {org_id: orgId, is_polling: false});
  }

  getWorkspaceWithoutCache(orgId: string, isPolling = false): Observable<IntacctWorkspace[]> {
    return this.apiService.get('/workspaces/', {org_id: orgId, is_polling: isPolling});
  }

  postWorkspace(): Observable<IntacctWorkspace> {
    return this.apiService.post('/workspaces/', {});
  }

  getWorkspaceId(): string {
    return this.storageService.get('workspaceId');
  }

  setIntacctOnboardingState(onboardingState: IntacctOnboardingState): void {
    return this.storageService.set('onboarding-state', onboardingState);
  }

  getIntacctOnboardingState(): IntacctOnboardingState {
    const onboardingState = this.storageService.get('onboarding-state');
    return onboardingState ? onboardingState : IntacctOnboardingState.CONNECTION;
  }

  getConfiguration(): Observable<Configuration> {
    return this.apiService.get(`/workspaces/${this.getWorkspaceId()}/configuration/`, {});
  }
}
