import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { WorkspaceService } from './workspace.service';
import { Observable, from } from 'rxjs';
import { HelperService } from './helper.service';
import { GroupedDestinationAttribute } from '../../models/db/destination-attribute.model';
import { IntegrationField, FyleField, MappingStats, GenericMappingApiParams } from '../../models/db/mapping.model';
import { EmployeeMapping, EmployeeMappingPost } from '../../models/db/employee-mapping.model';
import { MappingState } from '../../models/enum/enum.model';
import { GenericMappingResponse } from '../../models/db/extended-generic-mapping.model';
import { CategoryMapping, CategoryMappingPost } from '../../models/db/category-mapping.model';
import { GenericMapping, GenericMappingPost } from '../../models/db/generic-mapping.model';
import { MappingSettingResponse } from '../../models/db/mapping-setting.model';


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

  getExportSettings(): Observable<any> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/export_settings/`, {});
  }

  getDestinationAttributes(attributeTypes: string | string[], version: 'v1' | 'v2', apiPath?: string, accountType?: string, active?: boolean): Observable<any> {
    const params: {attribute_type__in: string | string[], account_type?: string, active?: boolean} = {
      attribute_type__in: attributeTypes
    };

    if (accountType) {
      params.account_type = accountType;
    }
    if (active) {
      params.active = active;
    }

    if (version === 'v1') {
      return this.apiService.get(`/workspaces/${this.workspaceId}/${apiPath}/destination_attributes/`, params);
    }

    return this.apiService.get(`/workspaces/${this.workspaceId}/mappings/destination_attributes/`, params);
  }

  getGroupedDestinationAttributes(attributeTypes: string[], version: 'v1' | 'v2', apiPath?: string): Observable<GroupedDestinationAttribute> {
    return from(this.getDestinationAttributes(attributeTypes, version, apiPath).toPromise().then((response: any | undefined) => {
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
        TAX_DETAIL: [],
        JOB: [],
        BANK_ACCOUNT: [],
        CREDIT_CARD_ACCOUNT: [],
        ACCOUNTS_PAYABLE: []
      });
    }));
  }

  getIntegrationsFields(app_name: string): Observable<IntegrationField[]> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/${app_name}/fields/`, {});
  }

  getFyleFields(): Observable<FyleField[]> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/fields/`, {});
  }

  postEmployeeMappings(employeeMapping: EmployeeMappingPost): Observable<EmployeeMapping> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/mappings/employee/`, employeeMapping);
  }

  getMappingSettings(): Observable<MappingSettingResponse> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/mappings/settings/`, {});
  }

  triggerAutoMapEmployees() {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/mappings/auto_map_employees/trigger/`, {});
  }

  private getEndpoint(mappingPage: string, isCategoryMappingGeneric?: boolean): string {
    if (isCategoryMappingGeneric) {
      return 'expense_attributes';
    }

    switch (mappingPage) {
      case 'EMPLOYEE':
        return 'employee_attributes';
      case 'CATEGORY':
        return 'category_attributes';
      default:
        return 'expense_attributes';
    }
  }

  getGenericMappingsV2(pageLimit: number, pageOffset: number, destinationType: string, mappingState: MappingState, alphabetsFilter: string, sourceType: string, isCategoryMappingGeneric?: boolean): Observable<GenericMappingResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    const isMapped: boolean = mappingState === MappingState.UNMAPPED ? false : true;
    const params: GenericMappingApiParams = {
      limit: pageLimit,
      offset: pageOffset,
      mapped: mappingState === MappingState.ALL ? MappingState.ALL : isMapped,
      destination_type: destinationType,
      source_type: sourceType
    };

    if (alphabetsFilter && alphabetsFilter !== 'All') {
      params.mapping_source_alphabets = alphabetsFilter;
    }

    const endpoint = this.getEndpoint(sourceType, isCategoryMappingGeneric);

    return this.apiService.get(`/workspaces/${workspaceId}/mappings/${endpoint}/`, params);
  }

  getMappingStats(sourceType: string, destinationType: string, appName: string): Observable<MappingStats> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/mappings/stats/`, {
      source_type: sourceType,
      destination_type: destinationType,
      app_name: appName
    });
  }

  postCategoryMappings(mapping: CategoryMappingPost): Observable<CategoryMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/category/`, mapping);
  }

  postMapping(mapping: GenericMappingPost): Observable<GenericMapping> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/mappings/`, mapping);
  }

}
