import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmailOption } from '../../models/common/advanced-settings.model';
import { ApiService } from './api.service';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
  ) {}

  getAdditionalEmails(): Observable<EmailOption[]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/admins/`, {});
  }
}
