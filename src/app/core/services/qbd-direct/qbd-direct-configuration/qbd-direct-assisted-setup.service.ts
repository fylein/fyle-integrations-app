import { Injectable } from '@angular/core';
import {  Observable, Subject } from 'rxjs';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { Workspace } from 'src/app/core/models/db/workspaces.model';

@Injectable({
  providedIn: 'root'
})
export class QbdDirectAssistedSetupService {

  private isSlotBookedSubject = new Subject<boolean>();

  isSlotBooked$: Observable<boolean> = this.isSlotBookedSubject.asObservable();

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
      this.isSlotBookedSubject.next(true);
    } else {
      this.isSlotBookedSubject.next(false);
    }
  }
}