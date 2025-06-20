import { Injectable } from '@angular/core';
import { HelperService } from '../../common/helper.service';
import { Observable, Subject } from 'rxjs';
import { ApiService } from '../../common/api.service';
import { StorageService } from '../../common/storage.service';
import { CacheBuster, Cacheable, globalCacheBusterNotifier } from 'ts-cacheable';
import { Sage300Credential } from 'src/app/core/models/sage300/db/sage300-credentials.model';

const sage300CredentialCache = new Subject<void>();

@Injectable({
  providedIn: 'root'
})

export class Sage300ConnectorService {

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    helper: HelperService
  ) {
    helper.setBaseApiURL();
  }

  @Cacheable({
    cacheBusterObserver: sage300CredentialCache
  })
  getSage300Credential(): Observable<Sage300Credential> {
    return this.apiService.get(`/workspaces/${this.storageService.get('workspaceId')}/credentials/sage300/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: sage300CredentialCache
  })
  connectSage300(data: Sage300Credential): Observable<Sage300Credential> {
    globalCacheBusterNotifier.next();
    return this.apiService.post(`/workspaces/${this.storageService.get('workspaceId')}/credentials/sage300/`, data);
  }

  @Cacheable()
  checkSage300TokenHealth(workspaceId: string): Observable<{}> {
    return this.apiService.get(`/workspaces/${workspaceId}/token_health/`, {});
  }

}
