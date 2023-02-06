import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QBDOnboardingState } from 'src/app/core/models/enum/enum.model';
import { Workspace } from 'src/app/core/models/qbd/db/workspaces.model';
import { Cacheable } from 'ts-cacheable';
import { StorageService } from '../../core/storage.service';
import { QbdApiService } from './qbd-api.service';

@Injectable({
  providedIn: 'root'
})
export class QbdWorkspaceService {

  constructor(
    private apiService: QbdApiService,
    private storageService: StorageService
  ) { }

  @Cacheable()
  getQBDWorkspace(orgId: string): Observable<Workspace> {
    return this.apiService.get('/workspaces/', {org_id: orgId});
  }

  postQBDWorkspace(): Observable<Workspace> {
    return this.apiService.post('/workspaces/', {});
  }

  getWorkspaceId(): string {
    return this.storageService.get('workspaceId');
  }

  setOnboardingState(onboardingState: QBDOnboardingState): void {
    return this.storageService.set('QBDonboardingState', onboardingState);
  }

  getOnboardingState(): QBDOnboardingState {
    const onboardingState = this.storageService.get('QBDonboardingState');
    return onboardingState ? onboardingState : QBDOnboardingState.EXPORT_SETTINGS;
  }
}
