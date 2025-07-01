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
  selector: 'app-sage300-mapping',
  templateUrl: './sage300-mapping.component.html',
  styleUrls: ['./sage300-mapping.component.scss']
})
export class Sage300MappingComponent implements OnInit {

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
  ) { }

  private setupPage(): void {
    this.isLoading = true;
    this.mappingPages = [
      {label: this.translocoService.translate('sage300Mapping.employeeLabel'), routerLink: '/integrations/sage300/main/mapping/employee'},
      {label: this.translocoService.translate('sage300Mapping.categoryLabel'), routerLink: '/integrations/sage300/main/mapping/category'}
    ];
    this.mappingService.getMappingSettings().subscribe((response) => {
      if (response.results && Array.isArray(response.results)) {
        response.results.forEach((item) => {
          if (item.source_field!==FyleField.EMPLOYEE && item.source_field!=='CATEGORY' && item.source_field !== 'PROJECT') {
            this.mappingPages.push({
              label: new SentenceCasePipe(this.translocoService).transform(new SnakeCaseToSpaceCasePipe().transform(item.source_field)),
              routerLink: `/integrations/sage300/main/mapping/${encodeURIComponent(item.source_field.toLowerCase())}`
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
