import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { Cacheable } from 'ts-cacheable';
import type { ApiService } from '../../common/api.service';
import type { WorkspaceService } from '../../common/workspace.service';
import type { IntegrationsToastService } from '../../common/integrations-toast.service';
import type { BusinessCentralMappingService } from '../business-central-mapping/business-central-mapping.service';
import { ToastSeverity } from 'src/app/core/models/enum/enum.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessCentralHelperService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    private mappingService: BusinessCentralMappingService,
    private toastService: IntegrationsToastService
  ) { }

  refreshBusinessCentralDimensions(refresh: boolean): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/business_central/import_attributes/`, { refresh });
  }

  importAttributes(isRefresh: boolean): void {
    this.workspaceService.importFyleAttributes(isRefresh).subscribe();
    this.mappingService.importBusinessCentralAttributes(isRefresh).subscribe();
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Syncing data dimensions from Dynamics 365 Business Central');
  }
}
