import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Workspace } from 'src/app/core/models/qbd/db/workspaces.model';
import { QbdApiService } from './qbd-api.service';

@Injectable({
  providedIn: 'root'
})
export class QbdWorkspaceService {

  constructor(
    private apiService: QbdApiService
  ) { }

  getQBDWorkspace(orgId: string): Observable<Workspace> {
    return this.apiService.get('/workspaces/', {org_id: orgId});
  }

  postQBDWorkspace(): Observable<Workspace> {
    return this.apiService.post('/workspaces/', {});
  }
}
