import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QbdAccountingExportsGet, GetQbdAccountingExportsPayload, QbdAccountingExportsPost, QbdExportTriggerGet } from 'src/app/core/models/qbd/db/iif-logs.model';
import { SelectedDateFilter } from 'src/app/core/models/qbd/misc/date-filter.model';
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

  getQbdAccountingExports(state: string | String[], limit: number, offset: number, selectedDateFilter: SelectedDateFilter | null, type: string[] | null): Observable<QbdAccountingExportsGet> {
    const params: any = {
      limit,
      offset,
      state
    };

    if (selectedDateFilter) {
      const startDate = selectedDateFilter.startDate.toLocaleDateString().split('/');
      const endDate = selectedDateFilter.endDate.toLocaleDateString().split('/');
      params.start_date = `${startDate[2]}-${startDate[1]}-${startDate[0]}T00:00:00`;
      params.end_date = `${endDate[2]}-${endDate[1]}-${endDate[0]}T23:59:59`;
    }

    if (type) {
      params.type = type;
    }
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/accounting_exports/`, params);
  }

  postQbdAccountingExports(id: number): Observable<QbdAccountingExportsPost> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/accounting_exports/${id}/download/`, {});
  }

  postQbdTriggerExport(): Observable<QbdExportTriggerGet> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/trigger_export/`, {});
  }
}
