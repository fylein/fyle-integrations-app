import { Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { Observable } from 'rxjs';
import { IntegrationsToastService } from '../../common/integrations-toast.service';
import { ClickEvent, ToastSeverity, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { TrackingService } from '../../integration/tracking.service';

@Injectable({
  providedIn: 'root'
})
export class QbdDirectHelperService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService
  ) { }

  importQBDAttributes(refresh: boolean): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/qbd/import_attributes/`, {refresh});
  }

  importAttributes(refresh: boolean): void {
    this.trackingService.onClickEvent(TrackingApp.QBD_DIRECT, ClickEvent.QBD_DIRECT_SYNC);
    this.workspaceService.importFyleAttributes(refresh).subscribe();
    this.importQBDAttributes(refresh).subscribe();
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Syncing data dimensions from QuickBooks Desktop');
  }
}
