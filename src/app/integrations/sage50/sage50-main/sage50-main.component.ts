import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AppName, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { TranslocoService } from '@jsverse/transloco';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterOutlet } from '@angular/router';
import { Sage50ExportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-export-settings.service';
import { Sage50CCCExportType, Sage50ReimbursableExportType } from 'src/app/core/models/sage50/sage50-configuration/sage50-export-settings.model';
import { Sage50MappingService } from 'src/app/core/services/sage50/sage50-core/sage50-mapping.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { globalCacheBusterNotifier } from 'ts-cacheable';

@Component({
  selector: 'app-sage50-main',
  standalone: true,
  imports: [SharedModule, RouterOutlet],
  templateUrl: './sage50-main.component.html',
  styleUrls: ['./sage50-main.component.scss']
})
export class Sage50MainComponent implements OnInit {

  appName: AppName = AppName.SAGE50;

  modules: MenuItem[] = [];

  activeModules: MenuItem[] = [];

  constructor(
    private accountingExportService: AccountingExportService,
    private exportSettingsService: Sage50ExportSettingsService,
    private mappingService: Sage50MappingService,
    private translocoService: TranslocoService,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService
  ) { }

  ngOnInit(): void {
    this.modules = [
      {label: this.translocoService.translate('sage50Main.dashboard'), routerLink: '/integrations/sage50/main/dashboard'},
      {label: this.translocoService.translate('sage50Main.mapping'), routerLink: '/integrations/sage50/main/mapping'},
      {label: this.translocoService.translate('sage50Main.configuration'), routerLink: '/integrations/sage50/main/configuration'}
    ];

    this.exportSettingsService.getExportSettings().subscribe((exportSettings) => {
      const hasMappings = exportSettings?.reimbursable_expense_export_type === Sage50ReimbursableExportType.PURCHASES_RECEIVE_INVENTORY ||
                          exportSettings?.credit_card_expense_export_type === Sage50CCCExportType.PAYMENTS_JOURNAL;

      this.mappingService.shouldShowMappingPage.emit(hasMappings);
    });

    this.mappingService.shouldShowMappingPage.subscribe((showMapping: boolean) => {
      if (showMapping) {
        this.activeModules = this.modules;
      } else {
        const module = this.modules.filter(item => item.label !== this.translocoService.translate('sage50Main.mapping'));
        this.activeModules = module;
      }
    });
  }

  refreshDimensions() {
    globalCacheBusterNotifier.next();
    this.accountingExportService.importExpensesFromFyle('v3').subscribe();
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('sage50Main.syncDataDimensionsToast', { appName: AppName.SAGE50 }));
  }
}
