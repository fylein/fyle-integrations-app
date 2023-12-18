import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { WorkspaceService } from './workspace.service';
import { Observable } from 'rxjs';
import { Error, ErrorResponse } from '../../models/db/error.model';
import { HelperService } from './helper.service';
import { ExportableAccountingExport } from '../../models/db/accounting-export.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  workspaceId: string = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    private helper: HelperService
  ) {
    helper.setBaseApiURL();
  }

  getExportableAccountingExportIds(): Observable<ExportableAccountingExport> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/exportable_accounting_exports/`, {});
  }

  triggerAccountingExport(): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/exports/trigger/`, {});
  }

  getExportErrors(): Observable<ErrorResponse> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/accounting_exports/errors/`, {is_resolved: false});
  }
}
