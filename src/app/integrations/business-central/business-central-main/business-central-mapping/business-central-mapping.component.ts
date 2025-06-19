import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { TranslocoService } from '@jsverse/transloco';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { FyleField } from 'src/app/core/models/enum/enum.model';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { SentenceCasePipe } from 'src/app/shared/pipes/sentence-case.pipe';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';

@Component({
  selector: 'app-business-central-mapping',
  templateUrl: './business-central-mapping.component.html',
  styleUrls: ['./business-central-mapping.component.scss']
})
export class BusinessCentralMappingComponent implements OnInit {

  isLoading: boolean;

  mappingPages: MenuItem[];

  activeModule: MenuItem;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  constructor(
    private router: Router,
    private mappingService: MappingService,
    private translocoService: TranslocoService
  ) {
    this.mappingPages = [
      {label: this.translocoService.translate('businessCentralMapping.employeeMapping'), routerLink: '/integrations/business_central/main/mapping/employee'},
      {label: this.translocoService.translate('businessCentralMapping.categoryMapping'), routerLink: '/integrations/business_central/main/mapping/category'}
    ];
  }

  private setupPage(): void {
    this.isLoading = true;
    this.mappingService.getMappingSettings().subscribe((response) => {
      if (response.results && Array.isArray(response.results)) {
        response.results.forEach((item) => {
          if (item.source_field!==FyleField.EMPLOYEE && item.source_field!==FyleField.CATEGORY) {
            this.mappingPages.push({
              label: new SentenceCasePipe().transform(new SnakeCaseToSpaceCasePipe().transform(item.source_field)),
              routerLink: `/integrations/business_central/main/mapping/${encodeURIComponent(item.source_field.toLowerCase())}`
            });
          }
        });
      }
      this.router.navigateByUrl(this.mappingPages[0].routerLink);
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }
}
