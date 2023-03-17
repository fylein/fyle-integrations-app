import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { Travelperk, TravelperkConfiguration, TravelperkConfigurationPost } from '../../models/travelperk/travelperk.model';
import { ApiService } from '../core/api.service';
import { OrgService } from '../org/org.service';

@Injectable({
  providedIn: 'root'
})
export class TravelperkService {

  orgId: string = this.orgService.getOrgId();

  constructor(
    private apiService: ApiService,
    private orgService: OrgService
  ) { }

  createFolder(): Observable<{}> {
    return this.apiService.post(`/orgs/${this.orgId}/travelperk/folder/`, {});
  }

  uploadPackage(): Observable<{}> {
    return this.apiService.post(`/orgs/${this.orgId}/travelperk/packages/`, {});
  }

  getTravelperkData(): Observable<Travelperk> {
    return this.apiService.get(`/orgs/${this.orgId}/travelperk/`, {});
  }

  connectTravelperk(): Observable<{}>{
    return this.apiService.post(`/orgs/${this.orgId}/travelperk/travelperk_connection/`, {});
  }

  connectAwsS3(): Observable<{}>{
    return this.apiService.post(`/orgs/${this.orgId}/travelperk/s3_connection/`, {});
  }


  postConfigurations(payload: TravelperkConfigurationPost): Observable<TravelperkConfiguration> {
    return this.apiService.post(`/orgs/${this.orgId}/travelperk/configurations/`, payload);
  }

  getConfigurations(): Observable<TravelperkConfiguration> {
    return this.apiService.get(`/orgs/${this.orgId}/travelperk/configurations/`,{
      org_id: this.orgId
    });
  }

  patchConfigurations(recipe_status: boolean): Observable<TravelperkConfiguration>{
    console.log("Patch serviec is called");
    return this.apiService.patch(`/orgs/${this.orgId}/travelperk/recipe_status/`,{
      org_id: this.orgId,
      recipe_status: recipe_status
    });
  }
}
