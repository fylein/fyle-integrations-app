import { Injectable } from '@angular/core';
import { WorkspaceService } from '../../common/workspace.service';
import { Sage50MappingService } from '../sage50-mapping.service';
import { IntegrationsToastService } from '../../common/integrations-toast.service';
import { ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root'
})
export class Sage50HelperService {

  constructor(
    private workspaceService: WorkspaceService,
    private mappingService: Sage50MappingService,
    private toastService: IntegrationsToastService,
    private translocoService: TranslocoService
  ) { }

  importAttributes(isRefresh: boolean): void {
    this.workspaceService.importFyleAttributes(isRefresh).subscribe();
    this.mappingService.importSage50Attributes(isRefresh).subscribe();
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('services.sage50Helper.syncDataDimensionsToast'));
  }
}

