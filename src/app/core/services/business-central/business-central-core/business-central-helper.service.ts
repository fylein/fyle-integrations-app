import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cacheable } from 'ts-cacheable';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessCentralHelperService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  refreshBusinessCentralDimensions(): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/Business_Central/import_attribut/`, {});
  }
}
