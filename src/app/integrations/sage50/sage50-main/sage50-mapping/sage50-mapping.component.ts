import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AppName, FyleField } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { Router, RouterOutlet } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { brandingFeatureConfig, brandingConfig, brandingStyle } from 'src/app/branding/branding-config';
import { CommonModule } from '@angular/common';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';
import { SentenceCasePipe } from 'src/app/shared/pipes/sentence-case.pipe';
import { Sage50ExportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-export-settings.service';
import { Sage50CCCExportType, Sage50ReimbursableExportType } from 'src/app/core/models/sage50/sage50-configuration/sage50-export-settings.model';
import { forkJoin } from 'rxjs';

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
    private mappingService: MappingService,
    private exportSettingsService: Sage50ExportSettingsService,
    private router: Router,
    private translocoService: TranslocoService
  ) { }

  setupPage(): void {
    this.isLoading = true;

    forkJoin([
      this.mappingService.getSage50MappingSettings(),
      this.exportSettingsService.getExportSettings()
    ]).subscribe(([mappingSettings, exportSettings]) => {
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

      // Add custom field mappings from backend
      if (mappingSettings.results && Array.isArray(mappingSettings.results)) {
        mappingSettings.results.forEach((item) => {
          if (item.source_field !== FyleField.EMPLOYEE &&
              item.source_field !== FyleField.CATEGORY &&
              item.source_field !== FyleField.CORPORATE_CARD) {
            const mappingPage = new SnakeCaseToSpaceCasePipe().transform(item.source_field);
            this.modules.push({
              label: new SentenceCasePipe(this.translocoService).transform(mappingPage),
              routerLink: `/integrations/sage50/main/mapping/${encodeURIComponent(item.source_field.toLowerCase())}`
            });
          }
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
