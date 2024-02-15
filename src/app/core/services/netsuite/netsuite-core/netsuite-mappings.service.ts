import { Injectable } from '@angular/core';
import { NetsuiteWorkspaceService } from './netsuite-workspace.service';
import { ApiService } from '../../common/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetsuiteMappingsService {

  constructor(
    private apiService: ApiService,
    private workspaceService: NetsuiteWorkspaceService
  ) { }

  refreshNetsuiteDimensions(dimensionsToSync: string[] = []) {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/netsuite/refresh_dimensions/`, {
      dimensions_to_sync: dimensionsToSync
    });
  }

  getNetsuiteDestinationAttributes(attributeTypes: string | string[], accountType?: string, active?: boolean): Observable<[]> {
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

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/destination_attributes/`, params);
  }

}
