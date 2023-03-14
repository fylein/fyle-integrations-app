import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Travelperk } from '../../models/travelperk/travelperk.model';
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

}
