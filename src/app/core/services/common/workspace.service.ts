import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import { Cacheable } from 'ts-cacheable';
import { Configuration } from '../../models/db/configuration.model';
import { AppUrl, IntacctOnboardingState, QBDOnboardingState } from '../../models/enum/enum.model';
import { IntacctWorkspace } from '../../models/si/db/workspaces.model';
import { ApiService } from './api.service';
import { QBDWorkspace } from '../../models/qbd/db/workspaces.model';
import { HelperService } from './helper.service';
import { AppUrlMap } from '../../models/integrations/integrations.model';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  constructor(
    private storageService: StorageService,
    private apiService: ApiService,
    private helper: HelperService
  ) {
    helper.setBaseApiURL();
   }

  importFyleAttributes(refresh: boolean): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.getWorkspaceId()}/fyle/import_attributes/`, {refresh});
  }

  // The return type is made any intentionally, the caller can specify the return type to be aligned with the app
  getWorkspace(orgId: string): any {
    return this.apiService.get('/workspaces/', {org_id: orgId});
  }

  // The return type is made any intentionally, the caller can specify the return type to be aligned with the app
  postWorkspace(): any {
    return this.apiService.post('/workspaces/', {});
  }

  getWorkspaceId(): string {
    return this.storageService.get('workspaceId');
  }

  setOnboardingState(onboardingState: IntacctOnboardingState | QBDOnboardingState): void {
    return this.storageService.set('onboarding-state', onboardingState);
  }

  getOnboardingState(): any {
    const appInitialOnboardingState: AppUrlMap = {
      [AppUrl.INTACCT]: IntacctOnboardingState.CONNECTION,
      [AppUrl.GUSTO]: QBDOnboardingState.EXPORT_SETTINGS,
      [AppUrl.SAGE300]: IntacctOnboardingState.CONNECTION,
      [AppUrl.BAMBOO_HR]: IntacctOnboardingState.CONNECTION,
      [AppUrl.QBD]: IntacctOnboardingState.CONNECTION,
      [AppUrl.TRAVELPERK]: IntacctOnboardingState.CONNECTION,
      [AppUrl.INTEGRATION]: IntacctOnboardingState.CONNECTION
    };
    const onboardingState = this.storageService.get('onboarding-state');
    return onboardingState ? onboardingState : appInitialOnboardingState[(this.helper.getAppName()) as AppUrl];
  }

  // The return type is made any intentionally, the caller can specify the return type to be aligned with the app
  getConfiguration(): any {
    return this.apiService.get(`/workspaces/${this.getWorkspaceId()}/configuration/`, {});
  }
}
