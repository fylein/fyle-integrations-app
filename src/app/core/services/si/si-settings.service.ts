import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiService } from '../core/api.service';
import { SageIntacctCredentials } from '../../models/si/db/sage-credentials.model';
import { SiWorkspaceService } from './si-core/si-workspace.service';
import { Cacheable, CacheBuster, globalCacheBusterNotifier } from 'ts-cacheable';
import { FyleCredentials } from '../../models/si/db/fyle-credentials.model';

const fyleCredentialsCache = new Subject<void>();
const sageIntacctCredentialsCache = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class SiSettingsService {

  constructor(
    private apiService: ApiService,
    private workspace: SiWorkspaceService
  ) { }

  @Cacheable({
    cacheBusterObserver: fyleCredentialsCache
  })
  getFyleCredentials(workspaceId: number): Observable<FyleCredentials> {
    return this.apiService.get('/workspaces/' + workspaceId + '/credentials/fyle/', {});
  }
 
  @Cacheable({
    cacheBusterObserver: sageIntacctCredentialsCache
  })
  getSageIntacctCredentials(workspaceId: number): Observable<SageIntacctCredentials> {
    return this.apiService.get('/workspaces/' + workspaceId + '/credentials/sage_intacct/', {});
  }

  @CacheBuster({
    cacheBusterNotifier: fyleCredentialsCache
  })
  connectFyle(workspaceId: number, authorizationCode: string): Observable<FyleCredentials> {
    return this.apiService.post('/workspaces/' + workspaceId + '/connect_fyle/authorization_code/', {
      code: authorizationCode
    });
  }

  @CacheBuster({
    cacheBusterNotifier: sageIntacctCredentialsCache
  })
  connectSageIntacct(workspaceId: number, data: SageIntacctCredentials): Observable<SageIntacctCredentials> {
    globalCacheBusterNotifier.next();
    return this.apiService.post('/workspaces/' + workspaceId + '/credentials/sage_intacct/', data);
  }
}
