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
    private router: Router,
    private translocoService: TranslocoService
  ) { }

  setupPage(): void {
    this.mappingService.getMappingSettings().subscribe((response) => {
        if (response.results && Array.isArray(response.results)) {
          response.results.forEach((item) => {
            if (item.source_field !== FyleField.EMPLOYEE && item.source_field !== FyleField.CATEGORY) {
              const mappingPage = new SnakeCaseToSpaceCasePipe().transform(item.source_field);
              this.modules.push({
                label: new SentenceCasePipe(this.translocoService).transform(mappingPage),
                routerLink: `/integrations/qbo/main/mapping/${encodeURIComponent(item.source_field.toLowerCase())}`
              });
            }
          });
        }
        if (!brandingFeatureConfig.featureFlags.mapEmployees) {
          this.modules.splice(0, 1);
        }
        this.router.navigateByUrl(this.modules[0].routerLink);
        this.isLoading = false;
      });
  }

  ngOnInit(): void {
    this.modules = [
      {
        label: this.translocoService.translate('sage50Mapping.employeeLabel'),
        routerLink: '/integrations/sage50/main/mapping/employee'
      },
      {
        label: this.translocoService.translate('sage50Mapping.categoryLabel'),
        routerLink: '/integrations/sage50/main/mapping/category'
      }
    ];

    this.setupPage();
  }
}
