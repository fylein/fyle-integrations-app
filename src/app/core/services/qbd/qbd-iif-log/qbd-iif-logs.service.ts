import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QbdAccountingExportsGet, GetQbdAccountingExportsPayload, QbdAccountingExportsPost, QbdExportTriggerGet } from 'src/app/core/models/qbd/db/iif-logs.model';
import { QbdApiService } from '../qbd-core/qbd-api.service';
import { QbdWorkspaceService } from '../qbd-core/qbd-workspace.service';

@Injectable({
  providedIn: 'root'
})
export class QbdIifLogsService {

  constructor(
    private apiService: QbdApiService,
    private workspaceService: QbdWorkspaceService
  ) { }

  getQbdAccountingExports(data: GetQbdAccountingExportsPayload): Observable<QbdAccountingExportsGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/accounting_exports/`, data);
  }

  postQbdAccountingExports(id: number): Observable<QbdAccountingExportsPost> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/accounting_exports/${id}/download/`, {});
  }

  postQbdTriggerExport(): Observable<QbdExportTriggerGet> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/trigger_export/`, {});
  }
}
