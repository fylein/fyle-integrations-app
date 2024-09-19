import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { QBDOnboardingState } from 'src/app/core/models/enum/enum.model';
import type { QBDWorkspace } from 'src/app/core/models/qbd/db/qbd-workspace.model';
import { Cacheable } from 'ts-cacheable';
import type { StorageService } from '../../common/storage.service';
import type { ApiService } from '../../common/api.service';

@Injectable({
  providedIn: 'root'
})
export class QbdWorkspaceService {

  constructor(
    private apiService: ApiService,
    private storageService: StorageService
  ) { }

  @Cacheable()
  getQBDWorkspace(orgId: string): Observable<QBDWorkspace> {
    return this.apiService.get('/workspaces/', { org_id: orgId });
  }

  postQBDWorkspace(): Observable<QBDWorkspace> {
    return this.apiService.post('/workspaces/', {});
  }

  getWorkspaceId(): string {
    return this.storageService.get('workspaceId');
  }

  setOnboardingState(onboardingState: QBDOnboardingState): void {
    return this.storageService.set('QBDOnboardingState', onboardingState);
  }

  getOnboardingState(): QBDOnboardingState {
    const onboardingState = this.storageService.get('QBDOnboardingState');
    return onboardingState ? onboardingState : QBDOnboardingState.EXPORT_SETTINGS;
  }

  syncFyleDimensions() {
    return this.apiService.post(`/workspaces/${this.getWorkspaceId()}/fyle/sync_dimensions/`, {});
  }
}
