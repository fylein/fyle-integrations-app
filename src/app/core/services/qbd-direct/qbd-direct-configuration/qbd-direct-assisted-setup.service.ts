import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { Workspace } from 'src/app/core/models/db/workspaces.model';

@Injectable({
  providedIn: 'root'
})
export class QbdDirectAssistedSetupService {

  isSlotBooked: boolean = false;

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  bookSlot(): Observable<any> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/assisted_setup/`, { action: 'BOOK_SLOT' });
  }

  submitRequest(description: string): Observable<any> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/assisted_setup/`, { action: 'QUERY', query: description });
  }

  setSlotBookingStatus(workspace: Workspace): void {
    if (workspace.assisted_setup_requested_at){
      this.isSlotBooked = true;
      window.alert('debug -> isSlotBooked true');
    }

    window.alert('debug -> isSlotBooked ' +  this.isSlotBooked);
  }

  getSlotBookingStatus(): Observable<boolean>{
    return of(this.isSlotBooked);
  }
}