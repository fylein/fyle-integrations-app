import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { DestinationAttribute, GroupedDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { SiApiService } from './si-api.service';
import { SiWorkspaceService } from './si-workspace.service';
import { ExpenseField } from 'src/app/core/models/si/db/expense-field.model';
import { Configuration } from 'src/app/core/models/db/configuration.model';
import { MappingSetting, MappingSettingResponse } from 'src/app/core/models/si/db/mapping-setting.model';

@Injectable({
  providedIn: 'root'
})
export class SiMappingsService {

  constructor(
    private apiService: SiApiService,
    private workspaceService: SiWorkspaceService
  ) { }

  refreshSageIntacctDimensions(dimensionsToSync: string[] = []) {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/sage_intacct/refresh_dimensions/`, {
      dimensions_to_sync: dimensionsToSync
    });
  }

  getConfiguration(): Observable<Configuration>{
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(`/workspaces/${workspaceId}/configuration/`, {});
  }

  getSageIntacctFields(): Observable<ExpenseField[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/sage_intacct/sage_intacct_fields/`, {});
  }

  getFyleFields(): Observable<ExpenseField[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/fyle_fields/`, {}
    );
  }

  getSageIntacctDestinationAttributes(attributeTypes: string | string[], accountType?: string, active?: boolean): Observable<DestinationAttribute[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    const params: {attribute_types: string | string[], account_type?: string, active?: boolean} = {
      attribute_types: attributeTypes
    };

    if (accountType) {
      params.account_type = accountType;
    }
    if (active) {
      params.active = active;
    }

    return this.apiService.get(`/workspaces/${workspaceId}/sage_intacct/destination_attributes/`, params);
  }

  getGroupedDestinationAttributes(attributeTypes: string[]): Observable<GroupedDestinationAttribute> {
    return from(this.getSageIntacctDestinationAttributes(attributeTypes).toPromise().then((response: DestinationAttribute[] | undefined) => {
      return response?.reduce((groupedAttributes: GroupedDestinationAttribute | any, attribute: DestinationAttribute) => {
        const group: DestinationAttribute[] = groupedAttributes[attribute.attribute_type] || [];
        group.push(attribute);
        groupedAttributes[attribute.attribute_type] = group;

        return groupedAttributes;
      }, {
        ACCOUNT: [],
        EXPENSE_PAYMENT_TYPE: [],
        VENDOR: [],
        CHARGE_CARD_NUMBER: [],
        TAX_DETAIL: []
      });
    }));
  }

  getMappingSettings(): Observable<MappingSettingResponse> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/mappings/settings/`, {});
  }

  postMappingSettings(mappingSettings: MappingSetting[]): Observable<MappingSetting[]> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/mappings/settings/`, mappingSettings);
  }

  getMappings(sourceType: string, uri: string, limit: number = 500, offset: number = 0, tableDimension: number = 2, sourceActive?: boolean): Observable<MappingSettingResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    const params: {source_type: string, limit: number, offset: number, table_dimension: number, source_active?: boolean} = {
      source_type: sourceType,
      limit,
      offset,
      table_dimension: tableDimension
    };
    if (sourceActive) {
      params.source_active = sourceActive;
    }
    const url = uri ? uri.split('/api')[1] : `/workspaces/${workspaceId}/mappings/`;
    return this.apiService.get(url, params);
  }
}
