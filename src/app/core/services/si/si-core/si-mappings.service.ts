import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { DestinationAttribute, GroupedDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { SiApiService } from './si-api.service';
import { SiWorkspaceService } from './si-workspace.service';
import { ExpenseField } from 'src/app/core/models/si/db/expense-field.model';
import { Configuration } from 'src/app/core/models/db/configuration.model';
import { MappingSetting, MappingSettingResponse } from 'src/app/core/models/si/db/mapping-setting.model';
import { CategoryMappingsResponse } from 'src/app/core/models/si/db/category-mapping-response.model';
import { EmployeeMapping, EmployeeMappingPost, EmployeeMappingsResponse } from 'src/app/core/models/si/db/employee-mapping.model';
import { MappingSource } from 'src/app/core/models/si/db/mapping-source.model';
import { MappingIntacct, MappingPost, MappingStats } from 'src/app/core/models/si/db/mapping.model';
import { MappingState } from 'src/app/core/models/enum/enum.model';
import { CategoryMapping } from 'src/app/core/models/si/db/category-mapping.model';
import { GeneralMapping } from 'src/app/core/models/si/db/mappings.model';
import { ExtendedExpenseAttributeResponse } from 'src/app/core/models/si/db/expense-attribute.model';

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

  getMappingStats(sourceType: string, destinationType: string): Observable<MappingStats> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/mappings/stats/`, { source_type: sourceType, destination_type: destinationType });
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

  getFyleExpenseAttributes(attributeType: string, active?: boolean): Observable<MappingSource[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    const params: {attribute_type: string, active?: boolean} = {
      attribute_type: attributeType
    };

    if (active) {
      params.active = active;
    }

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expense_attributes/`, params);
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
        EXPENSE_TYPE: [],
        EXPENSE_PAYMENT_TYPE: [],
        VENDOR: [],
        EMPLOYEE: [],
        CHARGE_CARD_NUMBER: [],
        TAX_DETAIL: []
      });
    }));
  }

  getCategoryMappings(pageLimit: number, pageOffset: number, sourceType: string, mappingState: MappingState): Observable<CategoryMappingsResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    const isMapped: boolean = (mappingState==='UNMAPPED' ? false : true);
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/category_attributes/`, {
        limit: pageLimit,
        offset: pageOffset,
        mapped: mappingState===MappingState.ALL ? MappingState.ALL : isMapped,
        destination_type: sourceType
      }
    );
  }

  postCategoryMappings(mapping: CategoryMapping): Observable<GeneralMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/category/`, mapping);
  }

  getEmployeeMappings(pageLimit: number, pageOffset: number, sourceType: string, mappingState: MappingState): Observable<EmployeeMappingsResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    const isMapped: boolean = (mappingState==='UNMAPPED' ? false : true);
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/employee_attributes/`, {
        limit: pageLimit,
        offset: pageOffset,
        mapped: mappingState===MappingState.ALL ? MappingState.ALL : isMapped,
        destination_type: sourceType
      }
    );
  }

  postEmployeeMappings(employeeMapping: EmployeeMappingPost): Observable<EmployeeMapping> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/mappings/employee/`, employeeMapping);
  }

  getMappingSettings(): Observable<MappingSettingResponse> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/mappings/settings/`, {});
  }

  postMappingSettings(mappingSettings: MappingSetting[]): Observable<MappingSetting[]> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/mappings/settings/`, mappingSettings);
  }

  triggerAutoMapEmployees() {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/mappings/auto_map_employees/trigger/`, {});
  }

  getMappings(mappingState: MappingState, limit: number, offset: number, sourceType: string, destinationType: string): Observable<ExtendedExpenseAttributeResponse> {
    const isMapped: boolean = (mappingState==='UNMAPPED' ? false : true);
    const params: any = {
      limit,
      offset,
      mapped: mappingState===MappingState.ALL ? MappingState.ALL : isMapped,
      source_type: sourceType.toUpperCase(),
      destination_type: destinationType
    };

    // If (alphabetsFilter.length) {
    //   Params.mapping_source_alphabets = alphabetsFilter;
    // }

    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/mappings/expense_attributes/`, params);
  }

  postMapping(mapping: MappingPost): Observable<EmployeeMapping> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/mappings/`, mapping);
  }
}
