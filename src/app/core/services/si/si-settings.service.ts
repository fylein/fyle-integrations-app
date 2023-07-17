import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiService } from '../core/api.service';
import { SageIntacctCredentials } from '../../models/si/db/sage-credentials.model'; 
import { SiWorkspaceService } from './si-core/si-workspace.service';
import { Cacheable, CacheBuster, globalCacheBusterNotifier } from 'ts-cacheable';

const sageIntacctCredentialsCache = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class SiSettingsService {

  constructor(
    private apiService: ApiService, 
    private workspace: SiWorkspaceService
  ) { }

  @CacheBuster({
    cacheBusterNotifier: sageIntacctCredentialsCache
  })
  connectSageIntacct(workspaceId: number, data: SageIntacctCredentials): Observable<SageIntacctCredentials> {
    globalCacheBusterNotifier.next();
    return this.apiService.post('/workspaces/' + workspaceId + '/credentials/sage_intacct/', data);
  }

  @Cacheable({
    cacheBusterObserver: sageIntacctCredentialsCache
  })
  getSageIntacctCredentials(workspaceId: number): Observable<SageIntacctCredentials> {
    return this.apiService.get('/workspaces/' + workspaceId + '/credentials/sage_intacct/', {});
  }
}
