import { Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { Observable } from 'rxjs';
import { HelperService } from '../../common/helper.service';

@Injectable({
  providedIn: 'root',
})
export class Sage300MappingService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    helper: HelperService,
  ) {
    helper.setBaseApiURL();
  }

  importSage300Attributes(refresh: boolean): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/sage300/import_attributes/`, {
      refresh,
    });
  }
}
