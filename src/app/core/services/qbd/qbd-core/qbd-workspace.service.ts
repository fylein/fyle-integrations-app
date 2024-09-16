import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { QBDOnboardingState } from 'src/app/core/models/enum/enum.model';
import { QBDWorkspace } from 'src/app/core/models/qbd/db/qbd-workspace.model';
import { Cacheable } from 'ts-cacheable';
import { StorageService } from '../../common/storage.service';
import { ApiService } from '../../common/api.service';

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
    return this.apiService.get('/workspaces/', {org_id: orgId});
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

  spotlightQuery(query: string) {
    return this.apiService.post(`/workspaces/${this.getWorkspaceId()}/spotlight/query/`, { query });
  }

  spotlightAction(code: string) {
    return this.apiService.post(`/workspaces/${this.getWorkspaceId()}/spotlight/action/`, { code });
  }

  spotlightHelp(query: string) {
    return this.apiService.post(`/workspaces/${this.getWorkspaceId()}/spotlight/help/`, { query });
  }

  samePageOptions(page_name: string): Observable<any> {
    return this.apiService.post(`/workspaces/${this.getWorkspaceId()}/spotlight/suggest_actions/`, { user_query: page_name });
  }

  private defaultOptionsSubject = new BehaviorSubject<any>(null);
  defaultOptions$ = this.defaultOptionsSubject.asObservable();

  initializeDefaultOptions(page_name: string): void {
    this.samePageOptions(page_name).subscribe(
      (options) => {
        this.defaultOptionsSubject.next(options);
      },
      (error) => {
        console.error('Error fetching default options:', error);
      }
    );
  }
}
