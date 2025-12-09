import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import {
  AppUrl,
  BusinessCentralOnboardingState,
  IntacctOnboardingState,
  NetsuiteOnboardingState,
  QBDOnboardingState,
  QBOOnboardingState,
  Sage300OnboardingState,
  Sage50OnboardingState,
  XeroOnboardingState,
} from '../../models/enum/enum.model';
import { ApiService } from './api.service';
import { HelperService } from './helper.service';
import { AppUrlMap } from '../../models/integrations/integrations.model';
import { WorkspaceOnboardingState } from '../../models/db/workspaces.model';
import { QbdDirectWorkspace } from '../../models/qbd-direct/db/qbd-direct-workspaces.model';
import { Cacheable } from 'ts-cacheable';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  constructor(
    private storageService: StorageService,
    private apiService: ApiService,
    private helper: HelperService,
  ) {
    helper.setBaseApiURL();
  }

  importFyleAttributes(refresh: boolean): Observable<{}> {
    return this.apiService.post(this.helper.buildEndpointPath(`${this.getWorkspaceId()}/fyle/import_attributes/`), {
      refresh,
    });
  }

  // The return type is made any intentionally, the caller can specify the return type to be aligned with the app
  getWorkspace(orgId: string): any {
    return this.apiService.get('/workspaces/', { org_id: orgId });
  }

  // The return type is made any intentionally, the caller can specify the return type to be aligned with the app
  postWorkspace(): any {
    return this.apiService.post('/workspaces/', {});
  }

  getWorkspaceId(): string {
    return this.storageService.get('workspaceId');
  }

  setWorkspaceId(workspaceId: number): void {
    this.storageService.set('workspaceId', workspaceId);
  }

  setOnboardingState(onboardingState: string): void {
    this.storageService.set('onboarding-state', onboardingState);
  }

  // The return type is made any intentionally, the caller can specify the return type to be aligned with the app
  getOnboardingState(): any {
    const appInitialOnboardingState: AppUrlMap = {
      [AppUrl.INTACCT]: IntacctOnboardingState.CONNECTION,
      [AppUrl.SAGE300]: Sage300OnboardingState.CONNECTION,
      [AppUrl.BAMBOO_HR]: null,
      [AppUrl.QBD]: QBDOnboardingState.CONNECTION,
      [AppUrl.TRAVELPERK]: null,
      [AppUrl.INTEGRATION]: '',
      [AppUrl.BUSINESS_CENTRAL]: BusinessCentralOnboardingState.CONNECTION,
      [AppUrl.QBO]: QBOOnboardingState.CONNECTION,
      [AppUrl.NETSUITE]: NetsuiteOnboardingState.CONNECTION,
      [AppUrl.XERO]: XeroOnboardingState.CONNECTION,
      [AppUrl.QBD_DIRECT]: QBDOnboardingState.CONNECTION,
      [AppUrl.SAGE50]: Sage50OnboardingState.YET_TO_START,
    };
    const onboardingState = this.storageService.get('onboarding-state');
    return onboardingState ? onboardingState : appInitialOnboardingState[this.helper.getAppName() as AppUrl];
  }

  // The return type is made any intentionally, the caller can specify the return type to be aligned with the app
  getConfiguration(): Observable<any> {
    return this.apiService.get(this.helper.buildEndpointPath(`${this.getWorkspaceId()}/configuration/`), {});
  }

  getWorkspaceGeneralSettings(): Observable<any> {
    return this.apiService.get(this.helper.buildEndpointPath(`${this.getWorkspaceId()}/settings/general/`), {});
  }

  updateWorkspaceOnboardingState(payload: WorkspaceOnboardingState): Observable<QbdDirectWorkspace> {
    return this.apiService.patch(`/workspaces/${this.getWorkspaceId()}/onboarding_state/`, payload);
  }
}
