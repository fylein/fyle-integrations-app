import { Injectable } from '@angular/core';
import { WorkspaceService } from '../../common/workspace.service';
import { Sage300MappingService } from '../sage300-mapping/sage300-mapping.service';
import { IntegrationsToastService } from '../../common/integrations-toast.service';
import { ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root'
})
export class Sage300HelperService {

  constructor(
    private workspaceService: WorkspaceService,
    private mappingService: Sage300MappingService,
    private toastService: IntegrationsToastService,
    private translocoService: TranslocoService
  ) { }

  importAttributes(isRefresh: boolean): void {
    this.workspaceService.importFyleAttributes(isRefresh).subscribe();
    this.mappingService.importSage300Attributes(isRefresh).subscribe();
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('services.sage300Helper.syncDataDimensionsToast'));
  }
}
