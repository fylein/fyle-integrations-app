import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { from } from 'rxjs';
import type { SiWorkspaceService } from './si-workspace.service';
import type { ExpenseField } from 'src/app/core/models/intacct/db/expense-field.model';
import type { IntacctConfiguration } from 'src/app/core/models/db/configuration.model';
import type { MappingSetting, MappingSettingResponse } from 'src/app/core/models/intacct/db/mapping-setting.model';
import type { CategoryMappingsResponse } from 'src/app/core/models/intacct/db/category-mapping-response.model';
import type { EmployeeMapping, EmployeeMappingPost, EmployeeMappingsResponse } from 'src/app/core/models/intacct/db/employee-mapping.model';
import type { MappingSource } from 'src/app/core/models/intacct/db/mapping-source.model';
import type { MappingIntacct, MappingPost, MappingStats } from 'src/app/core/models/intacct/db/mapping.model';
import { MappingState } from 'src/app/core/models/enum/enum.model';
import type { CategoryMapping, CategoryMappingPost } from 'src/app/core/models/intacct/db/category-mapping.model';
import type { ExtendedExpenseAttributeResponse } from 'src/app/core/models/intacct/db/expense-attribute.model';
import type { GroupedDestinationAttribute, IntacctDestinationAttribute, PaginatedintacctDestinationAttribute } from 'src/app/core/models/intacct/db/destination-attribute.model';
import type { ApiService } from '../../common/api.service';

@Injectable({
  providedIn: 'root'
})
export class SiMappingsService {

  constructor(
    private apiService: ApiService,
    private workspaceService: SiWorkspaceService
  ) { }

  refreshSageIntacctDimensions(dimensionsToSync: string[] = []) {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/sage_intacct/refresh_dimensions/`, {
      dimensions_to_sync: dimensionsToSync
    });
  }

  refreshFyleDimensions() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/fyle/refresh_dimensions/`, {});
  }

  getMappingStats(sourceType: string, destinationType: string): Observable<MappingStats> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/mappings/stats/`, {
      source_type: sourceType,
      destination_type: destinationType,
      app_name: 'INTACCT'
    });
  }

  getConfiguration(): Observable<IntacctConfiguration>{
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

  getPaginatedDestinationAttributes(attributeType: string, value?: string): Observable<PaginatedintacctDestinationAttribute> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    const params: {limit: number, offset: number, attribute_type: string, value?: string} = {
      limit: 100,
      offset: 0,
      attribute_type: attributeType
    };

    if (value) {
      params.value = value;
    }

    return this.apiService.get(`/workspaces/${workspaceId}/sage_intacct/paginated_destination_attributes/`, params);
  }

  getSageIntacctDestinationAttributes(attributeTypes: string | string[], accountType?: string, active?: boolean): Observable<IntacctDestinationAttribute[]> {
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
    return from(this.getSageIntacctDestinationAttributes(attributeTypes).toPromise().then((response: IntacctDestinationAttribute[] | undefined) => {
      return response?.reduce((groupedAttributes: GroupedDestinationAttribute | any, attribute: IntacctDestinationAttribute) => {
        const group: IntacctDestinationAttribute[] = groupedAttributes[attribute.attribute_type] || [];
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

  getCategoryMappings(pageLimit: number, pageOffset: number, sourceType: string, mappingState: MappingState, alphabetsFilter: string): Observable<CategoryMappingsResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    const isMapped: boolean = (mappingState==='UNMAPPED' ? false : true);

    const params: { limit: number, offset: number, mapped: boolean | MappingState, destination_type: string, mapping_source_alphabets?: string } = {
      limit: pageLimit,
      offset: pageOffset,
      mapped: mappingState===MappingState.ALL ? MappingState.ALL : isMapped,
      destination_type: sourceType
    };

    if (alphabetsFilter && alphabetsFilter !== 'All') {
      params.mapping_source_alphabets = alphabetsFilter;
    }

    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/category_attributes/`, params
    );
  }

  postCategoryMappings(mapping: CategoryMappingPost): Observable<CategoryMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/category/`, mapping);
  }

  getEmployeeMappings(pageLimit: number, pageOffset: number, sourceType: string, mappingState: MappingState, alphabetsFilter: string): Observable<EmployeeMappingsResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    const isMapped: boolean = mappingState==='UNMAPPED' ? false : true;
    const params: { limit: number, offset: number, mapped: boolean | MappingState, destination_type: string, mapping_source_alphabets?: string } = {
      limit: pageLimit,
      offset: pageOffset,
      mapped: mappingState === MappingState.ALL ? MappingState.ALL : isMapped,
      destination_type: sourceType
    };

    if (alphabetsFilter && alphabetsFilter !== 'All') {
      params.mapping_source_alphabets = alphabetsFilter;
    }

    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/employee_attributes/`, params
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

  getMappings(mappingState: MappingState, limit: number, offset: number, sourceType: string, destinationType: string, alphabetsFilter: string): Observable<ExtendedExpenseAttributeResponse> {
    const isMapped: boolean = (mappingState==='UNMAPPED' ? false : true);
    const params: any = {
      limit,
      offset,
      mapped: mappingState===MappingState.ALL ? MappingState.ALL : isMapped,
      source_type: sourceType.toUpperCase(),
      destination_type: destinationType
    };

    if (alphabetsFilter && alphabetsFilter !== 'All') {
      params.mapping_source_alphabets = alphabetsFilter;
    }

    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/mappings/expense_attributes/`, params);
  }

  postMapping(mapping: MappingPost): Observable<MappingIntacct> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/mappings/`, mapping);
  }
}
