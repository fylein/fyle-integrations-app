import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { WorkspaceService } from './workspace.service';
import { Observable, from } from 'rxjs';
import { HelperService } from './helper.service';
import {
  GroupedDestinationAttribute,
  PaginatedDestinationAttribute,
} from '../../models/db/destination-attribute.model';
import { IntegrationField, FyleField, MappingStats, GenericMappingApiParams } from '../../models/db/mapping.model';
import { EmployeeMapping, EmployeeMappingPost } from '../../models/db/employee-mapping.model';
import { AppName, MappingState } from '../../models/enum/enum.model';
import { GenericMappingResponse } from '../../models/db/extended-generic-mapping.model';
import { CategoryMapping, CategoryMappingPost } from '../../models/db/category-mapping.model';
import { GenericMapping, GenericMappingPost } from '../../models/db/generic-mapping.model';
import { MappingSettingResponse } from '../../models/db/mapping-setting.model';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root',
})
export class MappingService {
  constructor(
    protected apiService: ApiService,
    protected workspaceService: WorkspaceService,
    private helper: HelperService,
    private translocoService: TranslocoService,
  ) {
    helper.setBaseApiURL();
  }

  getExportSettings(): Observable<any> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, {});
  }

  getImportSettings(): Observable<any> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/import_settings/`, {});
  }

  getDestinationAttributes(
    attributeTypes: string | string[],
    version: 'v1' | 'v2',
    apiPath?: string,
    accountType?: string,
    active?: boolean,
    displayName?: string,
  ): Observable<any> {
    const params: {
      attribute_type__in: string | string[];
      account_type?: string;
      active?: boolean;
      display_name__in?: string;
    } = {
      attribute_type__in: attributeTypes,
    };

    if (accountType) {
      params.account_type = accountType;
    }
    if (active) {
      params.active = active;
    }

    if (displayName) {
      params.display_name__in = displayName;
    }

    if (version === 'v1') {
      return this.apiService.get(
        this.helper.buildEndpointPath(`${this.workspaceService.getWorkspaceId()}/${apiPath}/destination_attributes/`),
        params,
      );
    }

    return this.apiService.get(
      this.helper.buildEndpointPath(`${this.workspaceService.getWorkspaceId()}/mappings/destination_attributes/`),
      params,
    );
  }

  getGroupedDestinationAttributes(
    attributeTypes: string[],
    version: 'v1' | 'v2',
    apiPath?: string,
  ): Observable<GroupedDestinationAttribute> {
    return from(
      this.getDestinationAttributes(attributeTypes, version, apiPath)
        .toPromise()
        .then((response: any | undefined) => {
          return response?.reduce(
            (groupedAttributes: any, attribute: any) => {
              const group: any = groupedAttributes[attribute.attribute_type] || [];
              group.push(attribute);
              groupedAttributes[attribute.attribute_type] = group;
              return groupedAttributes;
            },
            {
              VENDOR_PAYMENT_ACCOUNT: [],
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
              ACCOUNTS_PAYABLE: [],
              TAX_CODE: [],
              COMPANY: [],
              LOCATION: [],
              DEPARTMENT: [],
              CLASS: [],
            },
          );
        }),
    );
  }

  getIntegrationsFields(app_name: string): Observable<IntegrationField[]> {
    return this.apiService.get(
      this.helper.buildEndpointPath(`${this.workspaceService.getWorkspaceId()}/${app_name}/fields/`),
      {},
    );
  }

  getFyleFields(version?: 'v1'): Observable<FyleField[]> {
    return this.apiService.get(
      this.helper.buildEndpointPath(
        `${this.workspaceService.getWorkspaceId()}/fyle/${version === 'v1' ? 'expense_fields' : 'fields'}/`,
      ),
      {},
    );
  }

  postEmployeeMappings(employeeMapping: EmployeeMappingPost): Observable<EmployeeMapping> {
    return this.apiService.post(
      this.helper.buildEndpointPath(`${this.workspaceService.getWorkspaceId()}/mappings/employee/`),
      employeeMapping,
    );
  }

  getMappingSettings(): Observable<MappingSettingResponse> {
    return this.apiService.get(
      this.helper.buildEndpointPath(`${this.workspaceService.getWorkspaceId()}/mappings/settings/`),
      {},
    );
  }

  triggerAutoMapEmployees() {
    return this.apiService.post(
      this.helper.buildEndpointPath(`${this.workspaceService.getWorkspaceId()}/mappings/auto_map_employees/trigger/`),
      {},
    );
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

  getGenericMappingsV2(
    pageLimit: number,
    pageOffset: number,
    destinationType: string,
    mappingState: MappingState,
    alphabetsFilter: string,
    sourceType: string,
    isCategoryMappingGeneric?: boolean,
    searchQuery?: string | null,
    appName?: string,
    isEmployeeAndVendorAllowed: boolean = false,
  ): Observable<GenericMappingResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    const isMapped: boolean = mappingState === MappingState.UNMAPPED ? false : true;
    const params: GenericMappingApiParams = {
      limit: pageLimit,
      offset: pageOffset,
      mapped: mappingState === MappingState.ALL ? MappingState.ALL : isMapped,
      destination_type: destinationType,
      source_type: sourceType,
      ...(appName && { app_name: appName }),
      employee_vendor_purchase_from: !!isEmployeeAndVendorAllowed,
    };

    if (searchQuery) {
      params.value = searchQuery;
    }

    if (alphabetsFilter && alphabetsFilter !== this.translocoService.translate('services.mapping.allFilter')) {
      params.mapping_source_alphabets = alphabetsFilter;
    }

    const endpoint = this.getEndpoint(sourceType, isCategoryMappingGeneric);

    return this.apiService.get(this.helper.buildEndpointPath(`${workspaceId}/mappings/${endpoint}/`), params);
  }

  getMappingStats(
    sourceType: string,
    destinationType: string,
    appName: AppName,
    isEmployeeAndVendorAllowed: boolean = false,
  ): Observable<MappingStats> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(this.helper.buildEndpointPath(`${workspaceId}/mappings/stats/`), {
      source_type: sourceType,
      destination_type: destinationType,
      app_name: appName,
      employee_vendor_purchase_from: !!isEmployeeAndVendorAllowed,
    });
  }

  postCategoryMappings(mapping: CategoryMappingPost): Observable<CategoryMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(this.helper.buildEndpointPath(`${workspaceId}/mappings/category/`), mapping);
  }

  postMapping(mapping: GenericMappingPost): Observable<GenericMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(this.helper.buildEndpointPath(`${workspaceId}/mappings/`), mapping);
  }

  constructPaginatedDestinationAttributesParams(
    attributeType: string | string[],
    value?: string,
    display_name?: string,
    appName?: string,
    detailed_account_type?: string[],
    categories?: string[],
    destinationIds?: string[],
  ) {
    const params: {
      limit: number;
      offset: number;
      attribute_type?: string | string[];
      attribute_type__in?: string[];
      active?: boolean;
      value__icontains?: string;
      value?: string;
      display_name__in?: string;
      detail__account_type__in?: string[];
      detail__category__in?: string[];
      destination_id__in?: string[];
    } = {
      limit: 100,
      offset: 0,
      attribute_type: attributeType,
      active: true,
    };

    if (attributeType && Array.isArray(attributeType)) {
      params.attribute_type__in = attributeType;
      delete params.attribute_type;
    }

    if (value) {
      if (appName && ([AppName.SAGE300, AppName.QBO, AppName.INTACCT] as string[]).includes(appName)) {
        params.value = value;
      } else {
        params.value__icontains = value;
      }
    }

    if (display_name) {
      params.display_name__in = display_name;
    }

    if (detailed_account_type) {
      params.detail__account_type__in = detailed_account_type;
    }

    if (categories) {
      params.detail__category__in = categories;
    }

    if (destinationIds) {
      params.destination_id__in = destinationIds;
    }

    return params;
  }

  getPaginatedDestinationAttributes(
    attributeType: string | string[],
    value?: string,
    display_name?: string,
    appName?: string,
    detailed_account_type?: string[],
    categories?: string[],
    destinationIds?: string[],
  ): Observable<PaginatedDestinationAttribute> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    const params = this.constructPaginatedDestinationAttributesParams(
      attributeType,
      value,
      display_name,
      appName,
      detailed_account_type,
      categories,
      destinationIds,
    );
    return this.apiService.get(
      this.helper.buildEndpointPath(`${workspaceId}/mappings/paginated_destination_attributes/`),
      params,
    );
  }
}
