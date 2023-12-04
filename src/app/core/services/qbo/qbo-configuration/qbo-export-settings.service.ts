import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkspaceService } from '../../common/workspace.service';
import { ApiService } from '../../common/api.service';

@Injectable({
  providedIn: 'root'
})
export class QboExportSettingsService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  // TODO: Update return type when I work on Export Settings
  getExportSettings(): Observable<any>{
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, {});
  }
}
