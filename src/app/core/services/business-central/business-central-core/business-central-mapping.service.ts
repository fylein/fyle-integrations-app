import { Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { HelperService } from '../../common/helper.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class BusinessCentralMappingService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    helper: HelperService,
  ) {
    helper.setBaseApiURL();
  }

  importBusinessCentralAttributes(refresh: boolean): Observable<{}> {
    return this.apiService.post(
      `/workspaces/${this.workspaceService.getWorkspaceId()}/business_central/import_attributes/`,
      { refresh },
    );
  }
}
