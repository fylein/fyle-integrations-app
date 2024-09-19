import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import type { LocationEntityMapping } from 'src/app/core/models/intacct/db/location-entity-mapping.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import type { SiWorkspaceService } from './si-workspace.service';
import type { StorageService } from '../../common/storage.service';
import { Cacheable, CacheBuster, globalCacheBusterNotifier } from 'ts-cacheable';
import type { SageIntacctCredential } from 'src/app/core/models/intacct/db/sage-credentials.model';
import type { ApiService } from '../../common/api.service';


const sageIntacctCredentialCache = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class IntacctConnectorService {

  workspaceId: number;

  constructor(
    private apiService: ApiService,
    private workspaceService: SiWorkspaceService,
    private workspace: SiWorkspaceService,
    private storageService: StorageService
  ) { }

  @Cacheable({
    cacheBusterObserver: sageIntacctCredentialCache
  })
  getSageIntacctCredential(): Observable<SageIntacctCredential> {
    this.workspaceId = this.storageService.get('workspaceId');
    return this.apiService.get('/workspaces/' + this.workspaceId + '/credentials/sage_intacct/', {});
  }

  @CacheBuster({
    cacheBusterNotifier: sageIntacctCredentialCache
  })
  connectSageIntacct(data: SageIntacctCredential): Observable<SageIntacctCredential> {
    this.workspaceId = this.storageService.get('workspaceId');
    globalCacheBusterNotifier.next();
    return this.apiService.post('/workspaces/' + this.workspaceId + '/credentials/sage_intacct/', data);
  }

  postLocationEntityMapping(locationEntityMappingPayload: LocationEntityMapping): Observable<LocationEntityMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/mappings/location_entity/`, locationEntityMappingPayload);
  }

  getLocationEntityMapping(): Observable<LocationEntityMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/location_entity/`, {}
    );
  }
}
