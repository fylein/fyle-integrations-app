import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationEntityMapping } from 'src/app/core/models/si/db/location-entity-mapping.model';
import { MappingDestination } from 'src/app/core/models/si/db/mapping-destination.mode';
import { ApiService } from '../../core/api.service';
import { SiWorkspaceService } from './si-workspace.service';

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

  postLocationEntityMapping(locationEntityMappingPayload: LocationEntityMapping): Observable<any> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/mappings/location_entity/`, locationEntityMappingPayload);
  }

  getLocationEntityMapping(): Observable<LocationEntityMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/location_entity/`, {}
    );
  }

  getSageIntacctDestinationAttributes(attributeTypes: string | string[], accountType?: string, active?: boolean): Observable<MappingDestination[]> {
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
}
