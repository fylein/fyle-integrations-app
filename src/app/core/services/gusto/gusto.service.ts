import { Injectable } from '@angular/core';
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

}
