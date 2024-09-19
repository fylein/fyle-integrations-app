import { Injectable } from '@angular/core';
import type { WorkspaceService } from '../../common/workspace.service';
import type { Sage300MappingService } from '../sage300-mapping/sage300-mapping.service';
import type { IntegrationsToastService } from '../../common/integrations-toast.service';
import { ToastSeverity } from 'src/app/core/models/enum/enum.model';

@Injectable({
  providedIn: 'root'
})
export class Sage300HelperService {

  constructor(
    private workspaceService: WorkspaceService,
    private mappingService: Sage300MappingService,
    private toastService: IntegrationsToastService
  ) { }

  importAttributes(isRefresh: boolean): void {
    this.workspaceService.importFyleAttributes(isRefresh).subscribe();
    this.mappingService.importSage300Attributes(isRefresh).subscribe();
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Syncing data dimensions from Sage 300 CRE');
  }
}
