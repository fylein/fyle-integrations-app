import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AppName, FyleField } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { Router, RouterOutlet } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { brandingFeatureConfig, brandingConfig, brandingStyle } from 'src/app/branding/branding-config';
import { CommonModule } from '@angular/common';
import { Sage50ExportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-export-settings.service';
import { Sage50CCCExportType, Sage50ReimbursableExportType } from 'src/app/core/models/sage50/sage50-configuration/sage50-export-settings.model';

@Component({
  selector: 'app-sage50-mapping',
  standalone: true,
  imports: [SharedModule, RouterOutlet, CommonModule],
  templateUrl: './sage50-mapping.component.html',
  styleUrls: ['./sage50-mapping.component.scss']
})
export class Sage50MappingComponent implements OnInit {

  isLoading: boolean = false;

  appName: AppName = AppName.SAGE50;

  modules: MenuItem[] = [];

  activeModule: MenuItem;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(
    private exportSettingsService: Sage50ExportSettingsService,
    private router: Router,
    private translocoService: TranslocoService
  ) { }

  setupPage(): void {
    this.isLoading = true;

    this.exportSettingsService.getExportSettings().subscribe((exportSettings) => {
      this.modules = [];

      if (exportSettings?.reimbursable_expense_export_type === Sage50ReimbursableExportType.PURCHASES_RECEIVE_INVENTORY) {
        this.modules.push({
          label: this.translocoService.translate('sage50Mapping.employeeLabel'),
          routerLink: '/integrations/sage50/main/mapping/employee'
        });
      }

      if (exportSettings?.credit_card_expense_export_type === Sage50CCCExportType.PAYMENTS_JOURNAL) {
        this.modules.push({
          label: this.translocoService.translate('sage50Mapping.corporateCardLabel'),
          routerLink: '/integrations/sage50/main/mapping/corporate_card'
        });
      }

      if (this.modules.length > 0) {
        this.router.navigateByUrl(this.modules[0].routerLink);
      }

      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }
}
