import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { WorkspaceService } from './workspace.service';
import { Observable, from } from 'rxjs';
import { HelperService } from './helper.service';
import { IntegrationField, FyleField } from '../../models/db/mapping.model';


@Injectable({
  providedIn: 'root'
})
export class MappingService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    helper: HelperService
  ) {
    helper.setBaseApiURL();
  }

  workspaceId = this.workspaceService.getWorkspaceId();

  getDestinationAttributes(attributeTypes: string | string[], accountType?: string, active?: boolean): Observable<any> {
    const params: {attribute_types: string | string[], account_type?: string, active?: boolean} = {
      attribute_types: attributeTypes
    };

    if (accountType) {
      params.account_type = accountType;
    }
    if (active) {
      params.active = active;
    }

    return this.apiService.get(`/workspaces/${this.workspaceId}/mappings/destination_attributes/`, params);
  }

  getGroupedDestinationAttributes(attributeTypes: string[]): any {
    return from(this.getDestinationAttributes(attributeTypes).toPromise().then((response: any | undefined) => {
      return response?.reduce((groupedAttributes: any, attribute: any) => {
        const group: any = groupedAttributes[attribute.attribute_type] || [];
        group.push(attribute);
        groupedAttributes[attribute.attribute_type] = group;
        return groupedAttributes;
      }, {
        ACCOUNT: [],
        EXPENSE_TYPE: [],
        EXPENSE_PAYMENT_TYPE: [],
        VENDOR: [],
        EMPLOYEE: [],
        CHARGE_CARD_NUMBER: [],
        TAX_DETAIL: []
      });
    }));
  }

  getIntegrationsFields(app_name: string): Observable<IntegrationField[]> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/mappings/${app_name}/fields/`, {});
  }

  getFyleFields(): Observable<FyleField[]> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/mappings/fyle/fields/`, {});
  }

}
