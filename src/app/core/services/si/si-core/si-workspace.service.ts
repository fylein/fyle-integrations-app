import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IntacctOnboardingState } from 'src/app/core/models/enum/enum.model';
import { Workspace } from 'src/app/core/models/db/workspaces.model';
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

  setIntacctOnboardingState(IntacctOnboardingState: IntacctOnboardingState): void {
    return this.storageService.set('IntacctOnboardingState', IntacctOnboardingState);
  }

  getIntacctOnboardingState(): IntacctOnboardingState {
    const IntacctOnboardingState = this.storageService.get('IntacctOnboardingState');
    return IntacctOnboardingState ? IntacctOnboardingState : IntacctOnboardingState.EXPORT_SETTINGS;
  }

}
