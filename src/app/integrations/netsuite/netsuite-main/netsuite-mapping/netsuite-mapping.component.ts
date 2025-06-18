import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingFeatureConfig, brandingConfig, brandingStyle } from 'src/app/branding/branding-config';
import { FyleField } from 'src/app/core/models/enum/enum.model';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { SentenceCasePipe } from 'src/app/shared/pipes/sentence-case.pipe';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-netsuite-mapping',
  templateUrl: './netsuite-mapping.component.html',
  styleUrls: ['./netsuite-mapping.component.scss']
})
export class NetsuiteMappingComponent implements OnInit {

  isLoading: boolean = true;

  mappingPages: MenuItem[];

  activeModule: MenuItem;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

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
              label: new SentenceCasePipe().transform(mappingPage),
              routerLink: `/integrations/netsuite/main/mapping/${encodeURIComponent(item.source_field.toLowerCase())}`
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
      {label: this.translocoService.translate('netsuiteMapping.employee'), routerLink: '/integrations/netsuite/main/mapping/employee'},
      {label: this.translocoService.translate('netsuiteMapping.category'), routerLink: '/integrations/netsuite/main/mapping/category'}
    ];
    this.setupPage();
  }

}
