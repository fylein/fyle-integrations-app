import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { EmailOption } from '../../models/common/advanced-settings.model';
import type { ApiService } from './api.service';
import type { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  getAdditionalEmails(): Observable<EmailOption[]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/admins/`, {});
  }
}
