import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cacheable } from 'ts-cacheable';
import { Org } from '../../models/org/org.model';
import { ApiService } from '../core/api.service';
import { StorageService } from '../core/storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrgService {

  constructor(
    private apiService: ApiService,
    private storageService: StorageService
  ) { }

  getOrgId(): string {
    return this.storageService.get('orgId');
  }

  createOrg(): Observable<Org> {
    return this.apiService.patch('/orgs/', {});
  }

  @Cacheable()
  getOrgs(orgId: string | undefined): Observable<Org> {
    return this.apiService.get(`/orgs/`, {
      org_id: orgId
    });
  }

  getCachedOrg(): Org {
    return this.storageService.get('org');
  }

  createWorkatoWorkspace(): Observable<{}> {
    return this.apiService.patch(`/orgs/${this.getOrgId()}/workato_workspace/`, {});
  }

  connectFyle(): Observable<{}> {
    return this.apiService.post(`/orgs/${this.getOrgId()}/connect_fyle/`, {});
  }
}
