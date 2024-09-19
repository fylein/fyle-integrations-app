import { Injectable } from '@angular/core';
import type { ApiService } from '../../common/api.service';
import type { WorkspaceService } from '../../common/workspace.service';
import type { HelperService } from '../../common/helper.service';
import type { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class BusinessCentralMappingService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    helper: HelperService
  ) {
    helper.setBaseApiURL();
  }

  importBusinessCentralAttributes(refresh: boolean): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/business_central/import_attributes/`, { refresh });
  }
}
