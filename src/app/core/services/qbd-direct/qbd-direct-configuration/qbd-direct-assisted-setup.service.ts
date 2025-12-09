import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';

@Injectable({
  providedIn: 'root',
})
export class QbdDirectAssistedSetupService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
  ) {}

  bookSlot(): Observable<any> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/assisted_setup/`, { action: 'BOOK_SLOT' });
  }

  submitRequest(description: string): Observable<any> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/assisted_setup/`, { action: 'QUERY', query: description });
  }
}
