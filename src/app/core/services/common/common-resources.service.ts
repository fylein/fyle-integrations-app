import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HelperService } from './helper.service';
import { WorkspaceService } from './workspace.service';
import { Observable } from 'rxjs';
import { PaginatedDimensionDetails } from '../../models/db/dimension-details.model';

@Injectable({
  providedIn: 'root'
})
export class CommonResourcesService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    private helper: HelperService
  ) { }

  getDimensionDetails(
    { attributeTypes, sourceType }:
    { attributeTypes: string[], sourceType: 'FYLE' | 'ACCOUNTING' }
  ): Observable<PaginatedDimensionDetails> {
    this.helper.setBaseApiURL();

    const params: Record<string, string[] | string | number> = {
      attribute_type__in: attributeTypes,
      source_type: sourceType,
      offset: 0,
      limit: 100
    };

    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/common_resources/dimension_details/`, params);
  }
}
