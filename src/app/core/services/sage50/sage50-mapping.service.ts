import { Injectable } from '@angular/core';
import { MappingService } from '../common/mapping.service';
import { Observable } from 'rxjs';
import { PaginatedDestinationAttribute } from '../../models/db/destination-attribute.model';
import { AppName, Sage50AttributeType } from '../../models/enum/enum.model';

@Injectable({
  providedIn: 'root'
})
export class Sage50MappingService extends MappingService {
  getAccounts(accountTypes: string[], value?: string): Observable<PaginatedDestinationAttribute> {
    const params = this.constructPaginatedDestinationAttributesParams(
      Sage50AttributeType.ACCOUNT, value, undefined, AppName.SAGE50, accountTypes
    );
    return this.apiService.get(`/${this.workspaceService.getWorkspaceId()}/mappings/paginated_destination_attributes/`, params);
  }

  getVendors(value?: string): Observable<PaginatedDestinationAttribute> {
    const params = this.constructPaginatedDestinationAttributesParams(
      Sage50AttributeType.VENDOR, value, undefined, AppName.SAGE50
    );
    return this.apiService.get(`/${this.workspaceService.getWorkspaceId()}/mappings/paginated_destination_attributes/`, params);
  }
}
