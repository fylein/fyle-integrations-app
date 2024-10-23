import { Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { Observable } from 'rxjs';
import { IntegrationsToastService } from '../../common/integrations-toast.service';
import { ToastSeverity } from 'src/app/core/models/enum/enum.model';

@Injectable({
  providedIn: 'root'
})
export class QbdDirectHelperService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    private toastService: IntegrationsToastService
  ) { }

  importQBDAttributes(refresh: boolean): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/qbd/import_attributes/`, {refresh});
  }

  importAttribuites(refresh: boolean): void {
    this.workspaceService.importFyleAttributes(refresh).subscribe();
    this.importQBDAttributes(refresh).subscribe();
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Syncing data dimensions from Quickbooks Desktop');
  }
}
