import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IntacctOnboardingState } from 'src/app/core/models/enum/enum.model';
import { IntacctWorkspace } from 'src/app/core/models/si/db/workspaces.model';
import { Cacheable } from 'ts-cacheable';
import { StorageService } from '../../core/storage.service';
import { SiApiService } from './si-api.service';

@Injectable({
  providedIn: 'root'
})
export class SiWorkspaceService {

  constructor(
    private storageService: StorageService,
    private apiService: SiApiService
  ) { }

  @Cacheable()
  getWorkspace(orgId: string): Observable<IntacctWorkspace> {
    return this.apiService.get('/workspaces/', {org_id: orgId});
  }

  postWorkspace(): Observable<IntacctWorkspace> {
    return this.apiService.post('/workspaces/', {});
  }

  getWorkspaceId(): string {
    return this.storageService.get('si.workspaceId');
  }

  setIntacctOnboardingState(onboardingState: IntacctOnboardingState): void {
    return this.storageService.set('IntacctOnboardingState', onboardingState);
  }

  getIntacctOnboardingState(): IntacctOnboardingState {
    const onboardingState = this.storageService.get('IntacctOnboardingState');
    return onboardingState ? onboardingState : IntacctOnboardingState.LANDING;
  }

}
