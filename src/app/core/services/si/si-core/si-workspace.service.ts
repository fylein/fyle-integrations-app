import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OnboardingState } from 'src/app/core/models/enum/enum.model';
import { Workspace } from 'src/app/core/models/si/db/workspaces.model';
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
  getWorkspace(orgId: string): Observable<Workspace> {
    return this.apiService.get('/workspaces/', {org_id: orgId});
  }

  postWorkspace(): Observable<Workspace> {
    return this.apiService.post('/workspaces/', {});
  }

  getWorkspaceId(): string {
    return this.storageService.get('workspaceId');
  }

  setOnboardingState(onboardingState: OnboardingState): void {
    return this.storageService.set('OnboardingState', onboardingState);
  }

  getOnboardingState(): OnboardingState {
    const onboardingState = this.storageService.get('OnboardingState');
    return onboardingState ? onboardingState : OnboardingState.EXPORT_SETTINGS;
  }

}
