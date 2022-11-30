import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BambooHr } from '../../models/bamboo-hr/bamboo-hr.model';
import { ApiService } from '../core/api.service';
import { OrgService } from '../org/org.service';

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
}
