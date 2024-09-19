import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { BambooHr, BambooHRConfiguration, BambooHRConfigurationPost, BambooHrConnection } from '../../models/bamboo-hr/bamboo-hr.model';
import type { ApiService } from '../common/api.service';
import type { OrgService } from '../org/org.service';

@Injectable({
  providedIn: 'root'
})
export class BambooHrService {

  orgId: string = this.orgService.getOrgId();

  constructor(
    private apiService: ApiService,
    private orgService: OrgService
  ) { }

  getBambooHRData(): Observable<BambooHr> {
    return this.apiService.get(`/orgs/${this.orgId}/bamboohr/`, {});
  }

  createFolder(): Observable<{}> {
    return this.apiService.post(`/orgs/${this.orgId}/bamboohr/folder/`, {});
  }

  uploadPackage(): Observable<{}> {
    return this.apiService.post(`/orgs/${this.orgId}/bamboohr/packages/`, {});
  }

  connectBambooHR(payload: BambooHrConnection): Observable<{}> {
    return this.apiService.post(`/orgs/${this.orgId}/bamboohr/bamboo_connection/`, payload);
  }

  getConfigurations(): Observable<BambooHRConfiguration> {
    return this.apiService.get(`/orgs/${this.orgId}/bamboohr/configuration/`, {
      org_id: this.orgId
    });
  }

  postConfigurations(payload: BambooHRConfigurationPost): Observable<BambooHRConfiguration> {
    return this.apiService.post(`/orgs/${this.orgId}/bamboohr/configuration/`, payload);
  }

  disconnectBambooHr(): Observable<{}> {
    return this.apiService.post(`/orgs/${this.orgId}/bamboohr/disconnect/`, {});
  }

  syncEmployees(): Observable<{}> {
    return this.apiService.post(`/orgs/${this.orgId}/bamboohr/refresh_employees/`, {});
  }
}
