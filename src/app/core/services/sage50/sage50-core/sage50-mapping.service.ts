import { EventEmitter, Injectable, Output } from '@angular/core';
import { MappingService } from '../../common/mapping.service';
import { Observable } from 'rxjs';
import {
  DestinationAttributeStats,
  PaginatedDestinationAttribute,
} from '../../../models/db/destination-attribute.model';
import { AppName, Sage50AttributeType } from '../../../models/enum/enum.model';

@Injectable({
  providedIn: 'root',
})
export class Sage50MappingService extends MappingService {
  @Output() shouldShowMappingPage: EventEmitter<boolean> = new EventEmitter();

  getAccounts(accountTypes: string[], value?: string): Observable<PaginatedDestinationAttribute> {
    const params = this.constructPaginatedDestinationAttributesParams(
      Sage50AttributeType.ACCOUNT,
      value,
      undefined,
      AppName.SAGE50,
      accountTypes,
    );
    return this.apiService.get(
      `/${this.workspaceService.getWorkspaceId()}/mappings/paginated_destination_attributes/`,
      params,
    );
  }

  getVendors(value?: string): Observable<PaginatedDestinationAttribute> {
    const params = this.constructPaginatedDestinationAttributesParams(
      Sage50AttributeType.VENDOR,
      value,
      undefined,
      AppName.SAGE50,
    );
    return this.apiService.get(
      `/${this.workspaceService.getWorkspaceId()}/mappings/paginated_destination_attributes/`,
      params,
    );
  }

  getAttributeStats(attributeType: Sage50AttributeType): Observable<DestinationAttributeStats> {
    const params = {
      attribute_type: attributeType,
    };
    return this.apiService.get(
      `/${this.workspaceService.getWorkspaceId()}/mappings/destination_attributes_stats/`,
      params,
    );
  }

  getUnmappedAttributes(
    sourceType: 'EMPLOYEE' | 'CORPORATE_CARD',
    destinationType: string,
    limit: number = 500,
    offset: number = 0,
  ): Observable<any> {
    const params = {
      limit,
      offset,
      mapped: false,
      destination_type: destinationType,
      source_type: sourceType,
      app_name: AppName.SAGE50,
    };
    return this.apiService.get(`/${this.workspaceService.getWorkspaceId()}/mappings/employee_attributes/`, params);
  }
}
