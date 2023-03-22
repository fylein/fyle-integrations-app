import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Gusto, GustoConfiguration, GustoConfigurationPost } from '../../models/gusto/gusto.model';
import { ApiService } from '../core/api.service';
import { OrgService } from '../org/org.service';

@Injectable({
  providedIn: 'root'
})
export class GustoService {

  orgId: string = this.orgService.getOrgId();

  constructor(
    private apiService: ApiService,
    private orgService: OrgService
  ) { }

  getGustoData(): Observable<Gusto> {
    return this.apiService.get(`/orgs/${this.orgId}/gusto/`, {});
  }

  createFolder(): Observable<{}> {
    return this.apiService.post(`/orgs/${this.orgId}/gusto/folder/`, {});
  }

  uploadPackage(): Observable<{}> {
    return this.apiService.post(`/orgs/${this.orgId}/gusto/packages/`, {});
  }

  getConfigurations(): Observable<GustoConfiguration> {
    return this.apiService.get(`/orgs/${this.orgId}/gusto/configuration/`, {
      org_id: this.orgId
    });
  }

  postConfigurations(payload: GustoConfigurationPost): Observable<GustoConfiguration> {
    return this.apiService.post(`/orgs/${this.orgId}/gusto/configuration/`, payload);
  }

  connect(): Observable<{message: {connection_id: string}}>{
    return this.apiService.post(`/orgs/${this.orgId}/gusto/connection/`, {});
  }

  syncEmployees(): Observable<{}> {
    return this.apiService.post(`/orgs/${this.orgId}/gusto/refresh_employees/`, {});
  }

  patchConfigurations(recipe_status: boolean): Observable<GustoConfiguration> {
    return this.apiService.patch(`/orgs/${this.orgId}/gusto/recipe_status/`, {
      org_id: this.orgId,
      recipe_status: recipe_status
    });
  }
}