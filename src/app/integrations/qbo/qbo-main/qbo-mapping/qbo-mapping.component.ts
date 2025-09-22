import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { FyleField } from 'src/app/core/models/enum/enum.model';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { SentenceCasePipe } from 'src/app/shared/pipes/sentence-case.pipe';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-qbo-mapping',
  templateUrl: './qbo-mapping.component.html',
  styleUrls: ['./qbo-mapping.component.scss']
})
export class QboMappingComponent implements OnInit {

  isLoading: boolean = true;

  mappingPages: MenuItem[];

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

  private setupPage(): void {
    this.mappingService.getMappingSettings().subscribe((response) => {
      if (response.results && Array.isArray(response.results)) {
        response.results.forEach((item) => {
          if (item.source_field !== FyleField.EMPLOYEE && item.source_field !== FyleField.CATEGORY) {
            const mappingPage = new SnakeCaseToSpaceCasePipe().transform(item.source_field);
            this.mappingPages.push({
              label: new SentenceCasePipe(this.translocoService).transform(mappingPage),
              routerLink: `/integrations/qbo/main/mapping/${encodeURIComponent(item.source_field.toLowerCase())}`
            });
          }
        });
      }
      if (!brandingFeatureConfig.featureFlags.mapEmployees) {
        this.mappingPages.splice(0, 1);
      }
      this.router.navigateByUrl(this.mappingPages[0].routerLink);
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.mappingPages = [
      {label: this.translocoService.translate('qboMapping.employeeLabel'), routerLink: '/integrations/qbo/main/mapping/employee'},
      {label: this.translocoService.translate('qboMapping.categoryLabel'), routerLink: '/integrations/qbo/main/mapping/category'}
    ];
    this.setupPage();
  }

}
