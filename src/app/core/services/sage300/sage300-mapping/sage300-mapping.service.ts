import { Injectable } from '@angular/core';
import type { ApiService } from '../../common/api.service';
import type { WorkspaceService } from '../../common/workspace.service';
import type { Observable } from 'rxjs';
import type { HelperService } from '../../common/helper.service';

@Injectable({
  providedIn: 'root'
})
export class Sage300MappingService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    helper: HelperService
  ) {
    helper.setBaseApiURL();
  }

  importSage300Attributes(refresh: boolean): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/sage300/import_attributes/`, { refresh });
  }
}
